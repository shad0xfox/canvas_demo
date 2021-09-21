<template>
  <v-app id="inspire">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card v-if="page === 'Login'" class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login form</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    prepend-icon="mdi-account"
                    name="email"
                    label="Email"
                    type="text"
                    :rules="rules.email"
                    required
                    v-model="email"
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    prepend-icon="mdi-lock"
                    name="password"
                    label="Password"
                    type="password"
                    :rules="rules.password"
                    required
                    v-model="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="page = 'Signup'">Signup</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="login">Login</v-btn>
              </v-card-actions>
            </v-card>
            <v-card v-else class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Signup form</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    prepend-icon="mdi-account"
                    name="email"
                    label="Email"
                    type="text"
                    :rules="rules.email"
                    required
                    v-model="email"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="mdi-account-box"
                    name="username"
                    label="Username"
                    type="text"
                    :rules="rules.username"
                    required
                    v-model="username"
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    prepend-icon="mdi-lock"
                    name="password"
                    label="Password"
                    type="password"
                    :rules="rules.password"
                    required
                    v-model="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="signup">Signup</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="page = 'Login'">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "Login",
  methods: {
    login() {
      if (!this.email || !this.password) {
        return;
      }
      this.$emit("login", { email: this.email, password: this.password });
    },
    signup() {
      if (!this.email || !this.password || !this.username) {
        return;
      }
      this.$emit("signup", {
        email: this.email,
        password: this.password,
        username: this.username,
      });
    },
  },
  data: () => ({
    page: "Login",
    email: null,
    password: null,
    username: null,
    rules: {
      email: [(val) => (val || "").length > 0 || "This field is required"],
      password: [(val) => (val || "").length > 0 || "This field is required"],
      username: [(val) => (val || "").length > 0 || "This field is required"],
    },
  }),
};
</script>
