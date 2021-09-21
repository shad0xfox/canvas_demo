const router = require("express").Router();
const {
  handleGetImagesRequest,
  handleUpdateImageRequest,
  handleGetCommentDialogsRequest,
  handleUpdateCommentDialogRequest,
  handleUpdateCommentDialogStatusRequest,
  handleCreateCommentRequest,
  handleCreateCommentDialogRequest,
} = require("../../router-handlers/canvas");

router.get("/images", handleGetImagesRequest);
router.post("/images/:id", handleUpdateImageRequest);
router.get("/comment-dialogs", handleGetCommentDialogsRequest);
router.post("/comment-dialogs/:id", handleUpdateCommentDialogRequest);
router.post(
  "/comment-dialogs/:id/status",
  handleUpdateCommentDialogStatusRequest
);
router.post("/comment-dialog", handleCreateCommentDialogRequest);
router.post("/comment", handleCreateCommentRequest);

module.exports = router;
