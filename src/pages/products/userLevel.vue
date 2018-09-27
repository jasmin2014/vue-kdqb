<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<!--产品管理-->
<template>
  <div class="box">
    <!--=======产品管理-用户信用等级===start========-->
    <el-row>
        <el-table :data="list" border :cell-style = "cellClass">
          <el-table-column v-for="col in table"
                          :prop="col.prop"
                          :label="col.label"
                          :formatter="col.formatter"
                          :key="col.prop"
                          align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-tooltip content="编辑">
                <el-button size="small" type="warning" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
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
       <!--添加 编辑 查看-->
      <el-dialog :title="dialogTitle" :visible.sync="showDialog" width="600px">
        <el-form :model="userLevel" ref="userLevel" label-width="100px">
          <el-row>
            <el-col :span="20">
              <el-form-item label="用户等级:" prop="userGradeCode">
                <kd-input v-model="userLevel.userGradeCode" :disabled="mode !== 'CREATE'"></kd-input>
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>
            <el-col :span="20">
              <el-form-item label="产品规则:" prop="ruleCode">
                <kd-select v-model="userLevel.ruleCode" :options="productRuleOptions"></kd-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import { getUserGradeByPage,getAllEnableRule,getUserGradeByCode } from '../../api/products'
import { editUserGrade} from '../../api/products'
export default {
  name: "ProductsUsersLevelPage",
  data() {
    return {
      table: [
        {
          label: "用户等级",
          prop: "userGradeName"
        },
        {
          label: "产品规则",
          prop: "ruleName",
        },
        {
          label: "更新时间",
          prop: "updatedTime"
        },
        {
          label: "更新人",
          prop: "updatedBy",
          formatter: (row, col, val) => this.$filterUpdate(val,this.updatedBys)
        }
      ],
      list: [],
      updatedBys:[],
      total:0,
      page:{
        pageSize:10,
        pageNum:1
      },
      showDialog:false,
      dialogTitle:'',
      mode:'',
      userLevel: {},
      productRuleOptions:[]
    };
  },
  created() {
    this.getUserGradeByPage()
    this.getAllEnableRule()
  },
  methods: {
    getUserGradeByPage(){
      getUserGradeByPage(this.page).then(response=>{
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
    getAllEnableRule(){
      getAllEnableRule().then(response=>{
        const res = response.data
        if (res.code == 200) {
          res.body.forEach((ele)=>{
            this.productRuleOptions.push({
              text:ele.ruleName,
              value:ele.ruleCode
            })
          })
        }else{
          this.$message({
            showClose: true,
            type: 'error',
            message:res.message
          })
        }
     })
    },
    handleEdit(row){
      this.showDialog = true
      this.dialogTitle = '编辑'
      this.mode = 'EDIT'
      getUserGradeByCode(row.userGradeCode).then(response=>{
         const res = response.data
          if (res.code == 200) {
            this.userLevel = res.body
          }else{
            this.$message({
              showClose: true,
              type: 'error',
              message:res.message
            })
          }
      })
    },
    handleCurrentChange(val){
      this.page.pageNum = val
      this.getUserGradeByPage()
    },
    handleSizeChange(val){
      this.page.pageSize = val
      this.getUserGradeByPage()
    },
    cellClass({row, column, rowIndex, columnIndex}){
      if(row.ruleIsEnable == false){
        if(columnIndex == 1){
          return {
            "color":'#d2c9c9'
          }
        }
      }
    },
    handleSave() {
      this.$refs.userLevel.validate((valid) => {
        if (valid) {
          editUserGrade(this.userLevel).then(response=>{
            const res = response.data
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '编辑成功'
              });
              this.showDialog = false
              this.getUserGradeByPage()
            }else{
              this.$message({
                showClose: true,
                type: 'error',
                message: res.message
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    handleCancel(){
      this.showDialog = false
    }
  }
};
</script>
