const Model = require("../models/comment-dialog");
const { ENUM_COMMENT_DIALOG_STATUS } = require("../lib/enum");

const MIN_PROJECTIONS = ["id", "x", "y", "typeId", "createdAt"];

function getCommentDialogsWithComments({
  commentDialogProjections,
  commentProjections,
  userProjections,
} = {}) {
  return Model.findAll({
    attributes: commentDialogProjections,
    where: {
      status: ENUM_COMMENT_DIALOG_STATUS.PENDING,
    },
    include: [
      {
        association: "comments",
        attributes: commentProjections,
        include: [
          {
            association: "user",
            attributes: userProjections,
          },
        ],
      },
      {
        association: "user",
        attributes: userProjections,
      },
    ],
  });
}

function getCommentDialogWithCommentsById(
  id,
  { commentDialogProjections, commentProjections, userProjections } = {}
) {
  return Model.findOne({
    attributes: commentDialogProjections,
    where: {
      id,
    },
    include: [
      {
        association: "comments",
        attributes: commentProjections,
        include: [
          {
            association: "user",
            attributes: userProjections,
          },
        ],
      },
      {
        association: "user",
        attributes: userProjections,
      },
    ],
  });
}

function updateCommentDialogById(id, updatedColumns) {
  return Model.update(updatedColumns, { where: { id } });
}

function createCommentDialog({ x, y, userId }, { transaction } = {}) {
  return Model.create(
    {
      x,
      y,
      createdBy: userId,
    },
    { transaction }
  );
}

module.exports = {
  getCommentDialogsWithComments,
  getCommentDialogWithCommentsById,
  updateCommentDialogById,
  createCommentDialog,

  MIN_PROJECTIONS,
};
