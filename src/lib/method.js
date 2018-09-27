import { MessageBox } from "element-ui";
import { logout } from "../api/user";
import { getPartyRealName, getChannelNameByCode } from "../api/common";

/**
 * yyyy-MM-dd 或 yyyy-MM-dd HH:mm:ss 格式化
 * @param {String} obj
 * @returns {String}
 */
const $dateFilter = function(obj, type) {
  const date = new Date(obj);
  const yyyy = date.getFullYear();
  const MM =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const yyyy_MM_dd =
    yyyy.toString() + "-" + MM.toString() + "-" + dd.toString();

  const hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const mm =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(); //分
  const ss =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(); //秒

  const yyyy_MM_dd_hh_mm_ss =
    yyyy_MM_dd +
    " ".toString() +
    hh.toString() +
    ":" +
    mm.toString() +
    ":" +
    ss.toString();
  return type && type === "yyyy-MM-dd HH:mm:ss"
    ? yyyy_MM_dd_hh_mm_ss
    : yyyy_MM_dd;
};

/**
 * 深拷贝
 * @param {Object | Array} obj
 * @returns {Object | Array}
 */
const $deepcopy = function(obj) {
  if (!(typeof obj == "object")) {
    return;
  }
  for (var key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      (obj[key] == null || obj[key] == undefined || obj[key] == "")
    ) {
      delete obj[key];
    }
  }
  // return obj;
  return JSON.parse(JSON.stringify(obj));
};

let $router = null;
const $saveRouterInstance = function(router) {
  $router = router;
};
const $getRouterInstance = function() {
  return $router;
};

let $store = null;
const $saveStoreInstance = function(store) {
  $store = store;
};
const $getStoreInstance = function() {
  return $store;
};
//日期转换
const $formatDate = function(date, format) {
  date = new Date(date);
  if (!format) {
    format = "yyyy-MM-dd hh:mm:ss";
  }

  var map = {
    M: date.getMonth() + 1, //月份
    d: date.getDate(), //日
    h: date.getHours(), //小时
    m: date.getMinutes(), //分
    s: date.getSeconds(), //秒
    q: Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  };
  format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
    var v = map[t];
    if (v !== undefined) {
      if (all.length > 1) {
        v = "0" + v;
        v = v.substr(v.length - 2);
      }
      return v;
    } else if (t === "y") {
      return (date.getFullYear() + "").substr(4 - all.length);
    }
    return all;
  });
  return format;
};
/**
 * 预览一组图片
 * @param {Array} files 图片列表, {name: <图片名称>, url: <图片地址>}
 * @param {Number} index 预览从第几张图片开始
 * @returns {*}
 */
const $preview = function(files, index = 0) {
  const h = this.$createElement;
  const message = [];
  for (let i = 0; i < files.length; i++) {
    if (index === i) {
      message.push(
        h("img", {
          attrs: {
            src: files[i].url,
            alt: files[i].name
          }
        })
      );
    } else {
      message.push(
        h("img", {
          attrs: {
            src: files[i].url,
            alt: files[i].name
          },
          style: {
            display: "none"
          }
        })
      );
    }
  }
  const previewPrev = function() {
    if (index > 0) {
      document.querySelectorAll(".message-preview .img-list img")[
        index
      ].style.display = "none";
      document.querySelectorAll(".message-preview .img-list img")[
        --index
      ].style.display = "block";
    }
  };
  const previewNext = function() {
    if (index < files.length - 1) {
      document.querySelectorAll(".message-preview .img-list img")[
        index
      ].style.display = "none";
      document.querySelectorAll(".message-preview .img-list img")[
        ++index
      ].style.display = "block";
    }
  };
  const cancelPreview = function() {
    document
      .querySelector(
        ".message-preview .el-button.el-button--default.el-button--small"
      )
      .click();
  };
  const previewClickHandler = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.clientX === 0) return;
    const ratio = e.clientX / document.body.clientWidth;
    if (ratio <= 0.4 && index > 0) {
      previewPrev();
    } else if (ratio >= 0.6 && index < files.length - 1) {
      previewNext();
    } else {
      cancelPreview();
    }
  };
  const cursorHandler = function(e) {
    window.requestAnimationFrame(() => {
      const ratio = e.clientX / document.body.clientWidth;
      if (ratio <= 0.4 && index !== 0) {
        this.classList.remove("next");
        this.classList.remove("zoom-out");
        this.classList.add("prev");
      } else if (ratio >= 0.6 && index !== files.length - 1) {
        this.classList.remove("prev");
        this.classList.remove("zoom-out");
        this.classList.add("next");
      } else {
        this.classList.remove("prev");
        this.classList.remove("next");
        this.classList.add("zoom-out");
      }
    });
  };
  const bindEvent = function() {
    if (document.querySelector(".message-preview")) {
      document.querySelector(".message-preview").onmousemove = cursorHandler;
      document.querySelector(".message-preview").onclick = previewClickHandler;
    } else {
      setTimeout(bindEvent, 200);
    }
  };
  setTimeout(bindEvent);
  const defaultOptions = {
    customClass: "message-preview",
    message: h(
      "div",
      {
        class: "img-list"
      },
      message
    ),
    dangerouslyUseHTMLString: true,
    showCancelButton: false,
    showConfirmButton: false,
    beforeClose: (action, instance, done) => {
      document.querySelector(".message-preview").onmousemove = null;
      document.querySelector(".message-preview").onclick = null;
      done();
    },
    callback: (action, instance) => {
      instance.message = "";
    }
  };
  return MessageBox(defaultOptions);
};

