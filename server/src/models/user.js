const { schema, indexes } = require("../schemas/mysql/user");
const { getInstance } = require("../lib/db");

const User = getInstance().define("user", schema, indexes);

module.exports = User;
