<template>
  <div class="nuclear-ecording">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="6">
        <h3><span>电核记录</span></h3>
      </el-col>
      <el-col :span="6" align="right" v-if="mode !== 'VIEW'">
        <el-button type="primary" class="margin-top10" size="small" @click="handleShowDialog">添加电核记录</el-button>
      </el-col>
    </el-row>
    <el-table :data="currentValue.tableData" border style="width: 100%">
      <el-table-column prop="name" label="联系人" align="center"></el-table-column>
      <el-table-column prop="relationship" label="关系" align="center"></el-table-column>
      <el-table-column prop="isKnowLoan" label="是否知悉贷款" align="center"></el-table-column>
      <el-table-column prop="phone" label="联系人电话" align="center"></el-table-column>
      <el-table-column prop="status" label="电核状态" align="center"></el-table-column>
      <el-table-column prop="backup" label="审核备注" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="handleLookBackup">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="addTime" label="添加时间" align="center"></el-table-column>
    </el-table>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentValue.paging.currentPage"
        :page-size="currentValue.paging.pageSize"
        layout="total, prev, next, jumper"
        :total="currentValue.paging.pageTotal">
      </el-pagination>
    </el-row>

    <div v-if="mode !=='VIEW'">
      <el-dialog title="添加电核信息" :visible.sync="dialogFormVisible">
        <el-form :model="currentValue.addNuclearForm" class="flex" :label-width="formLableWidth">
          <el-form-item label="联系人">
            <mj-input v-model="currentValue.addNuclearForm.name"></mj-input>
          </el-form-item>
          <el-form-item label="关系">
            <mj-select v-model="currentValue.addNuclearForm.relationship" :option="thisOptions" placeholder="请选择活动区域"></mj-select>
          </el-form-item>
          <el-form-item label="联系电话">
            <mj-input v-model="currentValue.addNuclearForm.phone"></mj-input>
          </el-form-item>
          <el-form-item label="是否知悉贷款">
            <el-radio-group v-model="currentValue.addNuclearForm.isKnowLoan">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="核实记录">
            <el-input
              type="textarea"
              :rows="4"
              v-model="currentValue.addNuclearForm.record">
            </el-input>
          </el-form-item>
          <el-form-item label="电核状态">
            <el-radio-group v-model="currentValue.addNuclearForm.status">
              <el-radio label="3">流畅</el-radio>
              <el-radio label="6">较好</el-radio>
              <el-radio label="9">一般</el-radio>
              <el-radio label="12">混乱</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    name:'MjNuclearRecords',
    props: {
      mode: String,
      value: Object,
      formLableWidth: String
    },
    data() {
      return {
        dialogFormVisible: false,
        currentValue: {
          tableData: [],
          addNuclearForm: {
            name: '',
            relationship: '',
            phone: '',
            isKnowLoan: '',
            record:'',
            status: ''
          },
          paging: {
          }
        },
        thisOptions: [
          {
            text:'母亲',
            value:"mother"
          },
          {
            text:'父亲',
            value:"father"
          }
        ]
      }
    },
    watch:{
      'value.tableData'(val,oldval){
        this.currentValue.tableData = val;
      },
      'value.addNuclearForm'(val,oldval){
        this.currentValue.addNuclearForm = val;
      },
      'value.paging'(val,oldval){
        this.currentValue.paging = val;
      }
    },
    created(){
      this.currentValue = this.value ? this.$deepcopy(this.value) : {};
    },
    methods: {
      handleSizeChange(){
        this.$emit('size-change');
      },
      handleCurrentChange(){
        this.$emit('current-change');
      },
      handleLookBackup(){
        this.$emit('backup')
      },
      handleShowDialog(val){
        this.dialogFormVisible = true;
        val = this.$deepcopy(this.currentValue.addNuclearForm);
        this.$emit('show-dialog',val);
      },
      handleSubmit(val){
        val = this.$deepcopy(this.currentValue.addNuclearForm);
        this.$emit('submit-form',val);

      }
    }
  }
</script>
<style lang="scss">
.nuclear-ecording {
  background: #fff;
  padding: 0 10px 20px;
  h3 {
    font-weight: normal;
    font-size: 100%;
    span{
      color: #409EFF;
      padding-left:10px;
      border-left:3px solid #409EFF;
    }

  }
  .el-dialog__body {
    padding: 20px 40px;
  }
}
</style>

