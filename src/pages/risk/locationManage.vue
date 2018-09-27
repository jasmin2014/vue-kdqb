<!--风控管理-定位管理-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
form.flex .el-form-item.flex .el-form-item__content {
  display: flex;
}
</style>
<template>
  <div class="box">
   <!--=======风控管理-定位管理页 start===========-->
   <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="姓名">
            <el-input v-model="search.nameLike" placeholder="姓名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="登录手机号">
            <el-input v-model="search.loginMobileLike" placeholder="登录手机号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="获取时间">
            <kd-date-time-picker v-model="appDate" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间" ></kd-date-time-picker>
          </el-form-item>
        </el-col>      
        <el-col :span="6">
          <el-form-item label="SIM卡号">
            <el-input v-model="search.simNumLike" placeholder="SIM卡号" clearable></el-input>
          </el-form-item>
        </el-col> 
        <el-col :span="6">
          <el-form-item label="来源">
            <el-input v-model="search.resourceLike" placeholder="来源" clearable></el-input>
          </el-form-item>
        </el-col>      
        <el-col :span="6">
          <el-form-item label="地理位置">
            <el-input v-model="search.locationLike" placeholder="地理位置" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纬度" class="flex">
            <el-input v-model="search.latitudeMin" placeholder="纬度最小值" clearable></el-input>
            <span style="display:inline-block; width:20px;line-height: 40px;">-</span>
            <el-input v-model="search.latitudeMax" placeholder="纬度最大值" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经度" class="flex">
            <el-input v-model="search.longitudeMin" placeholder="经度最小值" clearable></el-input>
            <span style="display:inline-block; width:20px;line-height: 40px;">-</span>
            <el-input v-model="search.longitudeMax" placeholder="经度最大值" clearable></el-input>
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
   <!--=======风控管理-定位管理页 end===========-->
  </div>
</template>

<script>
import * as api from "../../api/risk.js";
export default {
  name: "RiskLocationMangePage",
  components: {},
  data() {
    return {
      search: {
        nameLike: "",
        loginMobileLike: "",
        startTime: "",
        endTime: "",
        simNumLike: "",
        resourceLike: "",
        locationLike: "",
        latitudeMin: "",
        latitudeMax: "",
        longitudeMin: "",
        longitudeMax: "",
        evenRecordType: "",
        pageNum: 1,
        pageSize: 10
      },
      pageTotal: 0,
      list: [],
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
          label: "SIM卡号码",
          prop: "simNum"
        },
        {
          label: "来源",
          prop: "resource"
        },
        {
          label: "地理位置",
          prop: "location"
        },
        {
          label: "经度",
          prop: "longitude"
        },
        {
          label: "纬度",
          prop: "latitude"
        },
        {
          label: "事件记录",
          prop: "evenRecord"
        }
      ]
    };
  },
  computed: {
    appDate: {
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
    this.getLocationList(1);
  },
  methods: {
    handleSizeChange(val) {
      this.search.pageSize = val;
      this.getLocationList(this.search.pageNum, val);
    },
    handleCurrentChange(val) {
      this.search.pageNum = val;
      this.getLocationList(val, this.search.pageSize);
    },
    getLocationList(pageNumber, pageSize) {
      const mySearch = this.$deepcopy(this.search);
      mySearch.pageNum = pageNumber;
      mySearch.pageSize = pageSize;
      api.getLocationList(mySearch).then(response => {
        let res = response.data;
        if (res.code == 200 && res.body.content) {
          this.list = res.body.content;
          this.pageTotal = res.body.total;
        }
      });
    },
    handleSearch() {
      this.getLocationList(1, this.search.pageSize);
    }
  }
};
</script>


