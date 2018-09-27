<!--风控管理-额度巡检记录-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<template>
  <div class="box">
   <!--=======风控管理-额度巡检记录页 start===========-->
   <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="姓名">
            <el-input v-model="search.realName" placeholder="姓名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="登录手机号">
            <el-input v-model="search.cellphone" placeholder="登录手机号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="巡检完成时间">
            <kd-date-time-picker v-model="appDate" type="datetimerange" start-placeholder="开始时间" end-placeholder="开始时间" ></kd-date-time-picker>  
            
          </el-form-item>
        </el-col>      
        <el-col :span="6">
          <el-form-item label="巡检状态">
            <kd-select v-model="search.checkStatus"
                       :group="this.$enum.CHECK_STATUS"
                       clearable>
            </kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="巡检结果">
            <kd-select v-model="search.checkResult"
                       :group="this.$enum.CHECK_RESULT"
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
        <!-- <el-table-column type="index" width="50" align="center" label="选择"></el-table-column> -->
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :width="col.width"
                         :key="index" align="center"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="400">
          <template slot-scope="scope">
             <el-tooltip content="查看详情">
              <el-button type="primary" size="small" icon="el-icon-view" @click="handleSeeDetail(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="查看报告">
              <el-button type="primary" size="small" @click="handleSeeReport(scope.row)">查看报告</el-button>
            </el-tooltip>
            <el-tooltip content="额度变动记录">
              <el-button type="primary" size="small" @click="handleWatchRecords(scope.row)">额度变动记录</el-button>
            </el-tooltip>  
            <el-tooltip content="取消限制天数" v-if="scope.row.checkResult == 2">
              <el-button type="danger" size="small" @click="handleCancelLimitDays(scope.row)">取消限制天数</el-button>
            </el-tooltip>            
          </template>
        </el-table-column>
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
   <!--=======风控管理-额度巡检记录页 end===========-->

   <!--=======编辑记录弹框 start======-->
    <el-dialog title="编辑记录" :visible.sync="dialogTableVisible" @closed="handleCloseRecordsDialog">
      <el-table :data="recordsValues.recordsDates">
        <el-table-column v-for="(col,index) in recordsValues.tableHeader" :prop="col.prop" :label="col.label" :width="col.width" :formatter="col.formatter" :key="index"></el-table-column>    
      </el-table>
      <el-row type="flex" justify="center" class="mgt20">
        <el-pagination
          @size-change="sizeChangeRecords"
          @current-change="currentChangeRecords"
          :current-page="1"
          :page-size="recordsValues.pageSize"
          layout="sizes, total, prev, pager, next, jumper"
          :total="recordsValues.pageTotal">
        </el-pagination>
      </el-row>
    </el-dialog>
    <!-- <edit-records-dialog :value="recordsValues" :records-visible="dialogTableVisible" @size-change="getAmountChangeRecords"  @close="handleCloseRecordsDialog"></edit-records-dialog> -->
    <!--=======编辑记录弹框 start======-->
  </div>
</template>

