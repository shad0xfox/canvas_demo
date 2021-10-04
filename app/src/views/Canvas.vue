<template>
  <canvas-area v-if="username" />
</template>

<script>
import CanvasArea from "@/components/CanvasArea.vue";
import axios from "../lib/axios";

export default {
  name: "Canvas",
  props: ["username"],
  components: {
    CanvasArea,
  },
  async mounted() {
    try {
      const user = await axios.get("/user/me");

      this.$emit("setUsername", user.username);
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
