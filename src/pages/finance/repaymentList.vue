<!--财务管理-还款管理-->
<template>
  <div class="box">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="贷款编号">
            <el-input v-model="search.loanApplyNoLike" placeholder="贷款编号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="月账号编号">
            <el-input v-model="search.billNo" placeholder="月账号编号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="渠道">
            <kd-select v-model="search.channelCode" :channel="'true'" clearable></kd-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="起息日">
            <kd-date-picker v-model="qxDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></kd-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="客户姓名">
            <kd-input v-model="search.userNameLike" placeholder="客户姓名" clearable></kd-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="应还款日">
            <kd-date-picker v-model="repayDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></kd-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="手机号码">
            <kd-input v-model="search.userPhone" placeholder="手机号码" clearable></kd-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="实际还款日">
            <kd-date-picker v-model="clearDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" ></kd-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="出账状态">
            <kd-select v-model="search.czStatus" :group="this.$enum.BILL_STATUS" clearable></kd-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="还款状态">
            <kd-select v-model="search.repayStatus" :group="this.$enum.LOAN_BILL_REPAY_STATUS" clearable></kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="逾期状态">
            <kd-select v-model="search.overdueStatus" :group="this.$enum.OVERDUE_STATUS" clearable></kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" title="查找" @click="handleSearch"></el-button>
            <el-button type="primary" icon="el-icon-download" title="下载" @click="HandleDownLoadList(search.pageNumber)"></el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border>
        <el-table-column label="贷款编号" align="center">
          <template slot-scope="scope">
            <div class="cell-word" @click="handleToBill(scope.row)">{{scope.row.loanApplyNo}}</div>
          </template>
        </el-table-column>
        <el-table-column label="出账月账单编号" align="center" width="130">
          <template slot-scope="scope">
            <el-button type="text" @click="handleToMonthBill(scope.row)">{{scope.row.billNo}}</el-button>
          </template>
        </el-table-column>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :width="col.width"
                         :key="index" align="center">
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="search.pageNum"
        :page-size="search.pageSize"
        layout="sizes,total, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import * as api from "../../api/finance.js";
