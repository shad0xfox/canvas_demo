const router = require("socket.io-events")();
const {
  handleDialogMovingSocketRequest,
  handleDialogMoveEndSocketRequest,
} = require("../socket-handlers/comment-dialog");
const {
  dialog: { DIALOG_MOVING, DIALOG_MOVE_END },
} = require("../lib/socket-events");

router.use(DIALOG_MOVING, handleDialogMovingSocketRequest);
router.use(DIALOG_MOVE_END, handleDialogMoveEndSocketRequest);

module.exports = router;
