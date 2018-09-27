<!--财务管理-放款审核-->
<template>
  <div class="box">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="货款编号">
            <el-input v-model="search.loanApplyNoLike" placeholder="货款编号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户姓名">
            <el-input v-model="search.realNameLike" placeholder="客户姓名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="手机号码">
            <el-input type="number" v-model="search.mobile" placeholder="手机号码" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="放款时间">
            <kd-date-time-picker v-model="grantDate" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" ></kd-date-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="申请时间">
            <kd-date-time-picker v-model="applyTime" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" ></kd-date-time-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="业务类型">
            <kd-select v-model="search.loanType" :group="this.$enum.LOAN_TYPE" clearable>
            </kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" title="查找" @click="handleSearch"></el-button>
            <el-button :disabled="activeName !=='already'" type="primary" icon="el-icon-download" title="下载"
                       @click="downAlreadyAuditList(search.pageNumber)"></el-button>
            <el-button type="warning" :disabled="activeName !=='wait' || isLoan !=='1'" title="批量放款" @click="handleRepay">批量放款
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="已审核" name="already" style="overflow: scroll">
          <el-table :data="list" border>
            <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label"
                             :formatter="col.formatter"
                             :width="col.width"
                             :key="index" align="center"></el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="100">
              <template slot-scope="scope">
                <el-tooltip content="查看详情">
                  <el-button type="primary" size="small" icon="el-icon-view" @click="handleDetail(scope.row)">
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="待审核" name="wait" style="overflow: scroll">
          <el-table :data="waitList" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="80" align="center" label="全选/取消"></el-table-column>
            <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label"
                             :formatter="col.formatter"
                             :width="col.width"
                             :key="index" align="center"></el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="160">
              <template slot-scope="scope">
                <el-tooltip content="查看详情">
                  <el-button size="small" type="primary" icon="el-icon-view" @click="handleDetail(scope.row)">
                  </el-button>
                </el-tooltip>
                <el-tooltip content="财务放款">
                  <el-button size="small" @click="handleFinanceLoan(scope.row)">财务放款</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <div class="tab-sum">共勾选{{auditCount}}笔 共计{{auditSum}}元</div>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <el-row v-if="activeName === 'already'" type="flex" justify="center" class="mgt20">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="search.pageNum"
        :page-size="search.pageSize"
        layout="sizes,total, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </el-row>

    <el-row v-else type="flex" justify="center" class="mgt20">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="search.pageNum"
        :page-size="search.pageSize"
        layout="sizes,total, prev, pager, next, jumper"
        :total="pageWaitTotal">
      </el-pagination>
    </el-row>

    <!--批量放款-->
    <el-dialog title="批量放款" :visible.sync="repayDialog" @close="handleClose">
      <el-form :model="repayModels" label-width="150px" ref="repayModels" :rules="rules">
        <el-row>
          <el-col :span="15">
            <el-form-item label="选择账户" prop="investorId">
              <kd-select v-model="repayModels.investorId"
                         :options="loanOptions"
                         @change="changeAccount"></kd-select>
              <span style="color: #ff6600">账户余额: {{repayModels.amount}} 元</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="账户名">
              <kd-input disabled v-model="repayModels.investor" auto-complete="off"></kd-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="handleSave">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from "../../api/finance.js";

