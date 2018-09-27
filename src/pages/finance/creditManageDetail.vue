<!--财务管理-贷款管理-详情-->
<template>
  <div class="box">
    <el-form v-model="detail" label-width="100px">
      <div class="info">
        <h4 style="display: inline-block">
          <span>用户基础信息</span>
        </h4> <el-button type="info" size="mini" @click="handleToPersonInfo">查看用户个人信息</el-button>
        <el-row>
          <el-col :span="8">
            <el-form-item label="登录账户">
              <el-input v-model="detail.userDetail.cellphone" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户姓名">
              <el-input v-model="detail.userDetail.realName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件号码">
              <el-input v-model="detail.userDetail.idCard" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="info">
        <h4>
          <span>账单信息</span>
        </h4>
        <el-row>
          <el-table :data="detail.loanApplyList" border>
            <el-table-column v-for="(col, index) in billTable" :prop="col.prop" :label="col.label"
                             :formatter="col.formatter" :width="col.width"
                             :key="index" align="center"></el-table-column>
          </el-table>
        </el-row>
      </div>

      <el-tabs class="mgt20" type="border-card" v-model="activeName">
        <el-tab-pane label="账单明细" name="first" style="overflow: scroll">
          <el-row class="user-table">
            <el-col :span="4" class="user-table-th">
              <span>总待还金额(元):</span> <span>{{detail.loanAmountCalc.remainAmount}}</span>
            </el-col>
            <el-col :span="4" class="user-table-th">
              <span>已还款金额(元):</span> <span>{{detail.loanAmountCalc.shAmount}}</span>
            </el-col>
            <el-col :span="4" class="user-table-th">
              <span>总待还本金(元):</span> <span>{{detail.loanAmountCalc.remainPrincipalTotal}}</span>
            </el-col>
            <el-col :span="4" class="user-table-th">
              <span>已还本金(元):</span> <span>{{detail.loanAmountCalc.shPrincipalTotal}}</span>
            </el-col>
            <el-col :span="4" class="user-table-th">
              <span>待抵扣金额(元):</span> <span>{{detail.loanAmountCalc.remaindkAmount}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-table :data="detail.loanApplyInfoList" border>
              <el-table-column label="月账单编号" align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleDetail(scope.row)">{{scope.row.billNo}}</el-button>
                </template>
              </el-table-column>
              <el-table-column v-for="(col, index) in billDecsTable" :prop="col.prop" :label="col.label"
                               :formatter="col.formatter" :width="col.width"
                               :key="index" align="center"></el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="还款明细" name="second" style="overflow: scroll">
          <el-table :data="detail.repayDescList" border>
            <el-table-column v-for="(col, index) in repayDecsTable" :prop="col.prop" :label="col.label"
                             :formatter="col.formatter" :width="col.width"
                             :key="index" align="center"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

    </el-form>
  </div>
</template>

<script>
import * as api from "../../api/finance.js";
export default {
  components: {},
  data() {
    return {
      id: "",
      type: "",
      activeName: "first",
      partyId: "",
      detail: {
        userDetail: {
          cellphone: "",
          realName: "",
          idCard: "",
          partyId:''
        },
        loanAmountCalc: {
          remainAmount: "",
          shAmount: "",
          remainPrincipalTotal: "",
          shPrincipalTotal: "",
          remaindkAmount: ""
        },
        loanApplyList: [],
        loanApplyInfoList: [],
        repayDescList: []
      },
      billTable: [
        {
          label: "贷款编号",
          prop: "loanApplyNo"
        },
        {
          label: "渠道",
          prop: "channelName"
        },
        {
          label: "借款金额",
          prop: "loanAmount"
        },
        {
          label: "借款期限",
          prop: "period"
        },
        {
          label: "起息日期",
          prop: "interestDate"
        },
        {
          label: "日／月利率",
          prop: "loanFee",
          formatter: (row, col, val) => this.$floatToPercentage(val)
        },
        {
          label: "基本利率",
          prop: "baseRate1",
          formatter: (row, col, val) => this.$floatToPercentage(val)
        },
        {
          label: "基本利率2",
          prop: "baseRate2",
          formatter: (row, col, val) => this.$floatToPercentage(val)
        },
        {
          label: "账户管理费率",
          prop: "accountManagementRate",
          formatter: (row, col, val) => this.$floatToPercentage(val)
        },
        {
          label: "综合管理费",
          prop: "managementRate",
          formatter: (row, col, val) => this.$floatToPercentage(val)
        },
        {
          label: "提前还款违约金率",
          prop: "advanceWyRate",
          formatter: (row, col, val) => this.$floatToPercentage(val)
        },
        {
          label: "预设呆账天数",
          prop: "overDebtCycle"
        },
        {
          label: "逾期罚息利率（呆账内）",
          prop: "punishRateIn",
          formatter: (row, col, val) => this.$floatToPercentage(val)
        },
        {
          label: "逾期罚息利率（呆账内）",
          prop: "punishRateOut",
          formatter: (row, col, val) => this.$floatToPercentage(val)
        },
        {
          label: "逾期管理费率（呆账内）",
          prop: "punishManagementRateIn",
          formatter: (row, col, val) => this.$floatToPercentage(val)
        },
        {
          label: "逾期管理费率（呆账外）",
          prop: "punishManagementRateOut",
          formatter: (row, col, val) => this.$floatToPercentage(val)
        }
      ],
      billDecsTable: [
        {
          label: "期数",
          prop: "period"
        },
        {
          label: "入账时间",
          prop: "rzDate"
        },
        {
          label: "当期账单日",
          prop: "billDate"
        },
        {
          label: "应还款日",
          prop: "repayDate"
        },
        {
          label: "月账单编号",
          prop: "billNo"
        },
        {
          label: "出账状态",
          prop: "czStatus",
          formatter: (row, col, val) =>
            this.$filter(val, this.$enum.BILL_STATUS)
        },
        {
          label: "出账本金",
          prop: "czPrincipal"
        },
        {
          label: "出账利息",
          prop: "czTotalFee"
        },
        {
          label: "逾期天数",
          prop: "overdueDay"
        },
        {
          label: "待还金额",
          prop: "dhMoney"
        },
        {
          label: "分期金额",
          prop: "divideAmount"
        },
        {
          label: "应还本金",
          prop: "yhPrincipal"
        },
        {
          label: "应还利息",
          prop: "yhTotalFee"
        },
        {
          label: "应还基本利息1",
          prop: "yhFee1"
        },
        {
          label: "应还基本利息2",
          prop: "yhFee2"
        },
        {
          label: "应还账户管理费",
          prop: "yhAccountManage"
        },
        {
          label: "应还综合管理费",
          prop: "yhManage"
        },
        {
          label: "应还逾期费",
          prop: "yhOverdue"
        },
        {
          label: "应还逾期罚息",
          prop: "yhOverdueFee"
        },
        {
          label: "应还逾期管理费",
          prop: "yhOverdueManage"
        },
        {
          label: "逾期应还利息",
          prop: "cutFee"
        },
        {
          label: "逾期实还利息",
          prop: "shCutFee"
        },
        {
          label: "逾期状态",
          prop: "overdueStatus",
          formatter: (row, col, val) =>
            this.$filter(val, this.$enum.OVERDUE_STATUS)
        },
        {
          label: "还款状态",
          prop: "repayStatus",
          formatter: (row, col, val) =>
            this.$filter(val, this.$enum.LOAN_BILL_REPAY_STATUS)
        },
        {
          label: "实际还款日",
          prop: "clearDate"
        },
        {
          label: "实还本金",
          prop: "shPrincipal"
        },
        {
          label: "实还利息",
          prop: "shTotalFee"
        },
        {
          label: "实还基本利息1",
          prop: "shFee1"
        },
        {
          label: "实还基本利息2",
          prop: "shFee2"
        },
        {
          label: "实还账户管理费",
          prop: "shAccountManage"
        },
        {
          label: "实还综合管理费",
          prop: "shManage"
        },
        {
          label: "实还逾期费",
          prop: "shOverdue"
        },
        {
          label: "实还逾期罚息",
          prop: "shOverdueFee"
        },
        {
          label: "实还逾期管理费",
          prop: "shOverdueManage"
        },
        {
          label: "提前结清违约金",
          prop: "advanceWy"
        },
        {
          label: "提前结清抵销利息",
          prop: "advanceTotalFee"
        },
        {
          label: "提前结清抵销基本利息1",
          prop: "advanceFee1"
        },
        {
          label: "提前结清抵销基本利息2",
          prop: "advanceFee2"
        },
        {
          label: "提前结清抵销账户管理费",
          prop: "advanceAccountManage"
        },
        {
          label: "提前结清抵销综合管理费",
          prop: "advanceManage"
        },
        {
          label: "实抵活动利息",
          prop: "activityTotalFeeUsed"
        },
        {
          label: "实抵活动基本利息1",
          prop: "activityFee1Used"
        },
        {
          label: "实抵活动基本利息2",
          prop: "activityFee2Used"
        },
        {
          label: "实抵活动账户管理费",
          prop: "activityAccountManageUsed"
        },
        {
          label: "实抵活动综合管理费",
          prop: "activityManageUsed"
        },
        {
          label: "应抵活动利息",
          prop: "activityTotalFee"
        },
        {
          label: "应抵活动基本利息1",
          prop: "activityFee1"
        },
        {
          label: "应抵活动基本利息2",
          prop: "activityFee2"
        },
        {
          label: "应抵活动账户管理费",
          prop: "activityAccountManage"
        },
        {
          label: "应抵活动综合管理费",
          prop: "activityManage"
        }
      ],
      repayDecsTable: [
        {
          label: "期数",
          prop: "period"
        },
        {
          label: "应还款日",
          prop: "repayDate"
        },
        {
          label: "逾期天数",
          prop: "overdueDay"
        },
        {
          label: "实还金额",
          prop: "shAmount"
        },
        {
          label: "扣款违约金",
          prop: "wyAmount"
        },
        {
          label: "扣款逾期实还利息",
          prop: "cutFee"
        },
        {
          label: "扣款逾期罚息费",
          prop: "overdueFee"
        },
        {
          label: "扣款逾期管理费",
          prop: "overdueManage"
        },
        {
          label: "扣款基本利息1",
          prop: "fee1"
        },
        {
          label: "扣款基本利息2",
          prop: "fee2"
        },
        {
          label: "扣款综合管理费",
          prop: "manageFee"
        },
        {
          label: "扣款账户管理费",
          prop: "accountManage"
        },
        {
          label: "扣款本金",
          prop: "principal"
        },
        {
          label: "扣款活动抵扣基本利息1",
          prop: "activityFee1"
        },
        {
          label: "扣款活动抵扣基本利息2",
          prop: "activityFee2"
        },
        {
          label: "扣款活动抵扣账户管理费",
          prop: "activityAccountManage"
        },
        {
          label: "扣款活动综合管理费",
          prop: "activityManage"
        },
        {
          label: "扣款前状态",
          prop: "preStatus",
          formatter: (row, col, val) => this.$filter(val, this.$enum.LOAN_BILL_REPAY_STATUS)
        },
        {
          label: "扣款后状态",
          prop: "postStatus",
          formatter: (row, col, val) => this.$filter(val, this.$enum.LOAN_BILL_REPAY_STATUS)
        },
        {
          label: "扣款时间",
          prop: "payTime"
        },
      ]
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.type = this.$route.query.mode;
    this.getFinanceDetail();
  },
  methods: {
    handleToPersonInfo() {
      const { href } = this.$router.resolve({
        name: "UserDetailPage",
        params: {
          id: this.detail.userDetail.partyId
        }
      });
      window.open(href, "_blank");
    },
    handleDetail(row) {
      const { href } = this.$router.resolve({
        name: "FinanceBillDetailPage",
        params: {
          id: row.creditBillId
        }
      });
      window.open(href, "_blank");
    },
    //详情
    getFinanceDetail() {
      api.getLoanDetail(this.id).then(response => {
        const res = response.data;
        if (res.code == 200 && res.body) {
          this.detail.userDetail = res.body.userDetail;
          this.partyId = res.body.loanApply.partyId;
          this.getLoanDetailAmountCalc(this.partyId, this.id);
          let _item = res.body.loanApply;
          this.detail.loanApplyList.push(_item);
          this.detail.loanApplyInfoList =
            res.body.loanBill && res.body.loanBill !== null
              ? res.body.loanBill
              : [];
          this.detail.repayDescList =
            res.body.loanBillDetail && res.body.loanBillDetail !== null
              ? res.body.loanBillDetail
              : [];
        }
      });
    },
    getLoanDetailAmountCalc(partyId, loanApplyId) {
      api.getLoanDetailAmountCalc(partyId, loanApplyId).then(response => {
        let res = response.data;
        if (res.code == 200 && res.body) {
          this.detail.loanAmountCalc = res.body;
        }
      });
    }
  }
};
</script>

<style scoped>
.user-table {
  font-size: 13px;
  line-height: 35px;
}
</style>


