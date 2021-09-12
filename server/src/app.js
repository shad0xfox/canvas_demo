// refs: https://github.com/gothinkster/node-express-realworld-example-app
require("./config");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const errorhandler = require("errorhandler");
const corsOptions = require("./config/cors.json");
const { createClient } = require("./lib/redis");

const isProduction = process.env.NODE_ENV === "production";

const db = require("./lib/db");
db.connect().then(async () => {
  await createClient();
  // Create global app object
  const app = express();

  // Normal express config defaults
  app.use(require("morgan")("dev"));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(helmet());
  app.use(cors(corsOptions));

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

  /// error handlers

  // development error handler
  // will print stacktrace
  if (!isProduction) {
    app.use(function (err, req, res, next) {
      console.log(err.stack);

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

  // finally, let's start our server...
  var server = app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port " + server.address().port);
  });
});
