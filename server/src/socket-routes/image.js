const router = require("socket.io-events")();
const {
  handleImageMovingSocketRequest,
  handleImageMoveEndSocketRequest,
} = require("../socket-handlers/image");
const {
  image: { IMAGE_MOVING, IMAGE_MOVE_END },
} = require("../lib/socket-events");

router.use(IMAGE_MOVING, handleImageMovingSocketRequest);
router.use(IMAGE_MOVE_END, handleImageMoveEndSocketRequest);

module.exports = router;
