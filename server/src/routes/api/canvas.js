const router = require("express").Router();
const { handleGetImagesRequest } = require("../../router-handlers/canvas");

router.get("/images", handleGetImagesRequest);

module.exports = router;
