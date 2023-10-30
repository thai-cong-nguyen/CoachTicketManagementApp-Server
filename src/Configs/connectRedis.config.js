// (async () => {
//   require("dotenv").config({ path: "../../.env" });
//   const redis = require("redis");

//   const REDIS_HOST = process.env.REDIS_HOST;
//   const REDIS_PORT = process.env.REDIS_PORT || 6379;
//   const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
//   const client = redis.createClient({
//     url: `redis://default:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
//   });

//   client.on("connect", () => {
//     console.log("Redis client connected");
//   });

//   client.on("error", (err) => {
//     console.log("Error: ", err.message);
//   });
//   module.exports = client;
// })();

require("dotenv").config({ path: "../../.env" });
const redis = require("redis");

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const client = redis.createClient({
  url: `redis://default:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
});

client.on("error", (err) => {
  console.log("Error: ", err.message);
});
module.exports = client;
