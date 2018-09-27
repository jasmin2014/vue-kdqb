<!--财务管理-资金流水-->
<template>
  <div class="box">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="客户姓名">
            <el-input v-model="search.holder" placeholder="客户姓名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号码">
            <el-input v-model="search.loginName" placeholder="手机号码" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="费用类型">
            <kd-select v-model="search.frontFeeType" :options="costTypes" clearable></kd-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10">
          <el-form-item label="交易发起时间">
            <kd-date-time-picker v-model="transDate" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" ></kd-date-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="交易完成时间">
            <kd-date-time-picker v-model="successDate" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" ></kd-date-time-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="平台流水号">
            <el-input v-model="search.flowId" placeholder="平台流水号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="平台订单号">
            <el-input v-model="search.platOrderId" placeholder="平台订单号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="机构订单号">
            <el-input v-model="search.orgOrderId" placeholder="机构订单号" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
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
    name: "FinanceFundRecordsPage",
    components: {},
    data() {
      return {
        costTypes: [],
        search: {
          transTimeB: '',
          transTimeE: '',
          successTimeB: '',
          successTimeE: '',
          holder: '',
          loginName:'',
          frontFeeType:'',
          flowId:'',
          platOrderId:'',
          orgOrderId:'',
          pageNum: 1,
          pageSize: 10
        },
        pageTotal: 0,
        list: [],
        table: [
          {
            label: "机构订单号",
            prop: "orgOrderId"
          },
          {
            label: "平台订单号",
            prop: "platOrderId"
          },
          {
            label: "平台流水号",
            prop: "flowId"
          },
          {
            label: "姓名",
            prop: "holder"
          },
          {
            label: "手机号",
            prop: "loginName"
          },
          {
            label: "交易发起时间",
            prop: "transTime"
          },
          {
            label: "交易完成时间",
            prop: "successTime"
          },
          {
            label: "费用类型",
            prop: "feeTypeName"
          },
          {
            label: "收入(元)",
            prop: 'transAmountI',
            formatter: (row, col, val) => val !==0 ? val : "--"
          },
          {
            label: "支出(元)",
            prop: 'transAmountO',
            formatter: (row, col, val) => val !==0 ? val : "--"
          },
          {
            label: '冻结/解冻金额',
            prop: 'freezeAmount'
          },
          {
            label: '冻结金额',
            prop: 'freezeBalance'
          },
          {
            label: "账户余额(元)",
            prop: "availableBalance"
          },
          {
            label: "备注",
            prop: "memo"
          }
        ]
      };
    },
    computed: {
      transDate: {
        get() {
          if (this.search.transTimeB || this.search.transTimeE) {
            let dateRange = [];
            dateRange[0] = this.search.transTimeB;
            dateRange[1] = this.search.transTimeE;
            return dateRange;
          } else {
            return [];
          }
        },
        set(range) {
          if (range) {
            this.search.transTimeB = this.$dateFilter(
              range[0],
              "yyyy-MM-dd HH:mm:ss"
            );
            this.search.transTimeE = this.$dateFilter(
              range[1],
              "yyyy-MM-dd HH:mm:ss"
            );
          } else {
            this.search.transTimeB = '';
            this.search.transTimeE = '';
          }
        }
      },
      successDate: {
        get() {
          if (this.search.successTimeB || this.search.successTimeE) {
            let dateRange = [];
            dateRange[0] = this.search.successTimeB;
            dateRange[1] = this.search.successTimeE;
            return dateRange;
          } else {
            return [];
          }
        },
        set(range) {
          if (range) {
            this.search.successTimeB = this.$dateFilter(
              range[0],
              "yyyy-MM-dd HH:mm:ss"
            );
            this.search.successTimeE = this.$dateFilter(
              range[1],
              "yyyy-MM-dd HH:mm:ss"
            );
          } else {
            this.search.successTimeB = '';
            this.search.successTimeE = '';
          }
        }
      }
    },
    created() {
      this.getCostType();
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
        api.getFundsList(mySearch).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.list = res.body.content;
            this.pageTotal = res.body.total;
          }
        });
      },
      //费用类型
      getCostType() {
        api.getCostType().then(response => {
          const res = response.data;
          if (res.code == 200) {
            res.body.forEach((val) => {
              val['value'] = val['feeType'];
              val['text'] = val['feeTypeName'];
            })
            this.costTypes = res.body;
          }
        })
      }
    }
  };
</script>

<style scoped>
</style>
