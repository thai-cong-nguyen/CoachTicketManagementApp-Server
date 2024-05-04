const { Sequelize } = require("sequelize");
require("dotenv").config({ path: "../../.env" });
const config = require("./config");

const env = process.env.NODE_ENV || "development";

const sequelize = new Sequelize(config[env]);

const connectDB = async () => {
  await sequelize
    .authenticate()
    .then(() => {
      console.log(
        `DB: Connection has been established ${
          env ? `in ${env} environment` : ""
        } successfully.`
      );
    })
    .catch((error) =>
      console.error("DB: Unable to connect to the database:", error.message)
    );
};

module.exports = { connectDB };
