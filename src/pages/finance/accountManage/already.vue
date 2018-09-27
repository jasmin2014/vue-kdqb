<!--财务管理-调账划账管理 已办-->
<template>
  <div class="box">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="10">
          <el-form-item label="审核时间">
            <kd-date-time-picker v-model="auditDate" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" ></kd-date-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="调账成功时间">
            <kd-date-time-picker v-model="operateDate" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" ></kd-date-time-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="出账账户">
            <el-input v-model="search.fromNameLike" placeholder="出账账户" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="入账账户">
            <el-input v-model="search.toNameLike" placeholder="入账账户" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="类型">
            <kd-select v-model="search.adjustmentType" :group="this.$enum.ADJUSTMENT_TYPE" clearable></kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
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
        <el-table-column label="操作" align="center" fixed="right" width="150">
          <template slot-scope="scope">
            <el-tooltip content="查看详情">
              <el-button size="small" type="primary" icon="el-icon-view" @click="handleDetail(scope.row)">
              </el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.status == 4" content="删除">
              <el-button size="small" type="danger" icon="el-icon-delete"
                         @click="handleDelete(scope.row)">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
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

    <el-dialog title="调账申请详情页面" :visible.sync="dialog">
      <el-form :model="alreadyModels" label-width="150px">
        <el-row>
          <el-col :span="15">
            <el-form-item label="出款账户登录名" prop="mobile">
              <el-input disabled v-model="alreadyModels.fromLoginName" auto-complete="off" placeholder="必填"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="出款账户姓名" prop="mobile">
              <el-input disabled v-model="alreadyModels.fromName" auto-complete="off" placeholder="必填"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="入款账户登录名">
              <el-input disabled v-model="alreadyModels.toLoginName" auto-complete="off" placeholder="必填"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="入款账户姓名">
              <el-input disabled v-model="alreadyModels.toName" auto-complete="off" placeholder="必填"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="调账金额">
              <kd-input disabled v-model="alreadyModels.amount"
                        auto-complete="off"
                        placeholder="必填"
                        unit="元"
              ></kd-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="备注">
              <el-input disabled type="textarea" v-model="alreadyModels.remarks" auto-complete="off"
                        placeholder="必填"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <div class="info">
            <h4>
              <span>操作记录</span>
            </h4>
          </div>
          <el-table :data="operateList" border>
            <el-table-column v-for="(col, index) in detailTable" :prop="col.prop" :label="col.label"
                             :formatter="col.formatter"
                             :width="col.width"
                             :key="index" align="center"></el-table-column>
            <!--<el-table-column label="结果" align="center" fixed="right" width="150">-->
              <!--<template slot-scope="scope">-->
                <!--<span>{{$filter(scope.row.operateStatus,this.$enum.ADJUSTMENT_OPERATE_STATUS)}}</span>-->
                <!--<el-tooltip v-if="scope.row.operateStatus == 3" content="重新提交">-->
                  <!--<el-button type="text" @click="handleRetryAdjustFund(scope.row)">重新提交</el-button>&lt;!&ndash; @click="handleDetail(scope.row)"&ndash;&gt;-->
                <!--</el-tooltip>-->
              <!--</template>-->
            <!--</el-table-column>-->
          </el-table>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import * as api from "../../../api/finance.js";

