const { getIO } = require("../../lib/socket");
const {
  createComment,
  getCommentById,
  COMMENT_PROJECTIONS,
} = require("../../services/comment");
const { USER_PROJECTIONS } = require("../../services/user");
const {
  comment: { COMMENT_CREATED_BROADCAST },
} = require("../../lib/socket-events");

module.exports = async (req, res, next) => {
  try {
    // waiting user implement
    const userId = 1;
    const { id: dialogId, message, socketId } = req.body;

    const createdComment = await createComment({ dialogId, userId, message });
    const returnComment = await getCommentById(createdComment.id, {
      commentProjections: COMMENT_PROJECTIONS.MIN,
      userProjections: USER_PROJECTIONS.ID_AND_NAME,
    });

    res.status(200).json(returnComment);

    const io = getIO();
    io.sockets.sockets
      .get(socketId)
      ?.broadcast.emit(COMMENT_CREATED_BROADCAST, returnComment);
  } catch (error) {
    next(error);
  }
};
