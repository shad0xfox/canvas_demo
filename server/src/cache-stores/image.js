const redis = require("../lib/redis").getClient();

function getImages() {
  return redis.v4.get("images");
}

function setImages(images) {
  return redis.v4.setEx("images", process.env.redisTTL, images);
}

module.exports = {
  getImages,
  setImages,
};
