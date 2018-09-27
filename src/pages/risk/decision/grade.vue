<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<template>
  <div class="box">
    <!--========风控管理-风控决策系统-评分详情 start===========-->
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="决策事件ID">
            <el-input v-model="search.decisionId" placeholder="决策事件ID" clearable></el-input>
          </el-form-item>
        </el-col>  
        <el-col :span="6">
          <el-form-item label="得分项">
            <kd-select v-model="search.gradeOption"
                       :kind="this.$enum.LOAN_STATUS"
                       :group="this.$enum.LOAN"
                       :sequence=[6,8,7,11]
                       clearable>
            </kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="得分字段">
            <el-input v-model="search.gradeParam" placeholder="得分字段" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="运算时间">
            <el-date-picker v-model="calcDate" value-format="yyyy-MM-dd" type="daterange" start-placeholder="开始日期"
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
    <!--========风控管理-风控决策系统-评分详情 end===========-->
  </div>

</template>

<script>
export default {
  name: "RiskDecisionGradePage",
  data() {
    return {
      search: {
        decisionId: "",
        gradeOption: "",
        gradeParam: "",
        startDate: "",
        endDate: ""
      },
      list: [
        {
          id: "DCEM123467989"
        }
      ],
      table: [
        {
          label: "决策事件ID",
          prop: "id"
        },
        {
          label: "得分项",
          prop: "bb"
        },
        {
          label: "得分字段",
          prop: "cc"
        },
        {
          label: "字段值",
          prop: "dsg"
        },
        {
          label: "规则描述",
          prop: "dd"
        },
        {
          label: "配置分值",
          prop: "ee"
        },
        {
          label: "实际分值",
          prop: "fdf"
        },
        {
          label: "运算时间",
          prop: "ff"
        },
        {
          label: "运算结果",
          prop: "gg"
        }
      ]
    };
  },
  computed: {
    calcDate: {
      get() {
        if (this.search.startDate || this.search.endDate) {
          let range = [];
          range[0] = this.search.startDate;
          range[1] = this.search.endDate;
          return range;
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.search.startDate = range[0];
          this.search.endDate = range[1];
        } else {
          this.search.startDate = "";
          this.search.endDate = "";
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


