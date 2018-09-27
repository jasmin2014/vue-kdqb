import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
import pageManageStore from "./operate/pageManage.js";
import luckDrawStore from "./operate/luckDraw.js";
import couponStore from "./operate/coupon.js";

export default new Vuex.Store({
  modules: {
    pageManageStore,
    luckDrawStore,
    couponStore
  },
  state: {
    routes: {},
    regions: {},
    enums: {},
    allChannels: [],
    allEnableChannels: [],
    channels: {},
    qiniu: "",
    menus: [],
    params: {
      accountType: ""
    }
  },
  mutations: {
    saveRoute(state, routes) {
      for (const route of routes) {
        if (route.meta && route.meta.hidden !== true) {
          state.routes[route.path] = route;
        }
      }
    },
    saveRegions(state, regions) {
      if (regions) {
        state.regions = regions;
      }
    },
    saveSysEnums(state, enums) {
      if (enums) {
        state.enums = enums;
      }
    },
    saveQiniuToken(state, token) {
      state.qiniu = token;
    },
    saveParams(state, { key, val }) {
      state.params[key] = val;
    },
    clearParams(state) {
      state.params = {
        accountType: ""
      };
    },
    getAllChannel(state, allChannels) {
      state.allChannels = allChannels;
    },
    getAllEnableChannel(state, allEnableChannels) {
      state.allEnableChannels = allEnableChannels;
    },
    saveSysChannels(state, channels) {
      if (channels) {
        state.channels = channels;
      }
    },
    saveMenus(state, menus) {
      if (menus) {
        state.menus = menus;
      }
    }
  },
  actions: {
    saveRoute(ctx, routes) {
      ctx.commit("saveRoute", routes);
    },
    saveParams(ctx, { key, val }) {
      ctx.commit("saveParams", { key, val });
    },
    getAllChannel(ctx, channelOption) {
      ctx.commit("getAllChannel", channelOption);
    },
    getAllEnableChannel(ctx, channelOption) {
      ctx.commit("getAllEnableChannel", channelOption);
    }
  }
});
