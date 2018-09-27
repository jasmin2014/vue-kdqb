<!--财务管理-信用卡月账单-->
<template>
  <div class="box">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="月账号编号">
            <el-input v-model="search.billNoLike" placeholder="月账号编号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户姓名">
            <el-input v-model="search.userNameLike" placeholder="客户姓名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号码">
            <el-input v-model="search.userPhone" placeholder="手机号码" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="是否出账">
            <kd-select v-model="search.billStatus" :group="this.$enum.BILL_STATUS" clearable></kd-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="账单日">
            <kd-date-picker v-model="billDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" ></kd-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="应还款日">
            <kd-date-picker v-model="repayDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" ></kd-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="是否已分期">
            <kd-select v-model="search.isDivide" :group="this.$enum.DIVIDE_STATUS" placeholder="请选择" clearable></kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="逾期状态">
            <kd-select v-model="search.overdueStatus" :group="this.$enum.OVERDUE_STATUS" placeholder="请选择" clearable></kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="还款状态">
            <kd-select v-model="search.repayStatus" :group="this.$enum.CREDIT_REPAY_STATUS" placeholder="请选择" clearable></kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" title="查找" @click="handleSearch"></el-button>
            <el-button type="primary" icon="el-icon-download" title="下载" @click="handleDownLoadList(search.pageNumber)"></el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border>
        <el-table-column prop="nodeName" label="月账单编号" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)">{{scope.row.billNo}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :width="col.width"
                         :key="index" align="center"></el-table-column>
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
export default {
  components: {},
  data() {
    return {
      appDate: [],
      search: {
        billNoLike: "",
        userNameLike: "",
        userPhone: "",
        billDateStart: "",
        billDateEnd: "",
        repayDateStart: "",
        repayDateEnd: "",
        billStatus:'',
        overdueStatus: "",
        isDivide: "",
        repayStatus: "",
        pageNum: 1,
        pageSize: 10
      },
      pageTotal: 0,
      list: [],
      table: [
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
          label: '是否出账',
          prop: 'billStatus',
          formatter: (row, col, val) => this.$filter(val, this.$enum.BILL_STATUS)
        },
        {
          label: "出账总额",
          prop: "czTotalAmount"
        },
        {
          label: "剩余应还款总额",
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
      ]
    };
  },
  computed: {
    billDate: {
      get() {
        if (this.search.billDateStart || this.search.billDateEnd) {
          let range = [];
          range[0] = this.search.billDateStart;
          range[1] = this.search.billDateEnd;
          return range;
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.search.billDateStart = this.$dateFilter(
            range[0],
            "yyyy-MM-dd"
          );
          this.search.billDateEnd =this.$dateFilter(
            range[1],
            "yyyy-MM-dd"
          );
        } else {
          this.search.billDateStart = "";
          this.search.billDateEnd = "";
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
    }
  },
  created() {
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
    getData(pageSize,pageNum) {
      const mySearch = this.$deepcopy(this.search);
      mySearch.pageSize = pageSize;
      mySearch.pageNum = pageNum;
      api.getCreditCardList(mySearch).then(response => {
        let res = response.data;
        if (res.code == 200) {
          this.list = res.body.content;
          this.pageTotal = res.body.total;
        }
      });
    },
    handleDownLoadList(pageNumber) {
      const mySearch = this.$deepcopy(this.search);
      mySearch.pageNum = pageNumber;
      api.downLoadCreditCardList(mySearch).then(response => {
        if (response.status == 200) {
          let data = response.data;
          let filename = response.headers["content-disposition"]
            ? response.headers["content-disposition"].split("filename=")[1]
            : "repayed_list.xlsx";
          this.$downloadExcel(data, filename);
        }
      });
    },
    handleDetail(row) {
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
</style>