export default {
  name: "FinanceLoanReviewPage",
  components: {},
  data() {
    return {
      activeName: "already",
      isLoan: "",
      repayDialog: false,
      repayModels: {
        investorId: "",
        investor: "",
        amount: 0,
        loanApplyIdList: []
      },
      auditedCount: 0,
      auditedSum: 0,
      auditCount: 0,
      auditSum: 0,
      loanOptions: {},
      appDate: [],
      options: [],
      search: {
        loanApplyNoLike: "",
        realNameLike: "",
        mobile: "",
        grantDateStart: "",
        grantDateEnd: "",
        applyTimeStart: "",
        applyTimeEnd: "",
        loanType: "",
        pageNum: 1,
        pageSize: 10
      },
      pageTotal: 0,
      pageWaitTotal: 0,
      list: [],
      waitList: [],
      table: [
        {
          label: "贷款编号",
          prop: "loanApplyNo"
        },
        {
          label: "业务类型",
          prop: "loanType",
          formatter: (row, col, val) => this.$filter(val, this.$enum.LOAN_TYPE)
        },
        {
          label: "渠道名称",
          prop: "channelName"
        },
        {
          label: "手机号码",
          prop: "userPhoneHide"
        },
        {
          label: "姓名",
          prop: "userName"
        },
        {
          label: "实际放款金额",
          prop: "grantAmount"
        },
        {
          label: "月利率",
          prop: "loanFee",
          formatter: (row, col, val) => this.$floatToPercentage(val)
        },
        {
          label: "分期期限",
          prop: "period"
        },
        {
          label: "申请时间",
          prop: "applyTime"
        },
        {
          label: "放款时间",
          prop: "grantDate"
        },
        {
          label: "放款状态",
          prop: "grantStatus",
          formatter: (row, col, val) =>
            this.$filter(val, this.$enum.GRANT_STATUS)
        },
        {
          label: "放款账户",
          prop: "grantAsset"
        },
        {
          label: "操作人",
          prop: "grantBy"
        }
      ],
      rules: {
        investorId: [
          { required: true, message: "请选择账户", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    grantDate: {
      get() {
        if (this.search.grantDateStart || this.search.grantDateEnd) {
          let range = [];
          range[0] = this.search.grantDateStart;
          range[1] = this.search.grantDateEnd;
          return range;
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.search.grantDateStart = this.$dateFilter(
            range[0],
            "yyyy-MM-dd HH:mm:ss"
          );
          this.search.grantDateEnd = this.$dateFilter(
            range[1],
            "yyyy-MM-dd HH:mm:ss"
          );
        } else {
          this.search.grantDateStart = undefined;
          this.search.grantDateEnd = undefined;
        }
      }
    },
    applyTime: {
      get() {
        if (this.search.applyTimeStart || this.search.applyTimeEnd) {
          let range = [];
          range[0] = this.search.applyTimeStart;
          range[1] = this.search.applyTimeEnd;
          return range;
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.search.applyTimeStart = this.$dateFilter(
            range[0],
            "yyyy-MM-dd HH:mm:ss"
          );
          this.search.applyTimeEnd = this.$dateFilter(
            range[1],
            "yyyy-MM-dd HH:mm:ss"
          );
        } else {
          this.search.applyTimeStart = undefined;
          this.search.applyTimeEnd = undefined;
        }
      }
    }
  },
  created() {
    this.getLoannedList(this.search.pageSize, this.search.pageNum);
    this.getWaitAuditList(this.search.pageSize, this.search.pageNum);
    this.getRepayAccount();
  },
  methods: {
    handleSearch() {
      if (this.activeName === "already") {
        this.search.pageNum = 1;
        this.getLoannedList(this.search.pageSize, this.search.pageNum);
      } else if (this.activeName == "wait") {
        this.search.pageNum = 1;
        this.getWaitAuditList(this.search.pageSize, this.search.pageNum);
      }
    },
    handleCurrentChange(val) {
      if (this.activeName === "already") {
        this.search.pageNum = val;
        this.getLoannedList(this.search.pageSize, val);
      } else if (this.activeName == "wait") {
        this.search.pageNum = val;
        this.getWaitAuditList(this.search.pageSize, val);
      }
    },
    handleSizeChange(val) {
      if (this.activeName === "already") {
        this.search.pageSize = val;
        this.getLoannedList(val, this.search.pageNum);
      } else if (this.activeName == "wait") {
        this.search.pageSize = val;
        this.getWaitAuditList(val, this.search.pageNum);
      }
    },
    downAlreadyAuditList(pageNumber) {
      let mySearch = this.$deepcopy(this.search);
      mySearch.pageNum = pageNumber;
      api.downAlreadyAuditList(mySearch).then(response => {
        if (response.status == 200) {
          let data = response.data;
          let filename = response.headers["content-disposition"]
            ? response.headers["content-disposition"].split("filename=")[1]
            : "repayed_list.xlsx";
          this.$downloadExcel(data, filename);
        }
      });
    },
    changeAccount(val) {
      this.getAccountAmount(val);
      this.loanOptions.forEach(item => {
        if(item.itemValue == val){
          this.repayModels.investor = item.attr1;
        }
      })
    },
    handleDetail(row) {
      this.$router.push({
        name: "FinanceLoanReviewDetailPage",
        params: { id: row.loanApplyId },
        query: { mode: "VIEW" }
      });
    },
    handleFinanceLoan(row) {
      const { href } = this.$router.resolve({
        name: "FinanceLoanReviewDetailPage",
        params: {
          id: row.loanApplyId
        },
        query: { mode: "EDIT" }
      });
      window.open(href, "_blank");
    },
    //待审核
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.isLoan = "1";
        this.auditCount = val.length;
        let auditSum = 0;
        const arr = [];
        val.forEach(item => {
          if (item.grantAmount && Number(item.grantAmount)) {
            auditSum += item.grantAmount;
            this.auditSum = auditSum.toFixed(2);
          }
          arr.push(item.loanApplyId);
          this.repayModels.loanApplyIdList = arr;
        });
      } else {
        this.isLoan = true;
        this.auditCount = 0;
        this.auditSum = 0;
      }
    },
    //已审核列表
    getLoannedList(pageSize, pageNum) {
      const mySearch = this.$deepcopy(this.search);
      mySearch.pageSize = pageSize;
      mySearch.pageNum = pageNum;
      api.getLoannedList(mySearch).then(response => {
        let res = response.data;
        if (res.code == 200) {
          this.list = res.body.content;
          this.pageTotal = res.body.total;
        }
      });
    },
    //待审核列表接口
    getWaitAuditList(pageSize, pageNum) {
      let mySearch = this.$deepcopy(this.search);
      mySearch.pageSize = pageSize;
      mySearch.pageNum = pageNum;
      api.getWaitLoanList(mySearch).then(response => {
        let res = response.data;
        if (res.code == 200) {
          this.waitList = res.body.content;
          this.pageWaitTotal = res.body.total;
        }
      });
    },
    //批量放款
    handleRepay() {
      this.repayDialog = true;
    },
    handleClose() {
      this.$refs.repayModels.resetFields();
      this.repayDialog = false;
      this.repayModels = {
        amount: 0,
        loanApplyIdList: []
      };
    },
    handleSave() {
      this.$refs.repayModels.validate(val => {
        if (val) {
          this.batchLoan();
        } else {
          return false;
        }
      });
    },
    //放款账户
    getRepayAccount() {
      api.getRepayAccount("LOAN_ACCOUNT").then(response => {
        const res = response.data;
        if (res.code == 200) {
          res.body.forEach(val => {
            val["text"] = val["itemName"];
            val["value"] = val["itemValue"];
          });
          this.loanOptions = res.body;
        }
      });
    },
    //查询余额
    getAccountAmount(id) {
      api.getAccountAmount(id).then(response => {
        const res = response.data;
        if (res.code == 200) {
          if(res.body){
            this.repayModels.amount = res.body.availableBalance ? res.body.availableBalance: 0;
          }
        }
      });
    },
    //批量
    batchLoan() {
      const repayModels = this.$deepcopy(this.repayModels);
      api.batchLoan(repayModels).then(response => {
        const res = response.data;
        if (res.code == 200) {
          this.repayDialog = false;
          this.$message({
            type: "success",
            message: "放款成功!"
          });
          this.getWaitAuditList(this.search.pageSize, this.search.pageNum);
        } else {
          this.$message({
            type: "success",
            message: res.message
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.tab-sum {
  color: #ff6600;
  margin-top: 20px;
}
</style>
