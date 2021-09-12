const router = require("express").Router();
const {
  handleGetImagesRequest,
  handleUpdateImageRequest,
  handleGetCommentDialogsRequest,
} = require("../../router-handlers/canvas");

router.get("/images", handleGetImagesRequest);
router.post("/images/:id", handleUpdateImageRequest);
router.get("/comment-dialogs", handleGetCommentDialogsRequest);

module.exports = router;
