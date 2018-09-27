<!--财务管理-放款审核-查看详情-->
<template>
  <div class="box">
    <el-form v-model="detail" label-width="100px">
      <div class="info">
        <h4>
          <span>用户基础信息</span>
        </h4>
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户姓名">
              <el-input v-model="detail.userDetail.realName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登录账户">
              <el-input v-model="detail.userDetail.cellphone" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件号码">
              <el-input v-model="detail.userDetail.idCard" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="手机号码">
              <el-input v-model="detail.userDetail.cellphoneHide" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="info">
        <h4>
          <span>申请借款信息</span>
        </h4>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="贷款订单号">
              <el-input v-model="detail.loanApply.loanApplyNo" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="渠道名称">
              <el-input v-model="detail.loanApply.channelName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="借款类型">
              <kd-select v-model="detail.loanApply.loanType" disabled :group="this.$enum.LOAN_TYPE"></kd-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="还款方式">
              <kd-select v-model="detail.loanApply.repaymentModel" disabled
                         :group="this.$enum.REPAYMENT_MODEL"></kd-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="借款期数">
              <el-input v-model="detail.loanApply.period" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="借款金额">
              <el-input v-model="detail.loanApply.loanAmount" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日/月利率">
              <kd-input v-model="detail.loanApply.loanFee" unit="%" disabled></kd-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请借款时间">
              <el-input v-model="detail.loanApply.applyTime" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="info">
        <h4>
          <span>财务放款信息</span>
        </h4>
        <el-row>
          <el-table :data="detail.loanApplyInfoList" border>
            <el-table-column v-for="(col, index) in loanTable" :prop="col.prop" :label="col.label"
                             :formatter="col.formatter" :width="col.width"
                             :key="index" align="center"></el-table-column>
          </el-table>
        </el-row>
      </div>
      <div class="info" v-if="type!='EDIT'">
        <h4>
          <span>终止放款信息</span>
        </h4>
        <el-row>
          <el-table :data="detail.endLoanList" border>
            <el-table-column v-for="(col, index) in endLoanTable" :prop="col.prop" :label="col.label"
                             :formatter="col.formatter" :width="col.width"
                             :key="index" align="center"></el-table-column>
          </el-table>
        </el-row>
      </div>
    </el-form>
    <div v-if="type!='VIEW'" class="info" style="margin-top: 28px">
      <h4>
        <span>财务放款审批</span>
      </h4>
      <el-form :model="loanDetail" label-width="100px" ref="loanDetail" :rules="loanRules">
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户申请金额">
              <kd-input unit="元" v-model="loanDetail.loanAmount" disabled></kd-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="放款账户" prop="investorId">
              <kd-select v-model="loanDetail.investorId"
                         :options="loanOptions"
                         @change="changeAccount"></kd-select>
              <span style="color: #fa5555">账户余额: {{amount}} 元</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="账户名称">
              <el-input v-model="loanDetail.investor" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="type!='VIEW'" style="margin-top: 30px">
          <el-button type="warning" @click="handleShopLoan">终止放款</el-button>
          <el-button type="primary" @click="handleLoan">确认放款</el-button>
        </el-row>
      </el-form>
    </div>


    <!--终止放款-->
    <el-dialog title="终止放款理由" :visible.sync="shopDialog" @close="handleDialogClose">
      <el-form :model="reasonModels" ref="reasonModels" label-width="150px" :rules="rules">
        <el-row>
          <el-col :span="15">
            <el-form-item label="终止放款理由" prop="cancelReason">
              <el-input type="textarea" :row="5" v-model="reasonModels.cancelReason"
                        placeholder="1～200字 必填！"></el-input>
              <span style="color: #444">终止放款后不能再次发起请求</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="handleAgainShopLoan">确认不放款</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as api from "../../api/finance.js";

  export default {
    components: {},
    data() {
      const inviteCodeRule = (rule, value, callback) =>
        this.$valid.inviteCodeRule(rule, value, callback, 200);
      return {
        id: "",
        type: "",
        amount: 0,
        detail: {
          userDetail: {
            realName: "",
            cellphone: "",
            idCard: "",
            cellphoneHide: ""
          },
          loanApply: {
            loanApplyNo: "",
            channelName: "",
            loanType: "",
            repaymentModel: "",
            period: "",
            loanAmount: "",
            loanFee: "",
            applyTime: ""
          },
          loanApplyInfoList: [],
          endLoanList: []
        },
        loanDetail: {
          investorId: "",
          investor: '',
          loanAmount:''
        },
        loanOptions: [],
        shopDialog: false,
        reasonModels: {},
        list: [],
        riskTable: [
          {
            label: "节点名称",
            prop: "auditNodeName"
          },
          {
            label: "审批人",
            prop: "auditPartyName"
          },
          {
            label: "审批时间",
            prop: "createdTime"
          },
          {
            label: "审核结果",
            prop: "auditStatus",
            formatter: (row, col, val) =>
              this.$filter(val, this.$enum.OPERATION, this.$enum.WORKFLOW)
          },
          {
            label: "审核备注",
            prop: "description",
            formatter: (row, col, val) => (val ? val : "--")
          }
        ],
        loanTable: [
          {
            label: "用户申请金额(元)",
            prop: "loanAmount"
          },
          {
            label: "实际放款金额(元)",
            prop: "grantAmount"
          },
          {
            label: "放款账放款时间",
            prop: "grantDate"
          },
          {
            label: "放款状态",
            prop: "grantStatus",
            formatter: (row, col, val) =>
              this.$filter(val, this.$enum.GRANT_STATUS)
          },
          {
            label: "备注",
            prop: "remarks"
          },
          {
            label: "操作人",
            prop: "grantBy"
          }
        ],
        endLoanTable: [
          {
            label: "终止时间",
            prop: "createdTime"
          },
          {
            label: "终止凭证",
            prop: "cancelReason"
          },
          {
            label: "终止状态",
            prop: "status",
            formatter: (row, col, val) =>
              this.$filter(val, this.$enum.LOAN_CANCEL_STATUS)
          },
          {
            label: "操作人",
            prop: "createdBy"
          }
        ],
        rules: {
          cancelReason: [
            {
              required: true,
              message: "请输入终止放款理由",
              trigger: "blur"
            },
            {validator: inviteCodeRule, trigger: 'blur'}
          ]
        },
        loanRules: {
          investorId: [
            {required: true, message: "请选择账户", trigger: "change"}
          ],
        }
      };
    },
    created() {
      this.id = this.$route.params.id;
      this.type = this.$route.query.mode;
      this.getAlreadyAuditInfo();
      this.getRepayAccount();
      // if (this.$route.params.type == "VIEW" || this.$route.query.type == "VIEW") {
      //   this.$route.meta.title = "详情";
      // } else {
      //   this.$route.meta.title = "财务放款";
      // }
      // this.getFinanceDetail();
    },
    methods: {
      //放款审核-已审核-详情信息
      getAlreadyAuditInfo() {
        api.getAlreadyLoanDetail(this.id).then(response => {
          let res = response.data;
          if (res.code == 200) {
            this.detail.userDetail = res.body.userDetail;
            let _loanApply = res.body.loanApply;
            this.detail.loanApply = {
              loanApplyNo: _loanApply.loanApplyNo,
              channelName: _loanApply.channelName,
              loanType: _loanApply.loanType,
              repaymentModel: _loanApply.repaymentModel,
              period: _loanApply.period,
              loanAmount: _loanApply.loanAmount,
              applyTime: _loanApply.applyTime
            };
            this.detail.loanApply.loanFee = this.$floatToPercentage(_loanApply.loanFee,1)
            let _item = {
              loanAmount: _loanApply.loanAmount,
              grantAmount: _loanApply.grantAmount,
              grantDate: _loanApply.grantDate,
              grantStatus: _loanApply.grantStatus,
              remarks: _loanApply.remarks,
              grantBy: _loanApply.grantBy
            };
            this.detail.loanApplyInfoList = [];
            this.detail.loanApplyInfoList.push(_item);
            this.loanDetail.loanAmount = this.detail.loanApplyInfoList[0].loanAmount
            if(res.body.loanCancel !==null){
              let _loanCancel = res.body.loanCancel;
              let _endItem = {
                createdTime: _loanCancel.createdTime,
                cancelReason: _loanCancel.cancelReason,
                status: _loanCancel.status,
                createdBy: _loanCancel.createdBy
              };
              this.detail.endLoanList = [];
              this.detail.endLoanList.push(_endItem);
            }else {
              res.body.loanCancel = {};
            }

          }
        });
      },
      changeAccount(val) {
        this.getAccountAmount(val);
        this.loanOptions.forEach(item => {
          if(item.itemValue == val){
            this.loanDetail.investor = item.attr1;
          }
        })
      },
      // 确认放款
      handleLoan() {
        this.$refs['loanDetail'].validate(val => {
          if (val) {
            this.$confirm("是否确认放款?", "提示", {
              type: "warning"
            }).then(() => {
              this.loanConfirm();
            });
          } else {
            return false;
          }
        })
      },
      // 终止放款弹框
      handleShopLoan() {
        this.shopDialog = true;
      },
      // 确认终止放款
      handleAgainShopLoan() {
        this.$refs["reasonModels"].validate(valid => {
          if (valid) {
            this.shopLoan();
          } else {
            return false;
          }
        });
      },
      handleDialogClose() {
        this.shopDialog = false;
        this.$refs["reasonModels"].resetFields();
      },
      // 关闭终止放款弹框
      handleCancel() {
        this.shopDialog = false;
        this.$refs["reasonModels"].resetFields();
      },
      //放款
      loanConfirm() {
        const loanDetail = this.$deepcopy(this.loanDetail);
        delete loanDetail.loanAmount
        loanDetail.loanApplyId = this.id;
        api.loanConfirm(loanDetail).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.$message({
              message: "放款成功",
              type: "success"
            });
            window.opener.location.href = window.opener.location.href;
            window.close();
            // this.$router.push({
            //   name: "FinanceLoanReviewPage"
            // });
          } else {
            this.$message({
              message: "放款失败",
              type: "warning"
            });
          }
        });
      },
      // 终止放款- 确认不放款
      shopLoan() {
        const reasonModels = this.$deepcopy(this.reasonModels);
        reasonModels.loanApplyId = this.id;
        api.stopConfirm(reasonModels).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.$message({
              message: "确认成功",
              type: "success",
              showClose: true
            });
            this.$router.push({
              name: "FinanceLoanReviewPage"
            });
          } else {
            this.$message({
              message: "确认失败",
              type: "warning",
              showClose: true
            });
          }
        });
      },

      //放款账户
      getRepayAccount() {
        api.getRepayAccount('LOAN_ACCOUNT').then(response => {
          const res = response.data;
          if (res.code == 200) {
            res.body.forEach(val => {
              val['text'] = val['itemName']
              val['value'] = val['itemValue']
            })
            this.loanOptions = res.body;
          }
        })
      },
      //查询余额
      getAccountAmount(id) {
        api.getAccountAmount(id).then(response => {
          const res = response.data;
          if (res.code == 200) {
            if(res.body){
              this.amount = res.body.availableBalance ? res.body.availableBalance: 0;
            }
          }
        })
      }
    }
  };
</script>

<style scoped>
  .mt40 {
    margin-top: -40px;
  }
</style>

