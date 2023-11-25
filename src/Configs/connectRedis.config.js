require("dotenv").config({ path: "../../.env" });
const redis = require("redis");

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const client = redis.createClient({
  url: `redis://default:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
});

client.on("error", async (err) => {
  console.log("Error: ", err.message);
});

const connectRedis = async () => {
  await client.connect();
};

const disconnectRedis = async () => {
  await client.disconnect();
};

module.exports = { client, connectRedis, disconnectRedis };
