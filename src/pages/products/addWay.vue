<!--策略详情-->
<template>
  <div class="box">
    <el-form :model="product" ref="product" label-width="180px" :rules="rules">
      <el-row>
        <el-col :span="14">
          <el-form-item label="渠道名称:" prop="channelName">
            <kd-input v-model.trim="product.channelName" auto-complete="off" :mode="mode" placeholder="请输入24个以内的字符"></kd-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="渠道编号:" prop="channelCode" v-if="this.mode == 'EDIT'">
            <kd-input v-model="product.channelCode" auto-complete="off"
                      :disabled="disabled" style="width:40%"></kd-input>
            <p class="explain">FD+产品名称首字母缩略 + 三位编号 比如电商贷：FDDSD001</p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="财务放款规则:" prop="grantRuleCode">
             <kd-select v-model="product.grantRuleCode" :options="grantRuleCodeOptions" placeholder="请选择"></kd-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="业务类型:" prop="busTypeList">
            <kd-checkbox v-model="product.busTypeList"
                    @change="changeBussinessType" :mode="mode" style="margin-top:10px;" :group="this.$enum.BUSINESS_TYPE"></kd-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14" v-if="preloanCashRadioShow">
          <el-form-item label="借款提现系数:" prop="preloanCashRadio">
            <kd-input v-model="product.preloanCashRadio" auto-complete="off"
                      :mode="mode" type="number" ></kd-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="是否启用:" prop="isEnable">
             <kd-radio v-model="product.isEnable" :mode="mode" :group="this.$enum.ENABLE_STATUS"
                @change="changeStartWay"></kd-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-left:180px">
        <el-button type="primary" @click="handleSave()">确 定</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { addChannel ,editChannel , getChannelByCode } from '../../api/products'
import { getGrantRule } from '../../api/finance'
export default {
  name: "ProductWayPage",
  data() {
    const numberRule = (rule, value, callback) => {
      if ((value >= 1) || (value <= 0)) {
        callback('请输入小于1的正数');
      }else if (!this.$valid.floatValidator(value, 2)) {
          callback('保留小数点后2位')
      } else {
        callback();
      }
    };
    const inviteCodeRule = (rule,value,callback) => this.$valid.inviteCodeRule(rule,value,callback,24)
    return {
      id:'',
      mode: 'CREATE',
      disabled:true,
      preloanCashRadioShow:false,
      product: {
        channelName: '', //渠道名称
        channelCode:'', //渠道编号
        grantRuleCode:'',//财务放款规则
        busTypeList:[],//业务类型
        preloanCashRadio:'',//借款提现系数
        isEnable:'false'//是否启动
      },
      busTypeList:[],
      busList:[],
      rules: {
        channelName: [
          {required: true, message: '请输入渠道名称', trigger: 'blur'},
          {validator: inviteCodeRule ,  trigger: 'blur'},
        ],
        grantRuleCode: [
          {required: true, message: '请选择财务放款规则', trigger: 'change'},
        ],
        busTypeList: [
          {type:'array',required: true, message: '请至少选择一个业务类型', trigger: 'change'},
        ],
        preloanCashRadio: [
          {required: true, message: '请输入借款体现系数', trigger: 'blur'},
          {validator: numberRule, trigger: 'blur'}
        ],
        isEnable: [
          {required: true, message: '请选择是否启动', trigger: 'change'}
        ],
      },
      grantRuleCodeOptions:[]
    }
  },
  created() {
    this.mode = this.$route.query.mode
    this.getGrantRule()
    this.id = this.$route.params.id || ' ';
    if (this.id !== ' ') {
      this.getChannelByCode(this.id)
    }
  },
  methods: {
    getChannelByCode(id){
      getChannelByCode({channelCode:id}).then((response)=>{
        const res = response.data
        if (res.code == 200) {
          this.product = res.body;
          this.product.isEnable = this.product.isEnable == true ? 'true' :'false'
          this.product.busTypeList.forEach(ele=>{
            if(ele.businessTypeCode == 'CASH'){
              this.preloanCashRadioShow = true
            }
            this.busList.push(ele.businessTypeCode)
          })
          this.product.busTypeList = this.busList
        }else{
          this.$message({
            showClose: true,
            type: 'error',
            message:res.message
          })
        }
      })
    },
    getGrantRule(){
      getGrantRule().then(response=>{
        const res = response.data
        if(res.code == 200){
          res.body.forEach(ele=>{
            this.grantRuleCodeOptions.push({
              text:ele.ruleName,
              value:ele.ruleNo
            })
          })
        }else{
          this.$message({
            showClose: true,
            type: 'error',
            message:res.message
          })
        }
      })
    },
    handleSave() {
      this.$refs.product.validate((valid) => {
        if (valid) {
          this.product.busTypeList.forEach(ele=>{
              this.busTypeList.push({
                "businessTypeCode": ele
              })
          })
          this.product.busTypeList = this.busTypeList
          this.product.isEnable = this.product.isEnable == 'true' ? true :false
          delete this.product.updatedTime
          if (this.mode == 'CREATE') {
            addChannel(this.product).then(response=>{
              this.submit(response,'添加成功')
            })
          }else{
            editChannel(this.product).then(response=>{
              this.submit(response,'编辑成功')
            })
          }
        } else {
          return false;
        }
      });
    },
    submit(response,message){
      const res = response.data
      if(res.code == 200){
        this.$message({
          type: 'success',
          message: message
        })
        this.showDialog = false
        window.opener.location.href=window.opener.location.href
        setTimeout(() => {
          window.close()
        }, 100)
      }else{
        this.$message({
          showClose: true,
          type: 'error',
          message: res.message
        });
        this.$refs.product.resetFields();
      }
    },
    changeBussinessType(val){
      if(val.indexOf("CASH") != -1){
        this.preloanCashRadioShow = true
      }else{
        this.preloanCashRadioShow = false
      }
    },
    changeStartWay(val){
      this.product.isEnable = val
    }
  }
}
</script>

<style scoped>

</style>


