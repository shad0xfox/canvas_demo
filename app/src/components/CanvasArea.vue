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
      >
      </canvas>
      <draggable
        v-model="commentDialogs"
        @start="onDialogStartMove"
        @end="onDialogEndMove"
        @move="openDialogModal"
      >
        <v-icon
          v-for="commentDialog in commentDialogs"
          v-bind:key="commentDialog.id"
          class="dialog"
          v-show="commentDialog.visible"
          @drag="(e) => onDialogMoving(e, commentDialog)"
          @click="(e) => openDialogModal(e, commentDialog)"
          :style="{
            top: `${commentDialog.y}px`,
            left: `${commentDialog.x}px`,
          }"
        >
          {{ "fas fa-comments" }}
        </v-icon>
      </draggable>
    </v-card>
  </v-container>
</template>

<script>
// refs: https://codepen.io/Silvia_Chen/pen/rRRQxr
import { debounce, throttle, find } from "lodash";
import axios from "axios";
import imagePath from "../assets/back_image.jpeg";
import draggable from "vuedraggable";
import socketIO from "socket.io-client";
import { SocketTypeEnums } from "../lib/enum";

const { IMAGE_MOVING, IMAGE_MOVING_BROADCAST, IMAGE_MOVE_END } =
  SocketTypeEnums;

axios.defaults.baseURL = "http://localhost:3000/api";

