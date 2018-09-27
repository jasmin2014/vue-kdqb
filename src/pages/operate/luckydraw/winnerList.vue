
<style lang="scss" scoped>
</style>
<template>
  <div class="box">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="抽奖活动id">
            <el-input v-model="search.activityId" placeholder="抽奖活动id" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="奖品类型">
                <kd-select v-model="search.prizeType" :options="options_1" clearable>
                </kd-select>
            </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户id">
            <el-input v-model="search.partyId" placeholder="用户id" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="发放状态">
                <kd-select v-model="search.issueStatus" :options="options_2" clearable>
                </kd-select>
            </el-form-item>
        </el-col>
         <el-col :span="2">
             <el-form-item>
                <el-button type="primary" icon="el-icon-search" title="查询" @click="handleSearch"></el-button>
            </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row style="margin-bottom:20px;">
        <el-button type="primary" title="导出" @click="handleExport">导出</el-button>
        <el-button type="primary" title="确认发放" @click="handlePub">确认发放</el-button>
    </el-row>
    <el-row>
      <el-table
            ref="multipleTable"
            :data="list"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            border>
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                        :width="col.width"
                        :key="index" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
                <el-tooltip content="查看">
                    <el-button type="warning" size="small" @click="handlePub(scope.row)" v-if='scope.row.issueStatus == "UNISSUED"'>
                        确认发放
                    </el-button>
                </el-tooltip>
                <el-tooltip content="查看">
                    <el-button type="info" size="small" @click="handleSwitch(scope.row)" v-if='scope.row.issueStatus == "UNISSUED"'>
                        关闭
                    </el-button>
                    <el-button type="success" size="small" @click="handleSwitch(scope.row)" v-if='scope.row.issueStatus == "CLOSED"'>
                        开启
                    </el-button>
                </el-tooltip>
            </template>
        </el-table-column>
    </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="search.pageNum"
        :page-sizes="[1,10, 20, 30,40,50,100,200]"
        :page-size="search.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import {
  luckyDrawParticipateList,
  switchLuckyDrawParticipate,
  exportLuckyDrawParticipate,
  issueLuckyDrawParticipate
} from "@/api/operate";
export default {
  name: "luckDrawList",
  components: {},
  data() {
    return {
      search: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      pageTotal: 0,
      list: [],
      options_1: [
        { text: "未发卡券", value: "COUPON" },
        { text: "实物商品", value: "PHYSICAL_COMMODITY" },
        { text: "话费充值", value: "PHONE_FARE" },
        { text: "油卡充值", value: "FUEL_CARD" },
        { text: "谢谢惠顾", value: "THANKS_PARTICIPATION" }
      ],
      options_2: [
        //UNISSUED 未发放，ISSUED 已发放，CLOSED 已关闭
        {
          text: "未发放",
          value: "UNISSUED"
        },
        {
          text: "已发放",
          value: "ISSUED"
        },
        {
          text: "已关闭",
          value: "CLOSED"
        }
      ],
      table: [
        {
          label: "用户id",
          prop: "cellphone"
        },
        {
          label: "奖品类型",
          prop: "prizeType"
          // formatter: (row, col, val) => val ? val : "--"
        },
        {
          label: "奖品描述",
          prop: "prizeName"
        },
        {
          label: "备注",
          prop: "memo"
        },
        {
          label: "发放状态",
          prop: "issueStatus",
          formatter: (row, col, val) =>
            (val === "UNISSUED" ? "未发放" : val == "ISSUED" ? "已发放" : "") ||
            "已关闭"
        },
        {
          label: "抽奖活动id",
          prop: "activityId"
        },
        {
          label: "中奖时间",
          prop: "createdTime"
        }
      ],
      rules: {
        psd: [{ required: true, message: "请输入密码!", trigger: "blur" }]
      },
      multipleSelection: [],
      participateIds: []
    };
  },
  computed: {},
  created() {
    this.getData();
  },
  methods: {
    getData() {
      luckyDrawParticipateList(this.search).then(res => {
        this.list = res.data.body.content;
        this.total = res.data.body.total;
      });
    },
    handleSearch() {
      this.getData();
    },
    handleDetailList() {
      this.showDialog = false;
      this.showDialogList = true;
    },
    handleAdd(val) {
      this.search.pageSize = val;
      this.getPageList();
    },
    handleSizeChange(val) {
      this.search.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.search.pageNum = val;
      this.getData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSwitch(row) {
      let isEnabled = row.issueStatus == "UNISSUED" ? 0 : 1;
      switchLuckyDrawParticipate({
        participateId: row.participateId,
        isEnabled: isEnabled
      }).then(res => {
        let mesDes = row.issueStatus == "UNISSUED" ? "关闭" : "开启";
        if (res.data.code == 200) {
          this.$notify({
            title: "成功",
            message: `${mesDes}成功`,
            type: "success"
          });
          this.getData();
        }
      });
    },
    handleExport() {
      // if(!this.participateIds.length){
      //   this.$message({
      //     message: '请至少选择一条数据',
      //     type: 'warning'
      //   });
      //   return
      // }
      exportLuckyDrawParticipate(this.search).then(response => {
        let data = response.data;
        let filename = response.headers["content-disposition"]
          ? response.headers["content-disposition"].split("filename=")[1]
          : "repayed_list.xlsx";
        filename = decodeURI(filename);
        this.$downloadExcel(data, filename);
      });
    },
    handlePub(row) {
      let params = {
        participateIds: []
      };
      if (row && row != "") {
        params.participateIds.push(row.participateId);
      } else {
        if (!this.participateIds.length) {
          this.$message({
            message: "请至少选择一条数据",
            type: "warning"
          });
          return;
        }
        params.participateIds = this.participateIds;
      }
      issueLuckyDrawParticipate(params).then(res => {
        if (res.data.code == 200) {
          this.$message({
            message: "发放成功",
            type: "success"
          });
          this.getData();
        }
      });
    }
  },
  watch: {
    multipleSelection(newVal, oldVal) {
      if (newVal) {
        for (let i in newVal) {
          this.participateIds.push(newVal[i].participateId);
        }
      }
    }
  }
};
</script>

