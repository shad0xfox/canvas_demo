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
    const parsedImages = JSON.parse(imagesFromRedis);

    const updatedImage = parsedImages.find(
      (parsedImage) => parsedImage.id === id
    );
    updatedImage.x = x;
    updatedImage.y = y;

    await ImageCacheStore.setImages(JSON.stringify(parsedImages));
  }
}

module.exports = {
  getImages,
  updateImageById,
};
