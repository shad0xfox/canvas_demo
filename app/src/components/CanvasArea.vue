<template>
  <v-container ref="container">
    <v-card ref="card">
      <canvas
        id="canvas"
        ref="canvas"
        width="0"
        height="0"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
        @mousemove="onThrottleMouseMove"
        @mouseleave="onMouseLeave"
      ></canvas>
    </v-card>
  </v-container>
</template>

<script>
// refs: https://codepen.io/Silvia_Chen/pen/rRRQxr
import { debounce, throttle, find } from "lodash";
import axios from "axios";
import imagePath from "../assets/back_image.jpeg";

axios.defaults.baseURL = "http://localhost:3000/api";

export default {
  name: "Canvas",
  async mounted() {
    const images = await axios.get("/canvas/images");
    this.images = images.data.map((image) => ({
      ...image,
      path: imagePath,
    }));
    this.imageComponents = this.images.map((image) => ({
      id: image.id,
      imageInstance: null,
    }));

    this.canvas = this.$refs.canvas;
    this.utilsCanvasInit();
    window.addEventListener(
      "resize",
      this.utilsDebounce(this.onWindowResize, 500)
    );
  },
  methods: {
    utilsCanvasInit() {
      this.canvas.width =
        (this.$refs.card.$refs && this.$refs.card.$refs.link.clientWidth) ||
        window.innerWidth;
      this.canvas.height = window.innerHeight - 110;
      this.ctx = this.canvas.getContext("2d");
      this.ctx.lineCap = "round";
      this.ctx.strokeStyle = this.strokeColor;
      this.ctx.lineWidth = this.strokeWidth;
      this.drawImages();
    },
    utilsDebounce(func, wait, options) {
      return debounce(func, wait, options);
    },
    utilsThrottle(func, wait, options) {
      return throttle(func, wait, options);
    },
    onWindowResize() {
      this.utilsCanvasInit();
    },
    onMouseDown(e) {
      if (this.isMouseDown) {
        return;
      }
      this.isMouseDown = true;
      this.clickDown = {
        x: e.clientX,
        y: e.clientY,
      };

      const canvasPosition = this.canvas.getBoundingClientRect();
      const canvasX = e.clientX - canvasPosition.x;
      const canvasY = e.clientY - canvasPosition.y;

      this.getSelectedImageOrNot(canvasX, canvasY);
    },
    onMouseUp(e) {
      if (this.selectedImage) {
        this.resetSelectedImage();
      }
      if (e.clientX === this.clickDown.x && e.clientY === this.clickDown.y) {
        console.log("same place");
      }
      this.isMouseDown = false;
    },
    // todo: not need throttle, do it when axios
    onThrottleMouseMove(e) {
      if (typeof this.throttleMouseUp !== "function") {
        this.throttleMouseUp = this.utilsThrottle(this.onMouseMove, 0);
      }

      this.throttleMouseUp(e);
    },
    onMouseMove(e) {
      if (this.selectedImage) {
        const canvasPosition = this.canvas.getBoundingClientRect();
        const newX = e.clientX - canvasPosition.x;
        const newY = e.clientY - canvasPosition.y;

        this.moveImage(newX, newY);
      }
    },
    onMouseLeave() {
      if (this.selectedImage) {
        this.resetSelectedImage();
      }
      this.isMouseDown = false;
    },
    moveImage(x, y) {
      const { x: startX, y: startY, oldX, oldY } = this.selectedImage;
      const moveX = x - oldX;
      const moveY = y - oldY;

      this.selectedImage.x = startX + moveX;
      this.selectedImage.y = startY + moveY;
      this.selectedImage.oldX = x;
      this.selectedImage.oldY = y;
      this.selectedImage.isDragging = true;

      // not to clean corresponding images, can be optimized
      this.drawImages();
    },
    drawImages() {
      this.clearCanvas();

      for (const image of this.images) {
        this.drawImage(image);
      }
    },
    drawImage(image) {
      const { x, y, isDragging, id } = image;
      const imageComponent = find(this.imageComponents, { id });

      // use old image, do not wait the onload time
      if (imageComponent.imageInstance) {
        const img = imageComponent.imageInstance;

        const imageWidth = this.IMG_WIDTH;
        const imageHeight = this.IMG_WIDTH * (img.height / img.width);
        image.width = imageWidth;
        image.height = imageHeight;

        if (isDragging) {
          this.ctx.globalAlpha = 0.2;
        }
        this.ctx.drawImage(img, x, y, imageWidth, imageHeight);
        this.ctx.globalAlpha = 1;
      } else {
        const img = new Image();
        img.src = imagePath;
        img.onload = () => {
          const imageWidth = this.IMG_WIDTH;
          const imageHeight = this.IMG_WIDTH * (img.height / img.width);
          image.width = imageWidth;
          image.height = imageHeight;
          this.ctx.drawImage(img, x, y, imageWidth, imageHeight);
        };
        imageComponent.imageInstance = img;
      }
    },
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    resetSelectedImage() {
      this.selectedImage.isDragging = false;
      this.selectedImage = null;

      // clear image with alpha
      this.drawImages();
    },
    getSelectedImageOrNot(x, y) {
      for (let i = 0; i < this.images.length; i++) {
        const { x: imageX, y: imageY, width, height } = this.images[i];

        if (
          x >= imageX &&
          x <= imageX + width &&
          y >= imageY &&
          y <= imageY + height &&
          !this.images[i].isDragging
        ) {
          this.selectedImage = this.images[i];
          this.selectedImage.oldX = x;
          this.selectedImage.oldY = y;
          return;
        }
      }

      this.selectedImage = null;
    },
  },
  data: () => ({
    // canvas object
    canvas: null,
    ctx: null,
    // drao info
    isMouseDown: false,
    selectedImage: null,
    IMG_WIDTH: 350,
    clickDown: {
      x: 0,
      y: 0,
    },
    throttleMouseUp: null,
    images: [],
    imageComponents: [],
    comments: [],
  }),
};
</script>
