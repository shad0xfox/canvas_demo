const Model = require("../models/image");

const MIN_PROJECTIONS = ["id", "x", "y", "path"];

function getImages({ projections } = {}) {
  return Model.findAll({
    attributes: projections,
  });
}

module.exports = {
  getImages,

  MIN_PROJECTIONS,
};
