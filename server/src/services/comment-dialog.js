const CommentDialogStore = require("../stores/comment-dialog");

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

module.exports = {
  getCommentDialogsWithComments,

  COMMENT_DIALOG_PROJECTIONS: {
    MIN: CommentDialogStore.MIN_PROJECTIONS,
  },
};
