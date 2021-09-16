const {
  image: { IMAGE_MOVING_BROADCAST },
} = require("../../lib/socket-events");

module.exports = async (socket, args, next) => {
  const image = args[1];

  socket.sock.broadcast.emit(IMAGE_MOVING_BROADCAST, image);
};
