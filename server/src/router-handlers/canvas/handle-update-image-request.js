const { updateImageById } = require("../../services/image");

module.exports = async (req, res, next) => {
  try {
    req.params.id = Number(req.params.id);
    const { id } = req.params;
    const { x, y } = req.body;

    await updateImageById(id, { x, y });

    res.status(200).end();
  } catch (error) {
    next(error);
  }
};
