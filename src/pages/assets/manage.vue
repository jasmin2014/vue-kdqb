
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<!--资产管理-资产管理-->
<template>
  <div class="box">
    <!--=======资产管理-资产管理列表页===start========-->
   <el-row class="fun-btns">
     <el-col>
       <el-button type="primary" title="添加" @click="handleAddRule">添加</el-button>
     </el-col>
   </el-row>
   <el-row>
      <el-table :data="list" border>
        <el-table-column v-for="col in table"
                         :prop="col.prop"
                         :label="col.label"
                         :formatter="col.formatter"
                         :key="col.prop"
                         align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip content="查看">
              <el-button size="small" icon="el-icon-view" @click="handleLook(scope.row)" type="primary"></el-button>
            </el-tooltip>
            <el-tooltip content="编辑">
              <el-button size="small" icon="el-icon-edit" @click="handleEdit(scope.row)" type="warning"></el-button>
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

   <!--=======资产管理-资产管理列表页===end========-->
    <el-dialog :title="dialogTitle" :visible.sync="showAddRuleDialog" width="600px" @close="handleDialogClose">
      <el-form :model="detail" label-width="140px" :rules="rules" ref="assetsForm">
        <el-form-item label="业务类型:" prop="businessType">
          <kd-select v-model="detail.businessType"
                      :group="this.$enum.BUSINESS_TYPE"
                      :sequence=[6,8,7,11]
                      :disabled="mode == 'VIEW'"
                      clearable>
          </kd-select>
        </el-form-item>
        <el-form-item label="渠道名称:" prop="channelCode">
          <kd-select v-model="detail.channelCode"
                      :channel = "'true'"
                      :disabled="mode == 'VIEW'"
                      clearable>
          </kd-select>
        </el-form-item>
        <el-form-item label="是否用第三方放款:" prop="isThird">
          <el-radio v-model="detail.isThird" :label="labelTrue" :disabled="mode == 'VIEW'">是</el-radio>
          <el-radio v-model="detail.isThird" :label="labelFalse" :disabled="mode == 'VIEW'">否</el-radio>
        </el-form-item>
        <el-form-item label="放款模式:" prop="grantMode">
          <kd-radio v-model="detail.grantMode" :group="this.$enum.LOAN_MODEL"
                  :disabled="this.mode == 'VIEW'"></kd-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="mode!='VIEW'">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getAssetConfig,addAssetConfig,getAssetConfigById,editAssetConfig} from '../../api/assets.js'
export default {
  name: "AssetsManagePage",
  data() {
    return {
      showAddRuleDialog: false,
      dialogTitle:'',
      detail: {
         businessType:'',
        channelCode:'',
        isThird:false,
        grantMode:'DIRECT_INVESTMENT'
      },
      updatedBys:[],
      mode: "",
      assetConfigId:'',
      labelTrue:true,
      labelFalse:false,
      rules:{
        businessType: [
          {required: true, message: '请选择业务类型', trigger:'change'},
        ],
        channelCode: [
          {required: true, message: '请选择渠道名称', trigger:'change'},
        ],
        isThird: [
          {required: true, message: '是否用第三方放款', trigger:'change'},
        ],
        grantMode: [
          {required: true, message: '放款模式', trigger:'change'},
        ]
      },
      table: [
        {
          label: "业务类型",
          prop: "businessType",
          formatter: (row, col, val) => this.$filter(val,this.$enum.BUSINESS_TYPE)
        },
        {
          label: "渠道名称",
          prop: "channelCode",
          formatter: (row, col, val) => this.$filterUpdate(val,this.$store.state.allChannels)
        },
        {
          label: "最后更新人",
          prop: "updatedBy",
          formatter: (row, col, val) => this.$filterUpdate(val,this.updatedBys)
        },
        {
          label: "最后更新时间",
          prop: "updatedTime"
        }
      ],
      list: [],
      total:0,
      page:{
        pageSize:10,
        pageNum:1
      }
    };
  },
  created() {
    this.getAssetConfig()
  },
  methods: {
    getAssetConfig(){
      getAssetConfig(this.page).then(response=>{
        const res = response.data
        const updatedBys = []
        if(res.code == 200){
          res.body.content.forEach(ele=>{
            updatedBys.push(ele.updatedBy)
          })
          if(updatedBys.length != 0){
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
    handleAddRule() {
      this.mode = "CREATE";
      this.showAddRuleDialog = true;
      this.dialogTitle = '添加债权规则'
    },
    handleEdit(row) {
      this.mode = "EDIT";
      this.showAddRuleDialog = true;
      this.dialogTitle = '编辑债权规则'
      this.getAssetConfigById(row)
    },
    handleLook(row) {
      this.mode = "VIEW";
      this.showAddRuleDialog = true;
      this.dialogTitle = '查看债权规则'
      this.getAssetConfigById(row)
    },
    handleDialogClose(){
      this.$refs.assetsForm.resetFields()
    },
    getAssetConfigById(row){
      getAssetConfigById(row.assetConfigId).then(response =>{
        const res = response.data
        if(res.code == 200){
          this.detail = res.body
          this.assetConfigId = this.detail.assetConfigId
        }else{
          this.$message({
            showClose: true,
            type: 'error',
            message:res.message
          })
        }
      })
    },
    submit(response,message){
      const res = response.data
      if(res.code == 200){
        this.$message({
          type: 'success',
          message: message
        })
        this.showAddRuleDialog = false
        this.getAssetConfig()
      }else{
        this.$message({
          type: 'error',
          message: res.message
        });
      }
    },
    handleSizeChange(val){
      this.page.pageSize = val
      this.getAssetConfig()
    },
    handleCurrentChange(val){
      this.page.pageNum = val
      this.getAssetConfig()
    },
    handleCancel() {
      this.showAddRuleDialog = false;
      this.$refs.assetsForm.resetFields();
    },
    handleSubmit() {
      this.$refs.assetsForm.validate((valid) => {
        if (valid) {
          if(this.mode == 'CREATE'){
            addAssetConfig(this.detail).then(response=>{
              this.submit(response,'添加成功')
            })
          }else{
            editAssetConfig(this.assetConfigId,this.detail).then(response=>{
              this.submit(response,'编辑成功')
            })
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

