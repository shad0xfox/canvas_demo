const ImageStore = require("../stores/image");
// const ImageCacheStore = require("../cache-stores/image");

async function getImages() {
  const images = await ImageStore.getImages({
    projections: ImageStore.MIN_PROJECTIONS,
  });

  return images;
}

module.exports = {
  getImages,
};
