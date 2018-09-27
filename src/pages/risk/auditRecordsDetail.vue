<!--风控管理-风控审核记录-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.risk-detail-box {
  box-shadow: 0 0 5px #ccc;
}
.base-datas {
  h3 {
    span.base-data-title {
      color: #ff6600;
      border-left: 2px solid #ff6600;
      line-height: 2em;
      font-size: 14px;
      padding-left: 1em;
    }
    span.base-data-toggle {
      color: #409eff;
      font-size: 14px;
      line-height: 30px;
      margin-left: 10px;
    }
  }
  .upload-demo {
    display: flex;
    align-content: space-between;
  }
  .base-uploads {
    .el-upload--picture-card {
      width: 128px;
      height: 128px;
      line-height: 126px;
      .el-upload__text {
        position: absolute;
        left: 0;
        bottom: 10px;
        width: 130px;
        font-size: 12px;
        color: #999;
        line-height: 30px;
      }
    }
  }
}
.data-blank {
  height: 120px;
  text-align: center;
  line-height: 120px;
  color: #666;
}
</style>
<template>
  <div class="box">
   <!--=======风控管理-风控审核记录详情页 start===========-->    
   <base-info :value="baseValue" 
    :application-type='applicationType' 
    :dialog-history="dialogHistory" 
    :loan-records-total="baseValue.loanRecordsTotal"
    :active-name="historyActiveName"
    @see-records="handleSeeRecord" 
    @close-history="handleCloseHistory" 
    @loan-size-change="loanSizeChange"
    @loan-curr-change="loanCurrChange"
    @credit-size-change="creditSizeChange"
    @credit-curr-change="creditCUrrChange"
    @download-address="downLoadAddressList"
    @see-appy-records="handleSeeAppDetail"
    @relation-size-change="handleRelSizeChange"
    @relation-curr-change="handleRelCurrChange"
    :credit-records-total="baseValue.creditRecordsTotal"></base-info>
    
    <el-tabs v-model="activeName" type="card" @tab-click="handleChangeFirsTab">
      <el-tab-pane label="申请表信息" name="first">
        <el-tabs v-model="secondActiveName" type="border-card">
          <el-tab-pane v-for="(item,index) in classifyDatas" :label="item.label" :name="item.name" :key="index">
            <div v-if="item.applicationForms.length>0">
              <kd-base-units v-for="(props,key) in item.applicationForms" :key="key" :value="props" :title="props.title" :mode="'VIEW'"> </kd-base-units>                     
            </div>            
            <div v-else class="data-blank">暂无相关数据</div>
          </el-tab-pane>          
        </el-tabs>
        <el-row style="margin:20px 0;" v-if="currStep === 'qs_already' && operateType === 'authFirst'">
          <el-button type="success" @click="handleAutoFill">自动填充</el-button>
        </el-row>   
      </el-tab-pane>
      <el-tab-pane label="决策报告" name="second">
        <el-button type="primary" @click="getProccessAuditReports">决策报告</el-button>
      </el-tab-pane>
      <el-tab-pane label="认证信息" name="third">

        <div class="base-datas">
          <h3><span class="base-data-title">认证情况</span></h3>
          <el-form :model="levelValues.baseDatas" class="form-label flex fixed-width">
            <el-row class="row-bg" justify="space-between" :gutter="20">
              <el-col :span="6" v-for="(item, index) in levelValues.baseUnits" :key="index">
                <el-form-item :label="item.label">                
                  <kd-input :mode="'VIEW'" v-model="levelValues.baseDatas[item.name]"></kd-input>               
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <el-row>
          <el-table :data="verifyList" border>
            <el-table-column v-for="(col, index) in verifyTable" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                            :width="col.width"
                            :key="index" align="center"></el-table-column>            
          </el-table>
        </el-row>
        <el-row type="flex" justify="center" class="mgt20">
          <el-pagination
            @size-change="handleChangeVerifyPage"
            @current-change="handleChangeVerifyPage"
            :current-page="1"
            :page-size="pageSize"
            layout="sizes,total, prev, pager, next, jumper"
            :total="verifyTotal">
          </el-pagination>
        </el-row> 
      </el-tab-pane>
    </el-tabs> 

   <footer-info :tag="isAuthFirst" :default-amount="defaultAmont"></footer-info>
   <!--=======风控管理-风控审核记录详情页 end===========-->
  </div>
