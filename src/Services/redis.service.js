const client = require("../Configs/connectRedis.config");

module.exports = {
  setRedis: async ({ key, value }) => {
    await client.connect();
    await client.set(key, value);
    await client.disconnect();
  },
  getRedis: async (key) => {
    await client.connect();
    const res = await client.get(key);
    await client.disconnect();
    return JSON.parse(res);
  },
  delRedis: async (key) => {
    await client.connect();
    await client.del(key);
    await client.disconnect();
  },
};
