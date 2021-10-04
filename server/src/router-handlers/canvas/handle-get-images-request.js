const { getImages } = require("../../services/image");

module.exports = async (req, res, next) => {
  try {
    const result = await getImages();

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
