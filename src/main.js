// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "element-ui/lib/theme-chalk/index.css";
import "./assets/style.scss";
import "./assets/users.scss";
import "./assets/operate.scss";
import "./lib/polyfill";
import Vue from "vue";
import Vuex from "vuex";
import store from "./vuex/store";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import Global from "./lib/global";

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(Vuex);

Vue.use(Global);
/* eslint-disable no-new */
new Vue({
  el: "#app",
  store,
  router,
  components: { App },
  template: "<App/>"
});
