const {
  getCommentDialogsWithComments,
  COMMENT_DIALOG_PROJECTIONS,
} = require("../../services/comment-dialog");
const { COMMENT_PROJECTIONS } = require("../../services/comment");
const { USER_PROJECTIONS } = require("../../services/user");

module.exports = async (req, res, next) => {
  try {
    const result = await getCommentDialogsWithComments({
      commentDialogProjections: COMMENT_DIALOG_PROJECTIONS.MIN,
      commentProjections: COMMENT_PROJECTIONS.MIN,
      userProjections: USER_PROJECTIONS.ID_AND_NAME,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
