const router = require("express").Router();
const {
  handleGetImagesRequest,
  handleUpdateImageRequest,
} = require("../../router-handlers/canvas");

router.get("/images", handleGetImagesRequest);
router.post("/images/:id", handleUpdateImageRequest);

module.exports = router;
