require("dotenv").config({ path: "../../.env" });
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../Models/index");
const apiReturns = require("../Helpers/apiReturns.helper");
const { initializeApp } = require("firebase/app");
const { firebaseConfig } = require("../Configs/firebase.config");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

initializeApp(firebaseConfig);

const storage = getStorage();

const createNewCoach = async (rawData) => {
  try {
    const { services, ...data } = rawData.body;
    const file = rawData.file;
    // upload coach's image
    if (file) {
      const dateTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/ho_chi_minh",
      });
      const storageRef = ref(
        storage,
        `images/${file.originalname + "       " + dateTime}`
      );
      const metaData = {
        contentType: file.mimetype,
        cacheControl: "public, max-age=31536000",
      };
      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        file.buffer,
        metaData
      );
      const downloadURL = await getDownloadURL(snapshot.ref);
      data.image = downloadURL;
    } else {
      data.image =
        "https://firebasestorage.googleapis.com/v0/b/coach-management-app.appspot.com/o/images%2Fvecteezy_bus-icon-design-template_7635505.jpg%20%20%20%20%20%20%2012%2F8%2F2023%2C%209%3A50%3A00%20PM?alt=media&token=f2ff5650-2591-4eb8-b655-ce26b7ad9a7b";
    }
    const result = await db.sequelize.transaction(async (tx) => {
      const coach = await db.Coach.create(data, { transaction: tx });
      if (services) {
        await Promise.all(
          JSON.parse(services).map(async (service) => {
            await db.CoachService.create(
              {
                coachId: coach.id,
                serviceId: service,
              },
              { transaction: tx }
            );
          })
        );
      }
      return coach;
    });

    return apiReturns.success(200, "Created new Coach Successful", result);
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

const listServiceNameForCoach = async (coachId) => {
  const serviceCoach = await db.CoachService.findAll({
    where: { coachId: coachId },
    include: [
      {
        model: db.Service,
        as: "ServiceData",
        attributes: ["serviceName"],
      },
    ],
  });
  const services = serviceCoach.map(
    (service) => service.ServiceData.serviceName
  );
  return services;
};

const getAllCoaches = async ({ page, limit, order, ...query }) => {
  try {
    // Order And Queries
    const queries = { raw: true, nest: true };
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const flimit = +limit || +process.env.PAGINATION_LIMIT;
    queries.offset = offset * flimit;
    queries.limit = flimit;
    if (order) queries.order = [order];
    const coaches = await db.Coach.findAndCountAll({
      where: query,
      ...queries,
      include: [{ model: db.CoachType, as: "CoachTypeData" }],
    });
    await Promise.all(
      coaches.rows.map(async (coach) => {
        const services = await listServiceNameForCoach(coach.id);
        coach.ServiceData = services;
      })
    );
    return apiReturns.success(200, "Get Coaches Successfully", coaches);
  } catch (error) {
    console.error(error.message);
    return apiReturns.error(400, error.message);
  }
};

const updateCoaches = async (rawData) => {
  try {
    const coachId = rawData.params.coachId;
    const { services, ...data } = rawData.body;
    const file = await rawData.file;
    const coach = await db.Coach.findByPk(coachId);
    if (!coach) {
      throw new Error("Coaches Not Found");
    }
    // upload coach's image
    if (file) {
      const dateTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/ho_chi_minh",
      });
      const storageRef = ref(
        storage,
        `images/${file.originalname + "       " + dateTime}`
      );
      const metaData = {
        contentType: file.mimetype,
        cacheControl: "public, max-age=31536000",
      };
      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        file.buffer,
        metaData
      );
      const downloadURL = await getDownloadURL(snapshot.ref);
      data.image = downloadURL;
    }
    const result = await db.sequelize.transaction(async (tx) => {
      if (services) {
        const servicesParse = JSON.parse(services);
        console.log(servicesParse);
        const serviceCoach = await db.CoachService.findAll({
          where: { coachId: coachId },
          include: [
            { model: db.Service, as: "ServiceData", attributes: ["id"] },
          ],
        });
        const serviceCoachDelete = serviceCoach.filter(
          (data) => servicesParse.indexOf(data.ServiceData.id) === -1
        );
        const serviceCoachCreate = servicesParse.filter(
          (service) =>
            !serviceCoach.some((data) => data.ServiceData.id === service)
        );
        await Promise.all(
          serviceCoachDelete.map(async (data) => {
            const check = await db.CoachService.findByPk(data.id);
            if (!check) {
              throw new Error("Can not find Service of Coach");
            }
            await db.CoachService.destroy({
              where: { id: data.id },
              transaction: tx,
            });
          })
        );
        await Promise.all(
          serviceCoachCreate.map(async (data) => {
            const checkServiceExists = await db.Service.findByPk(data);
            if (!checkServiceExists) {
              throw new Error("Can not find Service");
            }
            const [, created] = await db.CoachService.findOrCreate({
              where: { coachId: coachId, serviceId: data },
              default: { coachId: coachId, serviceId: data },
              transaction: tx,
            });
            if (!created) {
              throw new Error("Can not create Service for Coach");
            }
          })
        );
      }
      if (data) {
        const updatedCoach = await db.Coach.update(data, {
          where: { id: coachId },
          transaction: tx,
        });
      }
    });
    return apiReturns.success(200, "Updated Coach Successfully");
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

const deleteCoaches = async (rawData) => {
  try {
    const coachId = rawData.params.coachId;
    const data = rawData.body;
    const coach = await db.Coach.findByPk(coachId);
    if (!coach) {
      throw new Error("Coaches Not Found");
    }
    await db.Coach.destroy({ where: { id: coachId } });
    return apiReturns.success(200, "Delete Coach Successfully");
  } catch (error) {
    console.error(error);
    return apiReturns.error(400, error.message);
  }
};

module.exports = {
  createNewCoach,
  listServiceNameForCoach,
  getAllCoaches,
  updateCoaches,
  deleteCoaches,
};
