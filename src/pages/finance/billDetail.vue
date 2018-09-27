<!--财务管理-信用卡月账单-详情-->
<template>
  <div class="box">
    <el-form v-model="detail" label-width="100px">
      <div class="info">
        <h4 style="display: inline-block">
          <span>用户基础信息</span>
        </h4>
        <el-button type="info" size="mini" @click="handleToPersonInfo">查看用户个人信息</el-button>
        <el-row>
          <el-col :span="8">
            <el-form-item label="登录账户">
              <el-input v-model="detail.cellphone" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户姓名">
              <el-input v-model="detail.realName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件号码">
              <el-input v-model="detail.idCard" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="info">
        <h4>
          <span>月账单信息</span>
        </h4>
        <el-row>
          <el-table :data="monthlyBills" border>
            <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label"
                             :formatter="col.formatter" :width="col.width"
                             :key="index" align="center"></el-table-column>
            <el-table-column label="操作" align="center" fixed="right">
              <template slot-scope="scope">
                <el-tooltip content="查看组成">
                  <el-button size="small" icon="el-icon-view" @click="handleDetail(scope.row)">
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </div>
      <div class="info">
        <h4>
          <span>月账单交易记录</span>
        </h4>
        <el-row>
          <el-col :span="10">
            <el-form-item label="交易时间">
              <kd-date-time-picker v-model="tradeDate" type="datetimerange"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </kd-date-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="交易类型">
              <kd-select v-model="search.tradeType" placeholder="交易类型" :group="this.$enum.CREDIT_TRADE_DETAIL_TYPE" clearable></kd-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" title="查找" @click="handleSearch"></el-button>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
          <el-table :data="tradingRecordList" border class="table-center">
            <el-table-column prop="tradeDate" label="交易时间"></el-table-column>
            <el-table-column prop="tradeAmount" label="交易金额"></el-table-column>
            <el-table-column prop="tradeType" label="交易类型" :formatter="(row, col, val) => (this.$filter(val, this.$enum.CREDIT_TRADE_DETAIL_TYPE))"></el-table-column>
            <el-table-column prop="tradeName" label="交易名称"></el-table-column>
            <el-table-column prop="orderNo" label="商品订单号">
              <template slot-scope="scope">
                <el-button type="text" @click="handleToOrder(scope.row)">{{scope.row.orderNo}}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="tenantName" label="商户名称"></el-table-column>
            <el-table-column prop="loanApplyId" label="贷款编号">
              <template slot-scope="scope">
                <el-button type="text" @click="handleToLoan(scope.row)">{{scope.row.loanApplyId}}
                </el-button>
              </template>
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
    </el-form>
  </div>
</template>

