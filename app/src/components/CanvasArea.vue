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
import imagePath from "../assets/back_image.jpeg";

export default {
  name: "Canvas",
  // todo: get data
  created() {
    this.images = [
      {
        id: 1,
        path: imagePath,
        x: 20,
        y: 20,
        width: 0,
        height: 0,
        isDragging: false,
      },
      {
        id: 2,
        path: imagePath,
        x: 450,
        y: 200,
        width: 0,
        height: 0,
        isDragging: false,
      },
    ];
  },
  mounted() {
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
      this.clearCanvas();
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
        this.selectedImage = null;
      }
      if (e.clientX === this.clickDown.x && e.clientY === this.clickDown.y) {
        console.log("same place");
      }
      this.isMouseDown = false;
    },
    // todo: not need throttle, do it when axios
    onThrottleMouseMove(e) {
      if (typeof this.throttleMouseUp !== "function") {
        this.throttleMouseUp = this.utilsThrottle(this.onMouseMove, 50);
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
      this.selectedImage = null;
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

      this.clearCanvas();
      // not to clean corresponding images, can be optimized
      this.drawImages();
    },
    drawImages() {
      for (const image of this.images) {
        this.drawImage(image);
      }
    },
    drawImage(image) {
      const imageComponent = find(this.imageComponents, { id: image.id });
      let img;
      if (imageComponent.image) {
        img = imageComponent.image;

        const imageWidth = this.IMG_WIDTH;
        const imageHeight = this.IMG_WIDTH * (img.height / img.width);
        image.width = imageWidth;
        image.height = imageHeight;
        this.ctx.drawImage(img, image.x, image.y, imageWidth, imageHeight);
      } else {
        img = new Image();
        img.src = imagePath;
        img.onload = () => {
          const imageWidth = this.IMG_WIDTH;
          const imageHeight = this.IMG_WIDTH * (img.height / img.width);
          image.width = imageWidth;
          image.height = imageHeight;
          this.ctx.drawImage(img, image.x, image.y, imageWidth, imageHeight);
        };
        imageComponent.image = img;
      }
    },
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    getSelectedImageOrNot(x, y) {
      for (let i = 0; i < this.images.length; i++) {
        const { x: imageX, y: imageY, width, height } = this.images[i];

        if (
          x >= imageX &&
          x <= imageX + width &&
          y >= imageY &&
          y <= imageY + height
        ) {
          this.selectedImage = this.images[i];
          this.selectedImage.oldX = x;
          this.selectedImage.oldY = y;
          break;
        }
      }
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
    // todo: from axios
    images: [],
    imageComponents: [
      {
        id: 1,
        image: null,
      },
      {
        id: 2,
        image: null,
      },
    ],
    comments: [],
  }),
};
</script>
