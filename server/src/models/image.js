const { schema, indexes } = require("../schemas/mysql/image");
const { getInstance } = require("../lib/db");

const Image = getInstance().define("images", schema, indexes);

module.exports = Image;
