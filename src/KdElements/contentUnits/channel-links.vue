<template>
  <div class="channel-tags">
    <span>渠道报告:</span>
    <router-link v-for="tag in myTags" :to="tag.to" :class="{'el-tag--success': activeName === tag.to.name}" :title="tag.title" :key="tag.to.name">{{tag.title}}</router-link>
  </div>
</template>

<script>
  export default {
    name:'MjChannelLinks',
    props: {
      activeName: String
    },
    data() {
      return {
        myTags: [
          {
            title: '聚立信',
            to: {
              name: 'ReportJULIXINPage'
            }
          },
          {
            title: '同盾',
            to: {
              name: 'ReportTONGDUNPage'
            }
          },
          {
            title: '宜信致诚—共享版',
            to: {
              name: 'ReportYIXINSharePage'
            }
          },
          {
            title: 'NFCS',
            to: {
              name: 'ReportNFCSPage'
            }
          },
          {
            title: '生意参谋',
            to: {
              name: 'ReportSHENGYICANMOUPage'
            }
          }
        ]
      }
    },
    methods: {
    }
  }
</script>
<style lang="scss">
.channel-tags {
  padding: 0 0 30px 0;
  a {
    background-color: hsla(220,4%,58%,.1);
    border-color: hsla(220,4%,58%,.2);
    display: inline-block;
    padding: 0 10px;
    height: 32px;
    line-height: 30px;
    font-size: 12px;
    color: #909399;
    border-radius: 4px;
    box-sizing: border-box;
    white-space: nowrap;
    margin-left:15px;
  }
  a.el-tag--success {
    background-color: rgba(103,194,58,.1);
    border-color: rgba(103,194,58,.2);
    color: #67c23a;
  }

}
</style>

