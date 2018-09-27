<!--授信详情-底部-->
<template>
  <div class="nuclear-ecording margin-top20">    
    <el-row>
      <h3><span>审核记录</span></h3>
      <el-table :data="auditRecords" border style="width: 100%" align="center">
        <el-table-column prop="step" label="节点名称" align="center" :formatter="(row,col,val) => this.$filter(val,this.$enum.REVIEW_STATUS)"></el-table-column>
        <el-table-column prop="auditStaffNo" label="审批人" align="center"></el-table-column>
        <el-table-column prop="reason" label="审核备注" align="center"></el-table-column>
        <el-table-column prop="auditResult" label="审核结果" align="center" :formatter="(row,col,val) => this.$filter(val,this.$enum.AUDIT_RESULT_TYPE)"></el-table-column>
        <el-table-column prop="createdTime" label="审批时间" align="center"></el-table-column>
      </el-table>
    </el-row>

    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="6">
        <h3><span>电核记录</span></h3>
      </el-col>
      <el-col :span="6" align="right" v-if="type">
        <el-button type="primary" class="margin-top10" size="small" @click="handleAddExamine">添加电核记录</el-button>
      </el-col>
    </el-row>
    <el-table :data="examineList" border style="width: 100%">
      <el-table-column prop="contact" label="联系人" align="center" :formatter="(row, col, val) => (this.$filter(val, this.$enum.CONTACT_TYPE))"></el-table-column>
      <el-table-column prop="relationship" label="关系" align="center"
                       :formatter="(row, col, val) => (this.$filter(val, this.$enum.CONTACT_RELATIONSHIP))"></el-table-column>
      <el-table-column prop="knowLoan" label="是否知悉贷款" align="center"
                       :formatter="(row, col, val) => (val?'是':'否')"></el-table-column>
      <el-table-column prop="contactMobile" label="联系人电话" align="center"></el-table-column>
      <el-table-column prop="status" label="电核状态" align="center"
                       :formatter="(row, col, val) => ($filter(val, $enum.ELECTRIC_STATE))"></el-table-column>
      <el-table-column prop="record" label="审核备注" align="center">
        <template slot-scope="scope">
          <el-tooltip content="查看审核备注">
            <el-button size="small" icon="el-icon-view" @click="handleSeeRecord(scope.row)">
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>    
      <el-table-column prop="realName" label="操作人" align="center"></el-table-column>  
      <el-table-column prop="createdTime" label="添加时间" align="center"></el-table-column>      
    </el-table>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-size="pageSize"
        layout="sizes, total, prev, pager, next, jumper"
        :total="elecTotal">
      </el-pagination>
    </el-row>   

    <el-card class="margin-top20" v-if="type">
      
        <h3><span>审批信息</span></h3>

        <div class="verify-buttons">
          <el-button type="success" size="small" plain
                     :class="{'is-active': verifyType === 'success'}"
                     @click="handlePass">审核通过
          </el-button>
          <el-button type="danger" size="small" plain
                     :class="{'is-active': verifyType === 'danger'}"
                     @click="handleNotPass">审核不通过
          </el-button>
        </div>
        <div class="verify-main">
          <div v-if="verifyType === 'success'">
            <el-form :model="creditApplyInfo" ref="creditApplyInfo" :rules="creditRules" label-width="150px">
              <el-row>         
                <el-col :span="8">
                  <el-form-item label="实际授信额度" prop="actCreditLimit">
                    <kd-input v-model="creditApplyInfo.actCreditLimit"
                              type="number"
                              unit="元"
                              :mode="mode"></kd-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="有效期" prop="validityDate">
                    <kd-date-picker v-model="validityDate" type="daterange" clearable>
                    </kd-date-picker>
                  </el-form-item>               
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="添加用户标签：">
                    <el-row>
                      <el-col :span="8">
                          <kd-select v-model="creditApplyInfo.riskKind" :options="FirstUserLabelList" @change="handleChooseFirstLabel"></kd-select>                      
                      </el-col>
                      <el-col :span="8" :offset="1">
                          <kd-select v-model="creditApplyInfo.riskTag" :options="SecondUserLabelList" @kv-change="handleChooseRiskTag"></kd-select>
                      </el-col>
                    </el-row> 
                  </el-form-item>                
                </el-col>               
              </el-row>                       
              <el-row>         
                <el-col :span="18">
                  <el-form-item label="审核意见：" prop="reason">
                    <el-input type="textarea" v-model.trim="creditApplyInfo.reason" :rows="5"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>   
            </el-form>         
          </div>
          <div class="verify-fail" v-else-if="verifyType === 'danger'">
            <el-form :model="rejectPassValues" ref="rejectPassValues" :rules="rejectPassRules" label-width="150px">
              <el-row>
                <el-col :span="10">
                  <el-form-item label="添加用户标签：" align="left" prop="userLabel">
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label="" label-width="0" prop="riskKind">
                          <kd-select v-model="rejectPassValues.riskKind" :options="userRejuectLabels1" @change="handleChooseRejectLabel"></kd-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8" :offset="1">
                        <el-form-item label="" label-width="0" prop="riskTag">
                        <kd-select v-model="rejectPassValues.riskTag" :options="userRejuectLabels2"></kd-select>
                        </el-form-item>
                      </el-col>
                    </el-row> 
                  </el-form-item>                
                </el-col>               
              </el-row>             
              <el-row class="verify-fail-title">
                <el-col :span="4">欺诈类</el-col>
                <el-col :span="4">信用不良</el-col>
                <el-col :span="4">负面信息</el-col>
                <el-col :span="4">政策不符</el-col>
                <el-col :span="4">综合评分不足</el-col>
                <el-col :span="4">其它异常</el-col>
              </el-row>
              <el-form-item label="" label-width="0" prop="auditMessage">
                <el-checkbox-group v-model="rejectPassValues.auditMessage">
                  <el-row class="verify-fail-items">
                    <el-col :span="4">
                      <el-checkbox v-for="item in dataSource.one"
                                  :label="item.label"
                                  :key="item.Label"
                                  :value="item.val"></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                      <el-checkbox v-for="item in dataSource.two"
                                  :label="item.label"
                                  :key="item.Label"
                                  :value="item.val"></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                      <el-checkbox v-for="item in dataSource.three"
                                  :label="item.label"
                                  :key="item.Label"
                                  :value="item.val"></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                      <el-checkbox v-for="item in dataSource.four"
                                  :label="item.label"
                                  :key="item.Label"
                                  :value="item.val"></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                      <el-checkbox v-for="item in dataSource.five"
                                  :label="item.label"
                                  :key="item.Label"
                                  :value="item.val"></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                      <el-checkbox v-for="item in dataSource.six"
                                  :label="item.label"
                                  :key="item.Label"
                                  :value="item.val"></el-checkbox>
                      <el-row>
                        <el-col :span="8">
                          <kd-input v-model="rejectPassValues.refusalDays"></kd-input>
                        </el-col>
                        <el-col :span="14" class="custom-delayDay">天后可再次申请</el-col>
                      </el-row>
                      
                    </el-col>
                  </el-row>
                </el-checkbox-group>
              </el-form-item>
              <div class="verify-reason">
                <el-form-item label="审核意见：" prop="reason">
                  <el-input type="textarea" v-model.trim="rejectPassValues.reason" :rows="5"></el-input>
                </el-form-item>
              </div>
            </el-form>
          </div>        
        </div> 
        <el-row>
          <el-button type="primary" class="margin-top20"
                     size="small" @click="handleCreditSave">提交
          </el-button>
          <el-button type="warning" class="margin-top20"
                     size="small" @click="handleExit">退签
          </el-button>
        </el-row>
    </el-card>  
    <el-dialog title="添加电核信息" :visible.sync="dialogFormVisible" @close="handleClose">
      <el-form :model="examineValue" ref="examineValue" :rules="rules" class="flex" label-width="120px">
        <el-form-item label="联系人" prop="contact">         
          <el-radio-group v-model="examineValue.contact">
            <el-radio v-for="(item,index) in contactArray" :label="item.text" :key="index"></el-radio>
          </el-radio-group>          
        </el-form-item>
        <el-form-item label="关系" prop="relationship">
          <kd-select v-model="examineValue.relationship"
                     :group="this.$enum.CONTACT_RELATIONSHIP"
                     :disabled="flag"></kd-select> 
        </el-form-item>
        <el-form-item label="联系人电话" prop="contactMobile">
          <kd-input v-model="examineValue.contactMobile"
                    :disabled="flag"></kd-input>
        </el-form-item>
        <el-form-item label="是否知悉贷款" prop="isKnowLoan">
          <el-radio-group v-model="examineValue.isKnowLoan">
            <el-radio v-for="(item,index) in konwLoanArray" :label="item.text" :key="index"></el-radio>
          </el-radio-group>          
        </el-form-item>
        <el-form-item label="核实记录" prop="record">
          <el-input
            type="textarea"
            :rows="4"
            v-model="examineValue.record"
            :disabled="flag">
          </el-input>
        </el-form-item>
        <el-form-item label="电核状态" prop="status">
          <el-radio-group v-model="examineValue.status">
            <el-radio v-for="(item,index) in statusArray" :label="item.text" :key="index"></el-radio>
          </el-radio-group>          
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="flag !=true" type="primary" @click="handleAddExamineOk">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>


