var merge = require("webpack-merge");
var prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  "process.env": {
    NODE_ENV: '"testing"'
  },
  APP_ID: '"uc21c9ac1ea7a7aaab"', // 用户中心appId
  APP_SECRET: '"cf9b57494e014a7490fd211428241350"', // 用户中心appSecret
  U_CENTER_BASE_URL: '"https://uat-ucenter.trc.com/gateway/foundation-user"'
});
