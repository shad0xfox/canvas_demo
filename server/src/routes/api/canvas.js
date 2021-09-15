const router = require("express").Router();
const {
  handleGetImagesRequest,
  handleUpdateImageRequest,
  handleGetCommentDialogsRequest,
  handleUpdateCommentDialogRequest,
} = require("../../router-handlers/canvas");

router.get("/images", handleGetImagesRequest);
router.post("/images/:id", handleUpdateImageRequest);
router.get("/comment-dialogs", handleGetCommentDialogsRequest);
router.post("/comment-dialogs/:id", handleUpdateCommentDialogRequest);

module.exports = router;
