const { promisify } = require("util");
const { client } = require("../Configs/connectRedis.config");

// const setAsync = promisify(client.set).bind(client);
// const getAsync = promisify(client.get).bind(client);
// const delAsync = promisify(client.del).bind(client);

module.exports = {
  setRedis: async ({ key, value }) => {
    await client.set(key, value);
    // await setAsync(key, value);
  },
  getRedis: async (key) => {
    // const res = await getAsync(key);
    const res = await client.get(key);
    return JSON.parse(res);
  },
  delRedis: async (key) => {
    // await delAsync(key);
    await client.del(key);
  },
  renameKeyRedis: async ({ oldKey, newKey }) => {
    // const value = await getAsync(oldKey);
    // await setAsync(newKey, value);
    // await delAsync(oldKey);
    const value = await client.get(oldKey);
    await client.set(newKey, value);
    await client.del(oldKey);
  },
};
