<!--财务管理-调账划账管理-代办-->
<template>
  <div class="box">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="10">
          <el-form-item label="审核时间">
            <kd-date-time-picker v-model="auditDate" type="datetimerange" start-placeholder="开始日期"
                                 end-placeholder="结束日期"></kd-date-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="出账账户">
            <el-input v-model="search.fromNameLike" placeholder="出账账户" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="入账账户">
            <el-input v-model="search.toNameLike" placeholder="入账账户" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" title="查找" @click="handleSearch"></el-button>
            <el-button type="warning" title="申请制单" @click="handleAdd">申请制单</el-button>
            <el-button type="warning" :disabled="isDownload" title="批量审核" @click="handleBatchAudit">批量审核</el-button>
            <el-button type="warning" title="批量申请模板下载" @click="handleDownload">批量申请模板下载
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :file-list="fileList"
            :before-upload="handleBefore">
            <el-button type="warning" title="批量上传申请">批量上传申请</el-button>
          </el-upload>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" label="选择"></el-table-column>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :width="col.width"
                         :key="index" align="center"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="240">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.auditStatus == 1" content="审核">
              <el-button type="success" size="small" @click="handleToExamine(scope.row)">审核
              </el-button>
            </el-tooltip>
            <el-tooltip content="查看详情">
              <el-button size="small" type="primary" icon="el-icon-view" @click="handleDetail(scope.row)">
              </el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.status == 4" content="删除">
              <el-button size="small" type="danger" icon="el-icon-delete"
                         @click="handleDelete(scope.row)">
              </el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.auditStatus == 2 && scope.row.status == 4" content="发起资金操作">
              <el-button type="warning" size="small"
                         @click="handleRetryAdjustFund(scope.row)">发起资金操作
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="tab-sum">共勾选{{waitCount}}笔 共计{{waitSum}}元</div>
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

    <!--审核详情-->
    <el-dialog :title="alreadyModelTitle" :visible.sync="applyDecsDialog" @close="handleClose">
      <el-form :model="alreadyModels" label-width="150px" ref="alreadyModels" :rules='alreadyModelsRules'>
        <el-row v-if="mode =='EDIT' || mode == 'BATCH'">
          <el-col :span="13">
            <el-form-item prop="status">
              <kd-radio v-model="alreadyModels.status"
                        :options="options"
                        @change="changeStatus"></kd-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="mode !='BATCH'">
          <el-col :span="13">
            <el-form-item label="出款账户登录名" prop="fromLoginName" ref="fromLoginName">
              <kd-input :disabled="mode !== 'CREATE'"
                        v-model="alreadyModels.fromLoginName"
                        @blur="handleFromName(alreadyModels.fromLoginName)"
                        placeholder="必填"></kd-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" v-if="mode == 'CREATE'" style="margin-left:10px">
            <el-form-item label-width="100">
              <kd-select v-model="fromAccount"
                         :group="this.$enum.ADJUST_ACCOUNT_TYPE"
                         @change="ChangeFromAccount"></kd-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="mode != 'BATCH'">
          <el-row>
            <el-col :span="13">
              <el-form-item label="出款账户姓名" prop="fromName">
                <kd-input disabled v-model="alreadyModels.fromName" auto-complete="off"
                          placeholder="出款账户姓名"></kd-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item label="入款账户登录名" prop="toLoginName" ref="toLoginName">
                <kd-input :disabled="mode !== 'CREATE'"
                          v-model="alreadyModels.toLoginName"
                          @blur="handleToName(alreadyModels.toLoginName)"
                          placeholder="必填"></kd-input>
              </el-form-item>
            </el-col>
            <el-col :span="7" v-if="mode == 'CREATE'" style="margin-left:10px">
              <el-form-item label-width="100">
                <kd-select v-model="toAccount"
                           :group="this.$enum.ADJUST_ACCOUNT_TYPE"
                           @change="ChangeToAccount"></kd-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item label="入款账户姓名" prop="toName">
                <kd-input disabled v-model="alreadyModels.toName" auto-complete="off"
                          placeholder="入款账户姓名"></kd-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item label="调账金额" prop="amount">
                <kd-input :disabled="mode !== 'CREATE'"
                          v-model="alreadyModels.amount"
                          type="number"
                          unit="元"></kd-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row v-if="mode == 'CREATE'">
          <el-col :span="13">
            <el-form-item label="是否需要主管审核" prop="needAudit">
              <kd-radio :disabled="mode !== 'CREATE'"
                        v-model="alreadyModels.needAudit"
                        :options="auditOptions"
                        @change="changeNeedAudit"></kd-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="mode != 'BATCH'">
          <el-col :span="13">
            <el-form-item label="备注" prop="remarks">
              <kd-input :disabled="mode !== 'CREATE'"
                        type="textarea" :row="5"
                        v-model="alreadyModels.remarks"
                        placeholder="最多输入50个字符"></kd-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-if="mode == 'EDIT' || mode == 'VIEW'">
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
        </el-table>
      </div>
      <div v-if="mode !='VIEW'" slot="footer">
        <el-button type="primary" @click="handleSave">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as api from "../../../api/finance.js";

  export default {
    components: {},
    name: "FinanceAccountWaitPage",
    data() {
      const numberRule = (rule, value, callback) => {
        if (this.$valid.floatValidator(value, 2) == false) {
          callback("保留2位小数");
        }
        if (value <= 0) {
          callback("请输入大于0的金额!");
        } else {
          callback();
        }
      };
      const remarkRule = (rule, value, callback) =>
        this.$valid.inviteCodeRule(rule, value, callback, 50);
      return {
        mode: "",
        fileList: [],
        applyDecsDialog: false,
        applyDialog: false,
        alreadyModelTitle: "",
        alreadyModels: {
          fromPartyId: "",
          toPartyId: "",
          fromNameLike: "",
          toNameLike: "",
          needAudit: '0',
          toName: "",
          amount: "",
          remarks: "",
          status: 2
        },
        fromAccount: '1',
        toAccount: "1",
        alreadyRow: {},
        isDownload: true,
        waitCount: 0,
        waitSum: 0,
        adjustIdList: [],
        options: [{value: 2, text: "通过"}, {value: 3, text: "不通过"}],
        auditOptions: [{value: '1', text: "是"}, {value: '0', text: "否"}],
        search: {
          auditDateStart: "",
          auditDateEnd: "",
          fromLoginName: "",
          fromNameLike: "",
          pageNum: 1,
          pageSize: 10
        },
        pageTotal: 0,
        flag: "",
        list: [],
        table: [
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
            label: "操作成功时间",
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
              this.$filter(val, this.$enum.ADJUSTMENT_FUNDS_OPERATE_STATUS)
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
          },
          {
            label: "结果",
            prop: "operateStatus",
            formatter: (row, col, val) =>
              this.$filter(val, this.$enum.ADJUSTMENT_OPERATE_STATUS)
          }
        ],
        alreadyModelsRules: {
          fromLoginName: [
            {required: true, message: "请输入出款账户登录名", trigger: "blur"}
          ],
          toLoginName: [
            {required: true, message: "请输入入账账户登录名", trigger: "blur"}
          ],
          amount: [
            {required: true, message: "请输入调账金额", trigger: "blur"},
            {validator: numberRule, trigger: "blur"}
          ],
          remarks: [
            {
              required: false,
              message: "请填写50以内字符备注!",
              trigger: "blur"
            },
            {validator: remarkRule, trigger: "blur"}
          ]
        }
      };
    },
    computed: {
      auditDate: {
        get() {
          if (this.search.auditDateStart || this.search.auditDateEnd) {
            let range = [];
            range[0] = this.search.auditDateStart;
            range[1] = this.search.auditDateEnd;
            return range;
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
      }
    },
    created() {
      this.getData(this.search.pageSize, this.search.pageNum);
    },
    methods: {
      handleSearch() {
        this.search.pageNum = 1;
        this.getData(this.search.pageSize, this.search.pageNum);
      },
      handleClose() {
        this.$nextTick(() => {
          this.$refs.alreadyModels && this.$refs.alreadyModels.resetFields();
        });
      },
      handleCurrentChange(val) {
        this.search.pageNum = val;
        this.getData(this.search.pageSize, val);
      },
      handleSizeChange(val) {
        this.search.pageSize = val;
        this.getData(val, this.search.pageNum);
      },
      //获取待办列表
      getData(pageSize, pageNum) {
        const mySearch = this.$deepcopy(this.search);
        mySearch.pageSize = pageSize;
        mySearch.pageNum = pageNum;
        api.getWaitAdjustList(mySearch).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.list = res.body.content;
            this.pageTotal = res.body.total;
          }
        });
      },
      handleSelectionChange(val) {
        if (val.length > 0) {
          this.isDownload = false;
          this.waitCount = val.length;
          let waitSum = 0;
          const arr = [];
          val.forEach((item, index) => {
            waitSum += item.amount;
            this.waitSum = waitSum.toFixed(2);
            arr.push(item.adjustmentFundsId);
            this.adjustIdList = arr;
          });
        } else {
          this.isDownload = true;
          this.waitCount = 0;
          this.waitSum = 0;
        }
      },
      //资金操作
      handleRetryAdjustFund(row) {
        this.$confirm("确定发起资金操作吗?", "提示", {
          type: "warning"
        }).then(() => {
          api.adjustFundsRetry(row.adjustmentFundsId).then(response => {
            let res = response.data;
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "重新提交成功!"
              });
            }
          });
        });
      },
      //申请制单
      handleAdd() {
        this.alreadyModelTitle = "添加申请";
        this.mode = "CREATE";
        this.applyDecsDialog = true;
        this.alreadyModels = {
          fromPartyId: "",
          toPartyId: "",
          fromLoginName: "",
          fromName: "",
          toLoginName: "",
          needAudit: '0',
          toName: "",
          amount: "",
          remarks: "",
          status: 2
        };
        this.fromAccount = '1';
        this.toAccount = "1";
      },
      ChangeFromAccount(val) {
        const tmpId = '1'; //识别出账还是入账 1是出账
        this.$refs.fromLoginName.clearValidate()
        if (val == 2) {
          this.getItAccount(tmpId);
        } else if (val == 1) {
          this.alreadyModels.fromLoginName = '';
          this.alreadyModels.fromName = '';
        }
      },
      ChangeToAccount(val) {
        const tmpId = '2'; //2是入账
        this.$refs.toLoginName.clearValidate()
        if (val == 2) {
          this.getItAccount(tmpId);
        } else if (val == 1) {
          this.alreadyModels.toLoginName = '';
          this.alreadyModels.toName = '';
        }
      },
      handleFromName(val) {
        this.flag = "fromName";
        if (val) {
          this.getAdjustId(val);
        }
      },
      handleToName(val) {
        this.flag = "toName";
        if (val) {
          this.getAdjustId(val);
        }
      },
      changeNeedAudit(val) {
        this.alreadyModels.needAudit = val;
      },
      //批量审核
      handleBatchAudit() {
        this.mode = "BATCH";
        this.applyDecsDialog = true;
        this.alreadyModelTitle = "调账申请批量审核";
      },
      //下载
      handleDownload() {
        api.downLoanApply().then(response => {
          if (response.status == 200) {
            let data = response.data;
            let filename = response.headers["content-disposition"]
              ? response.headers["content-disposition"].split("filename=")[1]
              : "repayed_list.xlsx";
            this.$downloadExcel(data, filename);
          }
        });
      },
      //审核
      handleToExamine(row) {
        this.alreadyModelTitle = "调账申请审核";
        this.alreadyRow = row;
        this.mode = "EDIT";
        this.getDataDetail(row);
        this.applyDecsDialog = true;
      },
      handleDetail(row) {
        this.alreadyModelTitle = "调账申请详情页面";
        this.mode = "VIEW";
        this.getDataDetail(row);
        this.applyDecsDialog = true;
      },
      changeStatus(val) {
        this.alreadyModels.status = val;
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
            this.alreadyModels.status = 2;
            this.operateList = res.body.adjustmentOperate
              ? res.body.adjustmentOperate
              : [];
          }
        });
      },
      handleDelete(row) {
        this.$confirm("删除后,列表将不再展示?", "提示", {
          type: "warning"
        }).then(() => {
          this.delAdjust(row.adjustmentFundsId);
        });
      },
      handleSave() {
        this.$refs.alreadyModels.validate(val => {
          if (this.mode == "CREATE") {
            this.addAdjustFunds();
          } else if (this.mode == "BATCH") {
            this.batchAudit();
          } else {
            if (val) {
              this.auditAdjustFunds();
            } else {
              return false;
            }
          }
        });
      },
      //导入
      handleBefore(file) {
        const isLt10M = file.size / 1024 / 1024 <= 10;
        const fileNames = file.name.split('.');
        const suffix = fileNames[fileNames.length - 1];
        const isFile = (file.type && suffix == 'xls') || (file.type && suffix == 'xlsx');
        if (!isLt10M) {
          this.$message({
            type: 'warning',
            message: '最高上传限制10M!'
          })
        } else if (!isFile) {
          this.$message({
            type: 'warning',
            message: '上传文件有误，请重新上传!'
          })
        } else {
          let fd = new FormData();
          fd.append("file", file);
          setTimeout(() => {
            api.uploadLoanApply(fd).then(response => {
              const res = response.data;
              console.log(response, 999)
              if (response.status == 200) {
                if (!res.code) {
                  let filename = response.headers["content-disposition"]
                    ? response.headers["content-disposition"].split("filename=")[1]
                    : "list.xlsx";
                  this.$downloadExcel(res, filename);
                } else {
                  this.$message({
                    type: "warning",
                    message: res.message
                  });
                }
              }
            });
          }, 2000);
        }
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
            this.getData(this.search.pageSize, this.search.pageNum);
          } else {
            this.$message({
              type: "warning",
              message: "删除失败!"
            });
          }
        });
      },
      //审核
      auditAdjustFunds() {
        const data = {
          adjustId: this.alreadyRow.adjustmentFundsId,
          status: this.alreadyModels.status
        };
        api.auditAdjustFunds(data).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.getData(this.search.pageSize, this.search.pageNum);
            this.applyDecsDialog = false;
            this.$message({
              type: "success",
              message: "审核成功!"
            });
          }
        });
      },
      //添加
      addAdjustFunds() {
        const alreadyModels = this.$deepcopy(this.alreadyModels);
        delete alreadyModels.status;
        api.addAdjustFunds(alreadyModels).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.getData(this.search.pageSize, this.search.pageNum);
            this.applyDecsDialog = false;
            this.$message({
              type: "success",
              message: "添加成功!"
            });
          }
        });
      },
      //获取机构账户
      getItAccount(val) {
        api.getItAccount('PW_ORG_NO').then(response => {
          const res = response.data;
          if (res.code == 200) {
            if (val == 1) {
              this.alreadyModels.fromLoginName = res.body.paramValue;
              this.alreadyModels.fromName = res.body.paramName;
              this.alreadyModels.fromPartyId = res.body.paramValue;
            } else if (val == 2) {
              this.alreadyModels.toLoginName = res.body.paramValue;
              this.alreadyModels.toName = res.body.paramName;
              this.alreadyModels.toPartyId = res.body.paramValue;
            }
          }
        })
      },
      //添加查询id
      getAdjustId(cellphone) {
        api.getAdjustId(cellphone).then(response => {
          const res = response.data;
          if (res.code == 200) {
            if (this.flag == "fromName") {
              this.alreadyModels.fromName = res.body.realName;
              this.alreadyModels.fromPartyId = res.body.partyId;
            } else if (this.flag == "toName") {
              this.alreadyModels.toName = res.body.realName;
              this.alreadyModels.toPartyId = res.body.partyId;
            }
          }
        });
      },
      batchAudit() {
        const obj = {};
        obj.adjustIdList = this.adjustIdList;
        obj.status = this.alreadyModels.status;
        api.batchAudit(obj).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.applyDecsDialog = false;
            this.$message({
              type: "success",
              message: "审核成功!"
            });
            this.getData(this.search.pageSize, this.search.pageNum);
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: res.message
            });
          }
        });
      }
    }
  };
</script>

<style scoped>
  .tab-sum {
    color: #ff6600;
    margin-top: 20px;
  }
</style>

