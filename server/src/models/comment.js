const { schema, indexes } = require("../schemas/mysql/comment");
const { getInstance } = require("../lib/db");
const UserModel = require("./user");

const Comment = getInstance().define("comment", schema, indexes, {
  freezeTableName: true,
});

Comment.belongsTo(UserModel, {
  as: "user",
  foreignKey: "createdBy",
  targetKey: "id",
  constraints: false,
});

module.exports = Comment;
