<template>
  <login-area @login="onLogin" @signup="onSignup" />
</template>

<script>
import LoginArea from "@/components/LoginArea.vue";

export default {
  name: "Login",

  components: {
    LoginArea,
  },
  methods: {
    onLogin(payload) {
      this.$emit("login", payload);
    },
    onSignup(payload) {
      this.$emit("signup", payload);
    },
  },
};
</script>
