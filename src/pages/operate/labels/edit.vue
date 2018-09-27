<!--运营管理 用户标签管理-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>

<template>
<div class="box">
<!--=========运营管理-用户标签管理页 start===========-->
  
  <div style="margin-bottom: 10px;">
    <h3 style="display:inline-block;">白金卡标签</h3>
    <span style="margin-left: 20px;color:#909399">合计人数55555555555</span>
  </div>
  <el-form  label-width="70px">
    <el-row>
      <el-col :span="6">
        <el-form-item label="用户姓名" label-width="70px">
          <el-input v-model="search.name" placeholder="用户姓名" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7" :offset="1">
        <el-form-item label="用户手机号" label-width="100px">
          <el-input v-model="search.phone" type="number" pattern="[0-9]{11}"  placeholder="用户手机号" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="" style="color: #606266">
          剩余 <el-input v-model="search.count" type="number" pattern="[0-9]*" clearable style="display: inline-block;width: 40%"></el-input> 天过期
        </el-form-item>
      </el-col>
      <el-col :span="3" >
        <el-form-item label-width="20px">
          <el-button type="primary" icon="el-icon-search" title="查询" @click="handleSearch"></el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <el-row style="margin-bottom: 20px;">
      <el-button type="primary" title="批量增加" @click="handleImportBatch">批量增加</el-button>
      <el-button title="日志查看" @click="handleSeeLog">日志查看</el-button>
  </el-row>

  <el-table :data="list" border :loading="tableLoading">
    <el-table-column type="index" align="center" width="80" label="序号"></el-table-column>
    <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter" :width="col.width" :key="index" align="center"></el-table-column>
    <el-table-column label="操作" align="center" fixed="right" width="200">
      <template slot-scope="scope">                        
            <el-tooltip content="查看详情">
              <el-button size="small" icon="el-icon-view" @click="handleSee"></el-button>
            </el-tooltip>
            <el-tooltip content="移除">
              <el-button size="small" icon="el-icon-delete"  @click="handleDelete()"></el-button>
            </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
  <el-row type="flex" justify="center" class="mgt20">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" layout="prev, pager, next,jumper,sizes,total" :total="total">
    </el-pagination>
  </el-row>


  <!-- ====================  批量导入start  == -->
  <el-dialog title="批量导入" :visible.sync="dialogImportVisible" width="500px">
    <el-form label-width="100px" style="width: 430px">
      <el-form-item label="有效期至">
        <el-date-picker v-model="importEndDate" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" style="text-align: center;margin-top: 40px;">
      <el-button type="primary" @click="handleImportExcel">点击继续导入Excel</el-button>
    </div>
  </el-dialog>
  <!-- ===================  批量导入end  == -->

  <!-- ==  日志start  ====================== -->
  <el-dialog title="日志查看" :visible.sync="dialogLogVisible" width="800px">
    <el-form  label-width="100px">
      <el-row>
        <el-col :span="11">
          <el-form-item label="用户手机号">
            <el-input v-model="searchLog.phone" type="number" pattern="[0-9]{11}"  placeholder="用户手机号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="操作类型">
            <kd-select v-model="searchLog.type" :options="typeOptions"></kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="日期选择">
            <kd-select v-model="searchLog.date" :options="dateOptions"></kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="11"  :offset="1">
          <el-form-item >
            <el-button type="primary" icon="el-icon-search" title="查询" @click="handleSearchLog"></el-button>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    
    <el-table :data="logList" border>
      <el-table-column v-for="(col, index) in logTable" :prop="col.prop" :label="col.label" :formatter="col.formatter" :width="col.width"
        :key="index" align="center"></el-table-column>
    </el-table>

    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination @size-change="handleSizeChangeLog" @current-change="handleCurrentChangeLog" :current-page="pageLog" :page-sizes="[10, 20, 50, 100]"
        :page-size="limitLog" layout="prev, pager, next,jumper,sizes,total" :total="totalLog">
      </el-pagination>
    </el-row>
    <div class="dialog-footer mgt20" style="text-align: center;">
      <el-button type="primary" @click="dialogLogVisible = false">知道了</el-button>
    </div>
  </el-dialog>
  <!-- ==  日志end  ======================== -->
<!--=========运营管理-用户标签管理页 end===========-->
</div>
</template>

<script>
export default {
  name: "OperateEditLabelsPage",
  data() {
    return {
      total: 0, // 列表总数
      limit: 10, // 每页数量
      page: 1, // 当前页数
      tableLoading: false, // table状态
      search: {
        count: undefined,
        name: undefined,
        phone: undefined
      },
      list: [{
        name: 'dd'
      }],
      table: [{
        label: '用户姓名',
        prop: 'name'
      }, {
        label: '用户手机号',
        prop: 'mobile'
      }, {
        label: '有效期',
        prop: 'mobile'
      }],
      // log
      totalLog: 0, // 列表总数
      limitLog: 10, // 每页数量
      pageLog: 1, // 当前页数
      dialogLogVisible: false,
      searchLog: {
        phone: undefined,
        type: 0,
        date: 0
      },
      typeOptions: [{
        value: 0,
        text: '默认'
      }, {
        value: 1,
        text: '手动删除'
      }, {
        value: 2,
        text: '过期失效'
      }],
      dateOptions: [{
        value: 0,
        text: '一个月内'
      },{
        value: 1,
        text: '3天内'
      },{
        value: 2,
        text: '7天内'
      },{
        value: 3,
        text: '1天内'
      }],
      logList: [{
        mobile: '15765678909'
      }],
      logTable: [{
        label: '用户手机号',
        prop: 'mobile'
      }, {
        label: '操作时间',
        prop: 'time'
      }, {
        label: '操作说明',
        prop: 'remark'
      }],
      // 批量
      dialogImportVisible: false,
      importEndDate: undefined
    };
  },
  methods: {
    // 搜索
    handleSearch () {

    },
    handleSee() {
      this.$router.push({
        name: 'UserDetailPage',
        params: { id: '123' }
      })
    },
    // 删除
    handleDelete() {
      this.$confirm('数据删除后不可恢复，是否继续', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
            message: '已取消删除'
          });         
        })
    },
    getData() {

    },
    handleSizeChange(val) {
      this.limit = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getData()
    },

    // =================批量导入================
    handleImportBatch() {
      this.dialogImportVisible = true
    },
    handleImportExcel() {

    },

    // =================查看日志================
    // 日志查看搜索
    handleSearchLog () {

    },
    // 查看日志
    handleSeeLog() {
      this.dialogLogVisible = true

    },
    getDataLog() {
      
      },
    handleSizeChangeLog(val) {
      this.limit = val
      this.getDataLog()
    },
    handleCurrentChangeLog(val) {
      this.page = val
      this.getDataLog()
    },
  },
  mounted() {
    this.getData()
  }
};
</script>


