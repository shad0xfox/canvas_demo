const { updateCommentDialogById } = require("../../services/comment-dialog");

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { x, y } = req.body;

    await updateCommentDialogById(Number(id), { x, y });

    res.status(200).end();
  } catch (error) {
    next(error);
  }
};
