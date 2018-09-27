<!--风控管理-白名单-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.fun-btns {
  margin-bottom: 10px;
}
</style>
<template>
  <div class="box">
   <!--=======风控管理-白名单页 start===========-->
   <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="8">
          <el-form-item label="登录账号">
            <el-input v-model="search.accountName" placeholder="登录账号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="姓名">
            <el-input v-model="search.name" placeholder="姓名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="身份证号码">
            <el-input v-model="search.IDcard" placeholder="身份证号码" clearable></el-input>
          </el-form-item>
        </el-col>      
        <el-col :span="8">
          <el-form-item label="有效期">
            <el-date-picker v-model="appDate" value-format="yyyy-MM-dd" type="daterange" start-placeholder="开始日期"
                            end-placeholder="结束日期" clearable>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" title="查找" @click="handleSearch"></el-button>
            <!-- <el-button type="primary" icon="el-icon-download" title="下载" @click="handleDownload"></el-button> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="fun-btns">
      <el-button type="primary" title="添加白名单">添加白名单</el-button>
      <el-button type="primary" title="批量导入">批量导入</el-button>
    </el-row>
    <el-row>
      <el-table :data="list" border>
        <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :width="col.width"
                         :key="index" align="center"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template slot-scope="scope">
            <el-tooltip content="查看">
              <el-button size="small" icon="el-icon-view"></el-button>
            </el-tooltip>
            <el-tooltip content="删除">
              <el-button size="small">删除</el-button>
            </el-tooltip>                      
          </template>
        </el-table-column>
      </el-table>
    </el-row>
   <!--=======风控管理-白名单页 end===========-->
  </div>
</template>

<script>
export default {
  name: "RiskWhiteListPage",
  components: {},
  data() {
    return {
      search: {
        accountName: "",
        name: "",
        IDcard: "",
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
          label: "登录账号",
          prop: "bb"
        },
        {
          label: "姓名",
          prop: "cc"
        },
        {
          label: "数据来源",
          prop: "dsg"
        },
        {
          label: "来源名称",
          prop: "ee"
        },
        {
          label: "添加时间",
          prop: "dd"
        },
        {
          label: "有效期开始",
          prop: "fdf"
        },
        {
          label: "有效期结束",
          prop: "ff"
        },
        {
          label: "最后操作时间",
          prop: "fdf"
        },
        {
          label: "操作人",
          prop: "ff"
        }
      ]
    };
  },
  computed: {
    appDate: {
      get() {
        if (this.search.startDate || this.search.endDate) {
          let dateRange = [];
          dateRange[0] = this.search.startDate;
          dateRange[1] = this.search.endDate;
          return dateRange;
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
  created() {},
  methods: {
    handleSearch() {}
  }
};
</script>


