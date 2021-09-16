jest.mock("../../lib/db");
jest.mock("../../stores/image");
jest.mock("../../cache-stores/image");
const ImageService = require("../image");

/**
 * @type jest.Mocked<import('../../stores/image')>
 */
const ImageStore = require("../../stores/image");

/**
 * @type jest.Mocked<import('../../cache-stores/image')>
 */
const ImageCacheStore = require("../../cache-stores/image");

afterEach(() => {
  jest.clearAllMocks();
});

describe("image service", () => {
  describe("getImages", () => {
    it("return images in db if no data in redis", async () => {
      const images = [{ x: 20, y: 20 }];
      const imagesInRedis = "";
      ImageStore.getImages.mockResolvedValue(images);
      ImageCacheStore.getImages.mockResolvedValue(imagesInRedis);

      const result = await ImageService.getImages();

      expect(ImageCacheStore.getImages.mock.calls.length).toBe(1);
      expect(ImageStore.getImages.mock.calls.length).toBe(1);
      expect(result).toEqual(images);
    });
    it("return images in redis if redis has data", async () => {
      const images = [{ x: 20, y: 20 }];
      const imagesInRedis = JSON.stringify([{ x: 15, y: 25 }]);
      ImageStore.getImages.mockResolvedValue(images);
      ImageCacheStore.getImages.mockResolvedValue(imagesInRedis);

      const result = await ImageService.getImages();

      expect(ImageCacheStore.getImages.mock.calls.length).toBe(1);
      expect(ImageStore.getImages.mock.calls.length).toBe(0);
      expect(result).toEqual(JSON.parse(imagesInRedis));
    });
  });
});
