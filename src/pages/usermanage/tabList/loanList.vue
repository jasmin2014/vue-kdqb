<!-- 借款记录 -->
<template>
  <div class="box">
    <el-radio-group v-model="activeName" style="margin-bottom: 30px;" @change="changeTabs">
      <el-radio-button label="8">全部 {{(statusCount.total)}}</el-radio-button>
      <el-radio-button label="1">还款中 {{(statusCount.repayingCount)}}</el-radio-button>
      <el-radio-button label="5">已结清 {{(statusCount.repayedCount)}}</el-radio-button>
      <el-radio-button label="2">已逾期 {{(statusCount.overdueCount)}}</el-radio-button>
    </el-radio-group>
    <el-row>
      <el-table :data="list" border>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :width="col.width"
                         :key="index" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="100">
          <template slot-scope="scope">
            <el-tooltip content="查看详情">
              <el-button size="small" icon="el-icon-view" @click="handleDetail(scope.row)">
              </el-button>
            </el-tooltip>
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
</template>

<script>
  import * as api from "../../../api/user.js";

  export default {
    components: {},
    data() {
      return {
        id: this.$route.params.id,
        activeName: '8',
        search: {
          userRepayStatus: '',
          pageNum: 1,
          pageSize: 10
        },
        statusCount: {},
        pageTotal: 0,
        list: [],
        table: [
          {
            label: '账单类型',
            prop: 'loanType',
            formatter: (row, col, val) => this.$filter(val, this.$enum.LOAN_TYPE)
          },
          {
            label: '贷款编号',
            prop: 'loanApplyNo'
          },
          {
            label: '渠道',
            prop: 'channelName'
          },
          {
            label: '借款金额',
            prop: 'loanAmount'
          },
          {
            label: '实际审批金额',
            prop: 'grantAmount'
          },
          {
            label: '日/月利率',
            prop: 'loanFee',
            formatter: (row, col, val) => this.$floatToPercentage(val)
          },
          {
            label: '借款期限',
            prop: 'period'
          },
          {
            label: '借款申请时间',
            prop: 'applyTime',
          },
          {
            label: '起息日期',
            prop: 'interestDate'
          },
          {
            label: '还款状态',
            prop: 'status',
            formatter: (row, col, val) => this.$filter(val, this.$enum.LOAN_APPLY_REPAY_STATUS)
          }
        ]
      }
    },
    computed: {},
    created() {
      this.getStatusCount();
      this.getData(this.activeName);
    },
    methods: {
      handleCurrentChange(val){
        this.search.pageNum = val
        this.getData(this.activeName);
      },
      handleSizeChange(val){
        this.search.pageSize = val
        this.getData(this.activeName)
      },
      getData(status) {
        const mySearch = this.$deepcopy(this.search);
        mySearch.partyId = this.id;
        mySearch.userRepayStatus = Number(status);
        api.getLoanRecordList(mySearch).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.list = res.body.content;
            this.pageTotal = res.body.total;
          }
        });
      },
      changeTabs(val){
        this.getData(val);
      },
      handleDetail(row) {
        const {href} = this.$router.resolve({
          name: "FinanceCreditManageDetailPage",
          params: {
            id: row.loanApplyId,
          }
        });
        window.open(href, '_blank');
      },
      //借款状态个数
      getStatusCount() {
        api.getStatusCount(this.id).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.statusCount = res.body;
          }
        })
      }
    }
  };
</script>

