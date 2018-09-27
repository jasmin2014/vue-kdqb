import axios from "axios";
import { Loading, Message, Notification, MessageBox } from "element-ui";
import Utils from "./method";

function createHttpInstance(baseURL) {
  const http = axios.create({
    baseURL: "/api/" + baseURL,
    timeout: 30000
  });

  // http请求拦截器
  let loadingInstance;

  http.interceptors.request.use(
    config => {
      // element ui Loading方法
      if (!loadingInstance || !document.querySelector(".el-loading-mask")) {
        loadingInstance = window.loadingInstance = Loading.service({
          fullscreen: true,
          background: "rgba(255,255,255,.4)"
        });
      }
      if (Utils.$getLocalStorage("token")) {
        config.headers["Authorization"] = Utils.$getLocalStorage("token");
      }
      if (config.method === "get") {
        config.params = {
          _t: new Date().getTime(),
          ...config.params
        };
      }
      if (config.headers["Content-Type"]) {
        config.headers["Content-Type"] = config.headers["Content-Type"];
      }
      return config;
    },
    () => {
      setTimeout(() => {
        loadingInstance.close();
      });
      Notification.error({
        title: "错误",
        message: "加载超时",
        offset: 80
      });
      return Promise.reject();
    }
  );
  // http响应拦截器
  http.interceptors.response.use(
    data => {
      // 响应成功关闭loading
      setTimeout(() => {
        loadingInstance.close();
      });
      // console.log(data)
      if (data.data.code == 400 || data.data.code == 500) {
        if (data.data.message) {
          Message({
            message: data.data.message,
            type: "error"
          });
        }
      } else if (data.data.code == 401) {
        MessageBox.confirm("登录状态已失效,请重新登录!", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            Utils.$removeLocalStorage("token");
            location.href = "/";
          })
          .catch(() => {
            Utils.$removeLocalStorage("token");
            location.href = "/";
          });
      }
      return data;
    },
    error => {
      setTimeout(() => {
        loadingInstance.close();
      });
      const response = error.response;
      if (response) {
        if (response.data instanceof Blob) {
          const fr = new FileReader();
          fr.onload = function() {
            if (typeof this.result === "string") {
              response.data = JSON.parse(this.result);
            }
            errorHandler(response);
          };
          fr.readAsText(response.data);
        } else {
          errorHandler(response);
        }
      }
      return Promise.reject(response);
    }
  );
  return http;
}

function errorHandler(response) {
  switch (response.status) {
    case 401:
      Utils.$removeLocalStorage("token");
      // Utils.$removeLocalStorage("user");
      break;
    case 400:
      if (response.data && response.data.type === "object") {
        const message = [];
        for (const k in response.data.body) {
          message.push(`<p>${response.data.body[k]}</p>`);
        }
        Message({
          message: message.join("\n"),
          type: "error",
          dangerouslyUseHTMLString: true
        });
      } else if (response.data && response.data.message) {
        Message({
          message: response.data.message,
          type: "error"
        });
      } else if (response.data.error.description) {
        if (response.data.error.description) {
          Message({
            message: response.data.error.description,
            type: "error"
          });
        }
      }
      break;
    case 409:
      if (response.data && response.data.message) {
        Message({
          message: response.data.message,
          type: "error"
        });
      }
      break;
    case 500:
      Notification.error({
        title: "错误",
        message: "服务器错误",
        offset: 80
      });
      break;
    default:
      if (response.data && response.data.message) {
        Message({
          message: response.data.message,
          type: "error"
        });
      }
      break;
  }
}

export default {
  common: createHttpInstance("common/"),
  admin: createHttpInstance("admin/"),
  v1: createHttpInstance("v1/")
};
