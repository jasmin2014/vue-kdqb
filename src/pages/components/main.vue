<template>
  <div class="wrap">
    <kd-header></kd-header>
    <div class="main">
      <kd-sidebar :active="activeMenu"></kd-sidebar>
      <div class="layout-wrap">
        <kd-breadcrumb :breadcrumb="breadcrumb"></kd-breadcrumb>
        <div class="layout">
          <!--====START=====财务管理-贷款管理=========-->
          <div class="box">
            <router-view class="view"></router-view>
          </div>
          <!--=========财务管理-贷款管理=====END====-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app-main',
    data () {
      return {
        breadcrumb: this.$route.matched,
        activeMenu: this.$route.matched[2] ? this.$route.matched[2].path : this.$route.path
      }
    },
    created(){
      this.$saveRouterInstance(this.$router);
      this.$saveStoreInstance(this.$store);
    },
    beforeRouteUpdate(to, from, next) {
      // console.log(to)
      this.breadcrumb = to.matched;
      this.breadcrumb[0].path = '/';
      this.activeMenu = to.matched[2] ? to.matched[2].path : to.fullPath;
      this.title = to.matched[0].meta.title;
      next();
    },
    beforeRouteLeave(to, from, next) {
      // this.breadcrumb = to.matched;
      // this.breadcrumb[0].path = '/';
      // this.activeMenu = to.matched[2] ? to.matched[2].path : to.fullPath;
      // this.title = to.matched[0].meta.title;
      next();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.layout {
  width: 100%;
  height: 100%;
}

.box {
  padding: 0!important;
  width: 100%;
  height: 100%;
}

.view{
  width: 100%;
  height: 100%;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
