<!--欢迎页面-->
<template>
  <div class="welcome">
    <img src="../../assets/imgs/welcome.jpg" alt="">
  </div>
</template>

<script>
  export default {
    name: 'welcome',
    components: {},
    data() {
      return {}
    },
    methods: {},
    created() {}
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .welcome {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .welcome img {
    display: block;
    width: 100%;
  }

</style>
