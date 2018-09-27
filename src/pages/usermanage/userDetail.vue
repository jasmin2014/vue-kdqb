<!--用户详情-->
<template>
  <div class="box">
    <el-row>
      <el-button type="primary" size="small" @click="handlePut">手动提现
      </el-button>
      <!--<el-button type="primary" size="small" @click="handleCard">银行卡代扣-->
      <!--</el-button>-->
      <el-button type="primary" size="small" @click="handleRegister">还款登记
      </el-button>
      <el-button type="info" size="small" @click="handleApply">查看授信申请记录
      </el-button>
      <el-button type="info" size="small" @click="handleAuthInfo">查看认证记录
      </el-button>
    </el-row>
    <el-row class="user-table">
      <el-col :span="8" class="user-table-th">
        <span>登录账号:</span> <span>{{basicDetail.partyResp.cellphone}}</span>
      </el-col>
      <el-col :span="8" class="user-table-th">
        <span>用户姓名:</span> <span>{{basicDetail.partyResp.realName}}</span>
      </el-col>
      <el-col :span="8" class="user-table-th">
        <span>用户性别:</span> <span>{{basicDetail.partyResp.gender}}</span>
      </el-col>

    </el-row>
    <el-row class="user-table">
      <el-col :span="8" class="user-table-th">
        <span>证件号码:</span> <span>{{basicDetail.partyResp.idCard}}</span>
      </el-col>
      <el-col :span="8" class="user-table-th">
        <span>银行卡号码:</span> <span>{{basicDetail.bankCardResp.accNo || '--'}}</span>
        <el-button v-if="basicDetail.bankCardResp.accNo !='' && basicDetail.bankCardResp.accNo != null " type="text"
                   size="small" @click="handleUntieCrad">解绑银行卡
        </el-button>
        <el-button type="text" size="small" @click="handleBankcard">历史绑卡查询
        </el-button>
      </el-col>
      <el-col :span="8" class="user-table-th">
        <span>银行卡所属银行:</span> <span>{{basicDetail.bankCardResp.bankName}}</span>
      </el-col>
    </el-row>
    <el-row class="user-table">
      <el-col :span="8" class="user-table-th">
        <span>资金账户可用余额(元):</span> <span>{{basicDetail.accountResp.availableBalance}}</span>
        <el-button v-if="basicDetail.accountResp.status == 0" type="text" size="small" @click="handleThawAccount">解冻账户
        </el-button>
        <el-button v-if="basicDetail.accountResp.status == 1" type="text" size="small" @click="handleThawAccount">冻结账户
        </el-button>
      </el-col>
      <el-col :span="8" class="user-table-th">
        <span>存管账户待提现金额(元):</span> <span>待定</span>
      </el-col>
      <el-col :span="8" class="user-table-th">
        <span>冻结金额(元):</span> <span>{{basicDetail.accountResp.freezeAmount}}</span>
      </el-col>
    </el-row>
    <!--<el-row class="user-table">-->
    <!--<el-col :span="8" class="user-table-th">-->
    <!--<span>会员卡类型:</span> <span>157000000</span>-->
    <!--</el-col>-->
    <!--<el-col :span="8" class="user-table-th">-->
    <!--<span>会员卡号:</span> <span>王大毛</span>-->
    <!--</el-col>-->
    <!--<el-col :span="8" class="user-table-th">-->
    <!--<span>信用卡信息:</span> <span>157000000</span>-->
    <!--<el-button type="text" size="small" @click="handleCreditcard">绑卡记录-->
    <!--</el-button>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <div class="info">
      <h4>
        <span>还款情况</span>
      </h4>
      <el-row>
        <el-table :data="repayList" border>
          <!--<el-table-column v-for="(col, index) in repayTable" :prop="col.prop" :label="col.label"-->
          <!--:formatter="col.formatter"-->
          <!--:width="col.width"-->
          <!--:key="index" align="center"></el-table-column>-->

          <el-table-column prop="remainAmount" align="center" label="当前应还金额">
          </el-table-column>
          <el-table-column prop="czTotalAmount" align="center" label="已出账金额">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleToCardList(scope.row)">
                {{scope.row.czTotalAmount}}
              </el-button>
              <el-tooltip v-if="scope.row.remainAmount !='0'" content="账户还款">
                <el-button type="primary" size="small" @click="handleAccountRepay(scope.row)">
                  账户还款
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="repayStatus" align="center" label="还款情况"
                           :formatter="(row, col, val) => this.$filter(val, this.$enum.REPAY_SITUATION)"></el-table-column>
          <el-table-column prop="overdueDay" align="center" label="逾期天数"></el-table-column>
          <el-table-column prop="overdueAmount" align="center" label="逾期费"></el-table-column>
          <el-table-column prop="notczTotalAmount" align="center" label="未出账金额">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleToRepayList(scope.row)">
                {{scope.row.notczTotalAmount}}
              </el-button>
              <el-tooltip v-if="scope.row.czTotalAmount == '0'" content="未出账还款">
                <el-button type="primary" size="small" @click="handleNotAccount(scope.row)">
                  未出账还款
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>

    <el-tabs class="mgt20" type="border-card" v-model="activeName">
      <el-tab-pane label="借款记录" name="first" style="overflow: scroll">
        <loan :activeName="'first'"></loan>
      </el-tab-pane>
      <el-tab-pane label="信用卡月账单" name="second" style="overflow: scroll">
        <card :activeName="'second'"></card>
      </el-tab-pane>
      <el-tab-pane label="资金流水" name="three" style="overflow: scroll">
        <fund :activeName="'three'"></fund>
      </el-tab-pane>
      <el-tab-pane label="资金流水-前台" name="four" style="overflow: scroll">
        <fundRtl :activeName="'four'"></fundRtl>
      </el-tab-pane>
    </el-tabs>

    <!--手动提现-->
    <el-dialog title="手动提现" :visible.sync="putDialog" @close="handlePutClose">
      <el-form :model="putModel" label-width="120px" ref="putModel" :rules="putRule">
        <el-row>
          <el-col :span="12">
            <el-form-item label="账户余额">
              <kd-input v-model="putModel.availableBalance" unit="元" disabled auto-complete="off"></kd-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="银行卡账号">
              <kd-input v-model="putModel.card" disabled auto-complete="off"></kd-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="输入提现金额" prop="amount">
              <kd-input v-model="putModel.amount" unit="元" type="number" auto-complete="off"></kd-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-row>-->
        <!--<el-col :span="12">-->
        <!--<el-form-item label="支付通道" prop="psd">-->
        <!--<kd-radio v-model="putModel.psd" auto-complete="off"></kd-radio>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--</el-row>-->
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="handlePutSave">确 认</el-button>
        <!--<el-button @click="handleCancel">取 消</el-button>-->
      </div>
    </el-dialog>
    <!--银行卡代扣-->
    <!--<el-dialog title="银行卡代扣" :visible.sync="cardDialog">-->
    <!--<el-form :model="cardModel" label-width="100px">-->
    <!--<el-row>-->
    <!--<el-col :span="12">-->
    <!--<el-form-item label="现在银行卡">-->
    <!--<el-select v-model="cardModel.mobile" auto-complete="off"></el-select>-->
    <!--<el-button type="text" size="small" @click="handleAddCard">添加银行卡-->
    <!--</el-button>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--<el-row>-->
    <!--<el-col :span="12">-->
    <!--<el-form-item label="代扣金额">-->
    <!--<el-input v-model="cardModel.mobile" auto-complete="off"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--<el-row>-->
    <!--<el-col :span="12">-->
    <!--<el-form-item label="支付通道" prop="psd">-->
    <!--<kd-radio v-model="cardModel.psd" auto-complete="off"></kd-radio>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--</el-form>-->
    <!--<div slot="footer">-->
    <!--<el-button type="primary" @click="handleSave">确 认</el-button>-->
    <!--&lt;!&ndash;<el-button @click="handleCancel">取 消</el-button>&ndash;&gt;-->
    <!--</div>-->
    <!--</el-dialog>-->
    <!--&lt;!&ndash;添加银行卡&ndash;&gt;-->
    <!--<el-dialog title="添加银行卡" :visible.sync="addCarDialog">-->
    <!--<el-form :model="addCradModel" label-width="100px">-->
    <!--<el-row>-->
    <!--<el-col :span="12">-->
    <!--<el-form-item label="身份证号码">-->
    <!--<el-input v-model="addCradModel.mobile" disabled auto-complete="off"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--<el-row>-->
    <!--<el-col :span="12">-->
    <!--<el-form-item label="银行卡号码">-->
    <!--<el-input v-model="addCradModel.mobile" auto-complete="off"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--<el-row>-->
    <!--<el-col :span="12">-->
    <!--<el-form-item label="预留手机号" prop="psd">-->
    <!--<el-input v-model="addCradModel.psd" auto-complete="off"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--</el-form>-->
    <!--<div slot="footer">-->
    <!--<el-button type="primary" @click="handleSave">确 认</el-button>-->
    <!--<el-button @click="handleCancel">取 消</el-button>-->
    <!--</div>-->
    <!--</el-dialog>-->
    <!--还款登记单-->
    <el-dialog title="还款登记单" :visible.sync="registerDialog" @close="handleRegisterClose">
      <el-form :model="registerModel" ref="registerModel" :rules="registerRule" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="线下还款金额" prop="registerAmount">
              <kd-input v-model="registerModel.registerAmount"
                        type="number"
                        unit="元"></kd-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button type="primary" @click="handleRegisterSave">确 认</el-button>
        </el-row>
        <div class="info mgt20">
          <h4><span>该用户当前未确认到账的还款登记:</span></h4>
        </div>
        <el-row>
          <el-table :data="registerList" border>
            <el-table-column v-for="(col, index) in registerTable" :prop="col.prop" :label="col.label"
                             :formatter="col.formatter"
                             :width="col.width"
                             :key="index" align="center"></el-table-column>
          </el-table>
        </el-row>
      </el-form>
    </el-dialog>
    <!--授权及申请记录-->
    <el-dialog title="授权及申请记录" :visible.sync="applyDialog">
      <el-row>
        <el-table :data="applyList" border>
          <el-table-column v-for="(col, index) in applyTable" :prop="col.prop" :label="col.label"
                           :formatter="col.formatter"
                           :width="col.width"
                           :key="index" align="center"></el-table-column>
        </el-table>
      </el-row>
    </el-dialog>
    <!--账户还款-->
    <el-dialog :title="repayTitle" :visible.sync="accountRepayDialog" @close="handleRepayClose">
      <el-form :model="accountRepayModel" ref="accountRepayModel" :rules="accountRepayRule" label-width="100px">
        <el-row v-if="repayTypeFlag !='YES'">
          <el-col :span="12">
            <el-form-item label="还款类型">
              <kd-radio v-model="accountRepayModel.repayType"
                        :options="options"
                        auto-complete="off"
                        @change="changeRepayType"></kd-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="当前应还余额">
              <kd-input v-model="accountRepayModel.nowAmount" disabled unit="元" auto-complete="off"></kd-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="账户余额">
              <kd-input v-model="accountRepayModel.notczTotalAmount" unit="元" disabled auto-complete="off"></kd-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="还款金额" prop="amount">
              <kd-input v-model="accountRepayModel.amount"
                        :disabled="!repayAmountFlag"
                        unit="元"
                        auto-complete="off"
                        type="number"></kd-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="handleAccountRepaySave">确 认</el-button>
        <!--<el-button @click="handleCancel">取 消</el-button>-->
      </div>
    </el-dialog>

    <!--信用卡记录-->
    <el-dialog title="信用卡信息" :visible.sync="cardRecordDialog">
      <el-row>
        <el-table :data="list" border>
          <el-table-column v-for="(col, index) in cardRecordTable" :prop="col.prop" :label="col.label"
                           :formatter="col.formatter"
                           :width="col.width"
                           :key="index" align="center"></el-table-column>
        </el-table>
      </el-row>
      <div class="info">
        <h4><span>绑卡记录</span></h4>
        <el-row>
          <el-table :data="list" border class="table-center">
            <el-table-column label="银行名称" prop="paymentNo"></el-table-column>
            <el-table-column label="银行卡号" prop="paymentNo"></el-table-column>
            <el-table-column label="操作" prop="paymentNo">

            </el-table-column>
            <el-table-column label="操作时间" prop="paymentNo"></el-table-column>
          </el-table>
        </el-row>
      </div>
    </el-dialog>

    <!--绑卡记录/历史绑卡记录-->
    <el-dialog title="绑卡记录" :visible.sync="tieCardDialog">
      <el-row>
        <el-table :data="tieCardList" border>
          <el-table-column v-for="(col, index) in tieCardTable" :prop="col.prop" :label="col.label"
                           :formatter="col.formatter"
                           :width="col.width"
                           :key="index" align="center"></el-table-column>
        </el-table>
      </el-row>
      <el-row type="flex" justify="center" class="mgt20">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="tieCardModel.pageNum"
          :page-size="tieCardModel.pageCount"
          layout="sizes,total, prev, pager, next, jumper"
          :total="pageTotal">
        </el-pagination>
      </el-row>
    </el-dialog>
    <!--解绑银行卡-->
    <el-dialog title="解绑银行卡" :visible.sync="unbindCardDialog">
      <el-form :model="unbindCardModel" label-width="100px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="" prop="isDeleteAuth">
              <kd-radio style="line-height: 35px"
                        v-model="unbindCardModel.isDeleteAuth"
                        :options="unbindCardOptions"
                        @change="changeUnbindCard"></kd-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="handleUnbindCardSave">确 认</el-button>
        <!--<el-button @click="handleCancel">取 消</el-button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as api from "../../api/user.js";
  import loan from './tabList/loanList.vue'
  import card from './tabList/cardList.vue'
  import fund from './tabList/fundList.vue'
  import fundRtl from './tabList/fundReceptionList.vue'

  export default {
    name: "UserDetailPage",
    components: {loan, card, fund, fundRtl},
    data() {
      const BOOLEAN_OPTIONS = [
        {
          text: "解绑银行卡及预留手机号",
          value: '0'
        },
        {
          text: "解绑银行卡,预留手机号及实名信息",
          value: '1'
        }
      ];
      const putNumberRule = (rule, value, callback) => {
        if (value > this.putModel.availableBalance) {
          callback('输入金额不能大于账户余额!')
        } else if (this.$valid.floatValidator(value, 2) == false) {
          callback('保留2位小数!')
        } else if (value <= 0) {
          callback('请输入大于0的金额!')
        } else {
          callback()
        }
      };
      const repayNumberRule = (rule, value, callback) => {
        if (this.$valid.floatValidator(value, 2) == false) {
          callback('保留2位小数')
        } else if (value > this.accountRepayModel.nowAmount) {
          callback('还款金额不能大于当前还款余额!')
        } else if (value > this.accountRepayModel.notczTotalAmount) {
          callback('还款金额不能大于账户余额!')
        } else if (value <= 0) {
          callback('请输入大于0的金额!')
        } else {
          callback();
        }
      };
      return {
        id: this.$route.params.id,
        basicDetail: {
          partyResp: {
            gender: '',
            cellphone: ''
          },  //基本信息
          accountResp: {},
          bankCardResp: {
            bankCardId: ''
          }
        },  //账户基本信息
        putDialog: false, //手动提现
        putModel: {
          availableBalance: "",
          amount: '',
        },
        putRule: {
          amount: [
            {required: true, message: "请输入提现金额!", trigger: 'blur'},
            {validator: putNumberRule, trigger: 'blur'}
          ]
        },
        repayTitle: '',  //还款情况
        repayList: [],
        repayTable: [
          {
            label: '当前应还金额',
            prop: 'remainAmount'
          },
          {
            label: '已出账金额',
            prop: 'czTotalAmount'
          },
          {
            label: '还款情况',
            prop: 'repayStatus',
            formatter: (row, col, val) => this.$filter(val, this.$enum.REPAY_SITUATION)
          },
          {
            label: '逾期天数',
            prop: 'overdueDay'
          },
          {
            label: '逾期费',
            prop: 'overdueAmount'
          },
          {
            label: '未出账金额',
            prop: 'notczTotalAmount'
          }
        ],
        repayTypeFlag: '',// 还款类型
        repayAmountFlag: false, //还款金额
        accountRepayDialog: false, //账户还款
        accountRepayModel: {
          nowAmount: '',
          repayType: "",
          amount: "",
          notczTotalAmount: ""
        },
        accountRepayRow: {},
        accountRepayRule: {
          amount: [
            {required: true, message: "请输入还款金额!", trigger: 'blur'},
            {validator: repayNumberRule, trigger: 'blur'}
          ]
        },
        tieCardDialog: false,   //历史绑卡,绑卡记录
        tieCardModel: {
          partyId: this.$route.params.id,
          pageNum: 1,
          pageCount: 10,
        },
        pageTotal: 0,
        tieCardList: [],
        tieCardTable: [
          {
            label: '银行名称',
            prop: 'bankName'
          },
          {
            label: '银行卡号',
            prop: 'accNo'
          },
          {
            label: '操作',
            prop: 'operateTypeName'
          },
          {
            label: '操作时间',
            prop: 'createdTime'
          }
        ],
        unbindCardModel: {
          isDeleteAuth: ''
        },   //解绑银行卡
        unbindCardDialog: false,
        unbindCardOptions: BOOLEAN_OPTIONS,
        applyDialog: false,  //授信申请记录
        applyTable: [
          {
            label: '编号',
            prop: 'channelCode'
          },
          {
            label: '渠道名称',
            prop: 'channelName'
          },
          {
            label: '总授信额度',
            prop: 'totalAmount'
          },
          {
            label: '可用授信额度',
            prop: 'availableCredit'
          },
          {
            label: '申请日期',
            prop: 'applicationTime'
          },
          {
            label: '额度有效期',
            prop: 'validityDateEnd',
            formatter: (row, col, val) => val == null || row.validityDateStart == null ? '--' : row.validityDateStart - val
          },
          {
            label: '类型',
            prop: 'creditType',
            formatter: (row, col, val) => this.$filter(val, this.$enum.CREDIT_TYPE)
          },
          {
            label: '状态',
            prop: 'status',
            formatter: (row, col, val) => this.$filter(val, this.$enum.APPLICATION_STATUS)
          }
        ],
        applyList: [],
        registerDialog: false, //还款登记
        registerModel: {
          registerAmount: ''
        },
        registerList: [],
        registerTable: [
          {
            label: '登记时间',
            prop: 'registerRepayTime'
          },
          {
            label: '线下还款金额',
            prop: 'registerAmount'
          },
          {
            label: '发起人',
            prop: 'submitter'
          }],
        registerRule: {
          registerAmount: [
            {required: true, message: "请输入线下还款金额!", trigger: 'blur'},
            // {validator: putNumberRule, trigger: 'blur'}
          ]
        },
        options: [{value: 5, text: '提前还款'}, {value: 6, text: '提前结清'}],

        //银行卡和代扣功能待定
        cardDialog: false, //银行卡代扣
        cardModel: {},
        addCarDialog: false, //添加银行卡
        addCradModel: {},
        cardRecordDialog: false,  //绑卡记录
        activeName: 'first',
        list: [],
        cardRecordTable: [
          {
            label: '姓名',
            prop: 'mobile'
          },
          {
            label: '信用卡所属银行',
            prop: 'mobile'
          },
          {
            label: '信用卡卡号',
            prop: 'mobile'
          },
          {
            label: '绑卡时间',
            prop: 'mobile'
          },
        ],
      };
    },
    created() {
      this.getUserBasicDetail();
      this.getRepayment();
    },
    methods: {
      //手动提现
      handlePut() {
        this.putDialog = true;
        this.putModel.availableBalance = this.basicDetail.accountResp.availableBalance;
        this.putModel.card = this.basicDetail.bankCardResp.accNo;
      },
      handlePutSave() {
        this.$refs.putModel.validate((val) => {
          if (val) {
            this.accountPut();
          } else {
            return false;
          }
        })
      },
      handlePutClose() {
        this.putDialog = false;
        this.$refs.putModel.resetFields();
      },
      // //银行卡代扣
      // handleCard() {
      //   this.cardDialog = true;
      // },
      // //添加银行卡
      // handleAddCard() {
      //   this.cardDialog = false;
      //   this.addCarDialog = true;
      // },
      //查看还款登记
      handleRegister() {
        this.getRepayResList();
        this.registerDialog = true;
      },
      handleRegisterSave() {
        this.$refs.registerModel.validate((val) => {
          if (val) {
            this.repayRes();
          } else {
            return false;
          }
        })

      },
      handleRegisterClose() {
        this.registerDialog = false;
        this.$refs.registerModel.resetFields();
      },
      //查看授信申请记录
      handleApply() {
        this.applyDialog = true;
        this.getAuditList();
      },
      //查看认证记录
      handleAuthInfo() {
        this.$router.push({
          name: "UserAuthInfo",
          params: {id: this.id}
        });
      },
      //解冻账户
      handleThawAccount() {
        this.$confirm(`您确定${this.basicDetail.accountResp.status == 0 ? '解冻' : '冻结'}账户吗?`, '提示', {
          type: 'warning'
        }).then(() => {
          this.accountFreeze(this.basicDetail.accountResp.status == 0 ? '1' : '0');
        })
      },
      handleSave() {
      },
      handleCancel() {
      },
      //解绑银行卡
      handleUntieCrad() {
        this.unbindCardDialog = true;
      },
      changeUnbindCard(val) {
        this.unbindCardModel.isDeleteAuth = val;
      },
      handleUnbindCardSave() {
        this.unbindCard();
      },
      //历史绑卡记录
      handleBankcard() {
        this.tieCardDialog = true;
        this.getBindCardList(this.tieCardModel.pageCount, this.tieCardModel.pageNum);
      },
      handleCurrentChange(val) {
        this.tieCardModel.pageNum = val;
        this.getBindCardList(this.tieCardModel.pageCount, val);
      },
      handleSizeChange(val) {
        this.tieCardModel.pageCount = val;
        this.getBindCardList(val, this.tieCardModel.pageNum);
      },
      //信用卡绑卡记录
      handleCreditcard() {
        this.cardRecordDialog = true;
      },
      //已出账金额操作
      handleToCardList(row) {
        //到还款管理查询已出账列表
        const {href} = this.$router.resolve({
          name: "FinanceRefundsPage",
          query: {
            phone: this.basicDetail.partyResp.cellphone,
            status: 'true'  //已出账状态
          }
        });
        window.open(href, "_blank");
      },
      //未出账金额跳转
      handleToRepayList(row) {
        //到还款管理查询当前手机号未出账列表
        const {href} = this.$router.resolve({
          name: "FinanceRefundsPage",
          query: {
            phone: this.basicDetail.partyResp.cellphone,
            status: 'false'  //未出账状态
          }
        });
        window.open(href, "_blank");
      },
      //账户还款
      handleAccountRepay(row) {
        this.repayTitle = '账户还款';
        this.accountRepayDialog = true;
        this.repayAmountFlag = true;
        this.repayTypeFlag = 'YES';
        this.accountRepayModel.repayType = 4;
        this.accountRepayModel.nowAmount = row.remainAmount;
        this.accountRepayModel.notczTotalAmount = this.basicDetail.accountResp.availableBalance;
      },
      //未出账还款
      handleNotAccount(row) {
        this.accountRepayRow = row;
        this.accountRepayDialog = true;
        this.repayAmountFlag = true;
        this.repayTypeFlag = 'NOT';
        this.repayTitle = '未出账还款';
        this.accountRepayModel.repayType = 5;
        this.accountRepayModel.nowAmount = row.notczTotalAmount;
        this.accountRepayModel.notczTotalAmount = this.basicDetail.accountResp.availableBalance;
      },
      changeRepayType(val) {
        if (val == 5) {
          this.repayAmountFlag = true;
          this.accountRepayModel.amount = '';
        } else if (val == 6) {
          this.repayAmountFlag = false;
          this.accountRepayModel.repayType = 6;
          this.accountRepayModel.amount = this.accountRepayRow.notczTotalAmount;
        }
      },
      handleRepayClose() {
        this.accountRepayDialog = false;
        this.$refs.accountRepayModel.resetFields();
      },
      //还款
      handleAccountRepaySave() {
        this.$refs.accountRepayModel.validate((val) => {
          if (val) {
            this.accountRepay();
          } else {
            return false;
          }
        })
      },

      //用户基本信息
      getUserBasicDetail() {
        api.getUserBasicDetail(this.id).then(response => {
          if (response.status == 200) {
            if (response.data) {
              if (response.data.partyResp) {
                this.basicDetail.partyResp = response.data.partyResp;
                this.basicDetail.partyResp.gender = this.$filter(response.data.partyResp.gender, this.$enum.SEX);
              } else {
                this.basicDetail.partyResp = '';
              }
              if (response.data.accountResp) {
                this.basicDetail.accountResp = response.data.accountResp;
              } else {
                this.basicDetail.accountResp = '';
              }
              if (response.data.bankCardResp) {
                this.basicDetail.bankCardResp = response.data.bankCardResp;
              } else {
                this.basicDetail.bankCardResp = '';
              }
            }
          }
        })
      },
      //解冻-冻结账户
      accountFreeze(status) {
        api.accountFreeze(this.id, status).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: '成功!'
            })
            this.getUserBasicDetail();
          }
        })
      },

      //还款情况
      getRepayment() {
        api.getRepayment(this.id).then(response => {
          const res = response.data;
          if (res.code == 200) {
            if (res.body) {
              this.repayList = [];
              this.repayList.push(res.body);
            }
          }
        })
      },
      //账户还款
      accountRepay() {
        const accountRepay = this.$deepcopy(this.accountRepayModel);
        accountRepay.partyId = this.id;
        api.accountRepay(accountRepay).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.accountRepayDialog = false;
            this.$message({
              type: 'success',
              message: '还款成功!'
            });
            this.getRepayment();
          }
        });
      },

      //手动提现
      accountPut() {
        const putModel = this.$deepcopy(this.putModel);
        putModel.partyId = this.id;
        api.accountPut(putModel).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.putDialog = false;
            this.$message({
              type: 'success',
              message: '提现申请成功!'
            })
            this.getUserBasicDetail();
          } else {
            this.$message({
              type: 'success',
              message: res.message
            })
          }
        }, () => {
          this.getUserBasicDetail();
        })
      },

      //绑卡记录
      getBindCardList(pageSize, pageNum) {
        const tieCardModel = this.$deepcopy(this.tieCardModel);
        tieCardModel.pageNum = pageNum;
        tieCardModel.pageCount = pageSize;
        api.getBindCardList(tieCardModel).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.tieCardList = res.body.content;
            this.pageTotal = res.body.total;
          }
        })
      },

      //解绑银行卡
      unbindCard() {
        const unbindCard = this.$deepcopy(this.unbindCardModel)
        unbindCard.partyId = this.id;
        unbindCard.zjBankCardId = this.basicDetail.bankCardResp.bankCardId;
        api.unbindCard(unbindCard).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.unbindCardDialog = false;
            this.$message({
              type: 'success',
              message: '解绑成功!'
            })
            this.getUserBasicDetail();
          }
        })
      },

      //授信记录
      getAuditList() {
        api.getAuditList(this.id).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.applyList = res.body;
          }
        })
      },

      //还款登记列表
      getRepayResList() {
        api.getRepayResList(this.id).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.registerList = res.body;
          }
        })
      },
      //还款登记
      repayRes() {
        const registerModel = this.$deepcopy(this.registerModel);
        registerModel.partyId = this.id;
        api.repayRes(registerModel).then(response => {
          const res = response.data;
          if (res.code == 200) {
            this.getRepayResList();
            this.$message({
              type: 'success',
              message: '登记成功!'
            })
            this.registerDialog = false;
          }
        })
      },
    }
  };
</script>
<style lang="scss" scoped>
  .user-table {
    border: 1px solid #ebeef5;
    line-height: 38px;
    margin-top: 5px;
    color: #909399;
    padding: 8px 0;

    .user-table-th {
      padding-left: 15px;
    }

  }
</style>
