const ImageStore = require("../stores/image");
const ImageCacheStore = require("../cache-stores/image");

async function getImages() {
  const imagesFromRedis = await ImageCacheStore.getImages();

  if (imagesFromRedis) {
    return JSON.parse(imagesFromRedis);
  }

  const images = await ImageStore.getImages({
    projections: ImageStore.MIN_PROJECTIONS,
  });

  await ImageCacheStore.setImages(JSON.stringify(images));

  return images;
}

async function updateImageById(id, { x, y }) {
  await ImageStore.updateImageById(id, { x, y });

  const imagesFromRedis = await ImageCacheStore.getImages();

  if (imagesFromRedis) {
    await ImageCacheStore.clearImages();
  }
}

module.exports = {
  getImages,
  updateImageById,
};
