<!--风控管理-->
import func from './vue-temp/vue-editor-bridge';
import func from './vue-temp/vue-editor-bridge';
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.base-model-title {
  h3 {
    font-weight: normal;
    line-height: 2em;
    height: 2em;
    font-size: 14px;
    span {
      color: #000;
      padding-left: 10px;
      border-left: 3px solid #000;
    }
  }
}
</style>
<template>
  <div class="box">
    <!--=======风控管理-详情页左侧信息 start===========-->
    <el-card>
    <el-form class="form-label flex fixed-width">
      <el-row class="base-model-title"><h3><span>基本信息</span></h3></el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="姓名">
            <kd-input v-model="currentValue.realName" :mode="'VIEW'" clearable></kd-input>
          </el-form-item>
        </el-col>  
        <el-col :span="6">
          <el-form-item label="手机号">
            <kd-input v-model="currentValue.cellphone" :mode="'VIEW'" clearable></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="身份证号">
            <kd-input v-model="currentValue.idCard" :mode="'VIEW'" clearable></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="渠道名称">
            <kd-input v-model="currentValue.channelCode" :mode="'VIEW'" clearable></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请时间">
            <kd-input v-model="currentValue.applicationTime" :mode="'VIEW'" clearable></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请类型">
            <kd-input v-model="currentValue.applicationType" :mode="'VIEW'" clearable></kd-input>
          </el-form-item>
        </el-col>       
        <el-col :span="18">
          <el-button type="info" @click="handleSeeRecords('history')">查看历史申请</el-button>
          <el-button type="warning" @click="handleSeeRecords('relation')">查看关联申请<span v-if="currentValue.applicationRel && currentValue.applicationRel != 0" style="color:red;">({{currentValue.applicationRel}})</span></el-button>
          <el-button type="success" @click="handleSeeLocation">查看定位信息</el-button>
          <el-button type="danger" @click="handleSeeDevice">查看设备信息</el-button>
          <el-button type="primary" @click="handleSeeRecords('address')">查看通讯录</el-button>
        </el-col>       
      </el-row>  
      <el-row class="base-model-title" v-if="currentType === 'history'">
        <h3>
          <span v-if="isCredit">授信信息</span>
          <span v-else-if="isLoan">借款</span>
        </h3>
      </el-row>
      <el-row v-if="isCredit">
        <el-col :span="8">
          <el-form-item label="有效授信额度">
            <kd-input v-model="currentValue.credit.creditTotal" :mode="'VIEW'" clearable></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="授信有效期">
            <kd-input v-model="validityDate" :mode="'VIEW'" clearable></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实际用户等级">
            <kd-input v-model="currentValue.credit.userLevel" :mode="'VIEW'" clearable></kd-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-else-if="isLoan">
        <el-col :span="8">
          <el-form-item label="申请借款金额">
            <kd-input v-model="currentValue.loan.loanAmount" :mode="'VIEW'" clearable></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请借款期限">
            <kd-input v-model="currentValue.loan.loanPeriod" :mode="'VIEW'" clearable></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="授信额度">
            <kd-input v-model="currentValue.loan.creditTotal" :mode="'VIEW'" clearable></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="可用消费额度">
            <kd-input v-model="currentValue.loan.creditComsumeUsed" :mode="'VIEW'" clearable></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="可用提现额度">
            <kd-input v-model="currentValue.loan.creditWithdrawUsed" :mode="'VIEW'" clearable></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="授信有效期">
            <kd-input v-model="validityDate" :mode="'VIEW'" clearable></kd-input>
          </el-form-item>
        </el-col>
      </el-row>
      
    </el-form>
    </el-card>
    <el-dialog :title="currentValue.title" :visible.sync="dialogHistoryVisible" @closed="handleCloseDialog">
      <el-tabs v-if="currentType ==='history'" v-model="currentActiveName" type="card">
        <el-tab-pane label="借款记录" name="loan">
          <el-table :data="currentValue.dialogLoanData" border >
            <el-table-column v-for="(col,index) in currentValue.dialogLoanTop" :key="index" :prop="col.name" :formatter="col.formatter"  align="center" :label="col.label"></el-table-column>
            <el-table-column label="操作" align="center" fixed="right">
              <template slot-scope="scope">
                <el-tooltip content="查看审核记录">
                  <el-button size="small" icon="el-icon-view" @click="handleSeeApplyRecords(scope.row)"></el-button>
                </el-tooltip>                     
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="center" class="mgt20">
            <el-pagination
              @size-change="handleLoanSizeChange"
              @current-change="handleLoanCurChange"
              :current-page="1"
              :page-size="pageSize"
              layout="sizes,total, prev, pager, next, jumper"
              :total="currentValue.loanRecordsTotal">
            </el-pagination>            
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="授信记录" name="credit">
          <el-table :data="currentValue.dialogCreditData" border >
            <el-table-column v-for="(col,index) in currentValue.dialogCreditTop" :key="index" :prop="col.name"  :formatter="col.formatter" align="center" :label="col.label"></el-table-column>
            <el-table-column label="操作" align="center" fixed="right">
              <template slot-scope="scope">
                <el-tooltip content="查看审核记录">
                  <el-button size="small" icon="el-icon-view" @click="handleSeeApplyRecords(scope.row)"></el-button>
                </el-tooltip>                     
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="center" class="mgt20">
            <el-pagination
              @size-change="handleCreditSizeChange"
              @current-change="handleCreditCurrChange"
              :current-page="1"
              :page-size="pageSize"
              layout="sizes,total, prev, pager, next, jumper"
              :total="currentValue.creditRecordsTotal">
            </el-pagination>            
          </el-row>
        </el-tab-pane>
      </el-tabs>

      <!--查看关联申请-->
      <div v-else-if="currentType ==='relation'">
        <el-table :data="currentValue.dialogRelationData" border>
          <el-table-column v-for="(item,index) in currentValue.dialogRelationTop" :prop="item.name" :formatter="item.formatter" align="center" :label="item.label" :key="index"></el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
              <template slot-scope="scope">
                <el-tooltip content="查看审核记录">
                  <el-button size="small" icon="el-icon-view" @click="handleSeeApplyRecords(scope.row)"></el-button>
                </el-tooltip>                     
              </template>
            </el-table-column>
        </el-table> 
        <el-row type="flex" justify="center" class="mgt20">
          <el-pagination
            @size-change="handleRelationSizeChange"
            @current-change="handleRelationCurrChange"
            :current-page="1"
            :page-size="pageSize"
            layout="sizes,total, prev, pager, next, jumper"
            :total="currentValue.relationRecordsTotal">
          </el-pagination>            
        </el-row>
      </div>      

      <el-table v-else :data="currentValue.addressDatas" border>
        <el-table-column v-for="(item,index) in currentValue.addressTop" :prop="item.name" align="center" :label="item.label" :key="index"></el-table-column>
      </el-table>     
      <span v-if="currentType==='address'" slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">关闭弹窗</el-button>
        <el-button type="primary" @click="handleDownLoadAddressList">下载通讯录</el-button>
      </span>
    </el-dialog>   
    <!--=======风控管理-风控审核记录列表页 end===========-->
  </div>
