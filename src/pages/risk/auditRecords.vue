<!--风控管理-风控审核记录-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<template>
  <div class="box">
    <!--=======风控管理-风控审核记录列表页 start===========-->
      <el-form class="form-label flex fixed-width">

      <el-row>
        <el-col :span="6">
          <el-form-item label="贷款编号">
            <kd-input v-model="search.applicationId" placeholder="贷款编号" clearable></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="渠道名称">
            <kd-select v-model="search.channelCode" :channel="'true'" clearable></kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请类型">
            <kd-select v-model="search.applicationType"
                       :group="this.$enum.BUSINESS_TYPE"
                       clearable>
            </kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="登录手机号">
            <kd-input v-model="search.mobile" placeholder="登录手机号" clearable></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="姓名">
            <kd-input v-model="search.realName" placeholder="姓名" clearable></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请时间">
            <kd-date-time-picker v-model="applicationTime" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间" ></kd-date-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="前端状态">
            <kd-select v-model="search.status"
                       :group="this.$enum.APPLICATION_STATUS" clearable>
            </kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="当前审核节点">
            <kd-select v-model="search.currStep"
                       :group="this.$enum.REVIEW_STATUS"
                       clearable>
            </kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="审核工号">
            <kd-input v-model="search.auditStaffNo" placeholder="审核工号" clearable></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" title="查找" @click="handleSearch('All')"></el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
      <el-tab-pane label="全部" name="All">
        <el-table :data="listAll" border>
          <!-- <el-table-column type="index" width="50" align="center" label="序号"></el-table-column> -->
          <el-table-column v-for="(col, index) in tableHeader" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                          :width="col.width"
                          :key="index" align="center"></el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <el-tooltip content="查看">
                <el-button type="primary" size="small" icon="el-icon-view" @click="handleDetail(scope.row)">
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <el-row type="flex" justify="center" class="mgt20">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="1"
            :page-size="search.pageSize"
            layout="sizes, total, prev, pager, next, jumper"
            :total="pageTotal_All">
          </el-pagination>
        </el-row>

      </el-tab-pane>
      <el-tab-pane label="待签收" name="wait">
        <el-table :data="listWait" border>
          <!-- <el-table-column type="index" width="50" align="center" label="序号"></el-table-column> -->
          <el-table-column v-for="(col, index) in tableHeader" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                          :width="col.width"
                          :key="index" align="center"></el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <el-tooltip content="签收">
                <el-button type="success" size="small" @click="handleSignOn(scope.row)">签收</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" class="mgt20">
          <el-pagination
            @size-change="handleSizeChange_wait"
            @current-change="handleCurrentChange_wait"
            :current-page="1"
            :page-size="search.pageSize"
            layout="sizes, total, prev, pager, next, jumper"
            :total="pageTotal_wait">
          </el-pagination>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="已签收" name="qs_already">
        <el-table :data="listAlready" border>
          <!-- <el-table-column type="index" width="50" align="center" label="序号"></el-table-column> -->
          <el-table-column v-for="(col, index) in tableHeader" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                          :width="col.width"
                          :key="index" align="center"></el-table-column>
          <el-table-column label="操作" align="center" fixed="right" width="250">
            <template slot-scope="scope">
              <el-tooltip content="查看">
                <el-button type="primary" size="small" icon="el-icon-view" @click="handleDetail(scope.row)">
                </el-button>
              </el-tooltip>
              <el-tooltip content="退签">
                <el-button type="danger" size="small" @click="handleSignOut(scope.row)">退签</el-button>
              </el-tooltip>
              <el-tooltip content="风控一审">
                <el-button type="warning" size="small" @click="handleDetail(scope.row,'authFirst')">风控一审</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" class="mgt20">
            <el-pagination
              @size-change="handleSizeChange_qs"
              @current-change="handleCurrentChange_qs"
              :current-page="1"
              :page-size="search.pageSize"
              layout="sizes, total, prev, pager, next, jumper"
              :total="pageTotal_already">
            </el-pagination>
          </el-row>
      </el-tab-pane>
      <el-tab-pane label="已审核" name="auth_already">
        <el-table :data="listAudit" border>
          <!-- <el-table-column type="index" width="50" align="center" label="序号"></el-table-column> -->
          <el-table-column v-for="(col, index) in tableHeader" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                          :width="col.width"
                          :key="index" align="center"></el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <el-tooltip content="查看">
                <el-button type="primary" size="small" icon="el-icon-view" @click="handleDetail(scope.row)">
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" class="mgt20">
          <el-pagination
            @size-change="handleSizeChange_auth"
            @current-change="handleCurrentChange_auth"
            :current-page="1"
            :page-size="search.pageSize"
            layout="sizes, total, prev, pager, next, jumper"
            :total="pageTotal_already_auth">
          </el-pagination>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <!--=======风控管理-风控审核记录列表页 end===========-->
  </div>
