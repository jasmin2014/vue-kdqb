<!--运营管理 用户标签管理-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<template>
  <div class="box">
    <!--=========运营管理-用户标签管理页 start===========-->    
    <div style="display: flex;justify-content: space-between; align-items: center;">
        <h3>新人标签</h3>
        <el-button size="mini">导出用户list</el-button>
    </div>
    <el-table :data="list" border  :loading="tableLoading">
      <el-table-column type="index" align="center" width="80" label="序号"></el-table-column>
      <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter" :width="col.width" :key="index" align="center"></el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template slot-scope="scope">                        
            <el-tooltip content="查看详情">
              <el-button size="small" icon="el-icon-view" @click="handleSee"></el-button>
            </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 50, 100]"
        :page-size="limit" layout="prev, pager, next,jumper,sizes,total" :total="total">
      </el-pagination>
    </el-row>
    <!--=========运营管理-用户标签管理页 end===========-->
  </div>
</template>

<script>
export default {
  name: "OperateSeeLabelsPage",
  data() {
    return {
      total: 0, // 列表总数
      limit: 10, // 每页数量
      page: 1, // 当前页数
      tableLoading: false, // table状态
      list: [{
        name: 'dd'
      }],
      table: [{
        label: '用户姓名',
        prop: 'name'
      },{
        label: '用户手机号',
        prop: 'mobile'
      }]
    };
  },
  methods: {
    getData () {
      
    },
    handleSee() {
      this.$router.push({
        name: 'UserDetailPage',
        params: { id: '123' }
      })
    },
    handleSizeChange (val) {
      this.limit = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.page = val
      this.getData()
    }
  },
  mounted () {
    this.getData()
  }
};
</script>


