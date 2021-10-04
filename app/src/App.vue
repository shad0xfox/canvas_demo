<template>
  <v-app>
    <v-app-bar app color="#252266" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Doge Logo"
          class="shrink mr-2"
          contain
          :src="require('./assets/icon.png')"
          transition="scale-transition"
          width="40"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn @click="logout" v-if="username" text>
        <span class="mr-2">{{ `${username} - Logout` }}</span>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <v-btn v-else text>
        <span class="mr-2">Login</span>
        <v-icon>mdi-login</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view
        :username="username"
        @login="onLogin"
        @signup="onSignup"
        @setUsername="onSetUsername"
      />
    </v-main>
  </v-app>
</template>

<script>
import axios from "./lib/axios";

export default {
  name: "App",
  methods: {
    onSetUsername(username) {
      this.username = username;
    },
    async logout() {
      await axios.post("/logout");
      this.username = null;
      this.$router.push({ name: "Login" });
    },
    async onLogin({ email, password }) {
      try {
        await axios.post("/login", {
          email,
          password,
        });

        this.$router.push({ name: "Canvas" });
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    },
    async onSignup({ email, password, username }) {
      try {
        await axios.post("/signup", {
          email,
          password,
          username,
        });

        this.$router.push({ name: "Canvas" });
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    },
  },
  data: () => ({
    username: null,
    token: null,
  }),
};
</script>
