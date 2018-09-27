<!-- header -->
<template>
  <div class="header">
    <div class="logo">
      <router-link :to="{name:'Welcome'}">
        <img src="../../assets/imgs/logo.png" alt="">
      </router-link>
    </div>
    <div class="toolbar">
      <el-dropdown class="user"
                   trigger="click"
                   placement="bottom">
        <div class="user-info">
          <div class="avatar">
            <!--<img :src="user.avatar" alt="">-->
          </div>
          <div class="info">
            <p class="username">{{ user.cellphone}}</p>
            <p class="company">{{ user.lastLoginTime}}</p>
          </div>
          <i class="dropdown-arrow el-icon el-icon-arrow-down"></i>
        </div>
        <el-dropdown-menu class="user-dropdown-list" slot="dropdown">
          <!--<div>-->
            <!--<el-dropdown-item><i class="el-icon-setting"></i>-->
              <!--<router-link :to="{name: 'ResetPage', params: {phone: user.mobile},query:{type:'reset'}}">重置密码</router-link>-->
            <!--</el-dropdown-item>-->
          <!--</div>-->
          <div @click="handleExit">
            <el-dropdown-item><i class="el-icon-question"></i> 退出登录</el-dropdown-item>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { getUserLoginInfo} from "../../api/common.js";

export default {
  name: "KdHeader",
  props: {
    title: String
  },
  data() {
    return {
      user: {}
    };
  },
  computed: {},
  created() {
    this.getUserLoginInfo();
  },
  methods: {
    handleExit() {
      this.$confirm("您确定要退出账号?", "退出提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      })
        .then(() => {
          this.$logout(() => {
            this.$removeLocalStorage("token");
            this.$removeLocalStorage("user");
            this.$removeLocalStorage("routes");
            this.$router.push({ name: "LoginPage" });
          });
        })
        .catch(() => {});
    },
    getUserLoginInfo() {
      getUserLoginInfo()
        .then(({ data }) => {
          if (data.code == 200) {
            const user = data.body;
            if (user) {
              this.user = user;
              this.$setLocalStorage("user", user);
            }
          }
        })
        .catch(response => {
          if (!response || response.status !== 401) {
            this.$logout(() => {
              this.$router.push({ name: "LoginPage" });
            });
          }
        });
    }
  }
};
</script>

<style lang="scss">
.header {
  width: 100%;
  height: 60px;
  color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: #ffffff;

  .logo {
    display: inline-block;
    width: 200px;
    height: 100%;
    text-align: center;
    background: #ffffff;

    a {
      vertical-align: middle;
      display: block;
      height: 100%;

      &:after {
        content: "";
        vertical-align: middle;
        display: inline;
        line-height: 60px;
      }

      img {
        vertical-align: middle;
        width: 170px;
      }
    }
  }

  .title {
    display: inline-block;
    margin-left: 20px;

    h2 {
      margin: 0;
      padding-left: 20px;
      width: 180px;
      height: 38px;
      line-height: 38px;
      font-size: 14px;
      font-weight: normal;
      border-radius: 4px;
      background: #f2f6fa;
      color: #868d9a;
    }

    &.dropdown {
      h2 {
        position: relative;
        cursor: pointer;

        &:before {
          position: absolute;
          right: 15px;
        }
      }
    }
  }

  .toolbar {
    float: right;
    margin-right: 40px;
    height: 60px;

    .download {
      float: left;
      width: 70px;
      height: 100%;
      border-left: 1px solid #e3e7ee;
      border-right: 1px solid #e3e7ee;

      & > i {
        line-height: 60px;
      }
    }

    .user {
      float: left;
      height: 100%;
      border-right: 1px solid #e3e7ee;

      .user-info {
        position: relative;
        text-align: left;
        padding: 10px;
        width: 180px;
        height: 100%;
        cursor: pointer;

        /*.avatar {*/
        /*position: absolute;*/
        /*overflow: hidden;*/
        /*left: 10px;*/
        /*top: 10px;*/
        /*width: 40px;*/
        /*height: 40px;*/
        /*border-radius: 50%;*/

        /*img {*/
        /*display: block;*/
        /*width: 100%;*/
        /*height: 100%;*/
        /*background: #e5e5e5;*/
        /*}*/
        /*}*/

        .avatar {
          display: none;
        }

        .info {
          /*margin-left: 50px;*/
          margin-right: 25px;
          line-height: 1.5;

          p {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            margin: 0;
          }

          .username {
            font-size: 14px;
            color: #333333;
          }

          .company,
          .phone {
            font-size: 12px;
            color: #868d9a;
          }
        }

        .dropdown-arrow {
          position: absolute;
          display: block;
          top: 0;
          right: 10px;
          height: 100%;
          line-height: 60px;
        }
      }
    }
  }
}

.switch-dropdown-list,
.user-dropdown-list {
  width: 180px;
  padding: 5px 0;
}
</style>
