const { schema, indexes } = require("../schemas/mysql/comment-dialog");
const { getInstance } = require("../lib/db");
const UserModel = require("./user");
const CommentModel = require("./comment");

const CommentDialog = getInstance().define("comment_dialogs", schema, indexes);

CommentDialog.belongsTo(UserModel, {
  as: "user",
  foreignKey: "createdBy",
  targetKey: "id",
  constraints: false,
});

CommentDialog.hasMany(CommentModel, {
  as: "comments",
  foreignKey: "dialogId",
  targetKey: "id",
  constraints: false,
});

module.exports = CommentDialog;