export default {
  name: "CanvasDemo",
  components: {
    draggable,
  },
  async mounted() {
    this.canvas = this.$refs.canvas;
    this.socket = socketIO.connect("http://localhost:3000");

    await this.getImages();
    await this.getCommentDialogs();

    this.utilsCanvasInit();
    window.addEventListener(
      "resize",
      this.utilsDebounce(this.onWindowResize, 500)
    );

    this.socketReceiverRegister();
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
    openDialogModal(e, dialog) {
      console.log(e.clientX, dialog);
    },
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
    onDialogStartMove(e) {
      const { oldIndex: index } = e;
      const dialog = this.commentDialogs[index];

      if (this.isMouseDown || dialog.isDragging) {
        return;
      }

      this.isMouseDown = true;
      dialog.isDragging = true;
      dialog.visible = false;
    },
    onDialogMoving(e, dialog) {
      // drag event last time trigger will get it
      if (e.clientX === 0) {
        return;
      }
      const newX = e.clientX - this.canvasStartX;
      const newY = e.clientY - this.canvasStartY;

      // prevent same place trigger
      if (this.isMouseDown && !(newX === dialog.oldX && newY === dialog.oldY)) {
        const { oldX, oldY } = dialog;
        // first time trigger, old position was null
        const moveX = newX - (oldX || newX);
        const moveY = newY - (oldY || newY);

        dialog.oldX = newX;
        dialog.oldY = newY;

        this.moveDialog(dialog, moveX, moveY);
      }
    },
    async onDialogEndMove(e) {
      const { oldIndex: index } = e;
      const dialog = this.commentDialogs[index];

      this.isMouseDown = false;
      this.resetDraggedDialog(dialog);
      this.checkOverlapping();

      await this.updateDraggedDialog(dialog);
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

      if (this.selectedImage) {
        this.checkOverlapping();
      }
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
      const {
        x: startX,
        y: startY,
        oldX,
        oldY,
        attachedDialog,
      } = this.selectedImage;
      const moveX = x - oldX;
      const moveY = y - oldY;

      const newX = startX + moveX;
      const newY = startY + moveY;

      this.selectedImage.x = newX;
      this.selectedImage.y = newY;
      this.selectedImage.oldX = x;
      this.selectedImage.oldY = y;
      this.selectedImage.isDragging = true;

      const { id, isDragging } = this.selectedImage;
      this.onThrottleSocketImageMove({ id, x: newX, y: newY, isDragging });
      // not to clean corresponding images, can be optimized
      this.drawImages();

      if (attachedDialog?.length) {
        for (const dialog of attachedDialog) {
          this.moveDialog(dialog, moveX, moveY);
        }
      }
    },
    onThrottleSocketImageMove(image) {
      if (typeof this.throttleSocketImageMove !== "function") {
        this.throttleSocketImageMove = this.utilsThrottle(
          this.socketImageMove,
          100
        );
      }

      this.throttleSocketImageMove(image);
    },
    socketImageMove(image) {
      if (this.selectedImage) {
        this.socket.emit(IMAGE_MOVING, image);
      }
    },
    async moveDialog(dialog, moveX, moveY) {
      const { x: startX, y: startY } = dialog;

      const newX = startX + moveX;
      const newY = startY + moveY;

      if (newX < 0) {
        dialog.x = 0;
      } else if (newX > this.canvas.width - 30) {
        dialog.x = this.canvas.width - 30;
      } else {
        dialog.x = newX;
      }

      if (newY < 0) {
        dialog.y = 0;
      } else if (newY > this.canvas.height - 15) {
        dialog.y = this.canvas.height - 15;
      } else {
        dialog.y = newY;
      }

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
    resetDraggedDialog(dialog) {
      dialog.isDragging = false;
      dialog.oldX = null;
      dialog.oldY = null;

      // if dialogs are overlapping together, need set visible together
      for (const dialogItem of this.commentDialogs) {
        dialogItem.visible = true;
      }
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
    checkOverlapping() {
      for (const image of this.images) {
        image.attachedDialog = [];
        for (const dialog of this.commentDialogs) {
          const { x, y } = dialog;
          const { x: imageX, y: imageY, width, height } = image;
          if (
            x >= imageX &&
            x <= imageX + width &&
            y >= imageY &&
            y <= imageY + height
          ) {
            image.attachedDialog.push(dialog);
          }
        }
      }
    },
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
        const { id, x, y, attachedDialog } = this.selectedImage;
        await axios.post(`/canvas/images/${id}`, { x, y });

        if (attachedDialog?.length) {
          for (const dialog of attachedDialog) {
            await this.updateDraggedDialog(dialog);
          }
        }
        this.socket.emit(IMAGE_MOVE_END, { id, x, y, isDragging: false });
      } catch (error) {
        console.log(error);
      }
    },
    async updateDraggedDialog(dialog) {
      try {
        const { id, x, y } = dialog;
        await axios.post(`/canvas/comment-dialogs/${id}`, { x, y });
      } catch (error) {
        console.log(error);
      }
    },
    async getCommentDialogs() {
      try {
        const commentDialogs = await axios.get("/canvas/comment-dialogs");

        this.commentDialogs = commentDialogs.data.map((commentDialog) => ({
          ...commentDialog,
          visible: true,
        }));
      } catch (error) {
        console.log(error);
      }
    },
    updateBroadcastImage(image) {
      const { id, x, y, isDragging } = image;

      const movedImage = this.images.find((image) => image.id === id);
      movedImage.x = x;
      movedImage.y = y;
      movedImage.isDragging = isDragging;

      this.drawImages();
    },
    socketReceiverRegister() {
      const _updateBroadcastImage = this.updateBroadcastImage;

      this.socket.on(IMAGE_MOVING_BROADCAST, (broadCastImage) => {
        _updateBroadcastImage(broadCastImage);
      });
    },
    // -- todo socket event --
    // get dialog position by id
    // get create dialog
    // get delete dialog
  },
  data: () => ({
    // canvas object
    canvas: null,
    ctx: null,
    strokeColor: "#000000",
    strokeWidth: 16,
    // drao info
    isMouseDown: false,
    selectedImage: null,
    selectedDialog: null,
    IMG_WIDTH: 350,
    clickDown: {
      x: 0,
      y: 0,
    },
    images: [],
    imageComponents: [],
    commentDialogs: [],
    socket: null,
    throttleSocketImageMove: null,
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
