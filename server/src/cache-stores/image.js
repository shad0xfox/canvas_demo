const redis = require("../lib/redis").getClient();

function getImages() {
  return redis.get("images");
}

function setImages(images) {
  return redis.setEx("images", process.env.redisTTL, images);
}

module.exports = {
  getImages,
  setImages,
};
