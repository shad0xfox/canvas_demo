const router = require("express").Router();
const path = require("path");

router.use("/api", require("./api"));

router.get(/^\//, async function (req, res) {
  res.sendFile(path.resolve("public/index.html"));
});

module.exports = router;