</template>

<script>
import * as api from "../../api/risk.js";
export default {
  name: "RiskAuditRecordsPage",
  components: {},
  data() {
    return {
      testValue: "",
      search: {
        pageNum: 1,
        pageSize: 10,
        applicationId: "",
        channelCode: "",
        applicationType: "",
        mobile: "",
        realName: "",
        startApplicationTime: "",
        endApplicationTime: "",
        status: "",
        currStep: "",
        auditStaffNo: ""
      },
      pageNum_all: 1,
      pageSize_all: 10,
      pageNum_wait: 1,
      pageSize_wait: 10,
      pageNum_already_qs: 1,
      pageSize_already_qs: 10,
      pageNum_already_au: 1,
      pageSize_already_au: 10,
      activeName: this.$route.query.activeName
        ? this.$route.query.activeName
        : "All",
      pageTotal_All: 0,
      listAll: [],
      tableHeader: [
        {
          label: "贷款编号",
          prop: "applicationId"
        },
        {
          label: "渠道名称",
          prop: "channelCode",
          formatter: (row, col, val) => this.$filterChannelName(val)
        },
        {
          label: "申请类型",
          prop: "applicationType",
          formatter: (row, col, val) => this.$filter(val)
        },
        {
          label: "登录手机号",
          prop: "mobile"
        },
        {
          label: "姓名",
          prop: "realName"
        },
        {
          label: "申请时间",
          prop: "applicationTime"
        },
        {
          label: "前端状态",
          prop: "status",
          formatter: (row, col, val) => this.$filter(val)
        },
        {
          label: "当前审核节点",
          prop: "currStep",
          formatter: (row, col, val) =>
            this.$filter(val, this.$enum.REVIEW_STATUS)
        },
        {
          label: "审核工号",
          prop: "auditStaffNo"
        }
      ],
      listWait: [],
      pageTotal_wait: 0,
      listAlready: [],
      pageTotal_already: 0,
      listAudit: [],
      pageTotal_already_auth: 0
    };
  },
  computed: {
    applicationTime: {
      get() {
        if (
          this.search.startApplicationTime ||
          this.search.endApplicationTime
        ) {
          let range = [];
          range[0] = this.search.startApplicationTime;
          range[1] = this.search.endApplicationTime;
          return range;
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.search.startApplicationTime = this.$dateFilter(
            range[0],
            "yyyy-MM-dd HH:mm:ss"
          );
          this.search.endApplicationTime = this.$dateFilter(
            range[1],
            "yyyy-MM-dd HH:mm:ss"
          );
        } else {
          this.search.startApplicationTime = "";
          this.search.endApplicationTime = "";
        }
      }
    }
  },
  created() {
    this.getAllRiskListData(1, this.search.pageSize);
    if (this.$route.query.activeName === "auth_already") {
      this.getAlreadyAuthListData(1, this.search.pageSize);
    } else if (this.$route.query.activeName === "qs_already") {
      this.getAlreadySignListData(1, this.search.pageSize);
    } else if (this.$route.query.activeName === "wait") {
      this.getWaitSignListData(1, this.search.pageSize);
    }
  },
  methods: {
    //切换每页显示条数_全部
    handleSizeChange(val) {
      this.search.pageSize = val;
      this.pageSize_all = val;
      this.getAllRiskListData(this.search.pageNum, val);
    },
    //分页_全部
    handleCurrentChange(val) {
      this.search.pageNum = val;
      this.pageNum_all = val;
      this.getAllRiskListData(val, this.search.pageSize);
    },
    //全部列表
    getAllRiskListData(pageNumber, pageSize) {
      const mySearch = this.$deepcopy(this.search);
      mySearch.pageNum = pageNumber;
      mySearch.pageSize = pageSize;

      api.getAllRiskList(mySearch).then(response => {
        let res = response.data;
        if (res.code == 200 && res.body.content) {
          this.listAll = res.body.content;
          this.pageTotal_All = res.body.total;
        }
      });
    },
    //待签收切换每页显示条数
    handleSizeChange_wait(val) {
      this.search.pageSize = val;
      this.pageSize_wait = val;
      this.getWaitSignListData(this.search.pageNum, val);
    },
    //待签收分页
    handleCurrentChange_wait(val) {
      this.search.pageNum = val;
      this.pageNum_wait = val;
      this.getWaitSignListData(val, this.search.pageSize);
    },
    //待签收
    getWaitSignListData(pageNumber, pageSize) {
      const mySearch = this.$deepcopy(this.search);
      mySearch.pageNum = pageNumber;
      mySearch.pageSize = pageSize;
      api.getWaitSignList(mySearch).then(response => {
        let res = response.data;
        if (res.code == 200 && res.body.content) {
          this.listWait = res.body.content;
          this.pageTotal_wait = res.body.total;
        }
      });
    },
    //签收操作接口
    handleSignOn(row) {
      api.putAccessAuditSign(row.id).then(response => {
        if (response.data.code == 200) {
          this.$alert("签收成功", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.getAlreadySignListData(1, this.pageSize_already_qs);
              this.activeName = "qs_already";
            }
          });
        } else {
          console.log("签收失败!");
        }
      });
    },
    //已签收每页显示条数切换
    handleSizeChange_qs(val) {
      this.search.pageSize = val;
      this.pageSize_already_qs = val;
      this.getAlreadySignListData(this.search.pageNum, val);
    },
    //分页_已签收
    handleCurrentChange_qs(val) {
      this.search.pageNum = val;
      this.pageNum_already_qs = val;
      this.getAlreadySignListData(val, this.search.pageSize);
    },
    //已签收
    getAlreadySignListData(pageNumber, pageSize) {
      const mySearch = this.$deepcopy(this.search);
      mySearch.pageNum = pageNumber;
      mySearch.pageSize = pageSize;
      api.getAlreadySignList(mySearch).then(response => {
        let res = response.data;
        if (res.code == 200 && res.body.content) {
          this.listAlready = res.body.content;
          this.pageTotal_already = res.body.total;
        }
      });
    },
    //退签
    handleSignOut(row) {
      api.putAccessAuditSignOut(row.id).then(response => {
        if (response.data.code == 200) {
          this.$alert("退签成功!", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.activeName = "wait";
              this.getWaitSignListData(
                this.search.pageNum,
                this.search.pageSize
              );
            }
          });
        } else {
          this.$alert("退签失败!", "提示", {
            confirmButtonText: "确定"
          });
        }
      });
    },
    //已审核每页条数切换事件
    handleSizeChange_auth(val) {
      this.search.pageSize = val;
      this.pageSize_already_au = val;
      this.getAlreadyAuthListData(this.search.pageNum, val);
    },
    //分页_已审核
    handleCurrentChange_auth(val) {
      this.search.pageNum = val;
      this.pageNum_already_au = val;
      this.getAlreadyAuthListData(val, this.search.pageSize);
    },
    //已审核
    getAlreadyAuthListData(pageNumber, pageSize) {
      const mySearch = this.$deepcopy(this.search);
      mySearch.pageNum = pageNumber;
      mySearch.pageSize = pageSize;
      api.getAlreadyAuthList(mySearch).then(response => {
        let res = response.data;
        if (res.code == 200 && res.body.content) {
          this.listAudit = res.body.content;
          this.pageTotal_already_auth = res.body.total;
        }
      });
    },
    handleSearch() {
      if (this.activeName === "All") {
        this.activeName = "All";
        this.search.pageNum = this.pageNum_all;
        this.search.pageSize = this.pageSize_all;
        this.getAllRiskListData(1, this.search.pageSize);
      } else if (this.activeName === "wait") {
        this.activeName = "wait";
        this.search.pageNum = this.pageNum_wait;
        this.search.pageSize = this.pageSize_wait;
        this.getWaitSignListData(1, this.search.pageSize);
      } else if (this.activeName === "qs_already") {
        this.activeName = "qs_already";
        this.search.pageNum = this.pageNum_already_qs;
        this.search.pageSize = this.pageSize_already_qs;
        this.getAlreadySignListData(1, this.search.pageSize);
      } else if (this.activeName === "auth_already") {
        this.activeName = "auth_already";
        this.search.pageNum = this.pageNum_already_au;
        this.search.pageSize = this.pageSize_already_au;
        this.getAlreadyAuthListData(1, this.search.pageSize);
      }
    },
    handleTabClick(val) {
      this.handleSearch();
    },
    handleDetail(row, type) {
      if (this.activeName === "qs_already") {
        if (type && type === "authFirst") {
          const { href } = this.$router.resolve({
            name: "RiskAuditRecordsDetailPage",
            params: { id: row.applicationId },
            query: {
              processFlowId: row.id,
              applicationType: row.applicationType,
              currStep: this.activeName,
              operateType: type
            }
          });
          window.open(href, "_blank");
        } else {
          const { href } = this.$router.resolve({
            name: "RiskAuditRecordsDetailPage",
            params: { id: row.applicationId },
            query: { applicationType: row.applicationType }
          });
          window.open(href, "_blank");
        }
      } else {
        const { href } = this.$router.resolve({
          name: "RiskAuditRecordsDetailPage",
          params: { id: row.applicationId },
          query: { applicationType: row.applicationType }
        });
        window.open(href, "_blank");
      }
    }
  }
};
</script>