import { getChannelList } from "../../api/common.js";
export default {
  components: {},
  data() {
    return {
      search: {
        loanApplyNoLike: "",
        billNo: "",
        channelCode: "",
        qxDateStart: "", //起息日开始时间
        qxDateEnd: "", //起息日结束时间
        userNameLike: "",
        repayDateStart: "", //应还款日开始时间
        repayDateEnd: "", //应还款日结束时间
        userPhone: "",
        clearDateStart: "",
        clearDateEnd: "",
        czStatus: "",
        repayStatus: "",
        overdueStatus: "",
        pageNum: 1,
        pageSize: 10
      },
      pageTotal: 0,
      list: [],
      table: [
        {
          label: "渠道",
          prop: "channelName"
        },
        {
          label: "客户姓名",
          prop: "userName"
        },
        {
          label: "手机号码",
          prop: "userPhone"
        },
        {
          label: "借款金额",
          prop: "grantAmount"
        },
        {
          label: "借款期限",
          prop: "totalPeriod"
        },
        {
          label: "起息日",
          prop: "qxDate"
        },
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
          label: "应还款日期",
          prop: "repayDate"
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
          prop: "shFee1",
        },
        {
          label: "实还基本利息2",
          prop: "shFee2",
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
          label: "提前结清抵消利息",
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
          label: "提前结清抵消账户管理费",
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
          prop:'activityFee1',
        },
        {
          label: "应抵活动基本利息2",
          prop:'activityFee2',
        },
        {
          label: "应抵活动账户管理费",
          prop: "activityAccountManage"
        },
        {
          label: "应抵活动综合管理费",
          prop: "activityManage"
        }
      ]
    };
  },
  computed: {
    qxDate: {
      get() {
        if (this.search.qxDateStart || this.search.qxDateEnd) {
          let range = [];
          range[0] = this.search.qxDateStart;
          range[1] = this.search.qxDateEnd;
          return range;
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.search.qxDateStart = this.$dateFilter(
            range[0],
            "yyyy-MM-dd"
          );
          this.search.qxDateEnd =this.$dateFilter(
            range[1],
            "yyyy-MM-dd"
          );
        } else {
          this.search.qxDateStart = "";
          this.search.qxDateEnd = "";
        }
      }
    },
    repayDate: {
      get() {
        if (this.search.repayDateStart || this.search.repayDateEnd) {
          let range = [];
          range[0] = this.search.repayDateStart;
          range[1] = this.search.repayDateEnd;
          return range;
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.search.repayDateStart = this.$dateFilter(
            range[0],
            "yyyy-MM-dd"
          );
          this.search.repayDateEnd = this.$dateFilter(
            range[1],
            "yyyy-MM-dd"
          );
        } else {
          this.search.repayDateStart = "";
          this.search.repayDateEnd = "";
        }
      }
    },
    clearDate: {
      get() {
        if (this.search.clearDateStart || this.search.clearDateEnd) {
          let range = [];
          range[0] = this.search.clearDateStart;
          range[1] = this.search.clearDateEnd;
          return range;
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.search.clearDateStart = this.$dateFilter(
            range[0],
            "yyyy-MM-dd"
          );
          this.search.clearDateEnd = this.$dateFilter(
            range[1],
            "yyyy-MM-dd"
          );
        } else {
          this.search.clearDateStart = "";
          this.search.clearDateEnd = "";
        }
      }
    }
  },
  created() {
    if(this.$route.query.id){
      this.search.billNo = this.$route.query.id;
    }
    if(this.$route.query.phone){
      this.search.userPhone = this.$route.query.phone;
    }
    if(this.$route.query.status){
      this.search.czStatus = this.$route.query.status;
    }
    this.getData(this.search.pageSize,this.search.pageNum)
  },
  methods: {
    handleSearch() {
      this.search.pageNum = 1
      this.getData(this.search.pageSize,this.search.pageNum)
    },
    handleCurrentChange(val){
      this.search.pageNum = val
      this.getData(this.search.pageSize,val);
    },
    handleSizeChange(val){
      this.search.pageSize = val
      this.getData(val,this.search.pageNum)
    },
    //获取列表接口
    getData(pageSize,pageNum) {
      const mySearch = this.$deepcopy(this.search);
      mySearch.pageSize = pageSize;
      mySearch.pageNum = pageNum;
      api.getRepayList(mySearch).then(response => {
        let res = response.data;
        if (res.code == 200) {
          this.list = res.body.content;
          this.pageTotal = res.body.total;
        } else {
          this.list = [];
        }
      });
    },
    //下载列表
    HandleDownLoadList(pageNumber) {
      if (this.list && this.list.length > 0) {
        const mySearch = this.$deepcopy(this.search);
        mySearch.pageNum = pageNumber;
        api.downLoadList(mySearch).then(response => {
          if (response.status === 200) {
            let data = response.data;
            let filename = response.headers["content-disposition"]
              ? response.headers["content-disposition"].split("filename=")[1]
              : "repayed_list.xlsx";
            this.$downloadExcel(data, filename);
          }
        });
      } else {
        this.$confirm("下载失败,还款数据列表为空,不能下载!", "提示", {
          type: "error"
        });
      }
    },
    handleToBill(row) {
      const { href } = this.$router.resolve({
        name: "FinanceCreditManageDetailPage",
        params: {
          id: row.loanApplyId
        }
      });
      window.open(href, "_blank");
    },
    handleToMonthBill(row) {
      const { href } = this.$router.resolve({
        name: "FinanceBillDetailPage",
        params: {
          id: row.creditBillId
        }
      });
      window.open(href, "_blank");
    }
  }
};
</script>

<style scoped>
  .cell-word{
    color: #0c95ff;
    cursor: pointer;
  }
</style>

