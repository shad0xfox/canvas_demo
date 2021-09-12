const Model = require("../models/image");

const MIN_PROJECTIONS = ["id", "message", "createdAt"];

function getImages({ projections } = {}) {
  return Model.findAll({
    attributes: projections,
  });
}

function updateImageById(id, { x, y }) {
  return Model.update({ x, y }, { where: { id } });
}

module.exports = {
  getImages,
  updateImageById,

  MIN_PROJECTIONS,
};
