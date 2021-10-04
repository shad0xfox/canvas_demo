// refs: https://github.com/gothinkster/node-express-realworld-example-app
const express = require("express");
const router = require("socket.io-events")();
const helmet = require("helmet");
const cors = require("cors");
const http = require("http");
const errorhandler = require("errorhandler");
const redisSession = require("./middleware/redis-session");
const passport = require("./middleware/passport");
const corsOptions = require("./config/cors.json");
const { getIO } = require("./lib/socket");

const isProduction = process.env.NODE_ENV === "production";
// Create global app object
const app = express();
const server = http.createServer(app);
const io = getIO(server);

// Normal express config defaults
app.use(require("morgan")("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(cors(corsOptions));
app.use(redisSession);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + "/public"));

if (!isProduction) {
  app.use(errorhandler());
}

app.use(require("./routes"));

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// socket.io
router.use(require("./socket-routes/image"));
router.use(require("./socket-routes/comment-dialog"));
/// error handlers
router.use((error, socket, args, _next) => {
  console.log(error);
});

io.use(router);
io.on("connection", (socket) => {
  socket.join("/");
  console.info("Socket: connection", {
    socketId: socket.id,
  });
  socket.on("disconnecting", (reason) => {
    console.info("Socket: disconnecting", {
      socketId: socket.id,
      reason,
    });
  });
  socket.on("error", (error) => {
    console.error(error, {
      socketId: socket.id,
    });
  });
});

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function (err, req, res, next) {
    if (err.stack) {
      console.log(err.stack);
    }

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

module.exports = { server };
