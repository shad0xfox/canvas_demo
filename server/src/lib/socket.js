const socketIO = require("socket.io");

let io;

function getIO(server) {
  if (io) {
    return io;
  }

  if (!server) {
    throw new Error("pass server at the first time");
  }

  io = socketIO(server, {
    pingTimeout: 10000,
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"],
    },
  });
  return io;
}

module.exports = {
  getIO,
};
