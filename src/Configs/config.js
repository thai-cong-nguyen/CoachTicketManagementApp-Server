require("dotenv").config();

const DB_DATABASE_NAME = process.env.DB_DATABASE_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_SSL = process.env.DB_SSL;
const DB_DIALECT = process.env.DB_DIALECT;

const config = () => {
  return {
    development: {
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_DATABASE_NAME,
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
    },
    test: {
      username: "root",
      password: null,
      database: "database_test",
      host: "127.0.0.1",
      dialect: "mysql",
    },
    production: {
      username: "root",
      password: null,
      database: "database_production",
      host: "127.0.0.1",
      dialect: "mysql",
    },
  };
};
module.exports = config();
