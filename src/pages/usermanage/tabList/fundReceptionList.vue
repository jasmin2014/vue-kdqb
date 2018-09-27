<!-- 资金流水 前台 -->
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
          batchDateB: '',
          batchDateE: '',
          pageNum: 1,
          pageSize: 10
        },
        pageTotal: 0,
        list: [],
        costTypes:[],
        table: [
          {
            label: '交易发起时间',
            prop: 'flowTime'
          },
          {
            label: '流水号',
            prop: 'flowId'
          },
          {
            label: '前台费用类型',
            prop: 'frontFeeTypeName'
          },
          {
            label: '收入',
            prop: 'inAmount',
            formatter: (row, col, val) => val !== 0 ? val : "--"
          },
          {
            label: '支出',
            prop: 'outAmount',
            formatter: (row, col, val) => val !== 0 ? val : "--"
          },
          {
            label: '账户余额',
            prop: 'availableBalance'
          },
          {
            label: '备注',
            prop: ''
          }
        ]
      }
    },
    computed: {
      appDate: {
        get() {
          if (this.search.batchDateB || this.search.batchDateE) {
            let dateRange = [];
            dateRange[0] = this.search.batchDateB;
            dateRange[1] = this.search.batchDateE;
            return dateRange;
          } else {
            return [];
          }
        },
        set(range) {
          if (range) {
            this.search.batchDateB = this.$dateFilter(
              range[0],
              "yyyy-MM-dd HH:mm:ss"
            );
            this.search.batchDateE =this.$dateFilter(
              range[1],
              "yyyy-MM-dd HH:mm:ss"
            );
          } else {
            this.search.batchDateB = '';
            this.search.batchDateE = '';
          }
        }
      }
    },
    created() {
      this.getFrontCostType();
      this.getData(this.search.pageSize,this.search.pageNum)
    },
    methods: {
      handleSearch() {
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
        api.getReceptionList(mySearch).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.list = res.body.content;
            this.pageTotal = res.body.total;
          }
        });
      },
      //费用类型
      getFrontCostType(){
        api.getFrontCostType().then(response => {
          const res = response.data;
          if (res.code == 200) {
            res.body.forEach((val) =>{
              val['value'] =  val['frontFeeType'];
              val['text'] =  val['frontFeeTypeName'];
            })
            this.costTypes = res.body;
          }
        })
      }
    }
  };
</script>

