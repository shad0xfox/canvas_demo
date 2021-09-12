const Model = require("../models/comment-dialog");

const MIN_PROJECTIONS = ["id", "x", "y", "typeId", "createdAt"];

function getCommentDialogsWithComments({
  commentDialogProjections,
  commentProjections,
  userProjections,
} = {}) {
  return Model.findAll({
    attributes: commentDialogProjections,
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

module.exports = {
  getCommentDialogsWithComments,

  MIN_PROJECTIONS,
};
