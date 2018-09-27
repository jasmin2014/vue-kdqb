<!-- 资金流水 -->
<style lang="scss" scoped>
</style>
<template>
  <div class="box">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="10">
          <el-form-item label="交易发起时间">
            <kd-date-time-picker v-model="appDate" type="datetimerange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </kd-date-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="费用类型">
            <kd-select v-model="search.frontFeeType" :options="costTypes" clearable></kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="1">
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
  import * as api from "../../../api/user.js";
  export default {
    components: {},
    data() {
      return {
        id: this.$route.params.id,
        search: {
          transTimeB: '',
          transTimeE: '',
          frontFeeType:'',
          pageNum: 1,
          pageSize: 10
        },
        pageTotal: 0,
        list: [],
        costTypes:[],
        table: [
          {
            label: '交易发起时间',
            prop: 'transTime'
          },
          {
            label: '平台流水号',
            prop: 'flowId'
          },
          {
            label: '费用类型',
            prop: 'feeTypeName'
          },
          {
            label: '收入',
            prop: 'transAmountI',
            formatter: (row, col, val) => val !== 0 ? val : "--"
          },
          {
            label: '支出',
            prop: 'transAmountO',
            formatter: (row, col, val) => val !== 0 ? val : "--"
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
            label: '账户余额',
            prop: 'availableBalance'
          },
          {
            label: '备注',
            prop: 'memo'
          }
        ]
      }
    },
    computed: {
      appDate: {
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
            this.search.transTimeE =this.$dateFilter(
              range[1],
              "yyyy-MM-dd HH:mm:ss"
            );
          } else {
            this.search.transTimeB = '';
            this.search.transTimeE = '';
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
        mySearch.partyId = this.id;
        api.getFundsBackstageList(mySearch).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.list = res.body.content;
            this.pageTotal = res.body.total;
          }
        });
      },
      //费用类型
      getCostType(){
        api.getCostType().then(response => {
          const res = response.data;
          if (res.code == 200) {
            res.body.forEach((val) =>{
              val['value'] =  val['feeType'];
              val['text'] =  val['feeTypeName'];
            })
            this.costTypes = res.body;
          }
        })
      }
    }
  };
</script>

