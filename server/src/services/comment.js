const CommentStore = require("../stores/comment");

module.exports = {
  createComment: CommentStore.createdComment,
  getCommentById: CommentStore.getCommentById,

  COMMENT_PROJECTIONS: {
    MIN: CommentStore.MIN_PROJECTIONS,
  },
};
