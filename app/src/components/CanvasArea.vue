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
        @mousemove="onMouseMove"
        @mouseleave="onMouseLeave"
      ></canvas>
      <v-icon
        v-for="commentDialog in commentDialogs"
        v-bind:key="commentDialog.id"
        class="dialog"
        :style="{ top: `${commentDialog.y}px`, left: `${commentDialog.x}px` }"
        @mousedown="(e) => onIconMouseDown(e, commentDialog)"
        @mouseup="(e) => onIconMouseUp(e, commentDialog)"
        @mousemove="(e) => onIconMouseMove(e, commentDialog)"
      >
        {{ "fas fa-comments" }}
      </v-icon>
    </v-card>
  </v-container>
</template>

<script>
// @mouseup="onIconMouseUp"
// @mousemove="onThrottleIconMouseMove"
// refs: https://codepen.io/Silvia_Chen/pen/rRRQxr
import { debounce, throttle, find } from "lodash";
import axios from "axios";
import imagePath from "../assets/back_image.jpeg";

axios.defaults.baseURL = "http://localhost:3000/api";

export default {
  name: "CanvasDemo",
  async mounted() {
    this.canvas = this.$refs.canvas;

    await this.getImages();
    await this.getCommentDialogs();

    this.utilsCanvasInit();
    window.addEventListener(
      "resize",
      this.utilsDebounce(this.onWindowResize, 500)
    );
  },
  computed: {
    canvasStartX() {
      return this.canvas.getBoundingClientRect().x;
    },
    canvasStartY() {
      return this.canvas.getBoundingClientRect().y;
    },
  },
  methods: {
    utilsCanvasInit() {
      this.canvas.width =
        this.$refs?.card?.$refs.link.clientWidth || window.innerWidth;
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
    onIconMouseDown(e, icon) {
      if (this.isMouseDown) {
        return;
      }
      this.isMouseDown = true;

      const canvasX = e.clientX - this.canvasStartX;
      const canvasY = e.clientY - this.canvasStartY;

      this.setClickDown(canvasX, canvasY);
      icon.oldX = canvasX;
      icon.oldY = canvasY;
    },
    onIconMouseMove(e, icon) {
      if (this.isMouseDown && !this.selectedImage) {
        const newX = e.clientX - this.canvasStartX;
        const newY = e.clientY - this.canvasStartY;

        this.moveDialog(icon, newX, newY);
      }
    },
    onIconMouseUp(e, icon) {
      // api update dialog position
      // todo: check icon on image or not

      // todo: save dialog position
      this.isMouseDown = false;
    },
    onIconMouseLeave(icon) {
      // icon.x = icon.oldX;
      // icon.y = icon.oldY;
      // this.isMouseDown = false;
      // socket set dialog
    },
    onMouseDown(e) {
      if (this.isMouseDown) {
        return;
      }
      this.isMouseDown = true;

      const canvasX = e.clientX - this.canvasStartX;
      const canvasY = e.clientY - this.canvasStartY;

      this.setClickDown(canvasX, canvasY);
      this.getSelectedImageOrNot(canvasX, canvasY);
    },

    async onMouseUp(e) {
      if (this.selectedImage) {
        await this.updateSelectedImageImage();
        this.resetSelectedImage();
      }
      if (e.clientX === this.clickDown.x && e.clientY === this.clickDown.y) {
        console.log("same place");
      }
      this.isMouseDown = false;
    },
    // todo: not need throttle, do it when socket
    onThrottleMouseMove(e) {
      if (typeof this.throttleMouseUp !== "function") {
        this.throttleMouseUp = this.utilsThrottle(this.onMouseMove, 0);
      }

      this.throttleMouseUp(e);
    },
    onMouseMove(e) {
      if (this.selectedImage) {
        const newX = e.clientX - this.canvasStartX;
        const newY = e.clientY - this.canvasStartY;

        this.moveImage(newX, newY);
        // todo: socket update image position
      }
    },
    async onMouseLeave() {
      if (this.selectedImage) {
        await this.updateSelectedImageImage();
        this.resetSelectedImage();

        // socket set imagePosition
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
    moveDialog(dialog, x, y) {
      console.log({ x, y });
      const { x: startX, y: startY, oldX, oldY } = dialog;
      console.log({ startX, startY, oldX, oldY });
      const moveX = x - oldX;
      const moveY = y - oldY;
      console.log({ moveX, moveY });

      dialog.x = startX + moveX;
      dialog.y = startY + moveY;
      dialog.oldX = x;
      dialog.oldY = y;

      dialog.isDragging = true;
      // socket update dialog position
    },
    drawImages() {
      this.clearCanvas();

      for (let i = this.images.length - 1; i >= 0; i--) {
        this.drawImage(this.images[i]);
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
    setClickDown(x, y) {
      this.clickDown = {
        x,
        y,
      };
    },
    checkOverlapLapping(
      { x1, y1, width1, height1 },
      { x2, y2, wigth2, height2 }
    ) {},
    async getImages() {
      try {
        const images = await axios.get("/canvas/images");
        this.images = images.data.map((image) => ({
          ...image,
          path: imagePath,
        }));
        this.imageComponents = this.images.map((image) => ({
          id: image.id,
          imageInstance: null,
        }));
      } catch (error) {
        console.log(error);
      }
    },
    async updateSelectedImageImage() {
      try {
        const { id, x, y } = this.selectedImage;
        await axios.post(`/canvas/images/${id}`, { x, y });
      } catch (error) {
        console.log(error);
      }
    },
    async getCommentDialogs() {
      try {
        const commentDialogs = await axios.get("/canvas/comment-dialogs");

        this.commentDialogs = commentDialogs.data;

        for (let i = this.images.length - 1; i >= 0; i--) {
          for (const commentDialog of this.commentDialogs) {
            if (commentDialog.isAttatched) {
              continue;
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    // -- todo socket event --
    // get image position by id
    // get dialog position by id
    // get create dialog
    // get delete dialog
  },
  data: () => ({
    // canvas object
    canvas: null,
    ctx: null,
    // drao info
    isMouseDown: false,
    selectedImage: null,
    selectedDialog: null,
    IMG_WIDTH: 350,
    clickDown: {
      x: 0,
      y: 0,
    },
    throttleMouseUp: null,
    images: [],
    imageComponents: [],
    commentDialogs: [],
  }),
};
</script>

<style scoped>
.dialog {
  position: absolute;
}
.dialog:hover {
  cursor: pointer;
}
</style>
