const { schema, indexes } = require("../schemas/mysql/image");
const { getInstance } = require("../lib/db");

const Image = getInstance().define("image", schema, indexes, {
  freezeTableName: true,
});

module.exports = Image;
