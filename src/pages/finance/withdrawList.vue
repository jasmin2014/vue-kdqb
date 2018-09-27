<!--财务管理-自动提现记录-->
<template>
<div class="box">
  <el-form class="form-label flex fixed-width">
    <el-row>
      <el-col :span="6">
        <el-form-item label="姓名">
          <el-input v-model="search.userName" placeholder="姓名" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="手机号">
          <el-input v-model="search.mobile" placeholder="手机号" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="货款订单号">
          <el-input v-model="search.loanApplyNo" placeholder="货款订单号" clearable></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="10">
        <el-form-item label="提现时间">
          <kd-date-time-picker v-model="appDate" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" ></kd-date-time-picker>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="提现状态">
          <kd-select v-model="search.status" :group="this.$enum.ADJUSTMENT_FUNDS_OPERATE_STATUS" clearable></kd-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-form-item label="渠道名称">
          <kd-select v-model="search.channel" :channel="'true'" clearable></kd-select>
        </el-form-item>
      </el-col>
      <el-col :span="13">
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" title="查找" @click="handleSearch"></el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <el-row>
      <el-table :data="list" border>
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
  name: "FinanceWithdrawPage",
  data() {
    return {
      search: {
        userName: "",
        mobile: "",
        loanApplyNo: "",
        status: "",
        channel: "",
        dateBegin: "",
        dateEnd: "",
        pageNum: 1,
        pageSize: 10
      },
      pageTotal: 0,
      list: [],
      table: [
        {
          label: "贷款编号",
          prop: "loanApplyNo"
        },
        {
          label: "渠道名称",
          prop: "channel"
        },
        {
          label: "客户姓名",
          prop: "userName"
        },
        {
          label: "手机号码",
          prop: "mobile"
        },
        {
          label: "提现金额(元)",
          prop: "amount"
        },
        {
          label: "放款时间",
          prop: "grantDate"
        },
        {
          label: "提现时间",
          prop: "withDrawDate"
        },
        {
          label: "支付通道",
          prop: "receive",
          formatter: (row, col, val) =>
            this.$filter(val, this.$enum.PAY_CHANNEL)
        },
        {
          label: "提现状态",
          prop: "status",
          formatter: (row, col, val) =>
            this.$filter(val, this.$enum.ADJUSTMENT_FUNDS_OPERATE_STATUS)
        }
      ]
    };
  },
  computed: {
    appDate: {
      get() {
        if (this.search.dateBegin || this.search.dateEnd) {
          let dateRange = [];
          dateRange[0] = this.search.dateBegin;
          dateRange[1] = this.search.dateEnd;
          return dateRange;
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.search.dateBegin = this.$dateFilter(
            range[0],
            "yyyy-MM-dd HH:mm:ss"
          );
          this.search.dateEnd = this.$dateFilter(
            range[1],
            "yyyy-MM-dd HH:mm:ss"
          );
        } else {
          this.search.dateBegin = "";
          this.search.dateEnd = "";
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
      api.getWithdrawList(mySearch).then(response => {
        const res = response.data;
        if (res.code == 200) {
          this.list = res.body.content;
          this.pageTotal = res.body.total;
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
