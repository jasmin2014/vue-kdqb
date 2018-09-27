<template>
  <div class="verify-records">
    <div class="nuclear-ecording margin-top20">
      <h3><span>审核记录</span></h3>
      <el-table :data="currentValue.tableDatas" border style="width: 100%">
        <el-table-column prop="nodeName" label="节点名称"></el-table-column>
        <el-table-column prop="verifier" label="审批人"></el-table-column>
        <el-table-column prop="isKnowLoan" label="审批时间"></el-table-column>
        <el-table-column prop="result" label="审核结果"></el-table-column>
        <el-table-column prop="backup" label="审核备注"></el-table-column>
      </el-table>
    </div>
    <div class="nuclear-ecording margin-top20" v-if="mode !== 'VIEW'">
      <h3><span>授信申请信息</span></h3>
      <el-form :model="currentValue.recordsForm" class="form-label flex fixed-width">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="申请授信额度">
              <mj-input v-model="currentValue.recordsForm.authAmount" :mode="'VIEW'"></mj-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实际授信额度">
              <mj-input v-model="currentValue.recordsForm.actualAmount" :mode="'EDIT'"></mj-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="授信有效期">
              <el-date-picker
                v-model="applyDate"
                type="daterange" readonly
                placeholder="选择日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="repayment-method">
          <label>还款方式及利率：</label>
          <div class="repay-tags">
            <el-tag
              v-for="tag in currentValue.tags"
              :key="tag.name"
              closable
              @close="handleClose(tag)">
              {{tag.name}}
            </el-tag>
            <el-button type="primary" size="small" @click="handleAddRepayWay">添加</el-button>
          </div>
        </div>
      </el-form>
    </div>
    <div class="nuclear-ecording margin-top20" v-if="mode !== 'VIEW'">
      <el-form :model="currentValue.verifyDatas" class="form-label flex fixed-width">
      <div class="verify-buttons">
        <el-button type="success" size="small" plain :class="{'is-active': verifyType === 'success'}" @click="verifyType = 'success'">审核通过</el-button>
        <el-button type="danger" size="small" plain :class="{'is-active': verifyType === 'danger'}" @click="verifyType = 'danger'">审核不通过</el-button>
        <el-button type="primary" size="small" plain :class="{'is-active': verifyType === 'primary'}" @click="verifyType = 'primary'">补充资料</el-button>
      </div>
      <div class="verify-main">
        <div class="verify-reason" v-if="verifyType === 'success'">
          <p class="verify-reasontit">建议通过：</p>
          <el-input type="textarea" v-model="currentValue.verifyDatas.verifySuccessMsg" :rows="5"></el-input>
        </div>
        <div class="verify-fail" v-else-if="verifyType === 'danger'">
          <el-row class="verify-fail-title">
            <el-col :span="5">欺诈类</el-col>
            <el-col :span="5">信用不良</el-col>
            <el-col :span="5">负面信息</el-col>
            <el-col :span="5">政策不符</el-col>
            <el-col :span="4">综合评分不足</el-col>
          </el-row>
          <el-checkbox-group v-model="currentValue.verifyDatas.failCheckList">
            <el-row class="verify-fail-items">
              <el-col :span="5">
                <el-checkbox label="非本人申请"></el-checkbox>
                <el-checkbox label="中介代办"></el-checkbox>
                <el-checkbox label="单位信息不真实"></el-checkbox>
                <el-checkbox label="金融机构黑名单"></el-checkbox>
              </el-col>
              <el-col :span="5">
                <el-checkbox label="三方机构还款不良"></el-checkbox>
                <el-checkbox label="反欺诈客户信息记录不良"></el-checkbox>
                <el-checkbox label="命中催收电话"></el-checkbox>
                <el-checkbox label="我司贷款还款不良"></el-checkbox>
                <el-checkbox label="芝麻逾期"></el-checkbox>
              </el-col>
              <el-col :span="5">
                <el-checkbox label="提供信息不符合逻辑"></el-checkbox>
                <el-checkbox label="联系人信息虚假"></el-checkbox>
                <el-checkbox label="企业负面信息"></el-checkbox>
                <el-checkbox label="客户有负面信息"></el-checkbox>
                <el-checkbox label="联系人有负面信息"></el-checkbox>
                <el-checkbox label="系统匹配关联的负面信息"></el-checkbox>
                <el-checkbox label="第三方负面信息"></el-checkbox>
              </el-col>
              <el-col :span="5">
                <el-checkbox label="偿债能力不足"></el-checkbox>
                <el-checkbox label="系统建议拒绝"></el-checkbox>
                <el-checkbox label="公积金缴存不符合要求"></el-checkbox>
                <el-checkbox label="区域不符"></el-checkbox>
                <el-checkbox label="行业限制"></el-checkbox>
                <el-checkbox label="非目标客户"></el-checkbox>
              </el-col>
              <el-col :span="4">
                <el-checkbox label="稳定性较差"></el-checkbox>
                <el-checkbox label="收入较低"></el-checkbox>
                <el-checkbox label="同行授信较差"></el-checkbox>
                <el-checkbox label="还款记录较差"></el-checkbox>
                <el-checkbox label="涉及银行及贷款较多"></el-checkbox>
                <el-checkbox label="负债率高"></el-checkbox>
                <el-checkbox label="催收困难"></el-checkbox>
              </el-col>
              <el-col :span="5">
                <el-checkbox label="其它异常"></el-checkbox>
              </el-col>
            </el-row>
          </el-checkbox-group>
          <div class="verify-reason">
            <p>拒绝理由：</p>
            <el-input type="textarea" v-model="currentValue.verifyDatas.verifyFailMsg" :rows="5"></el-input>
          </div>
        </div>
        <div class="verify-reason" v-else>
          <p>补充资料：</p>
          <el-input type="textarea" v-model="currentValue.verifyDatas.supplementMsg" :rows="5"></el-input>
        </div>
      </div>
    </el-form>
    </div>
    <el-dialog title="还款方式及利率选择" :visible.sync="dialogTableRepayMethodsVisible" @close="handleCloseDialog" ref="myVerifyDialog"  v-if="mode !== 'VIEW'">
        <el-table
          ref="multipleTable"
          :data="currentValue.repayMethods"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="policyNumber"
            label="策略编号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="policyName"
            label="策略名称"
            width="280">
          </el-table-column>
          <el-table-column
            prop="repayWay"
            label="还款方式"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleSeeDetail">查看</el-button>
            </template>
          </el-table-column>
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
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableRepayMethodsVisible = false">返回</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
      </el-dialog>

  </div>