<script>
import * as api from "../../api/finance.js";
import KdDateTimePicker from "../../KdElements/input/dateTimePicker";
export default {
  name: "FinanceBillDetailPage",
  components: {KdDateTimePicker},
  data() {
    return {
      appDate: [],
      search: {
        tradeDateStart: "",
        tradeDateEnd: "",
        tradeType: "",
        pageNum: 1,
        pageSize: 10
      },
      pageTotal: 0,
      detail: {
        cellphone: "",
        realName: "",
        idCard: "",
        partyId:''
      },
      monthlyBills: [],
      table: [
        {
          label: "月账单编号",
          prop: "billNo"
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
          label: "账单日",
          prop: "billDate"
        },
        {
          label: "应还款日",
          prop: "repayDate"
        },
        {
          label: "是否出账",
          prop: "billStatus",
          formatter: (row, col, val) => this.$filter(val, this.$enum.BILL_STATUS)
        },
        {
          label: "出账总额",
          prop: "czTotalAmount"
        },
        {
          label: "剩余待还款总额",
          prop: "remainAmount"
        },
        {
          label: "已还款总额",
          prop: "repayAmount"
        },
        {
          label: "是否已分期",
          prop: "isDivide",
          formatter: (row, col, val) =>
            this.$filter(val, this.$enum.DIVIDE_STATUS)
        },
        {
          label: "分期金额",
          prop: "divideRepayAmount"
        },
        {
          label: "逾期状态",
          prop: "isOverdue",
          formatter: (row, col, val) =>
            this.$filter(val, this.$enum.OVERDUE_STATUS)
        },
        {
          label: "逾期天数",
          prop: "overdueDay"
        },
        {
          label: "逾期费",
          prop: "overdueAmount"
        },
        {
          label: "还款状态",
          prop: "repayStatus",
          formatter: (row, col, val) =>
            this.$filter(val, this.$enum.CREDIT_REPAY_STATUS)
        },
        {
          label: "结清日",
          prop: "clearDate"
        }
      ],
      tradingRecordList: []
    };
  },
  computed: {
    tradeDate: {
      get() {
        if (this.search.tradeDateStart || this.search.tradeDateEnd) {
          let range = [];
          range[0] = this.search.tradeDateStart;
          range[1] = this.search.tradeDateEnd;
          return range;
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.search.tradeDateStart = this.$dateFilter(
            range[0],
            "yyyy-MM-dd HH:mm:ss"
          );
          this.search.tradeDateEnd =this.$dateFilter(
            range[1],
            "yyyy-MM-dd HH:mm:ss"
          );
        } else {
          this.search.tradeDateStart = "";
          this.search.tradeDateEnd = "";
        }
      }
    }
  },
  created() {
    this.getCreditCardDetail();
    this.getTradingRecordsList(this.search.pageSize,this.search.pageNum)

  },
  methods: {
    //获取月账单信息和用户基础信息接口
    getCreditCardDetail() {
      let creditCardBillId = this.$route.params.id;
      api.getCreditCardDetail(creditCardBillId).then(response => {
        let res = response.data;
        if (res.code == 200) {
          this.detail = res.body.userDetail; //用户基础信息
          this.monthlyBills = [];
          this.monthlyBills.push(res.body.creditBill); //月账单信息
        }
      });
    },
    handleSearch() {
      this.search.pageNum = 1
      this.getTradingRecordsList(this.search.pageSize,this.search.pageNum)
    },
    handleCurrentChange(val){
      this.search.pageNum = val
      this.getTradingRecordsList(this.search.pageSize,val);
    },
    handleSizeChange(val){
      this.search.pageSize = val
      this.getTradingRecordsList(val,this.search.pageNum)
    },
    //获取月账单交易记录接口
    getTradingRecordsList(pageSize,pageNum) {
      const mySearch = this.$deepcopy(this.search);
      mySearch.creditBillId = this.$route.params.id;
      mySearch.pageSize = pageSize;
      mySearch.pageNum = pageNum;
      api.getTradingRecordsList(mySearch).then(response => {
        let res = response.data;
        if (res.code == 200) {
          this.tradingRecordList = res.body.content;
          this.pageTotal = res.body.total;
        }
      });
    },
    //查看组成
    handleDetail(row){
      const { href } = this.$router.resolve({
        name: "FinanceRefundsPage",
        query: {
          id: row.billNo,
        }
      });
      window.open(href, "_blank");
    },
    handleToPersonInfo() {
      const { href } = this.$router.resolve({
        name: "UserDetailPage",
        params: {
          id: this.detail.partyId
        }
      });
      window.open(href, "_blank");
    },
    //跳转到商户管理订单号详情
    handleToOrder(row) {
      const { href } = this.$router.resolve({
        name: "ShopOrderDetailPage",
        params: {
          id: row.orderNo
        }
      });
      window.open(href, "_blank");
    },
    handleToLoan(row) {
      const { href } = this.$router.resolve({
        name: "FinanceCreditManageDetailPage",
        params: {
          id: row.loanApplyId
        }
      });
      window.open(href, "_blank");
    }
  }
};
</script>

<style scoped>
</style>
