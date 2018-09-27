<!--运营管理 流量推广管理-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>

<template>
<div class="box">
  <!--=========运营管理-流量推广管理页 start===========-->

  <el-form class="form-label flex fixed-width">
    <el-row>
      <el-col :span="7">
        <el-form-item label="流量推广来源名称">
          <el-input v-model.trim="search.channelName"  @keyup.native.enter="handleSearch" placeholder="流量推广来源名称" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="流量推广来源编号">
          <el-input v-model.trim="search.channelNo"  @keyup.native.enter="handleSearch" placeholder="流量推广来源编号" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="时间筛选">
          <el-date-picker :clearable="false" v-model="appDate" @keyup.native.enter="handleSearch" value-format="yyyy-MM-dd HH:ss" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" title="查询" @click="handleSearch"></el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item>
          <el-button type="primary" title="添加推广来源" @click="handleAddGeneralize">添加推广来源</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <el-row>
    <el-table :data="list" border :loading="tableLoading">
      <el-table-column label="序号" align="center" width="50">
        <template slot-scope="scope">
            {{scope.$index + 1 + (page - 1) * limit}}
        </template>
      </el-table-column>
      <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter" :width="col.width" :key="index" align="center"></el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="160">
        <template slot-scope="scope">  
            <el-tooltip content="编辑">
              <el-button type="warning" size="small" icon="el-icon-edit" @click="handleEditGeneralize(scope.row.channelId)"></el-button>
            </el-tooltip>
            <el-tooltip :content="!scope.row.enable?'启用':'禁用'" >
              <el-button size="small" :type="scope.row.enable?'danger':'success'" @click="handleEnable(scope.row.channelId, scope.row.enable)">{{!scope.row.enable?'启用':'禁用'}}</el-button>
            </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
  
  <el-row type="flex" justify="center" class="mgt20">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 50, 100]"
      :page-size="limit" layout="prev, pager, next,jumper,sizes,total" :total="total">
    </el-pagination>
  </el-row>

  <!--=========运营管理-流量推广管理页 end===========-->
</div>
</template>

<script>
import {
  getFlowList,
  promoteEnable,
  putPromote,
  enableFlowInfo
} from "@/api/operate";
export default {
  name: "OperateFlowGeneManagePage",
  data() {
    return {
      total: 0, // 列表总数
      limit: 10, // 每页数量
      page: 1, // 当前页数
      tableLoading: false, // table状态
      search: {
        startCreatedTime: this.$formatDate(
          new Date(new Date().getTime() - 3600 * 1000 * 24 * 30)
        ),
        endCreatedTime: this.$formatDate(new Date()),
        channelName: undefined,
        channelNo: undefined
      },
      list: [],
      table: [
        {
          label: "流量推广来源名称",
          prop: "channelName"
        },
        {
          label: "推广渠道编号",
          prop: "channelNo"
        },
        {
          label: "注册用户数",
          prop: "registerPartyCount"
        },
        {
          label: "授信申请用户数",
          prop: "userCountOfCreditApply"
        },
        {
          label: "授信通过用户数",
          prop: "userCountOfCreditApplyPass"
        },
        {
          label: "授信申请笔数",
          prop: "numberOfCreditApply"
        },
        {
          label: "授信通过笔数",
          prop: "numberOfCreditApplyPass"
        },
        {
          label: "授信金额(元)",
          prop: "totalCreditAmount"
        },
        {
          label: "借款金额(元)",
          prop: "totalLoanAmount"
        },
        {
          label: "合作方式",
          prop: "cooperType"
        },
        {
          label: "状态",
          prop: "enable",
          formatter: (row, col, val) => this.$filter(val ? "启用" : "禁用")
        }
      ]
    };
  },
  computed: {
    appDate: {
      get() {
        if (this.search.startCreatedTime || this.search.endCreatedTime) {
          return [this.search.startCreatedTime, this.search.endCreatedTime];
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.search.startCreatedTime = range[0];
          this.search.endCreatedTime = range[1];
        } else {
          this.search.startCreatedTime = undefined;
          this.search.endCreatedTime = undefined;
        }
      }
    }
  },
  methods: {
    // 启用停用
    handleEnable(id, enable) {
      this.$confirm(
        `您正在进行${!enable ? "启用" : "禁用"}操作，确定操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          enableFlowInfo({ isEnable: !enable, channelId: id }).then(res => {
            if (res.data.code == "200") {
              this.$message.success(`${!enable ? "启用" : "禁用"}成功`);
              this.getData();
            }
          });
        })
        .catch(() => {});
    },
    // 搜索
    handleSearch() {
      if (!this.search.endCreatedTime || !this.search.startCreatedTime) {
        this.$message.error("时间筛选不为空");
      } else {
        this.getData();
      }
    },
    // 新增跳转
    handleAddGeneralize() {
      this.$router.push({
        name: "OperateAddGeneralizePage"
      });
    },
    // 编辑跳转
    handleEditGeneralize(id) {
      this.$router.push({
        name: "OperateAddGeneralizePage",
        query: { id: id }
      });
    },
    // 列表数据
    getData() {
      getFlowList({
        ...this.search,
        pageSize: this.limit,
        pageNum: this.page
      }).then(res => {
        if (res.data.code === "200") {
          this.page = res.data.body.pageNum;
          this.limit = res.data.body.pageSize;
          this.total = res.data.body.total;
          this.list = res.data.body.content;
        }
      });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    }
  },
  mounted() {
    this.getData();
  }
};
</script>


