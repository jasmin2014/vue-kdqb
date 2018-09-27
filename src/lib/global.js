import GlobalComponents from "./components";
import GlobalMethod from "./method";
import GlobalEnum from "./enum";
import GlobalRegExp from "./validation";

function install(Vue) {
  /* =====全局枚举===================================== */
  Vue.prototype.$enum = GlobalEnum;

  /* =====全局校验===================================== */
  Vue.prototype.$valid = GlobalRegExp;

  /*=============自定义全局组件============*/
  GlobalComponents.forEach(component => {
    Vue.component(component.name, component);
  });

  /* =====全局方法===================================== */
  for (const method in GlobalMethod) {
    Vue.prototype[method] = GlobalMethod[method];
  }
  /* =====全局过滤器=================================== */
  Vue.prototype.$filter = function(value, group) {
    if (
      Object.prototype.toString.call(value) != "[object Null]" &&
      Object.prototype.toString.call(value) != "[object Undefined]"
    ) {
      value = value.toString();
    }
    if (
      Object.prototype.toString.call(value) == "[object Null]" ||
      Object.prototype.toString.call(value) == "[object Undefined]" ||
      value.length == 0
    ) {
      return "-";
    }
    let res = [];
    if (group) {
      const key = `${group}`;
      res =
        this.$store.state.enums[key] &&
        this.$store.state.enums[key].filter(_ => _.value === value);
    } else {
      for (const key in this.$store.state.enums) {
        this.$store.state.enums[key].forEach(item => {
          if (item.value === value) {
            res = res.concat(this.$store.state.enums[key]);
          }
        });
      }
      res = res.filter(_ => _.value === value);
    }
    return res && res[0] ? res[0].text : value;
  };
  Vue.prototype.$filterChannelName = function(value) {
    const myChannel = this.$store.state.channels;
    let res = "";
    if (value && value != null) {
      res = myChannel[value] ? myChannel[value] : "";
    }
    return res;
  };
}

export default { install };
