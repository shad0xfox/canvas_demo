require("../config");
const { getIO } = require("../lib/socket");
const { io: Client } = require("socket.io-client");
const {
  image: { IMAGE_MOVING, IMAGE_MOVING_BROADCAST, IMAGE_MOVE_END },
} = require("../lib/socket-events");

jest.setTimeout(5000);

const db = require("../lib/db");
describe("socket io test", () => {
  let serverSocket = {},
    clientSocket1,
    clientSocket2,
    io;

  beforeAll((done) => {
    db.connect().then(() => {
      const { server } = require("../app");
      io = getIO(server);
      server.listen(3010, () => {
        const port = server.address().port;
        clientSocket1 = new Client(`http://localhost:${port}`);
        clientSocket2 = new Client(`http://localhost:${port}`);
        io.on("connection", (socket) => {
          serverSocket[socket.id] = socket;
        });
        clientSocket1.on("connect", done);
      });
    });
  });

  afterAll(() => {
    io.close();
    clientSocket1.close();
    clientSocket2.close();
  });

  it("socket1 should work", (done) => {
    clientSocket1.on("hello", (arg) => {
      expect(arg).toBe("world");
      done();
    });
    serverSocket[clientSocket1.id].emit("hello", "world");
  });
  it("socket2 should work", (done) => {
    clientSocket2.on("hello", (arg) => {
      expect(arg).toBe("world");
      done();
    });
    serverSocket[clientSocket2.id].emit("hello", "world");
  });
  test("socket1 send image moving then socket2 get broadcast", (done) => {
    const testData = { x: 123, y: 346, isDragging: true };
    clientSocket2.on(IMAGE_MOVING_BROADCAST, (arg) => {
      expect(arg).toEqual(testData);
      clientSocket2.off(IMAGE_MOVING_BROADCAST);
      done();
    });
    clientSocket1.emit(IMAGE_MOVING, testData);
  });
  test("socket1 send image move end then socket2 get broadcast", (done) => {
    const testData = { x: 123, y: 346, isDragging: false };
    clientSocket2.on(IMAGE_MOVING_BROADCAST, (arg) => {
      expect(arg).toEqual(testData);
      clientSocket2.off(IMAGE_MOVING_BROADCAST);
      done();
    });
    clientSocket1.emit(IMAGE_MOVE_END, testData);
  });
});
