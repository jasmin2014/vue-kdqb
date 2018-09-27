<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
<!--产品规则编辑-->
<template>
  <div class="box">
    <el-form :model="ruleForm" ref="ruleForm" label-width="220px" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="产品规则名称:" prop="ruleName">
            <kd-input v-model="ruleForm.ruleName" auto-complete="off" disabled style="width:50%"></kd-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="账单日:">
            <span>系统自动生成，为用户开通额度成功前一天</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="还款日:" prop="repaymentDay">
            <span>还款日根据账单日生成，为账单日后<span style="margin:0px 20px">{{ruleForm.repaymentDay}}</span>天</span>
            <p class="explain">{{repay}}</p>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="呆账周期（天）:" prop="badDebtCycle">
            <span><span style="margin:0px 20px">{{ruleForm.badDebtCycle}}</span>天</span>
          </el-form-item>
        </el-col>
         <el-col :span="12">
            <el-form-item label="账单终止周期（天）:" prop="contractTerminationCycle">
              <span><span style="margin:0px 20px">{{ruleForm.contractTerminationCycle}}</span>天</span>
            </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="逾期费计算方式:">
          <span>逾期费 = （出账本金 + 出账利息）* 逾期费费率 * 逾期天数</span>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="逾期罚息率（呆账周期内）：" prop="penaltyRateIn">
            <kd-input v-model.trim="ruleForm.penaltyRateIn" unit="%"
                      type="number" :mode="mode" style="width:50%">
            </kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="逾期罚息率（呆账周期外）：" prop="penaltyRateOut">
            <kd-input v-model.trim="ruleForm.penaltyRateOut" unit="%"
                      type="number" :mode="mode" style="width:50%">
            </kd-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
            <el-form-item label="逾期管理费率（呆账周期内）：" prop="penaltyManagementRateIn">
            <kd-input v-model.trim="ruleForm.penaltyManagementRateIn" unit="%"
                      type="number" :mode="mode" style="width:50%">
            </kd-input>
          </el-form-item>
        </el-col>
         <el-col :span="12">
            <el-form-item label="逾期管理费率（呆账周期外）:" prop="penaltyManagementRateOut">
            <kd-input v-model.trim="ruleForm.penaltyManagementRateOut" unit="%"
                      type="number" :mode="mode" style="width:50%">
            </kd-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="提前还款违约金计算方式:">
              <span>违约金 = 剩余本金 * 违约金率</span>
          </el-form-item>
        </el-col>
         <el-col :span="12">
            <el-form-item label="免息期利率（日息）:" prop="gracePeriodRate">
              <kd-input v-model.trim="ruleForm.gracePeriodRate" type="number" :mode="mode" unit="%" style="width:50%">
              </kd-input>
              <span class="remark">免息期利率入基准利率1原子交易项</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="提前还款违约金率:" prop="defaultsRate">
            <kd-input v-model.trim="ruleForm.defaultsRate" unit="%" :mode="mode"  type="number" style="width:50%">
            </kd-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <h5>消费分期利率</h5>
          <el-table :data="consumeList" border>
            <el-table-column v-for="col in tableHeader" :key="col.prop" :label="col.label" align="center">
              <template slot-scope="scope">
                <el-form :model="scope.row" :rules="rules2" ref="tableForm">
                  <el-form-item :prop="col.prop">
                    <div v-if="col.type == 'input'">
                      <kd-input v-model.trim="scope.row[col.prop]" unit="%" :mode="mode" type="number" :disabled="col.prop == 'totalMonthRate'"></kd-input>
                    </div>
                    <span v-else>{{ scope.row[col.prop] }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <h5>借款提现分期利率</h5>
          <el-table :data="cashAdvanceList" border>
            <el-table-column v-for="col in tableHeader" :key="col.prop" :label="col.label" align="center">
              <template slot-scope="scope">
                <el-form :model="scope.row" :rules="rules2" ref="tableForm">
                  <el-form-item :prop="col.prop">
                    <div v-if="col.type == 'input'">
                      <kd-input v-model.trim="scope.row[col.prop]" unit="%" :mode="mode" type="number" :disabled="col.prop == 'totalMonthRate'"></kd-input>
                    </div>
                    <span v-else>{{ scope.row[col.prop] }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <h5>信用卡代偿利率分期利率</h5>
          <el-table :data="creditCardList" border>
            <el-table-column v-for="col in tableHeader" :key="col.prop" :label="col.label" align="center">
              <template slot-scope="scope">
                <el-form :model="scope.row" :rules="rules2" ref="tableForm">
                  <el-form-item :prop="col.prop">
                    <div v-if="col.type == 'input'">
                      <kd-input v-model.trim="scope.row[col.prop]" unit="%" :mode="mode" type="number" :disabled="col.prop == 'totalMonthRate'"></kd-input>
                    </div>
                    <span v-else>{{ scope.row[col.prop] }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <h5>账单分期利率</h5>
          <el-table :data="billList" border>
            <el-table-column v-for="col in tableHeader" :key="col.prop" :label="col.label" align="center">
              <template slot-scope="scope">
                <el-form :model="scope.row" :rules="rules2" ref="tableForm">
                  <el-form-item :prop="col.prop">
                    <div v-if="col.type == 'input'">
                      <kd-input v-model.trim="scope.row[col.prop]" unit="%" :mode="mode" type="number" :disabled="col.prop == 'totalMonthRate'"></kd-input>
                    </div>
                    <span v-else>{{ scope.row[col.prop] }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row v-if="mode != 'VIEW'">
        <el-col :span="4" :offset="20" style="margin-top:20px;">
          <el-button type="primary" @click="handleSave">确 定</el-button>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>

<script>
import { editRule,getRuleByCode} from '../../api/products'
export default {
  name: "ProductsEditRules",
  components: {},
  data() {
    const numberRule = (rule, value, callback) => {
        if (isNaN(value) || value < 0 || value >100) {
          callback('请输入正确日利率');
        }else if (!this.$valid.floatValidator(value, 3)) {
          callback('保留小数点后3位')
        }else {
          callback();
        }
    };
    return {
      mode: '',
      id:'',
      isEnable:'',
      repay:'（设账单日为A，还款日为A后X天；若A＋X<28时，还款日＝A+X；若A+X>28，则计算 A＋X－31；其中，若A＋X－31＝－2，－1，0则还款日为1号；若A＋X－31>0，则为真实数值）',
      ruleForm: {
        ruleName: '', //产品规则名称
        repaymentDay:0,//还款日
        badDebtCycle:0,//呆账周期
        contractTerminationCycle:0,//合同终止周期
        gracePeriodRate:0,//免息期利率（日息）
        defaultsRate:0,//提前还款违约金率
        penaltyRateIn:0,//逾期罚息率（呆账周期内）
        penaltyRateOut:0,//逾期罚息率（呆账周期外）
        penaltyManagementRateIn:0,//逾期管理费率（呆账周期内）
        penaltyManagementRateOut:0,//逾期管理费率（呆账周期外）
        consumeList:[],//消费分期利率
        cashAdvanceList:[],//借款提现分期利率
        creditCardList:[],//信用卡代偿利率分期利率
        billList:[],//账单分期利率
      },
      tableHeader: [
        {
          prop: 'periods',
          label: '期数',
          type: '',
        },
        {
          prop: 'baseIntRate1',
          label: '基准利率1',
          type: 'input',
        },
        {
          prop: 'baseIntRate2',
          label: '基准利率2',
          type: 'input',
        },
        {
          prop: 'comprehensiveManagementRate',
          label: '综合管理费',
          type: 'input',
        },
        {
          prop: 'accountManagementRate',
          label: '账户管理费',
          type: 'input',
        },
        {
          prop: 'totalMonthRate',
          label: '总月利率',
          type: 'input',
        }
      ],
      rules: {
        penaltyRateIn: [
          {required: true, message: '请输入逾期罚息率（呆账周期内）', trigger: 'blur'},
          {validator: numberRule, trigger: 'blur'}
        ],
        penaltyRateOut: [
          {required: true, message: '请输入逾期罚息率（呆账周期内）', trigger: 'blur'},
          {validator: numberRule, trigger: 'blur'}
        ],
        penaltyManagementRateIn: [
          {required: true, message: '请输入逾期管理费率（呆账周期内）', trigger: 'blur'},
          {validator: numberRule, trigger: 'blur'}
        ],
        penaltyManagementRateOut: [
          {required: true, message: '请输入逾期管理费率（呆账周期外）', trigger: 'blur'},
          {validator: numberRule, trigger: 'blur'}
        ],
        defaultsRate: [
          {required: true, message: '请输入提前还款违约金率', trigger: 'blur'},
          {validator: numberRule, trigger: 'blur'}
        ],
        gracePeriodRate: [
          {required: true, message: '请输入免息期利率（日息）', trigger: 'blur'},
          {validator: numberRule, trigger: 'blur'}
        ],
      },
      rules2:{
        baseIntRate1:[
          {required: true, message: '请输入基准利率1', trigger: 'change'},
          {validator: numberRule, trigger: 'change'}
        ],
        baseIntRate2:[
          {required: true, message: '请输入基准利率2', trigger: 'change'},
          {validator: numberRule, trigger: 'change'}
        ],
        comprehensiveManagementRate:[
          {required: true, message: '请输入综合管理费', trigger: 'change'},
          {validator: numberRule, trigger: 'change'}
        ],
        accountManagementRate:[
          {required: true, message: '请输入账户管理费', trigger: 'change'},
          {validator: numberRule, trigger: 'change'}
        ]
      }
    };
  },
  created() {
    this.mode = this.$route.query.mode;
    this.id = this.$route.params.id || ' ';
    if(this.id !== ' '){
      this.getRuleByCode(this.id)
    }
  },
  computed:{
    consumeList(){
      this.ruleForm.consumeList.forEach(col=>{
        this.handleTotal(col)
      })
      return this.ruleForm.consumeList
    },
    cashAdvanceList(){
      this.ruleForm.cashAdvanceList.forEach(col=>{
         this.handleTotal(col)
      })
      return this.ruleForm.cashAdvanceList
    },
    creditCardList(){
      this.ruleForm.creditCardList.forEach(col=>{
         this.handleTotal(col)
      })
      return this.ruleForm.creditCardList
    },
    billList(){
      this.ruleForm.billList.forEach(col=>{
        this.handleTotal(col)
      })
      return this.ruleForm.billList
    }
  },
  methods: {
    getRuleByCode(id){
      getRuleByCode(id).then((response)=>{
        const res = response.data
        if (res.code == 200) {
          this.ruleForm = res.body;
          this.ruleForm.gracePeriodRate = this.$floatToPercentage(this.ruleForm.gracePeriodRate, 1)
          this.ruleForm.defaultsRate = this.$floatToPercentage(this.ruleForm.defaultsRate, 1)
          this.ruleForm.penaltyRateIn = this.$floatToPercentage(this.ruleForm.penaltyRateIn, 1)
          this.ruleForm.penaltyRateOut = this.$floatToPercentage(this.ruleForm.penaltyRateOut, 1)
          this.ruleForm.penaltyManagementRateIn = this.$floatToPercentage(this.ruleForm.penaltyManagementRateIn, 1)
          this.ruleForm.penaltyManagementRateOut = this.$floatToPercentage(this.ruleForm.penaltyManagementRateOut, 1)
          this.ruleForm.consumeList.forEach(ele=>{
           this.handleFloatMultiply(ele)
          })
          this.ruleForm.cashAdvanceList.forEach(ele=>{
           this.handleFloatMultiply(ele)
          })
          this.ruleForm.creditCardList.forEach(ele=>{
           this.handleFloatMultiply(ele)
          })
          this.ruleForm.billList.forEach(ele=>{
            this.handleFloatMultiply(ele)
          })
          this.isEnable = this.ruleForm.isEnable
        }else{
          this.$message({
            showClose: true,
            type: 'error',
            message:res.message
          })
        }
      })
    },
    handleSave(){
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let data = this.$deepcopy(this.ruleForm);
          data.isEnable = this.isEnable
          data.gracePeriodRate = this.$floatDivide(data.gracePeriodRate, 100);
          data.defaultsRate = this.$floatDivide(data.defaultsRate, 100);
          data.penaltyRateIn = this.$floatDivide(data.penaltyRateIn, 100);
          data.penaltyRateOut = this.$floatDivide(data.penaltyRateOut, 100);
          data.penaltyManagementRateIn = this.$floatDivide(data.penaltyManagementRateIn, 100);
          data.penaltyManagementRateOut = this.$floatDivide(data.penaltyManagementRateOut, 100);
          for(let a in data){
            if(isNaN(data[a]) && typeof(data[a])=="number"){
              data[a] = 0
            }
          }
          if(data.consumeList){
            data.consumeList.forEach(ele=>{
              this.handleFloatDivide(ele)
            })
          }
          if(data.cashAdvanceList){
            data.cashAdvanceList.forEach(ele=>{
              this.handleFloatDivide(ele)
            })
          }
          if(data.creditCardList){
            data.creditCardList.forEach(ele=>{
              this.handleFloatDivide(ele)
            })
          }
          if(data.billList){
            data.billList.forEach(ele=>{
              this.handleFloatDivide(ele)
            })
          }
          delete data.updatedTime
          editRule(data).then(response=>{
            const res = response.data
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '编辑成功'
              });
               window.opener.location.href=window.opener.location.href
              setTimeout(() => {
                window.close()
              }, 100)
            }else{
              this.$message({
                showClose: true,
                type: 'error',
                message:res.message
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    handleFloatDivide(ele){
      ele.baseIntRate1 = this.$floatDivide(ele.baseIntRate1, 100)
      ele.baseIntRate2 = this.$floatDivide(ele.baseIntRate2, 100)
      ele.comprehensiveManagementRate = this.$floatDivide(ele.comprehensiveManagementRate, 100)
      ele.accountManagementRate = this.$floatDivide(ele.accountManagementRate, 100)
      ele.totalMonthRate = this.$floatDivide(ele.totalMonthRate, 100)
    },
    handleFloatMultiply(ele){
      ele.baseIntRate1 = this.$floatToPercentage(ele.baseIntRate1, 1)
      ele.baseIntRate2 = this.$floatToPercentage(ele.baseIntRate2, 1)
      ele.comprehensiveManagementRate = this.$floatToPercentage(ele.comprehensiveManagementRate, 1)
      ele.accountManagementRate = this.$floatToPercentage(ele.accountManagementRate, 1)
      ele.totalMonthRate = this.$floatToPercentage(ele.totalMonthRate, 1)
    },
    handleTotal(col){
      col.totalMonthRate = col.comprehensiveManagementRate + col.baseIntRate1 + col.baseIntRate2 + col.accountManagementRate
      col.totalMonthRate = Math.round(Number(col.totalMonthRate) * 1000) / 1000
    }
  }
};
</script>


