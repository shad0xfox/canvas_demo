const router = require("socket.io-events")();
const { handleUpdateImageSocketRequest } = require("../socket-handlers/image");
const {
  image: { IMAGE_MOVING },
} = require("../lib/socket-events");

router.use(IMAGE_MOVING, handleUpdateImageSocketRequest);

module.exports = router;
