<!--风控管理-用户额度管理-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.custom-form {
  .el-row {
    width: 88%;
  }
  .el-form-item {
    .el-form-item__label,
    .customlabel {
      border-right: none;
    }
  }
}
</style>
<template>
  <div class="box">
   <!--=======风控管理-用户额度管理页 start===========-->
   <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="姓名">
            <el-input v-model="search.userName" placeholder="姓名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="登录手机号">
            <el-input v-model="search.loginName" placeholder="登录手机号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="授信开始时间">
            <kd-date-time-picker v-model="successTime" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间" ></kd-date-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="授信结束时间">
            <kd-date-time-picker v-model="invalidTime" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间" ></kd-date-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否有效">
            <kd-select v-model="search.isBind" :group="this.$enum.USER_PROPERTY_BIND_TYPE" clearable>
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
        <el-table-column type="index" width="50" align="center" label="选择"></el-table-column>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :width="col.width"
                         :key="index" align="center"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="350">
          <template slot-scope="scope">
            <el-tooltip content="编辑授信额度">
              <el-button type="warning" size="small" @click="handleEditAmount(scope.row)">编辑授信额度</el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.isBind" content="解除授信">
              <el-button type="danger" size="small" @click="updateBindStatus(scope.row,false)">解除授信</el-button>
            </el-tooltip>
            <el-tooltip content="恢复授信" v-else>
              <el-button type="success" size="small" @click="updateBindStatus(scope.row,true)">恢复授信</el-button>
            </el-tooltip>
            <el-tooltip content="查看编辑记录">
              <el-button type="primary" size="small" @click="handleWatchRecords(scope.row)">查看编辑记录</el-button>
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
    <!--=======风控管理-用户额度管理页 end===========-->

    <!--=======编辑额度弹框 start======-->
    <el-dialog title="编辑授信额度" :visible.sync="dialogFormVisible" @closed="handleCloseDialog">
      <el-form :model="ruleForm" :rules="rules" ref="editAmountDialog" label-width="120px" class="demo-ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="登录手机号" prop="name">
              <kd-input :mode="'VIEW'" v-model="ruleForm.loginName"></kd-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名">
              <kd-input :mode="'VIEW'" v-model="ruleForm.userName"></kd-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可消费额度">
              <kd-input :mode="'VIEW'" v-model="ruleForm.creditCurrent"></kd-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可提现额度">
              <kd-input :mode="'VIEW'" v-model="ruleForm.creditWithdraw"></kd-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="有效期" required>
          <el-col :span="11">
            <el-form-item prop="startValidateTime">
              <el-date-picker type="date" placeholder="开始时间" v-model="ruleForm.startValidateTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1" align="center">-</el-col>
          <el-col :span="11">
            <el-form-item prop="endValidateTime">
              <el-date-picker type="date" placeholder="结束时间" v-model="ruleForm.endValidateTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="授信总额" prop="creditTotalAmount">
              <el-input type="number" v-model.trim="ruleForm.creditTotalAmount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否有效" prop="isBind">
              <kd-radio v-model="ruleForm.isBind"
                      :options="ruleForm.bindOptions"
                      @change="handleChangeBind"></kd-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="修改原因" prop="remarks">
          <kd-input type="textarea" :rows="3" v-model="ruleForm.remarks"></kd-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleEditUserAmount">确定</el-button>
          <el-button @click="handleCloseDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--=======编辑额度弹框 end======-->

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
    <!--=======编辑记录弹框 start======-->
  </div>
</template>

