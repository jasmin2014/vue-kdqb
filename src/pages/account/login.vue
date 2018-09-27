<!--配置管理-->
<template>
  <div class="app-account">
    <top-header></top-header>
    <div class="main">
      <div class="users">
        <div class="wrapper">
          <h2>登录</h2>
          <section class="phone">
            <el-input v-model.trim="login.phone"
                      ref="phone"
                      placeholder="请输入手机号"
                      autofocus
                      @keyup.native.enter="handleLogin"></el-input>
            <p class="hint" v-if="isActive">
              您的账号未注册，
              <router-link :to="{name: 'ResetPage', params: {phone: login.phone,type:'active'}}">立即去注册</router-link>
            </p>
          </section>
          <section class="password">
            <el-input v-model="login.password"
                      ref="password"
                      placeholder="请输入密码"
                      type="password"
                      @input="handlePasswordChange"
                      @keyup.native.enter="handleLogin"></el-input>
          </section>
          <!--<section class="picturevalidate">-->
          <!--<el-input v-model="login.validatecod"-->
          <!--ref="validatecode"-->
          <!--placeholder="请输入图形验证码"-->
          <!--type="text"-->
          <!--@input="handleValidateCodeChange"-->
          <!--@keyup.native.enter="handleLogin"></el-input>-->
          <!--</section>-->
          <section class="forget-password">
            <router-link :to="{name: 'ResetPage', params: {phone: login.phone},query:{type:'active'}}" title="去注册">注册
            </router-link>
            <router-link :to="{name: 'ResetPage', params: {phone: login.phone},query:{type:'forget'}}" class="resetpass"
                         title="忘记密码，去重置">忘记密码
            </router-link>
          </section>
          <section class="action">
            <el-button type="primary"
                       :loading="loading"
                       @click="handleLogin">立即登录
            </el-button>
          </section>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { checkPhone, doLogin } from "../../api/login";
import TopHeader from "./components/header.vue";
import Utils from "../../lib/method";

import { getAllSysEnum, getRegionEnum, getChannelList } from "../../api/common";

const ILLEGAL_PHONE = "ILLEGAL_PHONE";
const NULL_PASSWORD = "NULL_PASSWORD";

const IS_CHECKING = "IS_CHECKING";
const NO_AUTHORITY = "NO_AUTHORITY";
const NOT_ACTIVATED = "NOT_ACTIVATED";
const NETWORK_ERROR = "NETWORK_ERROR";

