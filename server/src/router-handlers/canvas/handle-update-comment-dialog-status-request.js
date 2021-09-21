const { getIO } = require("../../lib/socket");
const { updateCommentDialogById } = require("../../services/comment-dialog");
const {
  dialog: { DIALOG_DELETED_BROADCAST },
} = require("../../lib/socket-events");

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, socketId } = req.body;

    await updateCommentDialogById(Number(id), { status });

    res.status(200).end();

    const io = getIO();
    io.sockets.sockets
      .get(socketId)
      ?.broadcast.emit(DIALOG_DELETED_BROADCAST, { dialogId: Number(id) });
  } catch (error) {
    next(error);
  }
};
