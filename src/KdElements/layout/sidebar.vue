<!-- 侧边导航 -->
<template>
  <div class="side-bar">
    <el-menu router unique-opened :default-active="active">
      <template v-for="sub in routes">
        <el-submenu :index="sub.path" v-if="isShow(sub)" :key="sub.path">
          <template slot="title">{{ sub.meta.title || sub.name }}</template>
          <el-submenu v-for="gs in sub.children" v-if="gs.children && gs.children.length > 0 && isShow(gs)" :key="gs.path" :index="sub.path + '/' + gs.path ">
            <template slot="title">{{gs.meta.title || gs.name}}</template>
            <el-menu-item v-for="ggs in gs.children" v-if="isShow(ggs)" :key="ggs.path" :index="'/pocket/' + sub.path + '/' + gs.path + '/' + ggs.path ">{{ggs.meta.title || ggs.name}}</el-menu-item>
          </el-submenu>
          <el-menu-item v-for="sec in sub.children" v-if="(!sec.children) && isShow(sec)" :key="sec.path" :index="'/pocket/'  + sub.path + '/'+sec.path">
            {{ sec.meta.title || sec.name }}
          </el-menu-item>

        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { getLoginUser, getMenus } from "../../api/user";
export default {
  name: "KdSidebar",
  props: ["active"],
  data() {
    return {
      routes: []
    };
  },
  methods: {
    // 获取当前二级路由
    getRoutes() {
      getMenus()
        .then(({ data }) => {
          if (data.code == 200) {
            const user = data.body;
            if (user) {
              let allRoutes = this.$router.options.routes[1].children;
              this.routes = this.$menuTransformer(allRoutes, user);
            }
            this.$setLocalStorage("routes", this.routes);
          }
        })
        .catch(response => {
          // console.log("catch_error:", response);
          if (response.status === 401) {
            this.$logout(() => {
              this.$removeLocalStorage("token");
              this.$removeLocalStorage("routes");
              this.$router.push({
                name: "LoginPage"
              });
            });
          }
        });
      // getLoginUser()
      //   .then(({ data }) => {
      //     if (data.code === 200) {
      //       const user = data.body;
      //       if (user) {
      //         this.$setLocalStorage("user", user);
      //         let userRoutes = user.menusAndAuth;
      //         let allRoutes = this.$router.options.routes[1].children;
      //         this.routes = this.$menuTransformer(allRoutes, userRoutes);
      //       }
      //       this.$setLocalStorage("routes", this.routes);
      //     }
      //   })
      //   .catch(response => {
      //     if (!response || response.status !== 401) {
      //       this.$logout(() => {
      //         this.$removeLocalStorage("token");
      //         this.$removeLocalStorage("user");
      //         this.$removeLocalStorage("routes");
      //         this.$router.push({
      //           name: "LoginPage"
      //         });
      //       });
      //     }
      //   });
    },
    isShow(r) {
      return r.meta && r.meta.show;
    }
  },
  created() {
    this.getRoutes();
    let routes = this.$router.options.routes[1].children;
    console.log("this.routes:", routes);
  }
};
</script>

<style lang='scss'>
.side-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: calc(100vh - 40px);
  /*border: 1px solid rgb(209, 219, 229);*/
  /*box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);*/
  box-shadow: 0 4px 8px rgba(192, 206, 221, 0.2);
  background: #1e262f;
  overflow-y: auto;

  .el-menu {
    border: none;
    background: #222a34;
    color: #868d9a;

    .el-submenu__title,
    .el-menu-item {
      color: #868d9a;

      &:hover {
        background: #222a34;
        color: #ffffff;
      }
    }

    .el-submenu.is-active .el-submenu__title {
      color: #ffffff;
    }

    .el-submenu .el-menu {
      background: #1e262f;

      .el-menu-item {
        &.is-active {
          background: #0068ff;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
