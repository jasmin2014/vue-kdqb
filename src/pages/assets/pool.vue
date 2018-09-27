
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<!--债权管理-资产标的池-->
<template>
  <div class="box">
    <!--=======债权管理-资产标的池列表页===start========-->
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="贷款编号">
            <el-input v-model="search.applicationId" placeholder="贷款编号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户姓名">
            <el-input v-model="search.realName" placeholder="客户姓名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号码">
            <el-input v-model="search.mobile" placeholder="手机号码" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="资产状态">
            <kd-select v-model="search.loanStatus"
                       :group="this.$enum.ASSET_STATUS"
                       clearable>
            </kd-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="推送状态">
            <kd-select v-model="search.pushStatus"
                       :group="this.$enum.PUSH_STATUS"
                       clearable>
            </kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" title="搜索" @click="handleSearch"></el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border>
        <el-table-column v-for="col in table"
                         :prop="col.prop"
                         :label="col.label"
                         :formatter="col.formatter"
                         :key="col.prop"
                         align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-tooltip content="查看合同">
              <el-button size="small" @click="handleContract(scope.row.contractUrl)" v-if="scope.row.contractUrl" type="primary">合同</el-button>
              <span v-else>-</span>
            </el-tooltip>
            <el-tooltip content="推送">
              <el-button size="small" @click="handlePush(scope.row)" v-if="scope.row.pushStatus == 'PUSH_FAILED'" type="warning">推送</el-button>
              <span v-else>-</span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="page.pageNum"
        :page-size="page.pageSize"
        layout="sizes,total,prev, pager, next,jumper"
        :total="total">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import { getLoanApplicationPool ,loanApplicationPoolPush } from '../../api/assets.js'
export default {
  name: "AssetsPoolPage",
  components: {},
  data() {
    return {
      search: {
        applicationId: "",
        realName: "",
        mobile: "",
        loanStatus: "",
        pushStatus:"",
        pageSize:10,
        pageNum:1
      },
      total:0,
      page:{
        pageSize:10,
        pageNum:1
      },
      table: [
        {
          label: "客户姓名",
          prop: "realName"
        },
        {
          label: "手机号码",
          prop: "mobile"
        },
        {
          label: "贷款编号",
          prop: "applicationId"
        },
        {
          label: "渠道名称",
          prop: "channelCode",
          formatter: (row, col, val) => this.$filterUpdate(val,this.$store.state.allChannels)
        },
        {
          label: "金额",
          prop: "loanAmount",
          formatter: (row, col, val) => this.$floatToFixed(val)
        },
        {
          label: "月利率",
          prop: "monthIntRate",
          formatter: (row, col, val) => this.$floatToPercentage(val)
        },
        {
          label: "期数",
          prop: "loanPeriods"
        },
        {
          label: "起息日",
          prop: "interestDate",
          formatter: (row, col, val) => this.$tableDefFormat(row, col, val)
        },
        {
          label: "资产状态",
          prop: "loanStatus",
          formatter: (row, col, val) => this.$filter(val, this.$enum.ASSET_STATUS)
        },
        {
          label: "推送状态",
          prop: "pushStatus",
          formatter: (row, col, val) => this.$filter(val)
        },
      ],
      list: []
    };
  },
  created() {
    this.getLoanApplicationPool(this.page)
  },
  methods: {
    getLoanApplicationPool(search){
      getLoanApplicationPool(search).then(response=>{
        const res = response.data
        if(res.code == 200){
          this.list = res.body.content
          this.total = res.body.total
        }else{
          this.$message({
            showClose: true,
            type: 'error',
            message:res.message
          })
        }
      })
    },
    handleSearch() {
      this.getLoanApplicationPool(this.search)
    },
    handleCurrentChange(val){
      this.page.pageNum = val
      this.getLoanApplicationPool(this.page)
    },
    handleSizeChange(val){
      this.page.pageSize = val
      this.getLoanApplicationPool(this.page)
    },
    handleContract(url){
      window.open(url, '_blank')
    },
    handlePush(row){
      loanApplicationPoolPush({applicationId:row.applicationId}).then(response => {
        const res = response.data
        if(res.code == 200){
          this.$message({
            type: 'success',
            message: '推送成功'
          })
          this.getLoanApplicationPool(this.page)
        }else{
          this.$message({
            showClose: true,
            type: 'error',
            message:res.message
          })
        }
      })
    },
  }
};
</script>

