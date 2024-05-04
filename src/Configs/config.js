require("dotenv").config();

// development environment
const DB_DATABASE_NAME = process.env.DB_DATABASE_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_SSL = process.env.DB_SSL;
const DB_DIALECT = process.env.DB_DIALECT;
// testing environment
const TEST_DB_HOST = process.env.TEST_DB_HOST;
const TEST_DB_PORT = process.env.TEST_DB_PORT;
const TEST_DB_DATABASE_NAME = process.env.TEST_DB_DATABASE_NAME;
const TEST_DB_USERNAME = process.env.TEST_DB_USERNAME;
const TEST_DB_PASSWORD = process.env.TEST_DB_PASSWORD;
const TEST_DB_DIALECT = process.env.TEST_DB_DIALECT;

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
      username: TEST_DB_USERNAME,
      password: TEST_DB_PASSWORD,
      database: TEST_DB_DATABASE_NAME,
      host: TEST_DB_HOST,
      port: TEST_DB_PORT,
      dialect: TEST_DB_DIALECT,
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
    production: {
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
  };
};
module.exports = config();
