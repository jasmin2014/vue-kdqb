
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<!--产品管理-->
<template>
  <div class="box">
   <el-row>
      <el-table :data="list" border>
        <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
        <el-table-column v-for="col in table"
                         :prop="col.prop"
                         :label="col.label"
                         :formatter="col.formatter"
                         :key="col.prop"
                         align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-tooltip content="查看">
              <el-button size="small" icon="el-icon-view" @click="handleLook(scope.row)" type="primary"></el-button>
            </el-tooltip>
            <el-tooltip content="编辑">
              <el-button size="small" icon="el-icon-edit" @click="handleEditRule(scope.row)" type="warning"></el-button>
            </el-tooltip>
            <el-tooltip content="启用" v-if="scope.row.isEnable == 0">
              <el-button size="small" @click="handleDisable(scope.row)" type="success">启用</el-button>
            </el-tooltip>
             <el-tooltip content="禁用" v-if="scope.row.isEnable == 1">
              <el-button size="small" @click="handleDisable(scope.row)" type="danger">禁用</el-button>
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
import { getRuleByPage ,enableRule } from '../../api/products'
export default {
  name: "ProductsRules",
  components: {},
  data() {
    return {
      isStart:true,
      total:0,
      page:{
        pageSize:10,
        pageNum:1
      },
      updatedBys:[],
      table: [
        {
          label: "规则编号",
          prop: "ruleCode"
        },
        {
          label: "规则名称",
          prop: "ruleName"
        },
        {
          label: "更新时间",
          prop: "updatedTime"
        },
        {
          label: "更新人",
          prop: "updatedBy",
          formatter: (row, col, val) => this.$filterUpdate(val,this.updatedBys)
        },
        {
          label: "状态",
          prop: "isEnable",
          formatter: (row, col, val) => this.$filter(val, this.$enum.ENABLE_STATUS)
        }
      ],
      list: [],
      rules:[]
    };
  },
  created() {
    this.getRuleByPage()
  },
  methods: {
    getRuleByPage(){
      getRuleByPage(this.page).then((response)=>{
        const res = response.data
        const updatedBys = []
        if (res.code == 200) {
          res.body.content.forEach(ele=>{
            updatedBys.push(ele.updatedBy)
          })
          if(updatedBys.length!=0){
            this.$getPartyRealName(updatedBys).then(data=>{
              this.updatedBys = data
              this.list = res.body.content
              this.total = res.body.total
            })
          }
        }else{
          this.$message({
            showClose: true,
            type: 'error',
            message:res.message
          })
        }
      })
    },
    enableRule(ruleCode,isEnable){
      const enable = {
        ruleCode:ruleCode,
        isEnable:isEnable
      }
      enableRule(enable).then((response)=>{
        const res = response.data;
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '成功'
          });
          setTimeout(() => {
            this.getRuleByPage()
          }, 1000)
        }else{
          this.$message({
            showClose: true,
            type: 'error',
            message:res.message
          });
        }
      })
    },
    handleEditRule(row) {
      const { href } = this.$router.resolve({
        name: "ProductsEditRules",
        params: {id:row.ruleCode},
        query: {mode: 'EDIT'}
      });
      window.open(href, "_blank");
    },
    handleLook(row){
      const { href } = this.$router.resolve({
        name: "ProductsLookRules",
        params: {id:row.ruleCode},
        query: {mode: 'VIEW'}
      });
      window.open(href, "_blank");
    },
    handleDisable(row){
       this.$confirm(`${row.isEnable ? '禁用':'启用'}操作将影响前端用户使用，确定操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.enableRule(row.ruleCode,row.isEnable ? false : true)
      }).catch(()=>{})
    },
    handleCurrentChange(val){
      this.page.pageNum = val
      this.getRuleByPage()
    },
    handleSizeChange(val){
      this.page.pageSize = val
      this.getRuleByPage()
    }
  }
};
</script>

