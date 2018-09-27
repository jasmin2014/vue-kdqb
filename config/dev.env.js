"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  "process.env": {
    NODE_ENV: '"development"'
  },
  APP_ID: '"ucad2c96167e18d315"',
  APP_SECRET: '"41233e35b2cf43a191d1415ad748bb5a"',
  U_CENTER_BASE_URL: '"http://ucenter.fengdai.org/gateway/foundation-user"'
});
