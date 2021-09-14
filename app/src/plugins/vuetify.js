import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify, {
  theme: {
    primary: "#252266",
  },
  icons: {
    iconfont: "fa",
  },
});

export default new Vuetify({});