</template>

<script>
import BaseInfo from "./components/base";
import FooterInfo from "./components/footerInfo";
import applicationForm from "./detailComponents/applicationForm";
import * as api from "../../api/risk.js";
import { getSysEnum } from "../../api/common.js";
export default {
  name: "RiskAuditRecordsDetailPage",
  components: {
    BaseInfo,
    FooterInfo,
    applicationForm
  },
  data() {
    return {
      applicationId: this.$route.params.id,
      applicationType: this.$route.query.applicationType,
      currStep: this.$route.query.currStep,
      operateType: this.$route.query.operateType,
      isAuthFirst:
        this.$route.query.currStep === "qs_already" &&
        this.$route.query.operateType === "authFirst"
          ? true
          : false,
      activeName: "first",
      secondActiveName: "",
      dialogHistory: false,
      dialogAddressList: false,
      defaultAmont: 0,
      verifyList: [],
      verifyTable: [
        {
          label: "认证类型",
          prop: "verificationType",
          formatter: (row, col, val) => this.$filter(val, this.$enum.AUTH_MODEL)
        },
        {
          label: "认证结果",
          prop: "verificationResult",
          formatter: (row, col, val) =>
            val == 1 ? "认证中" : val == 0 ? "认证中" : "认证失败"
        },
        {
          label: "认证分数",
          prop: "authScore"
        },
        {
          label: "截止有效期",
          prop: "validityDateEnd"
        },
        {
          label: "操作时间",
          prop: "verificationTime"
        }
      ],
      verifyTotal: 0,
      pageSize: 10,
      levelValues: {
        baseDatas: {
          realName: "",
          taobaoAlipay: "",
          personalInformation: "",
          contact: "",
          accumulationFund: "",
          weixin: "",
          withhold: "",
          sesameCredit: "",
          centralBank: "",
          creditCard: "",
          jingdong: "",
          operators: "",
          face: "",
          faceScore: 0,
          depository: ""
        },
        baseUnits: [
          {
            name: "realName",
            label: "实名认证",
            type: "input"
          },
          {
            name: "taobaoAlipay",
            label: "淘宝/支付宝认证",
            type: "input"
          },
          {
            name: "personalInformation",
            label: "个人信息认证",
            type: "input"
          },
          {
            name: "contact",
            label: "联系人认证",
            type: "input"
          },
          {
            name: "accumulationFund",
            label: "公积金认证",
            type: "input"
          },
          {
            name: "weixin",
            label: "微信认证",
            type: "input"
          },
          {
            name: "withhold",
            label: "代扣认证",
            type: "input"
          },
          {
            name: "sesameCredit",
            label: "芝麻信用认证",
            type: "input"
          },
          {
            name: "centralBank",
            label: "央行认证",
            type: "input"
          },
          {
            name: "creditCard",
            label: "信用卡认证",
            type: "input"
          },
          {
            name: "jingdong",
            label: "京东认证",
            type: "input"
          },
          {
            name: "operators",
            label: "运营商认证",
            type: "input"
          },
          {
            name: "face",
            label: "人脸识别认证",
            type: "input"
          },
          {
            name: "faceScore",
            label: "人脸识别评分",
            type: "input"
          },
          {
            name: "depository",
            label: "存管认证",
            type: "input"
          }
        ]
      },
      historyActiveName: "loan",
      baseValue: {
        partyId: "",
        realName: "",
        cellphone: "",
        idCard: "",
        channelCode: "",
        applicationTime: "",
        applicationType: "",
        creditTotal: "",
        credit: {
          creditTotal: "",
          validityDateStart: "",
          validityDateEnd: "",
          userLevel: ""
        },
        loan: {
          loanAmount: "",
          loanPeriod: "",
          creditTotal: "",
          creditComsumeUsed: "",
          creditWithdrawUsed: ""
        },
        dialogLoanData: [],
        loanRecordsTotal: 0,
        dialogLoanTop: [],
        dialogCreditData: [],
        creditRecordsTotal: 0,
        relationRecordsTotal: 0,
        dialogCreditTop: [],
        title: "",
        addressTop: [],
        addressDatas: [],
        applicationRel: 0,
        loanPageSize: 10,
        loanPageNum: 1,
        creditPageSize: 10,
        creditPageNum: 1,
        relationPageSize: 10,
        relationPageNum: 1
      },
      classifyDatas: [],
      _application: [],
      verifItem: {},
      classifyTabs: []
    };
  },
  watch: {
    secondActiveName: function(val, oldVal) {
      this.secondActiveName = val;
    },
    verifItem: function(val, oldVal) {
      this.levelValues.baseDatas = val;
    }
  },
  created() {
    this.getBaseDetail(() => {
      this.getVerificationDetail(this.baseValue.partyId);
      this.levelValues.baseDatas = this.verifItem;
      this.getVerificationHistory(this.baseValue.partyId, 1);
    });
    this.getFirstClassifyEnumsList(() => {
      this.secondActiveName =
        this.classifyDatas.length > 0 ? this.classifyDatas[0].name : "";
    });
  },
  methods: {
    //基本信息模块下的-查看历史记录-查看审核记录操作
    handleSeeAppDetail(value) {
      console.log("handleSeeAppDetail:", value);
      if (this.currStep === "qs_already") {
        const { href } = this.$router.resolve({
          name: "RiskAuditRecordsDetailPage",
          params: { id: value.applicationId },
          query: {
            processFlowId: value.id,
            applicationType: value.applicationType,
            currStep: this.currStep
          }
        });
        window.open(href, "_blank");
      } else {
        const { href } = this.$router.resolve({
          name: "RiskAuditRecordsDetailPage",
          params: { id: value.applicationId },
          query: { applicationType: value.applicationType }
        });
        window.open(href, "_blank");
      }
    },
    //下载通讯录
    downLoadAddressList() {
      let _params = {
        cellphone: this.baseValue.cellphone,
        idCard: this.baseValue.idCard,
        realName: this.baseValue.realName
      };
      api.downAddressList(_params).then(response => {
        if (response.status == 200) {
          let data = response.data;
          let filename = response.headers["content-disposition"]
            ? response.headers["content-disposition"].split("filename=")[1]
            : "repayed_list.xlsx";
          this.$downloadExcel(data, filename);
        }
      });
    },
    //通讯录列表
    getAddressList(pageNumber) {
      let _this = this;
      let _params = {
        cellphone: _this.baseValue.cellphone,
        idCard: _this.baseValue.idCard,
        realName: _this.baseValue.realName
      };
      api.getAddressList(_params).then(response => {
        let res = response.data;
        if (res.code == 200 && res.body.contacts && res.body.contacts !== "") {
          let myPhoneList = JSON.parse(res.body.contacts);
          for (const key in myPhoneList) {
            let _item = {};
            _item.cellphone = myPhoneList[key];
            _item.realName = key;
            _this.baseValue.addressDatas.push(_item);
          }
        }
      });
    },
    //认证历史分页
    handleChangeVerifyPage(pageNumber) {
      this.getVerificationHistory(this.baseValue.partyId, pageNumber);
    },
    //认证历史接口
    getVerificationHistory(partyId, pageNumber) {
      let _params = {
        pageSize: this.pageSize,
        pageNumber: pageNumber
      };
      api.getVerificationHistory(partyId, _params).then(response => {
        let res = response.data;
        if (res.code == 200 && res.body.content) {
          this.verifyList = res.body.content;
          this.verifyTotal = res.body.total;
        }
      });
    },
    filterVerif(value) {
      return value ? "已认证" : "未认证";
    },
    //认证情况相关接口
    getVerificationDetail(partyId) {
      api.getVerificationDetail(partyId).then(response => {
        let res = response.data;
        if (res.code == 200 && res.body) {
          this.verifItem = {
            realName: this.filterVerif(res.body.realName),
            taobaoAlipay: this.filterVerif(res.body.taobaoAlipay),
            personalInformation: this.filterVerif(res.body.personalInformation),
            contact: this.filterVerif(res.body.contact),
            accumulationFund: this.filterVerif(res.body.accumulationFund),
            weixin: this.filterVerif(res.body.weixin),
            withhold: this.filterVerif(res.body.withhold),
            sesameCredit: this.filterVerif(res.body.sesameCredit),
            centralBank: this.filterVerif(res.body.centralBank),
            creditCard: this.filterVerif(res.body.creditCard),
            jingdong: this.filterVerif(res.body.jingdong),
            operators: this.filterVerif(res.body.operators),
            face: this.filterVerif(res.body.face),
            faceScore: res.body.faceScore,
            depository: this.filterVerif(res.body.depository)
          };
        }
      });
    },

    //风控决策报告接口
    getProccessAuditReports() {
      api.getProccessAuditReports(this.applicationId).then(response => {
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
    //自动填充接口
    handleAutoFill() {
      api
        .putDetailAutoFillApplications(this.applicationId, this.applicationType)
        .then(response => {
          if (response.data.code == 200) {
            this.$alert(response.data.body, "提示", {
              confirmButtonText: "确定",
              callback: action => {
                this.$router.push({ name: "RiskAuditRecordsPage" });
              }
            });
          } else {
            this.$alert(response.data.message, "提示", {
              confirmButtonText: "确定"
            });
          }
        });
    },
    //根据对象中的属性名称排序
    compareByProp(prop) {
      return function(obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      };
    },
    //点击切换申请表那个地方的tab切换时默认将申请表下面的一级分类下面的内容展示
    handleChangeFirsTab() {
      if (this.activeName === "first") {
        if (this.classifyDatas && this.classifyDatas.length > 0) {
          this.secondActiveName = this.classifyDatas[0].name;
        }
      }
    },
    //获取申请表以及分类的枚举名称
    getFirstClassifyEnumsList(callback) {
      let _this = this;
      getSysEnum(_this.$enum.APPLICATION_FORM_TYPE).then(response => {
        let res = response.data;
        if (res.code == 200 && res.body && res.body.length > 0) {
          _this.classifyDatas = [];
          res.body.forEach((item, index) => {
            let _item = {};
            _item.itemSort = item.itemSort;
            _item.label = item.itemName;
            _item.name = item.itemValue;
            let allParams = [];
            _this.getApplicationForms(_item, function() {
              allParams = _this._application.map(_ => ({
                title: _.menuName,
                baseUnits: _.baseUnits,
                baseDatas: _.baseDatas
              }));

              _item.applicationForms = allParams;
              _this.classifyDatas.push(_item);
              _this.classifyDatas.sort(_this.compareByProp("itemSort"));
              callback && callback();
            });
          });
        }
      });
    },
    //根据申请表的一级分类的枚举值获取对应下面的内容
    getApplicationForms(item, callback) {
      let _this = this;
      api.getApplicationForms(_this.applicationId, item.name).then(response => {
        let res = response.data;
        if (res.code == 200 && res.body) {
          if (res.body.length > 0) {
            res.body.forEach(item => {
              if (item.list.length > 0) {
                item.list.forEach((childItem, childIndex) => {
                  childItem.fieldEngName =
                    childItem.fieldType +
                    childItem.displayOrder +
                    "_" +
                    childIndex;
                });
                item.baseUnits = item.list.map((_, _i) => ({
                  itemSort: _.displayOrder,
                  name: _.fieldEngName,
                  label: _.fieldName,
                  type: _.fieldType === "fileUpload" ? "upload" : "input",
                  value: _.fieldValue ? _.fieldValue : ""
                }));
                let _obj = {};
                item.baseUnits.forEach(_val => {
                  _obj[_val.name] = _val.value;
                });
                item.baseDatas = _obj;
              }
            });
          }
          _this._application = res.body;

          callback && callback();
        }
      });
    },

    //获取基本信息
    getBaseDetail(callback) {
      api
        .getAllBaseDetail(this.applicationId, this.applicationType)
        .then(response => {
          let res = response.data;
          let _body = res.body;
          if (res.code == 200 && _body) {
            this.baseValue.partyId = _body.partyId;
            this.baseValue.realName = _body.realName;
            this.baseValue.cellphone = _body.cellphone;
            this.baseValue.idCard = _body.idCard;
            this.baseValue.channelCode = this.$filterChannelName(
              _body.channelCode
            );
            this.baseValue.applicationTime = _body.applicationTime;
            this.baseValue.creditTotal = _body.creditTotal;
            this.baseValue.applicationType = this.$filter(
              _body.applicationType
            );
            this.baseValue.credit = {
              creditTotal: _body.creditTotal,
              validityDateStart: _body.validityDateStart,
              validityDateEnd: _body.validityDateEnd,
              userLevel: _body.userLevel
            };
            this.baseValue.loan = {
              loanAmount: _body.loanAmount,
              loanPeriod: _body.loanPeriod,
              creditTotal: _body.creditTotal,
              creditComsumeUsed: _body.creditComsumeUsed,
              creditWithdrawUsed: _body.creditWithdrawUsed
            };
            this.baseValue.applicationRel = _body.applicationRel;
            this.defaultAmont = _body.creditTotal;

            callback && callback();
          }
        });
    },
    //获取基本信息-查看历史申请-借款记录-每页条数改变事件
    loanSizeChange(val) {
      this.baseValue.loanPageSize = val;
      this.getBaseLoanRecords(this.baseValue.loanPageNum, val);
    },
    //获取基本信息-查看历史信息-借款记录-点击分页按钮事件
    loanCurrChange(val) {
      this.baseValue.loanPageNum = val;
      this.getBaseLoanRecords(val, this.baseValue.loanPageSize);
    },
    //获取基本信息-查看历史申请-借款记录
    getBaseLoanRecords(pageNumber, pageSize) {
      let params = {};
      params.pageSize = pageSize;
      params.pageNum = pageNumber;
      api.getBaseLoanRecords(this.baseValue.partyId, params).then(response => {
        let res = response.data;
        if (res.code == 200) {
          this.baseValue.dialogLoanData = res.body.content;
          this.baseValue.loanRecordsTotal = res.body.total;
        }
      });
    },
    //获取基本信息-查看历史申请-授信记录-每页条数改变事件
    creditSizeChange(val) {
      this.baseValue.creditPageSize = val;
      this.getBaseCreditRecords(this.baseValue.creditPageNum, val);
    },
    //获取基本信息-查看历史申请-授信记录-点击分页按钮事件
    creditCUrrChange(val) {
      this.baseValue.creditPageNum = val;
      this.getBaseCreditRecords(val, this.baseValue.creditPageSize);
    },
    //获取基本信息-查看历史申请-授信记录
    getBaseCreditRecords(pageNumber, pageSize) {
      let params = {};
      params.pageSize = 10;
      params.pageNum = pageNumber;
      api
        .getBaseCreditRecords(this.baseValue.partyId, params)
        .then(response => {
          let res = response.data;
          if (res.code == 200 && res.body.content) {
            this.baseValue.dialogCreditData = res.body.content;
            this.baseValue.creditRecordsTotal = res.body.total;
          }
        });
    },
    //获取基本信息-查看关联申请-每页条数变化事件
    handleRelSizeChange(val) {
      this.baseValue.relationPageSize = val;
      this.getRelationRecords(this.baseValue.relationPageNum, val);
    },
    handleRelCurrChange(val) {
      this.baseValue.relationPageNum = val;
      this.getRelationRecords(val, this.baseValue.relationPageSize);
    },
    //获取基本信息-查看关联申请
    getRelationRecords(pageNumber, pageSize) {
      let params = {};
      params.pageSize = pageSize;
      params.pageNum = pageNumber;
      api
        .getRelationRecords(this.baseValue.cellphone, params)
        .then(response => {
          let res = response.data;
          if (res.code == 200 && res.body.content) {
            this.baseValue.dialogRelationData = res.body.content;
            this.baseValue.relationRecordsTotal = res.body.total;
          }
        });
    },
    //点击基本信息上面的按钮操作逻辑
    handleSeeRecord(type) {
      this.historyActiveName = "loan";
      if (type === "history") {
        this.baseValue.title = "查看历史申请";
        this.baseValue.dialogLoanTop = [
          {
            name: "applicationId",
            label: "贷款编号"
          },
          {
            name: "applicationTime",
            label: "借款日期"
          },
          {
            name: "applicationType",
            label: "申请类型",
            formatter: (row, col, val) => this.$filter(val)
          },
          {
            name: "mobile",
            label: "登录手机号"
          },
          {
            name: "realName",
            label: "姓名"
          },
          {
            name: "loanAmount",
            label: "借款金额"
          },
          {
            name: "loanPeriod",
            label: "借款期数"
          },
          {
            name: "currentPeriod",
            label: "当前期数"
          },
          {
            name: "repayDate",
            label: "应还款日"
          },
          {
            name: "maxOverdueDay",
            label: "最大逾期天数"
          },
          {
            name: "remainPrincipal",
            label: "当前逾期本金"
          },
          {
            name: "overdueTimes",
            label: "逾期次数"
          },
          {
            name: "shTotalAmount",
            label: "实际还款总额"
          },
          {
            name: "status",
            label: "前端状态",
            formatter: (row, col, val) =>
              this.$filter(val, this.$enum.APPLICATION_STATUS)
          },
          {
            name: "overdue",
            label: "有无逾期"
          }
        ];
        this.baseValue.dialogCreditTop = [
          {
            name: "applicationId",
            label: "贷款编号"
          },
          {
            name: "channelCode",
            label: "渠道名称",
            formatter: (row, col, val) => this.$filterChannelName(val)
          },
          {
            name: "applicationType",
            label: "申请类型",
            formatter: (row, col, val) => this.$filter(val)
          },
          {
            name: "mobile",
            label: "登录手机号"
          },
          {
            name: "realName",
            label: "姓名"
          },
          {
            name: "applicationTime",
            label: "申请时间"
          },
          {
            name: "status",
            label: "前端状态",
            formatter: (row, col, val) =>
              this.$filter(val, this.$enum.APPLICATION_STATUS)
          }
        ];
        this.getBaseLoanRecords(1, this.baseValue.loanPageSize);
        this.getBaseCreditRecords(1, this.baseValue.creditPageSize);
      } else if (type === "relation") {
        this.baseValue.title = "查看关联申请";
        this.baseValue.dialogRelationTop = [
          {
            name: "relationType",
            label: "关联类型"
          },
          {
            name: "applicationId",
            label: "贷款编号"
          },
          {
            name: "applicationTime",
            label: "申请时间"
          },
          {
            name: "mobile",
            label: "登录手机号"
          },
          {
            name: "realName",
            label: "姓名"
          },
          {
            name: "channelCode",
            label: "渠道名称",
            formatter: (row, col, val) => this.$filterChannelName(val)
          },
          {
            name: "applicationType",
            label: "申请类型",
            formatter: (row, col, val) => this.$filter(val)
          },
          {
            name: "status",
            label: "前端状态",
            formatter: (row, col, val) => this.$filter(val)
          }
        ];
        this.getRelationRecords(1, this.baseValue.relationPageSize);
      } else {
        this.baseValue.title = "通讯录";
        this.baseValue.addressTop = [
          {
            name: "realName",
            label: "姓名"
          },
          {
            name: "cellphone",
            label: "电话"
          }
        ];
        this.getAddressList();
      }
      this.dialogHistory = true;
    },
    handleCloseHistory() {
      this.dialogHistory = false;
    },
    historySizeChange(val) {}
  }
};
</script>