<script>
import EditRecordsDialog from "./components/editRecordsDialog.vue";
import * as api from "../../api/risk.js";
export default {
  name: "RiskAmountPollingPage",
  components: { EditRecordsDialog },
  data() {
    return {
      search: {
        realName: "",
        cellphone: "",
        startTime: "",
        endTime: "",
        checkStatus: "",
        checkResult: "",
        pageNum: 1,
        pageSize: 10
      },
      pageTotal: 0,
      list: [],
      table: [
        {
          label: "姓名",
          prop: "realName"
        },
        {
          label: "登录手机号",
          prop: "cellphone"
        },
        {
          label: "原始额度(元)",
          prop: "origCreditAmount"
        },
        {
          label: "更新后额度(元)",
          prop: "updatedCreditAmount"
        },
        {
          label: "巡检完成时间",
          prop: "finishedDate"
        },
        {
          label: "巡检状态",
          prop: "checkStatus",
          formatter: (row, col, val) =>
            this.$filter(val, this.$enum.CHECK_STATUS)
        },
        {
          label: "巡检结果",
          prop: "checkResult",
          formatter: (row, col, val) =>
            this.$filter(val, this.$enum.CHECK_RESULT)
        }
      ],
      recordsPartyId: "",
      recordsValues: {
        pageTotal: 0,
        pageSize: 10,
        pageNum: 1,
        recordsDates: [],
        tableHeader: [
          {
            label: "被操作账号",
            prop: "loginName"
          },
          {
            label: "总授信额度",
            prop: "creditTotal"
          },
          {
            label: "可消费额度",
            prop: "creditCurrent"
          },
          {
            label: "可提现额度",
            prop: "creditWithdraw"
          },
          {
            label: "授信有效期开始时间",
            prop: "successTime"
          },
          {
            label: "授信有效期结束时间",
            prop: "invalidTime"
          },
          {
            label: "是否有效",
            prop: "bind",
            formatter: (row, col, val) => (val ? "是" : "否")
          },
          {
            label: "修改原因",
            prop: "remarks"
          },
          {
            label: "操作人账号",
            prop: "updatedBy"
          },
          {
            label: "操作时间",
            prop: "updatedTime"
          }
        ]
      },

      dialogTableVisible: false
    };
  },
  computed: {
    appDate: {
      get() {
        if (this.search.startDate || this.search.endDate) {
          let daterange = [];
          daterange[0] = this.search.startDate;
          daterange[1] = this.search.endDate;
          return daterange;
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.search.startDate = this.$dateFilter(
            range[0],
            "yyyy-MM-dd HH:mm:ss"
          );
          this.search.endDate = this.$dateFilter(
            range[1],
            "yyyy-MM-dd HH:mm:ss"
          );
        } else {
          this.search.startDate = "";
          this.search.endDate = "";
        }
      }
    }
  },
  created() {
    this.getAmountPollingList(1, 10);
  },
  methods: {
    handleSeeReport(row) {
      api.getReportUrl(row.creditLineRoundCheckId).then(response => {
        if (response.data.code == 200) {
          var dlform = document.createElement("form");
          dlform.style = "display:none;";
          dlform.method = "get";
          dlform.action = response.data.body;
          dlform.target = "callBackTarget";
          var hdnFilePath = document.createElement("input");
          hdnFilePath.type = "hidden";
          hdnFilePath.name = "filePath";
          hdnFilePath.value = "";
          dlform.appendChild(hdnFilePath);
          document.body.appendChild(dlform);
          dlform.submit();
          document.body.removeChild(dlform);
        }
      });
    },
    handleSizeChange(val) {
      this.search.pageSize = val;
      this.getAmountPollingList(this.search.pageNum, val);
    },
    handleCurrentChange(val) {
      this.search.pageNum = val;
      this.getAmountPollingList(val, this.search.pageSize);
    },
    getAmountPollingList(pageNumber, pageSize) {
      let mySearch = this.$deepcopy(this.search);
      mySearch.pageNum = pageNumber;
      mySearch.pageSize = pageSize;
      api.getAmountPollingList(mySearch).then(response => {
        let res = response.data;
        if (res.code == 200 && res.body.content) {
          this.list = res.body.content;
          this.pageTotal = res.body.total;
        }
      });
    },
    handleSearch() {
      this.getAmountPollingList(1, this.search.pageSize);
    },
    handleSeeDetail(row) {
      const { href } = this.$router.resolve({
        name: "RiskAmountPollingDetailPage",
        params: { id: row.creditLineRoundCheckId },
        query: {
          applicationType: row.applicationType
        }
      });
      window.open(href, "_blank");
    },
    //查看额度变动记录弹窗每页条数切换
    sizeChangeRecords(val) {
      this.recordsValues.pageSize = val;
      this.getAmountChangeRecords(this.recordsValues.pageNum, val);
    },
    //查看额度变动记录弹框点击分页事件
    currentChangeRecords(val) {
      this.recordsValues.pageNum = val;
      this.getAmountChangeRecords(val, this.recordsValues.pageSize);
    },
    //获取额度变动记录
    getAmountChangeRecords(pageNumber, pageSize) {
      let _params = {
        pageSize: pageSize,
        pageNum: pageNumber,
        partyId: this.recordsPartyId
      };
      api.seeHistoryEditRecords(_params).then(response => {
        let res = response.data;
        if (res.code == 200 && res.body.content) {
          this.recordsValues.recordsDates = res.body.content;
          this.recordsValues.pageTotal = res.body.total;
        }
      });
    },
    handleWatchRecords(row) {
      this.recordsPartyId = row.partyId;
      this.getAmountChangeRecords(1, this.recordsValues.pageSize);
      this.dialogTableVisible = true;
    },
    handleCloseRecordsDialog() {
      this.dialogTableVisible = false;
      this.recordsValues.recordsDates = [];
    },
    //取消限制天数(待调)
    handleCancelLimitDays(row) {
      api.cancelLimitDays(row.partyId).then(response => {
        let res = response.data;
        if (res.code == 200) {
          this.$alert("取消限制天数成功!", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.getAmountChangeRecords(
                this.recordsValues.pageNum,
                this.recordsValues.pageSize
              );
            }
          });
        }
        console.log("api.cancelLimitDays:", response);
      });
    }
  }
};
</script>


