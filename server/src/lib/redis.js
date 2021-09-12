const { createClient: redisCreateClient } = require("redis");
const { REDIS_HOST, REDIS_PORT } = process.env;

/**
 * @typedef { import("redis/dist/lib/commands").RedisModules } RedisModules
 * @typedef { import("redis/dist/lib/lua-script").RedisLuaScripts } RedisLuaScripts
 * @typedef { import("redis/dist/lib/client").RedisClientType<RedisModules, RedisLuaScripts> } RedisClient
 */

/** @type {RedisClient} */
let client = null;

/**
 *
 * @returns {RedisClient} client
 */
function getClient() {
  return client;
}

async function createClient() {
  console.log(`connecting redis...`);
  client = await redisCreateClient({
    socket: {
      url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
    },
  });

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  console.log(`connected redis`);
}

module.exports = {
  createClient,
  getClient,
};
