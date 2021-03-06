const { updateImageById } = require("../../services/image");

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { x, y } = req.body;

    await updateImageById(Number(id), { x, y });

    res.status(200).end();
  } catch (error) {
    next(error);
  }
};
