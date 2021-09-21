const sequelize = require("../lib/db").getInstance();
const CommentDialogStore = require("../stores/comment-dialog");
const CommentStore = require("../stores/comment");

async function getCommentDialogsWithComments({
  commentDialogProjections,
  commentProjections,
  userProjections,
}) {
  const result = await CommentDialogStore.getCommentDialogsWithComments({
    commentDialogProjections,
    commentProjections,
    userProjections,
  });

  return result;
}

async function getCommentDialogWithCommentsById(
  id,
  { commentDialogProjections, commentProjections, userProjections }
) {
  const result = await CommentDialogStore.getCommentDialogWithCommentsById(id, {
    commentDialogProjections,
    commentProjections,
    userProjections,
  });

  return result;
}

async function createCommentDialogWithComment({ x, y, userId, message }) {
  const transaction = await sequelize.transaction();

  try {
    const createdDialog = await CommentDialogStore.createCommentDialog(
      {
        x,
        y,
        userId,
      },
      { transaction }
    );
    await CommentStore.createdComment(
      {
        dialogId: createdDialog.id,
        message,
        userId,
      },
      { transaction }
    );

    await transaction.commit();

    return createdDialog;
  } catch (error) {
    if (!transaction) {
      await transaction.rollback();
    }
    throw error;
  }
}

module.exports = {
  getCommentDialogsWithComments,
  getCommentDialogWithCommentsById,
  createCommentDialogWithComment,
  updateCommentDialogById: CommentDialogStore.updateCommentDialogById,

  COMMENT_DIALOG_PROJECTIONS: {
    MIN: CommentDialogStore.MIN_PROJECTIONS,
  },
};