</template>

<script>
  export default {
    name:'MjVerifyRecords',
    props: {
      mode: String,
      value: Object,
      formLableWidth: String
    },
    data() {
      return {
        dialogTableRepayMethodsVisible: false,
        currentValue: {
          tableDatas: [],
          recordsForm: {
            authAmount: '',
            actualAmount: '',
            startTime:'',
            endTime:''
          },
          tags: [],
          repayMethods: [],
          paging: {
            currentPage: 1,
            pageSize: 10,
            pageTotal: 2
          },
          repayWayDetail: {
            status: '',
            policyName: ''
          },
          verifyDatas: {
            verifySuccessMsg: '',
            failCheckList: [],
            verifyFailMsg: '',
            supplementMsg: ''
          }
        },
        verifyType: 'success',
        checkedValues: []
      }
    },
    watch:{
      'value.tableDatas'(val,oldval){
        this.setCurrentValue(this.$deepcopy(val), 'tableDatas');
      },
      'value.paging'(val,oldval){
        this.setCurrentValue(this.$deepcopy(val), 'paging');
      },
      'value.recordsForm'(val,oldval){
        this.setCurrentValue(this.$deepcopy(val), 'recordsForm');
      },
      'value.tags'(val,oldval){
        this.setCurrentValue(this.$deepcopy(val), 'tags');
      },
      'value.repayMethods'(val,oldval){
        this.setCurrentValue(this.$deepcopy(val), 'repayMethods');
      },
      'value.repayWayDetail'(val,oldval){
        this.setCurrentValue(this.$deepcopy(val), 'repayWayDetail');
      },
      'value.verifyDatas'(val,oldval){
        this.setCurrentValue(this.$deepcopy(val), 'verifyDatas');
      }
    },
    computed: {
      applyDate: {
        get() {
          if (this.currentValue.recordsForm.startTime || this.currentValue.recordsForm.endTime) {
            const dateRange = [];
            dateRange[0] = this.currentValue.recordsForm.startTime;
            dateRange[1] = this.currentValue.recordsForm.endTime;
            return dateRange;
          } else {
            return [];
          }
        },
        set(range) {
          if (range) {
            this.currentValue.recordsForm.startTime = range[0];
            this.currentValue.recordsForm.endTime = range[1];
          } else {
            this.currentValue.recordsForm.startTime = '';
            this.currentValue.recordsForm.endTime = '';
          }
        }
      }
    },
    created(){
      this.currentValue = this.value ? this.$deepcopy(this.value) : {};
      this.currentValue.recordsForm = this.value.recordsForm ? this.$deepcopy(this.value.recordsForm) : {}
      this.currentValue.verifyDatas = this.value.verifyDatas ? this.$deepcopy(this.value.verifyDatas) : {}
      this.currentValue.paging = this.value.paging ? this.$deepcopy(this.value.paging) : {}
    },
    methods: {
      setCurrentValue(val, key) {
        if (this.currentValue.hasOwnProperty(key)) {
          if (typeof val === 'object' && val instanceof Array) {
            this.currentValue[key] = val;
          } else if (typeof val === 'object') {
            for (const k in val) {
              if (this.currentValue[key].hasOwnProperty(k)) {
                this.currentValue[key][k] = val[k];
              }
            }
          } else {
            this.currentValue[key] = val;
          }
        }
      },
      handleSelectionChange(val){
        this.checkedValues = val;
      },
      handleAddRepayWay(){
        this.dialogTableRepayMethodsVisible = true;
      },
      handleClose(tag){
        this.currentValue.tags.splice(this.currentValue.tags.indexOf(tag), 1)
      },
      handleSizeChange(val){
        this.$emit('size-change',val);
      },
      handleCurrentChange(val){
        this.$emit('current-change',val)
      },
      handleCloseDialog(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      closeTheDialog(){
        this.dialogTableRepayMethodsVisible = false;
      },
      handleSubmit(val){
        let _tags = [],_item = {};
        if(this.checkedValues.length>0){
          this.checkedValues.forEach((item,index) => {
            _item = {
              name: item.policyName,
              policyNumber: item.policyNumber
            };
            _tags.push(_item);
          })
        }else{
          this.$message({
            message: '请至少选择一项还款方式',
            type:'warning'
          })
        }
        val = _tags;
        this.$emit('choose-repay-way',val)
      },
      handleSeeDetail(){
        this.$emit('see-detail');
      }
    }
  }
</script>
<style lang="scss">
.nuclear-ecording {
  background: #fff;
  padding: 1px 10px 20px;
  h3 {
    font-weight: normal;
    font-size: 100%;
    span{
      color: #409EFF;
      padding-left:10px;
      border-left:3px solid #409EFF;
    }
  }
  .repayment-method {
    display: flex;
    > label {
      font-size: 90%;
      line-height: 30px;
    }
    .repay-tags {
      display: flex;
      .el-tag {
        margin-right: 10px;
      }
      ul {
        margin:0;
        padding:0;
      }
      ul li {
        float: left;
        margin-right: 10px;
      }
    }
  }
  .verify-buttons {
    padding-top: 20px;
    .el-button--success.is-active {
      background: #67c23a;
      border-color: #67c23a;
      color: #fff;
    }
    .el-button--danger.is-active {
      color: #ffffff;
      background: #f56c6c;
      border-color: #f56c6c;
    }
    .el-button--primary.is-active {
      color: #ffffff;
      background: #409EFF;
      border-color: #3a8ee6;
    }
  }
  .verify-main {
    padding: 20px 0;
    .verify-reason {
      p.verify-reasontit {
        margin-top: 0;
      }
    }
    .verify-fail {
      padding-top: 20px;
      .el-checkbox {
        display: block;
        margin-bottom: 10px;
      }
      .verify-fail-title {
        border: 1px solid #dcdfe6;
        border-bottom: none;
        padding: 20px 20px 0;
        .el-col {
          line-height:30px;
        }
      }
    .verify-fail-items{
      padding: 20px;
      border: 1px solid #dcdfe6;
      border-top: none;
    }
    }
  }
}
  .verify-records {
    .el-dialog__body{
      padding: 20px 40px;
    }
  }
</style>

