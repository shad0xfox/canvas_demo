import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify, {
  theme: {
    primary: "#252266",
  },
  icons: {
    iconfont: "fa", // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
});

export default new Vuetify({});
