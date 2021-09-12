const ImageStore = require("../stores/image");
const ImageCacheStore = require("../cache-stores/image");

async function getImages() {
  const imagesFromRedis = await ImageCacheStore.getImages();
  console.log(imagesFromRedis);

  if (imagesFromRedis) {
    return JSON.parse(imagesFromRedis);
  }

  const images = await ImageStore.getImages({
    projections: ImageStore.MIN_PROJECTIONS,
  });

  await ImageCacheStore.setImages(JSON.stringify(images));

  return images;
}

module.exports = {
  getImages,
};