</template>

<script>
import * as api from "../../../api/risk";
import { getSysEnum } from "../../../api/common";

const DATA = {
  one: [
    { label: "非本人申请", val: 1 },
    { label: "中介代办", val: 2 },
    { label: "单位信息不真实", val: 3 },
    { label: "金融机构黑名单", val: 4 }
  ],
  two: [
    { label: "三方机构还款不良", val: 1 },
    { label: "反欺诈客户信息记录不良", val: 2 },
    { label: "命中催收电话", val: 3 },
    { label: "我司贷款还款不良", val: 4 },
    { label: "芝麻逾期", val: 5 }
  ],
  three: [
    { label: "提供信息不符合逻辑", val: 1 },
    { label: "联系人信息虚假", val: 2 },
    { label: "企业负面信息", val: 3 },
    { label: "客户有负面信息", val: 4 },
    { label: "联系人有负面信息", val: 5 },
    { label: "系统匹配关联的负面信息", val: 6 },
    { label: "第三方负面信息", val: 7 }
  ],
  four: [
    { label: "偿债能力不足", val: 1 },
    { label: "系统建议拒绝", val: 2 },
    { label: "公积金缴存不符合要求", val: 3 },
    { label: "区域不符", val: 4 },
    { label: "行业限制", val: 5 },
    { label: "非目标客户", val: 6 }
  ],
  five: [
    { label: "稳定性较差", val: 1 },
    { label: "收入较低", val: 2 },
    { label: "同行授信较差", val: 3 },
    { label: "还款记录较差", val: 4 },
    { label: "涉及银行及贷款较多", val: 5 },
    { label: "负债率高", val: 6 },
    { label: "催收困难", val: 7 }
  ],
  six: [{ label: "其它异常", val: 1 }]
};