window.URL = window.URL || window.webkitURL || window.mozURL;

/**
 * 创建文件blob地址
 * @param {Blob} file
 * @returns {String}
 */
const $createObjectURL = function(file) {
  return window.URL.createObjectURL(file);
};
/**
 * 回收blob地址
 * @param {String} url
 */
const $revokeObjectURL = function(url) {
  window.URL.revokeObjectURL(url);
};
/**
 * 下载Excel文件
 * @param {} data
 * @param {} data
 * 直接下载文件
 */
const $downloadExcel = function(data, filename) {
  if ("msSaveOrOpenBlob" in navigator) {
    // Microsoft Edge and Microsoft Internet Explorer 10-11
    window.navigator.msSaveOrOpenBlob(data, filename);
  } else {
    // standard code for Google Chrome, Mozilla Firefox etc
    const url = $createObjectURL(data);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = decodeURI(filename);
    document.body.appendChild(anchor);
    anchor.click();
    $revokeObjectURL(url);
  }
};

/**
 * 以JSON字符串存储value到LocalStorage
 * @param {String} key
 * @param {Object | String | Number | Boolean} value
 */
const $setLocalStorage = function(key, value) {
  window.localStorage[key] = JSON.stringify(value);
};
/**
 * 读取LocalStorage，setLocalStorage镜像方法
 * @param {String} key
 * @returns {Object | String | Number | Boolean}
 */
const $getLocalStorage = function(key) {
  return JSON.parse(window.localStorage[key] || null);
};
/**
 * 移除LocalStorage中的某项
 * @param {String} key
 */
const $removeLocalStorage = function(key) {
  window.localStorage.removeItem(key);
};

/**
 * 对象过滤(原理同数组filter)
 * @param {Object} obj
 * @param {Function} predicate 是否过滤回调
 * @returns {Object}
 */
const $objFilter = function(obj, predicate) {
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && predicate(obj[key])) {
      result[key] = obj[key];
    }
  }
  return result;
};

/**
 * 数组转换为十进制数字
 * e.g. [0,2,5] -> 100101 -> 37
 * @param {Array} array
 * @returns {Number}
 */
const $arrayToBinary = function(array) {
  let binary = 0;
  for (const i of array) {
    binary += Math.pow(2, i);
  }
  return binary;
};

/**
 * 浮点数乘法
 * @param {Number} num 乘数(浮点数)
 * @param {Number} multiplier 被乘数
 * @returns {Number}
 */
const $floatMultiply = function(num, multiplier) {
  const splits = String(num).split(".");
  const integer = Number(splits.join(""));
  const scale = Math.pow(10, splits.length > 1 ? splits[1].length : 0);
  return (integer * multiplier) / scale;
};

/**
 * 浮点数除法
 * @param {Number} num 除数(浮点数)
 * @param {Number} divider 被除数
 * @returns {Number}
 */
const $floatDivide = function(num, divider) {
  const splits = String(num).split(".");
  const integer = Number(splits.join(""));
  const scale = Math.pow(10, splits.length > 1 ? splits[1].length : 0);
  return integer / (scale * divider);
};
/**
 * 浮点数转换为百分比
 * @param {Number} val
 * @returns {String} 包含%的百分比，且保留两位小数
 */
const RegInt = /^[1-9]\d*$/;
const $floatToPercentage = function(val, num) {
  if (num) {
    return $floatToFixed($floatMultiply(Number(val), 100), num);
  } else {
    return $floatToFixed($floatMultiply(Number(val), 100)) + "%";
  }
};

/**
 * 保留两位小数
 */
