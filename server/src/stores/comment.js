const Model = require("../models/comment");

const MIN_PROJECTIONS = ["id", "dialogId", "message", "createdBy", "createdAt"];

function createdComment({ dialogId, message, userId }, { transaction } = {}) {
  return Model.create(
    {
      dialogId,
      message,
      createdBy: userId,
    },
    { transaction }
  );
}

function getCommentById(id, { commentProjections, userProjections } = {}) {
  return Model.findOne({
    attributes: commentProjections,
    where: {
      id,
    },
    include: [
      {
        association: "user",
        attributes: userProjections,
      },
    ],
  });
}

module.exports = {
  createdComment,
  getCommentById,

  MIN_PROJECTIONS,
};
