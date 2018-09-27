<!--财务管理-贷款管理-->
<template>
  <div class="box">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="账单类型">
            <kd-select v-model="search.loanType" :group="this.$enum.LOAN_TYPE" clearable></kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="账单编号">
            <el-input v-model="search.loanApplyNoLike" placeholder="账单编号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户姓名">
            <kd-input v-model="search.realNameLike" placeholder="客户姓名" clearable></kd-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="起息日">
            <kd-date-picker v-model="grantDate" type="daterange" start-placeholder="开始日期"
                            end-placeholder="结束日期"></kd-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号码">
            <kd-input v-model="search.mobile" placeholder="手机号码" clearable></kd-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="渠道">
            <kd-select v-model="search.channelCode" :channel="'true'" clearable></kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="还款状态">
            <kd-select v-model="search.status" :group="this.$enum.LOAN_APPLY_REPAY_STATUS" clearable></kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" title="查找" @click="handleSearch"></el-button>
            <el-button type="primary" icon="el-icon-download" title="下载"
                       @click="downLoadLoanList(search.pageNumber)"></el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border class="table-center">
        <el-table-column prop="loanType" label="账单类型"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.LOAN_TYPE))"></el-table-column>
        <el-table-column prop="loanApplyNo" label="贷款编号">
          <template slot-scope="scope">
            <div class="cell-word" @click="handleDetail(scope.row)">{{scope.row.loanApplyNo}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="channelName" label="渠道"></el-table-column>
        <el-table-column prop="contractUrl" label="借款协议">
          <template slot-scope="scope">
            <a v-if="scope.row.contractUrl !==null || scope.row.contractUrl !==''" target="_blank"
               :href="scope.row.contractUrl">
              <el-button type="text">{{'查看协议'}}</el-button>
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="客户姓名"></el-table-column>
        <el-table-column prop="userPhoneHide" label="手机号码"></el-table-column>
        <el-table-column prop="grantAmount" label="放款金额(元)"></el-table-column>
        <el-table-column prop="loanFee" label="日/月利率"
                         :formatter="(row,col,val) => (this.$floatToPercentage(val))"></el-table-column>
        <el-table-column prop="period" label="借款期限"></el-table-column>
        <el-table-column prop="interestDate" label="起息日期"></el-table-column>
        <el-table-column prop="status" label="还款状态"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.LOAN_APPLY_REPAY_STATUS))"></el-table-column>
        <el-table-column prop="overdueFlag" label="逾期记录"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.OVERDUE_FLAG))"></el-table-column>
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
    name: "FinanceCreditManagePage",
    components: {},
    data() {
      return {
        appDate: [],
        search: {
          loanType: "",
          loanApplyNoLike: "",
          realNameLike: "",
          userPhoneHide: "",
          status: "",
          channelCode: "",
          interestDateStart: "",
          interestDateEnd: "",
          pageNum: 1,
          pageSize: 10
        },
        pageTotal: 0,
        list: []
      };
    },
    computed: {
      grantDate: {
        get() {
          if (this.search.interestDateStart || this.search.interestDateEnd) {
            let range = [];
            range[0] = this.search.interestDateStart;
            range[1] = this.search.interestDateEnd;
            return range;
          } else {
            return [];
          }
        },
        set(range) {
          if (range) {
            this.search.interestDateStart = this.$dateFilter(
              range[0],
              "yyyy-MM-dd"
            );
            this.search.interestDateEnd = this.$dateFilter(
              range[1],
              "yyyy-MM-dd"
            );
          } else {
            this.search.interestDateStart = "";
            this.search.interestDateEnd = "";
          }
        }
      }
    },
    created() {
      this.getData(this.search.pageSize, this.search.pageNum)
    },
    methods: {
      handleSearch() {
        this.search.pageNum = 1
        this.getData(this.search.pageSize, this.search.pageNum)
      },
      handleCurrentChange(val) {
        this.search.pageNum = val
        this.getData(this.search.pageSize, val);
      },
      handleSizeChange(val) {
        this.search.pageSize = val
        this.getData(val, this.search.pageNum)
      },
      getData(pageSize, pageNum) {
        const mySearch = this.$deepcopy(this.search);
        mySearch.pageSize = pageSize;
        mySearch.pageNum = pageNum;
        api.getLoanList(mySearch).then(response => {
          let res = response.data;
          if (res.code == 200) {
            this.list = res.body.content;
            this.pageTotal = res.body.total;
          }
        });
      },
      downLoadLoanList(pageNumber) {
        const mySearch = this.$deepcopy(this.search);
        mySearch.pageNum = pageNumber;
        api.downLoadLoanList(mySearch).then(response => {
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
        const {href} = this.$router.resolve({
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
  .cell-word{
    color: #0c95ff;
    cursor: pointer;
  }
</style>
