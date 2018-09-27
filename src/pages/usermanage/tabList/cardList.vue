<!-- 信用卡月账单 -->
<template>
  <div class="box">
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
        search:{
          pageNum: 1,
          pageSize: 10
        },
        pageTotal: 0,
        list: [],
        table: [
          {
            label: '信用卡订单号',
            prop: 'billNo'
          },
          {
            label: '账单总额',
            prop: 'czTotalAmount'
          },
          {
            label: '剩余应还款总额',
            prop: 'remainAmount'
          },
          {
            label: '已还款总额',
            prop: 'repayAmount'
          },
          {
            label: '是否已分期',
            prop: 'isDivide',
            formatter: (row, col, val) => val == 0 ? '未分期' : "已分期"
          },
          {
            label: '是否出账',
            prop: 'billStatus',
            formatter: (row, col, val) => this.$filter(val, this.$enum.BILL_STATUS)
          },
          {
            label: '分期总额',
            prop: 'divideRepayAmount'
          },
          {
            label: '逾期状态',
            prop: 'isOverdue',
            formatter: (row, col, val) => this.$filter(val,this.$enum.OVERDUE_STATUS)
          },
          {
            label: '逾期天数',
            prop: 'overdueDay'
          },
          {
            label: '逾期费',
            prop: 'overdueAmount'
          },
          {
            label: '账单日',
            prop: 'billDate'
          },
          {
            label: '应还款日',
            prop: 'repayDate'
          },
          {
            label: '还款状态',
            prop: 'repayStatus',
            formatter: (row, col, val) => this.$filter(val, this.$enum.CREDIT_REPAY_STATUS)
          },
          {
            label: '结清日',
            prop: 'clearDate'
          }
        ]
      }
    },
    computed: {},
    created() {
      this.getData();
    },
    methods: {
      handleCurrentChange(val){
        this.search.pageNum = val
        this.getData();
      },
      handleSizeChange(val){
        this.search.pageSize = val
        this.getData()
      },
      getData() {
        const mySearch = this.$deepcopy(this.search);
        api.getCreditbillList(mySearch).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.list = res.body.content;
            this.pageTotal = res.body.total;
          }
        });
      },
      handleDetail(row) {
        const {href} = this.$router.resolve({
          name: "FinanceBillDetailPage",
          params: {
            id: '123',
          }
        });
        window.open(href, '_blank');
      }
    }
  };
</script>