</template>

<script>
export default {
  props: {
    value: Object,
    applicationType: String,
    dialogHistory: Boolean,
    historyValue: Object,
    pageSize: {
      default: 10,
      type: Number
    },
    loanRecordsTotal: Number,
    creditRecordsTotal: Number,
    relationRecordsTotal: Number,
    activeName: {
      default: "loan",
      type: String
    }
  },
  components: {},
  data() {
    return {
      dialogHistoryVisible: false,
      currentType: "",
      currentActiveName: "loan",
      isCredit: false,
      isLoan: false,
      currentValue: {
        realName: "",
        cellphone: "",
        idCard: "",
        channelCode: "",
        applicationTime: "",
        applicationType: "",
        loanRecordsTotal: 0,
        creditRecordsTotal: 0,
        applicationRel: 0,
        credit: {
          creditTotal: "",
          validityDateStart: "",
          validityDateEnd: "",
          userLevel: ""
        },
        loan: {
          loanAmount: "",
          loanPeriod: "",
          creditTotal: "",
          creditComsumeUsed: "",
          creditWithdrawUsed: ""
        },
        dialogLoanData: [],
        dialogLoanTop: [],
        dialogCreditData: [],
        dialogCreditTop: [],
        addressDatas: [],
        addressTop: [],
        dialogRelationData: [],
        dialogRelationTop: [],
        relationRecordsTotal: 0
      }
    };
  },
  computed: {
    validityDate: {
      get() {
        if (
          this.currentValue.credit.validityDateStart ||
          this.currentValue.credit.validityDateEnd
        ) {
          const range = [];
          range[0] = this.currentValue.credit.validityDateStart;
          range[1] = this.currentValue.credit.validityDateEnd;
          return range[0] + "至" + range[1];
        } else {
          return "";
        }
      },
      set(range) {}
    }
  },
  watch: {
    value: function(val, oldVal) {
      this.currentValue = val;
    },
    "value.credit": function(val, oldVal) {
      this.setCurrentValue(val, "credit");
    },
    "value.loan": function(val, oldVal) {
      this.setCurrentValue(val, "loan");
    },
    dialogHistory: function(val, oldVal) {
      this.dialogHistoryVisible = val;
    },
    "value.dialogLoanData": function(val, oldVal) {
      this.setCurrentValue(val, "dialogLoanData");
    },
    "value.dialogLoanTop": function(val, oldVal) {
      this.setCurrentValue(val, "dialogLoanTop");
    },
    "value.dialogCreditData": function(val, oldVal) {
      this.setCurrentValue(val, "dialogCreditData");
    },
    "value.dialogCreditTop": function(val, oldVal) {
      this.setCurrentValue(val, "dialogTop");
    },
    "value.addressDatas": function(val, oldVal) {
      this.setCurrentValue(val, "addressDatas");
    },
    "value.addressTables": function(val, oldVal) {
      this.setCurrentValue(val, "addressTop");
    },
    "value.dialogRelationData": function(val, oldVal) {
      this.setCurrentValue(val, "dialogRelationData");
    },
    "value.dialogRelationTop": function(val, oldVal) {
      this.setCurrentValue(val, "dialogRelationTop");
    },
    loanRecordsTotal(val, oldVal) {
      this.currentValue.loanRecordsTotal = val;
    },
    creditRecordsTotal(val, oldVal) {
      this.currentValue.creditRecordsTotal = val;
    },
    relationRecordsTotal(val, oldVal) {
      this.currentValue.relationRecordsTotal = val;
    },
    activeName(val, oldVal) {
      this.currentActiveName = val;
    },
    addressList: function(val, oldVal) {
      this.currAddressList = val;
    }
  },
  created() {
    this.currentValue = this.value;
    this.currentValue.credit = this.value.credit;
    this.currentValue.loan = this.value.loan;
    this.dialogHistoryVisible = this.dialogHistory;

    //历史记录-借款申请
    this.currentValue.dialogLoanData = this.value.dialogLoanData || [];
    this.currentValue.dialogLoanTop = this.value.dialogLoanTop || [];

    //历史记录-授信申请
    this.currentValue.dialogCreditData = this.value.dialogCreditData || [];
    this.currentValue.dialogCreditTop = this.value.dialogCreditTop || [];

    //关联申请
    this.currentValue.dialogRelationData = this.value.dialogRelationData || [];
    this.currentValue.dialogRelationTop = this.value.dialogRelationTop || [];

    this.currentValue.addressDatas = this.value.addressDatas || [];
    this.currentValue.addressTables = this.value.addressTables || [];
    this.currentValue.title = this.value.title;
    this.isCredit =
      this.applicationType === "CUSTOMER_CREDIT" ||
      this.applicationType === "CREDIT" ||
      this.applicationType === "INCREASE_LIMIT" ||
      this.applicationType === "CREDIT_ACTIVATION";
    this.isLoan =
      this.applicationType === "CONSUMER" ||
      this.applicationType === "CASH" ||
      this.applicationType === "BILL_STAGING" ||
      this.applicationType === "CREDIT_CARD_COMPENSATION";
    this.currentValue.loanRecordsTotal = this.loanRecordsTotal;
    this.currentValue.creditRecordsTotal = this.creditRecordsTotal;
    this.currentValue.relationRecordsTotal = this.relationRecordsTotal;

    this.currentActiveName = this.activeName;
    this.currAddressList = this.addressList || [];
  },
  methods: {
    setCurrentValue(val, key) {
      if (this.currentValue.hasOwnProperty(key)) {
        if (typeof val === "object" && val instanceof Array) {
          this.currentValue[key] = val;
        } else if (typeof val === "object") {
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
    //借款记录每页条数切换事件
    handleLoanSizeChange(val) {
      this.$emit("loan-size-change", val);
    },
    //借款记录分页事件
    handleLoanCurChange(val) {
      this.$emit("loan-curr-change", val);
    },
    //授信记录每页展示条数切换事件
    handleCreditSizeChange(val) {
      this.$emit("credit-size-change", val);
    },
    //授信记录分页事件
    handleCreditCurrChange(val) {
      this.$emit("credit-curr-change", val);
    },
    //关联申请页面-改变每页展示条数事件
    handleRelationSizeChange(val) {
      this.$emit("relation-size-change", val);
    },
    //关联申请页面-分页事件
    handleRelationCurrChange(val) {
      this.$emit("relation-curr-change", val);
    },
    //历史申请(借款和授信)列表后面的操作事件按钮
    handleSeeApplyRecords(row) {
      this.$emit("see-appy-records", row);
    },
    handleSeeRecords(type) {
      this.currentType = type;
      this.$emit("see-records", this.currentType);
    },
    handleCloseDialog() {
      this.$emit("close-history");
    },
    handleSeeLocation() {
      const { href } = this.$router.resolve({ name: "RiskLocationMangePage" });
      window.open(href, "_blank");
    },
    handleSeeDevice() {
      const { href } = this.$router.resolve({ name: "RiskDeviceMangePage" });
      window.open(href, "_blank");
    },
    handleSeeAddress() {
      this.$emit("see-address");
    },
    handleDownLoadAddressList() {
      this.$emit("download-address");
    }
  }
};
</script>


