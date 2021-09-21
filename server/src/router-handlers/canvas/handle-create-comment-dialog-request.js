const { getIO } = require("../../lib/socket");
const {
  createCommentDialogWithComment,
  getCommentDialogWithCommentsById,
  COMMENT_DIALOG_PROJECTIONS,
} = require("../../services/comment-dialog");
const { COMMENT_PROJECTIONS } = require("../../services/comment");
const { USER_PROJECTIONS } = require("../../services/user");
const {
  dialog: { DIALOG_CREATED_BROADCAST },
} = require("../../lib/socket-events");

module.exports = async (req, res, next) => {
  try {
    const userId = req.headers["user-id"];
    const { x, y, message, socketId } = req.body;

    const commentDialog = await createCommentDialogWithComment({
      x,
      y,
      userId,
      message,
    });
    const dialogId = commentDialog.id;

    const returnDialog = await getCommentDialogWithCommentsById(dialogId, {
      commentDialogProjections: COMMENT_DIALOG_PROJECTIONS.MIN,
      commentProjections: COMMENT_PROJECTIONS.MIN,
      userProjections: USER_PROJECTIONS.ID_AND_NAME,
    });

    res.status(200).json(returnDialog);

    const io = getIO();
    io.sockets.sockets
      .get(socketId)
      ?.broadcast.emit(DIALOG_CREATED_BROADCAST, returnDialog);
  } catch (error) {
    next(error);
  }
};
