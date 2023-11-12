const { Sequelize } = require("sequelize");
require("dotenv").config({ path: "../../.env" });
const config = require("./config");

const DB_DATABASE_NAME = process.env.DB_DATABASE_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_SSL = process.env.DB_SSL;
const DB_DIALECT = process.env.DB_DIALECT;

// XAMPP - MySQL
// const sequelize = new Sequelize("coachticketmanagement", "root", null, {
//   host: "localhost",
//   dialect: "mysql",
//   logging: false,
// });

// Docker - PostgreSQL
const sequelize = new Sequelize(DB_DATABASE_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
  logging: false,
  dialectOptions:
    DB_SSL === "true"
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
});

const connectDB = async () => {
  await sequelize
    .authenticate()
    .then(() => {
      console.log("DB: Connection has been established successfully.");
    })
    .catch((error) =>
      console.error("DB: Unable to connect to the database:", error.message)
    );
};

module.exports = { connectDB };
