const redis = require("../lib/redis").getClient();

function getImages() {
  return redis.v4.get("images");
}

function setImages(images) {
  return redis.v4.setEx("images", process.env.redisTTL, images);
}

function clearImages() {
  return redis.v4.del("images");
}

module.exports = {
  getImages,
  setImages,
  clearImages,
};