export default {
  props: {
    mode: String,
    tag: Boolean,
    defaultAmount: Number
  },
  data() {
    const inviteCodeRule = (rule, value, callback) => {
      this.$valid.inviteCodeRule(rule, value, callback, 500);
    };
    // const validateAmount = (rule, value, callback) => {
    //   if (value <= 0) {
    //     callback("输入数字不能小于0!");
    //   } else {
    //     callback();
    //   }
    // };

    const validateLimitDate = (rule, value, callback) => {
      if (this.creditApplyInfo.validityDateStart === "") {
        callback("请选择有效开始日期!");
      } else if (this.creditApplyInfo.validityDateEnd === "") {
        callback("请选择有效结束日期!");
      } else {
        callback();
      }
    };

    const validateUserLabel = (rule, value, callback) => {
      if (!this.rejectPassValues.riskKind) {
        callback("请选择用户标签类型!");
      } else if (!this.rejectPassValues.riskTag) {
        callback("请选择用户标签!");
      } else {
        callback();
      }
    };

    return {
      FirstUserLabelList: [],
      SecondUserLabelList: [],
      userRejuectLabels1: [],
      userRejuectLabels2: [],
      type: this.tag,
      failCheckList: [], //授信拒绝原因
      dataSource: DATA,
      verifyType: "success",
      flag: false,
      loanTag: "1",
      id: "",
      list: [],
      applicationId: this.$route.params.id,
      examineList: [], //电核列表
      elecTotal: 0, //电核记录总数,
      pageSize: 10,
      pageNum: 1,
      creditApplyInfo: {
        actCreditLimit: this.defaultAmount ? this.defaultAmount : 0,
        validityDateStart: this.$dateFilter(new Date()),
        validityDateEnd: this.$dateFilter(
          new Date().getTime() + 3600 * 1000 * 24 * 365
        ),
        riskKind: "",
        riskTag: "",
        reason: ""
      }, //授信申请信息
      contactArray: [],
      konwLoanArray: [],
      statusArray: [],
      examineValue: {
        contact: "",
        relationship: "",
        contactMobile: "",
        knowLoan: "",
        isKnowLoan: "",
        record: "",
        status: ""
      },
      auditRecords: [], //审核记录
      dialogFormVisible: false,
      rejectPassValues: {
        riskKind: "",
        riskTag: "",
        refusalDays: 30,
        reason: "",
        auditMessage: []
      },
      loanMsg: "", //借款审核描述
      rules: {
        contact: [
          { required: true, message: "请选择联系人!", trigger: "change" }
        ],
        relationship: [
          { required: true, message: "请选择关系!", trigger: "change" }
        ],
        contactMobile: [
          { required: true, message: "请输入联系人电话!", trigger: "blur" },
          {
            pattern: /^((13[0-9])|(14[5-9])|(15[0-3,5-9])|(17[0-8])|(18[0-9])|19[8,9])\d{8}$/,
            message: "请输入正确的号码",
            trigger: "blur"
          }
        ],
        isKnowLoan: [
          { required: true, message: "请选择是否知悉贷款!", trigger: "change" }
        ],
        record: [
          {
            required: true,
            min: 1,
            max: 500,
            message: "请输入核实记录!",
            trigger: "blur"
          },
          {
            validator: inviteCodeRule,
            trigger: "blur"
          }
        ],
        status: [
          { required: true, message: "请选择电核状态!", trigger: "change" }
        ]
      },
      creditRules: {
        actCreditLimit: [
          {
            required: true,
            type: "number",
            message: "请输入实际授信额度!",
            trigger: "blur"
          },
          {
            pattern: this.$valid.RegInt,
            message: "请输入大于0的数字",
            trigger: "blur"
          }
        ],
        validityDate: [
          {
            validator: validateLimitDate,
            required: true,
            message: "请选择有效期!",
            trigger: "change"
          }
        ],
        reason: [
          {
            min: 1,
            max: 500,
            message: "请输入审核意见!",
            trigger: "blur"
          },
          {
            validator: inviteCodeRule,
            trigger: "blur"
          }
        ]
      },
      rejectPassRules: {
        userLabel: [
          {
            validator: validateUserLabel,
            required: true,
            message: "请选择用户标签!",
            trigger: "change"
          }
        ],
        riskKind: [
          { required: true, message: "请选择用户标签类型!", trigger: "change" }
        ],
        riskTag: [
          { required: true, message: "请选择用户标签!", trigger: "change" }
        ],
        auditMessage: [
          {
            type: "array",
            required: true,
            min: 1,
            message: "请勾选不通过原因!",
            trigger: "change"
          }
        ],
        reason: [
          {
            required: true,
            min: 1,
            max: 500,
            message: "请输入审核意见!",
            trigger: "blur"
          },
          {
            validator: inviteCodeRule,
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    validityDate: {
      get() {
        if (
          this.creditApplyInfo.validityDateStart ||
          this.creditApplyInfo.validityDateEnd
        ) {
          const range = [];
          range[0] = this.creditApplyInfo.validityDateStart;
          range[1] = this.creditApplyInfo.validityDateEnd;
          return range;
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.creditApplyInfo.validityDateStart = range[0];
          this.creditApplyInfo.validityDateEnd = range[1];
        } else {
          this.creditApplyInfo.validityDateStart = "";
          this.creditApplyInfo.validityDateEnd = "";
        }
      }
    }
  },
  watch: {
    defaultAmount: function(val, oldVal) {
      this.creditApplyInfo.actCreditLimit = val;
    }
  },
  created() {
    this.getDetailAuditList();
    this.getDetailElecticalRecords(1, this.pageSize);
    this.getDetailRiskLable();
    this.creditApplyInfo.actCreditLimit = this.defaultAmount
      ? this.defaultAmount
      : 0;
    this.getOptions(this.$enum.CONTACT_TYPE);
    this.getOptions(this.$enum.KNOWLEDGE_TYPE);
    this.getOptions(this.$enum.ELECTRIC_STATE);
  },
  methods: {
    getOptions(group) {
      let _curOpts = [];
      const enums = this.$store.state.enums;
      if (enums && enums[`${group}`]) {
        _curOpts = enums[`${group}`];
        if (group === this.$enum.CONTACT_TYPE) {
          this.contactArray = _curOpts;
        } else if (group === this.$enum.KNOWLEDGE_TYPE) {
          this.konwLoanArray = _curOpts;
        } else if (group === this.$enum.ELECTRIC_STATE) {
          this.statusArray = _curOpts;
        }
        return;
      }
      getSysEnum(group).then(
        response => {
          const res = response.data;
          if (res.code == 200 && res.body) {
            _curOpts = res.body.map(_ => ({
              text: _.itemName,
              value: _.itemValue
            }));
            if (group === this.$enum.CONTACT_TYPE) {
              this.contactArray = _curOpts;
            } else if (group === this.$enum.KNOWLEDGE_TYPE) {
              this.konwLoanArray = _curOpts;
            } else if (group === this.$enum.ELECTRIC_STATE) {
              this.statusArray = _curOpts;
            }
          }
        },
        () => {}
      );
    },
    //==审核记录信息获取==
    getDetailAuditList() {
      api.getDetailAuditList(this.applicationId).then(response => {
        let res = response.data;
        if (res.code == 200 && res.body) {
          this.auditRecords = res.body;
        }
      });
    },
    //==电核记录列表中-查看审核备注操作==
    handleSeeRecord(row) {
      this.$alert(row.record, "提示", {
        confirmButtonText: "确定"
      });
    },
    //切换每页显示条数触发
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDetailElecticalRecords(this.pageNum, val);
    },
    //点击分页序号时触发
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getDetailElecticalRecords(val, this.pageSize);
    },
    //==电核记录分页信息获取==
    getDetailElecticalRecords(pageNumber, pageSize) {
      let _params = { pageNum: pageNumber, pageSize: pageSize };
      api
        .getDetailElecticalRecords(this.applicationId, _params)
        .then(response => {
          let res = response.data;
          if (res.code == 200 && res.body.content) {
            this.examineList = res.body.content;
            this.elecTotal = res.body.total;
          }
        });
    },
    //==点击添加电核记录按钮操作==
    handleAddExamine(val) {
      this.flag = false;
      this.dialogFormVisible = true;
    },
    //==添加电核信息-电核状态将选中的值赋值给对应的参数==
    handleChange(val) {
      this.examineValue.status = val;
    },
    //==选择联系人类型时赋值到对应参数==
    handleChangeContact(val) {
      this.examineValue.contact = val;
    },
    //==选中是否知悉贷款时将选中的值赋值给对应的参数==
    handleChangeKnowLoanSatus(val) {
      this.examineValue.knowLoan = val;
    },
    //==点击添加电核记录弹框中的"确定"按钮操作者==
    handleAddExamineOk() {
      this.$refs.examineValue.validate(val => {
        if (val) {
          let params = {
            applicationId: this.applicationId,
            contact: this.examineValue.contact,
            contactMobile: this.examineValue.contactMobile,
            knowLoan: this.examineValue.isKnowLoan === "是" ? true : false,
            record: this.examineValue.record,
            relationship: this.examineValue.relationship,
            status: this.examineValue.status
          };
          api.addElecticalRecord(params).then(response => {
            let res = response.data;
            if (res.code == 200) {
              this.dialogFormVisible = false;
              this.$alert("添加电核记录成功", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                  this.getDetailElecticalRecords(1, this.pageSize);
                  this.$refs.examineValue.resetFields();
                }
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    //==审核通过不通过模块下-用户标签下拉选项获取==
    getDetailRiskLable(label) {
      let _label = label ? label : "";
      api.getDetailRiskLable(_label).then(response => {
        let res = response.data;
        if (res.code == 200 && res.body) {
          if (_label && _label !== "") {
            this.SecondUserLabelList = this.userRejuectLabels2 = response.data.body.map(
              _ => ({
                text: _.name,
                value: _.value
              })
            );
          } else {
            this.FirstUserLabelList = this.userRejuectLabels1 = response.data.body.map(
              _ => ({
                text: _.name,
                value: _.value
              })
            );
          }
        }
      });
    },
    //==选择用户标签一级分类获取用户标签二级分类==
    handleChooseFirstLabel(val) {
      this.getDetailRiskLable(val);
    },
    //==选择用户标签二级分类==
    handleChooseRiskTag(val) {
      this.creditApplyInfo.riskTag = val.text;
    },
    //==审核不通过模块-选择用户标签一级分类获取二级分类==
    handleChooseRejectLabel(val) {
      this.getDetailRiskLable(val);
    },
    //==关闭添加电核信息弹框==
    handleClose() {
      this.$refs.examineValue.resetFields();
      this.dialogFormVisible = false;
    },

    // ==点击授信通过按钮切换到授信通过相关内容模块==
    handlePass() {
      this.creditApplyInfo.checkUserLabel = "0";
      this.verifyType = "success";
    },
    // ==点击授信不通过按钮切换到授信不通过相关内容模块==
    handleNotPass() {
      this.creditApplyInfo.checkUserLabel = "0";
      this.verifyType = "danger";
    },
    //==审核通过接口调用==
    postPassAudit() {
      let _params = this.$deepcopy(this.creditApplyInfo);
      _params.applicationId = this.applicationId;
      _params.validityDateStart = this.$dateFilter(
        this.creditApplyInfo.validityDateStart
      );
      _params.validityDateEnd = this.$dateFilter(
        this.creditApplyInfo.validityDateEnd
      );
      _params.actCreditLimit = this.creditApplyInfo.actCreditLimit
        ? this.creditApplyInfo.actCreditLimit
        : 0;

      api.postPassAudit(_params).then(response => {
        let res = response.data;
        if (res.code == 200) {
          this.$alert("审核通过成功!", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.$router.push({
                name: "RiskAuditRecordsPage",
                query: { activeName: "auth_already" }
              });
            }
          });
        } else {
          this.$alert("审核通过失败!", "提示", {
            confirmButtonText: "确定"
          });
        }
      });
    },
    //==审核不通过接口调通(待调问题:验证勾选不通过原因时失败!)==
    postRejectPassAudit() {
      let _params = this.$deepcopy(this.rejectPassValues);
      _params.applicationId = this.applicationId;
      _params.auditMessage = this.rejectPassValues.auditMessage
        ? this.rejectPassValues.auditMessage.join()
        : "";
      api.postRejectPassAudit(_params).then(response => {
        let res = response.data;
        if (res.code == 200) {
          this.$alert("审核不通过成功!", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.$router.push({
                name: "RiskAuditRecordsPage",
                query: { activeName: "qs_already" }
              });
            }
          });
        } else {
          this.$alert(res.message, "提示", {
            confirmButtonText: "确定"
          });
        }
      });
    },
    //==审核通过操作==
    handleCreditSave() {
      if (this.verifyType === "success") {
        this.$refs.creditApplyInfo.validate(valid => {
          if (valid) {
            this.postPassAudit();
          } else {
            return false;
          }
        });
      } else {
        this.$refs.rejectPassValues.validate(valid => {
          if (valid) {
            this.postRejectPassAudit();
          } else {
            return false;
          }
        });
      }
    },
    //==退签操作按钮==
    handleExit() {
      api
        .putAccessAuditSignOut(this.$route.query.processFlowId)
        .then(response => {
          if (response.data.code == 200) {
            this.$alert("退签成功!", "提示", {
              confirmButtonText: "确定",
              callback: action => {
                this.$router.push({
                  name: "RiskAuditRecordsPage",
                  query: { activeName: "wait" }
                });
              }
            });
          } else {
            this.$alert("退签失败!", "提示", {
              confirmButtonText: "确定"
            });
          }
        });
    },

    //==弹框关闭按钮==
    handleCancel() {
      this.$refs.examineValue.resetFields();
      this.dialogFormVisible = false;
    }
  }
};
</script>
<style lang="scss">
.nuclear-ecording {
  background: #fff;
  padding: 0 10px 20px;
  h3 {
    font-weight: normal;
    font-size: 100%;
    span {
      color: #409eff;
      padding-left: 10px;
      border-left: 3px solid #409eff;
    }
  }
  .el-dialog__body {
    padding: 20px 40px;
  }
}

.verify-buttons {
  padding-top: 20px;
  .el-button--success.is-active {
    background: #67c23a;
    border-color: #67c23a;
    color: #fff;
  }
  .el-button--danger.is-active {
    color: #ffffff;
    background: #f56c6c;
    border-color: #f56c6c;
  }
  .el-button--primary.is-active {
    color: #ffffff;
    background: #409eff;
    border-color: #3a8ee6;
  }
}

.verify-main {
  padding: 20px 0;
  .verify-reason {
    p.verify-reasontit {
      margin-top: 0;
    }
  }
  .verify-fail {
    padding-top: 20px;
    .el-checkbox {
      display: block;
      margin-bottom: 10px;
    }
    .verify-fail-title {
      border: 1px solid #dcdfe6;
      border-bottom: none;
      padding: 20px 20px 0;
      background: #eee;
      .el-col {
        line-height: 30px;
      }
    }
    .verify-fail-items {
      padding: 20px;
      border: 1px solid #dcdfe6;
      border-top: none;
      background: #eee;
      .custom-delayDay {
        font-size: 14px;
        padding: 0 10px;
        line-height: 38px;
        border: 1px solid #dcdfe6;
        // background-color: #fff;
        border-left: 0;
      }
    }
  }
}

.verify-day {
  width: 100%;
  height: 100%;
  background: #8c939d;
}
</style>