const $floatToFixed = function(val, num) {
  const pointPosition = String(val).indexOf(".") + 1; //找出小数点的位置
  const decimalNum = String(val).length - pointPosition; //小数的位数
  if (RegInt.test(Number(val)) || decimalNum == 1 || decimalNum == 2) {
    return val;
  } else {
    if (num) {
      return Math.round(Number(val) * 1000) / 1000;
    } else {
      return Math.round(Number(val) * 100) / 100;
    }
  }
};

const $floatToNumber = function(val) {
  return isNaN(Number(val)) ? val : $floatMultiply(Number(val), 100);
};

const IS_URL = /^http(s)?:/;
/**
 * str是否是链接
 * @param {String} str 需要判断的字符串
 * @returns {Boolean}
 */
const $isUrl = function(str) {
  return IS_URL.test(str);
};
/**
 * 将接口数据转换为vue路由
 * @param {Array} data 处理过的menu接口数据
 * @param {Object} map vue组件name到组件的映射
 * @returns {Array} 路由数组
 */
const $menuTransformer = function(allRoutes, userRoutes) {
  if (typeof userRoutes === "object" && userRoutes instanceof Array) {
    const retRoutes = [...userRoutes];
    retRoutes.forEach((route, index) => {
      let searchInfo = $searchRoute(route, allRoutes);
      if (searchInfo.isEixst) {
        const child = route.child ? route.child : [];
        if (allRoutes[index].redirect && child.length > 0) {
          retRoutes[index] = {
            path: route.url,
            name: allRoutes[searchInfo.index].name,
            component: allRoutes[searchInfo.index].component,
            meta: {
              show: allRoutes[searchInfo.index].meta.show,
              auth: true,
              title: route.name
            },
            redirect: allRoutes[searchInfo.index].redirect,
            children:
              route.child.length > 0
                ? $menuTransformer(
                    allRoutes[searchInfo.index].children,
                    route.child
                  )
                : []
          };
        } else {
          retRoutes[index] = {
            path: route.url,
            name: allRoutes[searchInfo.index].name,
            component: allRoutes[searchInfo.index].component,
            meta: {
              show: allRoutes[searchInfo.index].meta.show,
              auth: true,
              title: route.name
            }
          };
        }
      }
    });
    return retRoutes;
  } else {
    return [];
  }
};

/**
 * 判断路由中是否存在某个路由
 * @param {Array} route 用户中心返回的单个路由
 * @param {Object} routes 总的路由列表
 * @returns {Boolean} 是否存在
 */
const $searchRoute = function(route, routes) {
  for (let [index, val] of routes.entries()) {
    if (route.name === val.meta.title) {
      return {
        isEixst: true,
        index: index
      };
    } else {
      continue;
    }
  }
  return {
    isEixst: false
  };
};

/**
 * 退出登录
 * 清除缓存
 */
const $logout = function(onComplete = null) {
  logout()
    .then(() => {
      this.$removeLocalStorage("token");
      this.$removeLocalStorage("type");
      this.$removeLocalStorage("action");
      this.$removeLocalStorage("routes");
      if (typeof onComplete === "function") {
        onComplete();
      }
    })
    .catch(() => {
      this.$removeLocalStorage("token");
      this.$removeLocalStorage("type");
      this.$removeLocalStorage("action");
      this.$removeLocalStorage("routes");
      if (typeof onComplete === "function") {
        onComplete();
      }
    });
};

const $filterUpdate = function(val, updatedBys) {
  let res = [];
  res = updatedBys.filter(_ => _.value === val);
  return res && res[0] ? res[0].text : val || "-";
};

const $tableDefFormat = function(row, col, val) {
  return (typeof val === "number" && val === 0) ||
    (typeof val === "string" && val === "0")
    ? 0
    : val || "-";
};

//处理最近更新人
const $getPartyRealName = function(updatedBys) {
  return new Promise((resolve, reject) => {
    getPartyRealName({ list: updatedBys })
      .then(response => {
        const res = response.data.body;
        const updatedBysList = [];
        for (let key in res) {
          updatedBysList.push({
            value: key,
            text: res[key]
          });
        }
        resolve(updatedBysList);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export default {
  $dateFilter,
  $deepcopy,
  $saveRouterInstance,
  $getRouterInstance,
  $saveStoreInstance,
  $getStoreInstance,
  $formatDate,
  $preview,
  $setLocalStorage,
  $getLocalStorage,
  $removeLocalStorage,
  $logout,
  $objFilter,
  $arrayToBinary,
  $floatMultiply,
  $floatDivide,
  $floatToPercentage,
  $floatToNumber,
  $isUrl,
  $createObjectURL,
  $revokeObjectURL,
  $downloadExcel,
  $menuTransformer,
  $searchRoute,
  $getPartyRealName,
  $filterUpdate,
  $floatToFixed,
  $tableDefFormat
};