const PASSWORD_ERROR = "PASSWORD_ERROR";
const phoneRegexp = /^1[34578]\d{9}$/;
export default {
  name: "LoginPage",
  components: { TopHeader },
  data() {
    return {
      login: {
        phone: "",
        password: ""
      },
      isActive: false,
      loading: false
    };
  },
  created() {
    this.login.phone = this.$route.params.phone;
  },
  methods: {
    getSysEnums() {
      getAllSysEnum().then(
        response => {
          const res = response.data;
          if (res.code == 200) {
            const enums = res.body.reduce((accumulator, item) => {
              const key = `${item.dicCode}`.trim();
              accumulator[key] = accumulator[key] || [];
              accumulator[key].push({
                text: item.itemName,
                value: item.itemValue
              });
              return accumulator;
            }, {});
            // console.log(JSON.stringify(enums));
            this.$store.commit("saveSysEnums", enums);
          }
        },
        () => {}
      );
    },
    getRegionEnum() {
      getRegionEnum().then(
        response => {
          let res = response.data;

          if (res.code == 200) {
            let regions = {};

            let province = [];
            let result = res.body.data || [];

            result.forEach(item => {
              province.push({ text: item.name, value: item.code });
              let city = [];
              let _provinces = item.children || [];
              _provinces.forEach(cityItem => {
                city.push({ text: cityItem.name, value: cityItem.code });
                let district = [];
                let _cities = cityItem.children || [];
                _cities.forEach(districtItem => {
                  district.push({
                    text: districtItem.name,
                    value: districtItem.code
                  });
                });
                regions[cityItem.name] = district;
              });
              regions[item.name] = city;
            });

            regions["省"] = province;

            this.$store.commit("saveRegions", regions);
          } else {
            this.$message({
              showClose: true,
              message: result.message,
              type: "error"
            });
          }
        },
        err => {}
      );
    },
    getChannelList(isEnable) {
      getChannelList(isEnable).then(response => {
        let channelOption = [],
          channels = {};
        const res = response.data;
        if (res.code == 200) {
          res.body.forEach(ele => {
            channelOption.push({
              text: ele.channelName,
              value: ele.channelCode
            });
            channels[ele.channelCode] = ele.channelName;
            this.$store.commit("saveSysChannels", channels);
          });
          this.$store.commit("getAllChannel", channelOption);
        }
      });
    },
    handleLogin() {
      const phone = this.login.phone;
      if (!phoneRegexp.test(phone)) {
        this.$refs.phone.$refs.input.focus();
        this.$refs.phone.$refs.input.classList.add("error");
        this.$message({
          message: this.getMessageByIllegalType(ILLEGAL_PHONE),
          type: "error"
        });
      } else if (!this.login.password) {
        this.$refs.phone.$refs.input.focus();
        this.$refs.password.$refs.input.classList.add("error");
        this.$message({
          message: this.getMessageByIllegalType(NULL_PASSWORD),
          type: "error"
        });
      } else {
        this.loading = true;
        this.doLogin(this.login.phone, this.login.password);
      }
    },
    doLogin(phone, password) {
      doLogin(phone, password).then(
        ({ data }) => {
          this.loading = false;
          if (data.code === "200") {
            this.loading = true;
            const token = data.body.token;
            Utils.$setLocalStorage("token", token);

            this.getSysEnums();
            this.getRegionEnum();
            this.getChannelList(false);

            this.$router.push({ path: "/WelcomeAll" });
          } else if (data.code === "202002") {
            //密码错误
            this.$refs.password.$refs.input.focus();
            this.$refs.password.$refs.input.classList.add("error");
            this.$message({
              message: this.getMessageByIllegalType(PASSWORD_ERROR),
              type: "error"
            });
          } else if (data.code === "2002001") {
            //未激活
            this.isActive = false;
          } else {
            this.$message({
              message: data ? data.message : "服务器忙，请稍后再试",
              type: "error"
            });
          }
        },
        () => {
          this.loading = false;
          this.$message({
            message: this.getMessageByIllegalType(NETWORK_ERROR),
            type: "error"
          });
        }
      );
    },
    checkPhone(token) {
      checkPhone(token).then(
        ({ data }) => {
          if (data.code === 200) {
            if (data.body == "USABLE" || data.body == "DISABLED") {
              this.$router.push({ name: "Welcome" });
            } else {
              this.loading = false;
              // this.isActive = true;
              this.$message({
                message: "您的账号异常,请联系客服处理",
                type: "error"
              });
            }
          }
        },
        error => {
          let message = "服务器忙，请稍后再试";
          if (error && error.response && error.response.data) {
            message = error.response.data.message || message;
          }
          this.loading = false;
          this.$message({
            message,
            type: "error"
          });
        }
      );
    },
    handlePasswordChange(password) {
      if (password) {
        this.$refs.password.$refs.input.classList.remove("error");
      }
    },
    getMessageByIllegalType(type) {
      let msg = "";
      switch (type) {
        case ILLEGAL_PHONE:
          msg = "请输入正确的手机号";
          break;
        case NULL_PASSWORD:
          msg = "请输入密码";
          break;
        case IS_CHECKING:
          msg = "正在检测账号安全";
          break;
        case NO_AUTHORITY:
          msg = "没有系统权限";
          break;
        case NOT_ACTIVATED:
          msg = "尚未注册";
          break;
        case NETWORK_ERROR:
          msg = "您的网络有问题，请稍后再试";
          break;
        case PASSWORD_ERROR:
          msg = "密码错误";
          break;
        default:
          msg = type;
          break;
      }
      return msg;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
