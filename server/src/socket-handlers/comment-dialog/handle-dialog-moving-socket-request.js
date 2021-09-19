const {
  dialog: { DIALOG_MOVING_BROADCAST },
} = require("../../lib/socket-events");

module.exports = async (socket, args, next) => {
  const dialog = args[1];

  socket.sock.broadcast.emit(DIALOG_MOVING_BROADCAST, dialog);
};