<script>
import * as api from "../../api/risk.js";
const binds = [{ text: "是", value: "true" }, { text: "否", value: "false" }];
export default {
  name: "RiskAmountMangePage",
  data() {
    const inviteCodeRule = (rule, value, callback) => {
      this.$valid.inviteCodeRule(rule, value, callback, 100);
    };
    var checkAmount = (rule, value, callback) => {
      if (!Number.isInteger(Number(value))) {
        callback(new Error("请输入数字值"));
      } else {
        if (value < 1) {
          callback(new Error("必须大于0"));
        } else {
          callback();
        }
      }
    };
    return {
      ruleForm: {
        bindOptions: [],
        userPropertyId: "",
        loginName: "",
        userName: "",
        creditWithdraw: 0,
        startValidateTime: "",
        endValidateTime: "",
        creditTotalAmount: 0,
        isBind: "",
        remarks: ""
      },
      rules: {
        startValidateTime: [
          {
            type: "date",
            required: true,
            message: "请选择开始日期",
            trigger: "change"
          }
        ],
        endValidateTime: [
          {
            type: "date",
            required: true,
            message: "请选择结束日期",
            trigger: "change"
          }
        ],
        creditTotalAmount: [
          {
            required: true,
            message: "请输入总授信额度",
            trigger: "blur"
          },
          {
            validator: checkAmount,
            trigger: "blur"
          }
        ],
        isBind: [{ required: true, message: "请选择一项", trigger: "change" }],
        remarks: [
          {
            required: true,
            min: 10,
            max: 100,
            message: "请至少填写10个字符,不多于100个字符",
            trigger: "blur"
          },
          {
            validator: inviteCodeRule,
            trigger: "blur"
          }
        ]
      },
      formLabelWidth: "120px",
      search: {
        userName: "",
        loginName: "",
        isBind: "",
        successTimeStart: "",
        successTimeEnd: "",
        invalidTimeStart: "",
        invalidTimeEnd: "",
        pageNum: 1,
        pageSize: 10
      },
      pageTotal: 0,
      list: [],
      table: [
        {
          label: "姓名",
          prop: "userName"
        },
        {
          label: "登录手机号",
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
          prop: "isBind",
          formatter: (row, col, val) => (val == true ? "是" : "否")
        }
      ],

      dialogFormVisible: false,
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
            prop: "isBind",
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
    successTime: {
      get() {
        if (this.search.successTimeStart || this.search.successTimeEnd) {
          let daterange = [];
          daterange[0] = this.search.successTimeStart;
          daterange[1] = this.search.successTimeEnd;
          return daterange;
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.search.successTimeStart = this.$dateFilter(
            range[0],
            "yyyy-MM-dd HH:mm:ss"
          );
          this.search.successTimeEnd = this.$dateFilter(
            range[1],
            "yyyy-MM-dd HH:mm:ss"
          );
        } else {
          this.search.successTimeStart = "";
          this.search.successTimeEnd = "";
        }
      }
    },
    invalidTime: {
      get() {
        if (this.search.invalidTimeStart || this.search.invalidTimeEnd) {
          let daterange = [];
          daterange[0] = this.search.invalidTimeStart;
          daterange[1] = this.search.invalidTimeEnd;
          return daterange;
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.search.invalidTimeStart = this.$dateFilter(
            range[0],
            "yyyy-MM-dd HH:mm:ss"
          );
          this.search.invalidTimeEnd = this.$dateFilter(
            range[1],
            "yyyy-MM-dd HH:mm:ss"
          );
        } else {
          this.search.invalidTimeStart = "";
          this.search.invalidTimeEnd = "";
        }
      }
    }
  },
  created() {
    this.manageAmountList(1, this.search.pageSize);
  },
  methods: {
    //列表每页展示条数切换
    handleSizeChange(val) {
      this.search.pageSize = val;
      this.manageAmountList(this.search.pageNum, val);
    },
    //分页显示列表
    handleCurrentChange(val) {
      this.search.pageNum = val;
      this.manageAmountList(val, this.search.pageSize);
    },
    //用户额度列表获取
    manageAmountList(pageNumber, pageSize) {
      const mySearch = this.$deepcopy(this.search);
      mySearch.pageNum = pageNumber;
      mySearch.pageSize = pageSize;
      api.manageAmountList(mySearch).then(response => {
        let res = response.data;
        if (res.code == 200 && res.body.content) {
          this.list = res.body.content;
          this.pageTotal = res.body.total;
        }
      });
    },
    //编辑额度记录弹框
    handleEditAmount(row) {
      let _sTime = row.successTime;
      let _eTime = row.invalidTime;
      this.ruleForm.loginName = row.loginName;
      this.ruleForm.userName = row.userName;
      this.ruleForm.creditCurrent = row.creditCurrent;
      this.ruleForm.creditWithdraw = row.creditWithdraw;
      this.ruleForm.userPropertyId = row.userPropertyId;
      this.ruleForm.remarks = row.remarks;
      this.ruleForm.bindOptions = binds;
      this.ruleForm.isBind =
        row.isBind && row.isBind != null ? "true" : "false";
      this.ruleForm.endValidateTime = new Date(_eTime);
      this.ruleForm.startValidateTime = new Date(_sTime);
      this.ruleForm.creditTotalAmount = row.creditTotal;
      this.dialogFormVisible = true;
    },
    //用户额度编辑
    handleEditUserAmount() {
      console.log("handleEditUserAmount:", this.ruleForm.creditTotalAmount);
      this.$refs.editAmountDialog.validate(valid => {
        if (valid) {
          const _params = {
            invalidTime: this.$dateFilter(this.ruleForm.endValidateTime),
            successTime: this.$dateFilter(this.ruleForm.startValidateTime),
            isBind:
              this.ruleForm.isBind && this.ruleForm.isBind == "true"
                ? true
                : false,
            userPropertyId: this.ruleForm.userPropertyId,
            remarks: this.ruleForm.remarks,
            creditTotal: this.ruleForm.creditTotalAmount
              ? Number(this.ruleForm.creditTotalAmount)
              : undefined
          };
          api.editUserAmount(_params).then(response => {
            let res = response.data;
            if (res.code == 200) {
              this.$alert("额度编辑成功!", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                  this.manageAmountList(
                    this.search.pageNum,
                    this.search.pageSize
                  );
                  this.$refs.editAmountDialog.resetFields();
                  this.dialogFormVisible = false;
                }
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    //选择是否有效事件
    handleChangeBind(val) {
      this.ruleForm.isBind = val;
      console.log("handleChangeBind:", val);
    },
    //点击查看编辑记录弹框里面的分页条数切换事件
    sizeChangeRecords(val) {
      this.recordsValues.pageSize = val;
      this.getAmountChangeRecords(this.recordsValues.pageNum, val);
    },
    //点击查看编辑记录弹框里面的分页事件
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
    //弹框查看历史编辑记录
    handleWatchRecords(row) {
      this.recordsPartyId = row.partyId;
      this.getAmountChangeRecords(1, this.recordsValues.pageSize);
      this.dialogTableVisible = true;
    },
    //关闭历史编辑记录弹框
    handleCloseRecordsDialog() {
      this.recordsValues.recordsDates = [];
      this.dialogTableVisible = false;
    },
    //解除或恢复授信
    updateBindStatus(row, isBind) {
      let _params = {
        partyId: row.partyId,
        isBind: isBind
      };
      api.updateBindStatus(_params).then(response => {
        console.log("api.updateBindStatus:", response);
        let res = response.data;
        if (res.code == 200) {
          let _msg = isBind ? "恢复授信成功!" : "解除授信成功!";
          this.$alert(_msg, "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.manageAmountList(this.search.pageNum, this.search.pageSize);
            }
          });
        }
      });
    },
    handleSearch() {
      this.manageAmountList(1, this.search.pageSize);
    },
    handleCloseDialog() {
      this.$refs.editAmountDialog.resetFields();
      this.dialogFormVisible = false;
    }
  }
};
</script>


