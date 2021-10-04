const expressSession = require("express-session");
const RedisStore = require("connect-redis")(expressSession);
const redisClient = require("../lib/redis").getClient();
const { sessionSecret, sessionTTL } = process.env;

const redisStore = new RedisStore({
  client: redisClient,
  // need to use string type, cause node-redis@next code in commander.ts cannot use number type
  ttl: sessionTTL,
});

module.exports = expressSession({
  store: redisStore,
  name: "canvas-demo",
  saveUninitialized: false,
  secret: sessionSecret,
  resave: false,
});