export default {
  name: "FinanceAccountAlreadyDonePage",
  data() {
    return {
      dialog: false,
      alreadyModels: {
        fromLoginName: "",
        fromName: "",
        toLoginName: "",
        toName: "",
        amount: "",
        remarks: ""
      },
      search: {
        auditDateStart: "",
        auditDateEnd: "",
        operateTimeStart: "",
        operateTimeEnd: "",
        fromNameLike: "",
        toNameLike: "",
        adjustmentType: "",
        pageNum: 1,
        pageSize: 10
      },
      pageTotal: 0,
      list: [],
      table: [
        {
          label: "类型",
          prop: "adjustmentType",
          formatter: (row, col, val) =>
            this.$filter(val, this.$enum.ADJUSTMENT_TYPE)
        },
        {
          label: "出款账户",
          prop: "fromLoginName"
        },
        {
          label: "出款账户姓名",
          prop: "fromName"
        },
        {
          label: "入款账户",
          prop: "toLoginName"
        },
        {
          label: "入款账户姓名",
          prop: "toName"
        },
        {
          label: "金额",
          prop: "amount"
        },
        {
          label: "申请人员",
          prop: "createdBy"
        },
        {
          label: "申请时间",
          prop: "createdTime"
        },
        {
          label: "调账成功时间",
          prop: "operateTime"
        },
        {
          label: "审核人员",
          prop: "auditBy"
        },
        {
          label: "审核时间",
          prop: "auditDate"
        },
        {
          label: "审核状态",
          prop: "auditStatus",
          formatter: (row, col, val) =>
            this.$filter(val, this.$enum.ADJUSTMENT_AUDIT_STATUS)
        },
        {
          label: "资金操作状态",
          prop: "status",
          formatter: (row, col, val) =>
            this.$filter(val, this.$enum.FUNDS_OPERATE_STATUS)
        },
        {
          label: "备注",
          prop: "remarks"
        }
      ],
      operateList: [],
      detailTable: [
        {
          label: "操作类型",
          prop: "operateType",
          formatter: (row, col, val) =>
            this.$filter(val, this.$enum.ADJUSTMENT_OPERATE_TYPE)
        },
        {
          label: "时间",
          prop: "operateTime"
        },
        {
          label: "操作人",
          prop: "operateBy"
        }
      ]
    };
  },
  computed: {
    auditDate: {
      get() {
        if (this.search.auditDateStart || this.search.auditDateEnd) {
          let dateRange = [];
          dateRange[0] = this.search.auditDateStart;
          dateRange[1] = this.search.auditDateEnd;
          return dateRange;
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.search.auditDateStart = this.$dateFilter(
            range[0],
            "yyyy-MM-dd HH:mm:ss"
          );
          this.search.auditDateEnd = this.$dateFilter(
            range[1],
            "yyyy-MM-dd HH:mm:ss"
          );
        } else {
          this.search.auditDateStart = "";
          this.search.auditDateEnd = "";
        }
      }
    },
    operateDate: {
      get() {
        if (this.search.operateTimeStart || this.search.operateTimeEnd) {
          let dateRange = [];
          dateRange[0] = this.search.operateTimeStart;
          dateRange[1] = this.search.operateTimeEnd;
          return dateRange;
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.search.operateTimeStart = this.$dateFilter(
            range[0],
            "yyyy-MM-dd HH:mm:ss"
          );
          this.search.operateTimeEnd = this.$dateFilter(
            range[1],
            "yyyy-MM-dd HH:mm:ss"
          );
        } else {
          this.search.operateTimeStart = "";
          this.search.operateTimeEnd = "";
        }
      }
    }
  },
  created() {
    this.getData(this.search.pageSize,this.search.pageNum);
  },
  methods: {
    handleSearch() {
      this.search.pageNum = 1
      this.getData(this.search.pageSize,this.search.pageNum);
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
      api.getAdjustList(mySearch).then(response => {
        const res = response.data;
        if (res.code == 200) {
          this.list = res.body.content;
          this.pageTotal = res.body.total;
        }
      });
    },
    handleDetail(row) {
      this.getDataDetail(row);
      this.dialog = true;
    },
    //获取详情
    getDataDetail(row) {
      api.getAdjustDetail(row.adjustmentFundsId).then(response => {
        let res = response.data;
        if (res.code == 200) {
          this.alreadyModels = {
            fromLoginName: res.body.adjustFunds.fromLoginName,
            fromName: res.body.adjustFunds.fromName,
            toLoginName: res.body.adjustFunds.toLoginName,
            toName: res.body.adjustFunds.toName,
            amount: res.body.adjustFunds.amount,
            remarks: res.body.adjustFunds.remarks
          };
          this.operateList = res.body.adjustmentOperate
            ? res.body.adjustmentOperate
            : [];
        }
      });
    },
    // //详情-操作失败-重新提交[无数据未测试]
    // handleRetryAdjustFund(row) {
    //   let _param = { adjustId: row.adjustmentFundsId };
    //   api.adjustFundsRetry(_param).then(response => {
    //     let res = response.data;
    //     if (res.code == 200) {
    //       this.$message({
    //         type: "success",
    //         message: "重新提交成功!"
    //       });
    //     }
    //   });
    // },
    handleDelete(row) {
      this.$confirm("确定要删除吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.delAdjust(row.adjustmentFundsId);
      });
    },
    //删除
    delAdjust(id) {
      api.delAdjust(id).then(response => {
        const res = response.data;
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getData(this.search.pageNum);
        } else {
          this.$message({
            type: "warning",
            message: "删除失败!"
          });
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
