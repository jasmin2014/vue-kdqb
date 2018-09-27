<!--风控管理-设备管理-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<template>
  <div class="box">
   <!--=======风控管理-设备管理页 start===========-->
   <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="姓名">
            <el-input v-model="search.name" placeholder="姓名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="登录手机号">
            <el-input v-model="search.loginMobile" placeholder="登录手机号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="获取时间">
            <kd-date-time-picker v-model="getTime" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间" ></kd-date-time-picker>              
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="设备ID">
            <el-input v-model="search.equipmentId" placeholder="设备ID" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="来源">
            <el-input v-model="search.resource" placeholder="来源" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="品牌机型">
            <el-input v-model="search.brandModel" placeholder="品牌机型" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="系统版本号">
            <el-input v-model="search.system" placeholder="系统版本号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="制造商">
            <el-input v-model="search.manufacturer" placeholder="制造商" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="运营商">
            <el-input v-model="search.operators" placeholder="运营商" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="事件记录">
            <kd-select v-model="search.evenRecordType"
                       :group="this.$enum.EVENRECORD_TYPE"
                       clearable>
            </kd-select>
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
        <!-- <el-table-column label="操作" align="center" fixed="right" width="200">
          <template slot-scope="scope">
            <el-tooltip content="查看报告">
              <el-button size="small">查看报告</el-button>
            </el-tooltip>
            <el-tooltip content="额度编辑记录">
              <el-button size="small">额度编辑记录</el-button>
            </el-tooltip>
            <el-tooltip content="取消限制天数">
              <el-button size="small">取消限制天数</el-button>
            </el-tooltip>
          </template>
        </el-table-column> -->
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-size="search.pageSize"
        layout="sizes, total, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </el-row>
   <!--=======风控管理-设备管理页 end===========-->
  </div>
</template>

<script>
import * as api from "../../api/risk.js";
export default {
  name: "RiskDeviceMangePage",
  components: {},
  data() {
    return {
      search: {
        name: "",
        loginMobile: "",
        startTime: "",
        endTime: "",
        equipmentId: "",
        resource: "",
        brandModel: "",
        system: "",
        pageNum: 1,
        pageSize: 10
      },
      list: [],
      pageTotal: 0,
      table: [
        {
          label: "获取时间",
          prop: "createdTime"
        },
        {
          label: "姓名",
          prop: "name"
        },
        {
          label: "登录手机号",
          prop: "loginMobile"
        },
        {
          label: "来源",
          prop: "resource"
        },
        {
          label: "设备ID",
          prop: "equipmentId"
        },
        {
          label: "品牌",
          prop: "brand"
        },
        {
          label: "品牌机型",
          prop: "brandModel"
        },
        {
          label: "系统",
          prop: "system"
        },
        {
          label: "制造商",
          prop: "manufacturer"
        },
        {
          label: "运营商",
          prop: "operators"
        },
        {
          label: "事件记录",
          prop: "evenRecord"
        }
      ]
    };
  },
  computed: {
    getTime: {
      get() {
        if (this.search.startTime || this.search.endTime) {
          let daterange = [];
          daterange[0] = this.search.startTime;
          daterange[1] = this.search.endTime;
          return daterange;
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.search.startTime = this.$dateFilter(
            range[0],
            "yyyy-MM-dd HH:mm:ss"
          );
          this.search.endTime = this.$dateFilter(
            range[1],
            "yyyy-MM-dd HH:mm:ss"
          );
        } else {
          this.search.startTime = "";
          this.search.endTime = "";
        }
      }
    }
  },
  created() {
    this.getDeviceList(1);
  },
  methods: {
    handleSizeChange(val) {
      this.search.pageSize = val;
      this.getDeviceList(this.search.pageNum, val);
    },
    handleCurrentChange(val) {
      this.search.pageNum = val;
      this.getDeviceList(val, this.search.pageSize);
    },
    getDeviceList(pageNumber, pageSize) {
      const mySearch = this.$deepcopy(this.search);
      mySearch.pageNum = pageNumber;
      mySearch.pageSize = pageSize;
      api.getDeviceList(mySearch).then(response => {
        let res = response.data;
        if (res.code == 200 && res.body.content) {
          this.list = res.body.content;
          this.pageTotal = res.body.total;
        }
      });
    },
    handleSearch() {
      this.getDeviceList(1, this.search.pageSize);
    }
  }
};
</script>


