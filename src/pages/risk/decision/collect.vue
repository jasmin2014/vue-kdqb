<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<template>
  <div class="box">
    <!--========风控管理-风控决策系统-采集详情 start===========-->
    <el-form class="form-label flex fixed-width">
      <el-row>        
        <el-col :span="6">
          <el-form-item label="数据源名称">
            <kd-select v-model="search.dataResorceName"
                       :kind="this.$enum.LOAN_STATUS"
                       :group="this.$enum.LOAN"
                       :sequence=[6,8,7,11]
                       clearable>
            </kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="采集方式">
            <kd-select v-model="search.collectType"
                       :kind="this.$enum.LOAN_STATUS"
                       :group="this.$enum.LOAN"
                       :sequence=[6,8,7,11]
                       clearable>
            </kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="采集状态">
            <kd-select v-model="search.collectStatus"
                       :kind="this.$enum.LOAN_STATUS"
                       :group="this.$enum.LOAN"
                       :sequence=[6,8,7,11]
                       clearable>
            </kd-select>
          </el-form-item>
        </el-col>       
        <el-col :span="9">
          <el-form-item label="采集开始时间">
            <el-date-picker v-model="collectStartRange" value-format="yyyy-MM-dd" type="daterange" start-placeholder="开始日期"
                            end-placeholder="结束日期" clearable>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="采集开始结束">
            <el-date-picker v-model="collectEndRange" value-format="yyyy-MM-dd" type="daterange" start-placeholder="开始日期"
                            end-placeholder="结束日期" clearable>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" title="查找" @click="handleSearch"></el-button>
          </el-form-item>
        </el-col>
      </el-row>     
    </el-form>
    <el-row>
      <el-table :data="list" border>
        <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :width="col.width"
                         :key="index" align="center"></el-table-column>        
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <!--<el-pagination layout="prev, next" :total="pageTotal" :page-size="search.pageSize"-->
      <!--@current-change="getData"></el-pagination>-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="getData"
        :current-page="getData"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </el-row>
    <!--========风控管理-风控决策系统-采集详情 end===========-->
  </div>

</template>

<script>
export default {
  name: "RiskDecisionCollectPage",
  data() {
    return {
      search: {
        dataResorceName: "",
        collectType: "",
        collectStatus: "",
        startTime_s: "",
        startTime_e: "",
        endTime_s: "",
        endTime_e: ""
      },
      list: [
        {
          dataResorceName: "dagewa"
        }
      ],
      table: [
        {
          label: "数据源名称",
          prop: "dataResorceName"
        },
        {
          label: "采集开始时间",
          prop: "collectStart"
        },
        {
          label: "采集完成时间",
          prop: "collectEnd"
        },
        {
          label: "采集方式",
          prop: "collectType"
        },
        {
          label: "采集状态",
          prop: "collectStatus"
        },
        {
          label: "失败原因",
          prop: "reason"
        }
      ]
    };
  },
  computed: {
    collectStartRange: {
      get() {
        if (this.search.startTime_s || this.search.startTime_e) {
          let range = [];
          range[0] = this.search.startTime_s;
          range[1] = this.search.startTime_e;
          return range;
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.search.startTime_s = range[0];
          this.search.startTime_e = range[1];
        } else {
          this.search.startTime_s = "";
          this.search.startTime_e = "";
        }
      }
    },
    collectEndRange: {
      get() {
        if (this.search.endTime_s || this.search.endTime_e) {
          let range = [];
          range[0] = this.search.endTime_s;
          range[1] = this.search.endTime_e;
          return range;
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.search.endTime_s = range[0];
          this.search.endTime_e = range[1];
        } else {
          this.search.endTime_s = "";
          this.search.endTime_e = "";
        }
      }
    }
  },
  methods: {
    handleSizeChange(val) {},
    getData() {}
  }
};
</script>


