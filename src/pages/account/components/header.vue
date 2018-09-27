<!--配置管理-->
<template>
  <div class="login-header">
    <div class="container">
      <div class="logo">
        <a href="/">
          <img src="../../../assets/imgs/logo.png" alt="米今后台">
        </a>
      </div>
      <div class="btn-group">
        <router-link :to="{ name: 'LoginPage' }"
                     tag="button"
                     class="plain-btn">登录</router-link>
        <a href="/" class="home-btn">返回首页</a>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
  data () {
    return {
    }
  },
  created(){
  },
  methods:{
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .login-header .container .logo img {
    width: 170px;
  }
</style>
