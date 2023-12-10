require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { deleteScheduleById } = require("./schedule.service");
const { defaults } = require("pg");

const getAllRoutes = async ({ page, limit, order, ...query }) => {
  try {
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const flimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * flimit;
    queries.limit = flimit;
    if (order) queries.order = order;
    const routes = await db.Route.findAndCountAll({
      where: query,
      ...queries,
    });
    await Promise.all(
      routes.rows.map(async (route) => {
        const startPlaces = await db.Places.findAll({
          where: { routeId: route.id, isPickUpPlace: "1" },
        });
        const arrivalPlaces = await db.Places.findAll({
          where: { routeId: route.id, isPickUpPlace: "0" },
        });
        route.PlacesData = { startPlaces, arrivalPlaces };
      })
    );
    return apiReturns.success(200, "Get Successfully", routes);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const createNewRoute = async (rawData) => {
  try {
    const { places, ...data } = rawData.body;

    const result = await db.sequelize.transaction(async (tx) => {
      const route = await db.Route.create(data, { transaction: tx });
      if (!route) {
        throw new Error("Could not create route");
      }
      if (places.startPlace) {
        await Promise.all(
          places.startPlace.map(async (place) => {
            await db.Places.create(
              {
                routeId: route.id,
                placeName: place.placeName,
                isPickUpPlace: "1",
                placeLat: place.placeLat ? place.placeLat : null,
                placeLng: place.placeLng ? place.placeLng : null,
              },
              { transaction: tx }
            );
          })
        );
      }
      if (places.endPlace) {
        await Promise.all(
          places.endPlace.map(async (place) => {
            await db.Places.create(
              {
                routeId: route.id,
                placeName: place.placeName,
                isPickUpPlace: "0",
                placeLat: place.placeLat ? place.placeLat : null,
                placeLng: place.placeLng ? place.placeLng : null,
              },
              { transaction: tx }
            );
          })
        );
      }
      return route;
    });
    return apiReturns.success(200, "Create a new route successfully", result);
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

const updateRoute = async (rawData) => {
  try {
    const { routeId } = rawData.params;
    const { places, ...updateData } = rawData.body;
    await db.sequelize.transaction(async (tx) => {
      const route = await db.Route.update(updateData, {
        where: { id: routeId },
      });
      if (!route) {
        throw new Error("Route update failed");
      }
      if (places) {
        const startPlaces = await db.Places.findAll({
          where: { routeId: routeId, isPickUpPlace: "1" },
        });
        if (places.startPlaces) {
          if (startPlaces) {
            await Promise.all(
              startPlaces.map(async (place) => {
                if (!places.startPlaces.includes(place.placeName)) {
                  await db.Places.destroy({
                    where: { id: place.id },
                    transaction: tx,
                  });
                }
              })
            );
          }
          await Promise.all(
            places.startPlaces.map(async (place) => {
              await db.Places.findOrCreate({
                where: {
                  routeId: routeId,
                  placeName: place.placeName,
                  isPickUpPlace: "1",
                },
                defaults: {
                  routeId: routeId,
                  placeName: place.placeName,
                  isPickUpPlace: "1",
                  placeLat: place.placeLat,
                  placeLng: place.placeLng,
                },
                transaction: tx,
              });
            })
          );
        } else {
          if (startPlaces) {
            await Promise.all(
              startPlaces.map(async (place) => {
                await db.Places.destroy({ where: { id: place.id } });
              })
            );
          }
        }
        const endPlaces = await db.Places.findAll({
          where: { routeId: routeId, isPickUpPlace: "0" },
        });
        if (places.endPlaces) {
          if (endPlaces) {
            await Promise.all(
              endPlaces.map(async (place) => {
                if (!places.endPlaces.includes(place.placeName)) {
                  await db.Places.destroy({
                    where: { id: place.id },
                    transaction: tx,
                  });
                }
              })
            );
          }
          await Promise.all(
            places.endPlaces.map(async (place) => {
              await db.Places.findOrCreate({
                where: {
                  routeId: routeId,
                  placeName: place.placeName,
                  isPickUpPlace: "0",
                },
                defaults: {
                  routeId: routeId,
                  placeName: place.placeName,
                  isPickUpPlace: "0",
                  placeLat: place.placeLat,
                  placeLng: place.placeLng,
                },
                transaction: tx,
              });
            })
          );
        } else {
          if (endPlaces) {
            await Promise.all(
              endPlaces.map(async (place) => {
                await db.Places.destroy({ where: { id: place.id } });
              })
            );
          }
        }
      }
      const updatedRoute = await db.Route.update(updateData, {
        where: { id: routeId },
        transaction: tx,
      });
    });
    return apiReturns.success(200, "Update Route Successful");
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

const deleteRoute = async (rawData) => {
  try {
    const { routeId } = rawData.params;
    const route = await db.Route.findByPk(routeId);
    if (!route) {
      throw new Error("Route not found");
    }
    await db.Route.destroy({ where: { id: routeId } });
    return apiReturns.success(200, "Delete Route Successful");
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

module.exports = {
  getAllRoutes,
  createNewRoute,
  updateRoute,
  deleteRoute,
};
