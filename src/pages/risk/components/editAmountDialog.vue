<!--风控管理-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.custom-form {
  .el-row {
    width: 88%;
  }
  .el-form-item__label,
  .customlabel {
    border-right: none;
  }
}
</style>
<template>
  <!--=======风控管理-用户额度管理-编辑授信额度弹窗 start===========-->

  <el-dialog title="编辑授信额度" :visible.sync="showDialog" @closed="handleCancel">
    <el-form :model="currentValue" :rules="FormRules" ref="myEditAmountForms" label-width="120px" class="demo-ruleForm">
      <el-row>  
        <el-col :span="12">
          <el-form-item label="登录手机号" prop="name">
            <kd-input :mode="'VIEW'" v-model="currentValue.loginName"></kd-input>
          </el-form-item>  
        </el-col> 
        <el-col :span="12">
          <el-form-item label="姓名">
            <kd-input :mode="'VIEW'" v-model="currentValue.userName"></kd-input>
          </el-form-item>  
        </el-col>
        <el-col :span="12">
          <el-form-item label="可消费额度">
            <kd-input :mode="'VIEW'" v-model="currentValue.creditCurrent"></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="可提现额度">
            <kd-input :mode="'VIEW'" v-model="currentValue.creditWithdraw"></kd-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="有效期" required>
        <el-col :span="11">
          <el-form-item prop="startValidateTime">
            <kd-date-picker type="date" placeholder="开始时间" v-model="currentValue.startValidateTime" style="width: 100%;"></kd-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="1" align="center">-</el-col>
        <el-col :span="11">
          <el-form-item prop="endValidateTime">
            <kd-date-picker type="date" placeholder="结束时间" v-model="currentValue.endValidateTime" style="width: 100%;"></kd-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>      
      <el-row>
        <el-col :span="12">
          <el-form-item label="总授信额度" prop="creditTotal">
            <kd-input v-model="currentValue.creditTotal"></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否有效" prop="isBind">
            <kd-radio v-model="currentValue.isBind"
                    :options="currentValue.bindOptions"
                    @change="handleChangeBind"></kd-radio> 
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="修改原因" prop="remarks">
        <kd-input type="textarea" :rows="3" v-model="currentValue.remarks"></kd-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>    
  </el-dialog>



  <!-- <el-dialog title="编辑授信额度" :visible.sync="showDialog" @closed="handleCancel">
    <el-form :model="currentValue" ref="myEditAmountForms" class="custom-form" :rules="FormRules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="登录手机号" :label-width="formLabelWidth">
            <kd-input :mode="'VIEW'" v-model="currentValue.loginName"></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <kd-input :mode="'VIEW'" v-model="currentValue.userName"></kd-input>
          </el-form-item>
        </el-col>     
        <el-col :span="12">
          <el-form-item label="可消费额度" :label-width="formLabelWidth">
            <kd-input :mode="'VIEW'" v-model="currentValue.creditCurrent"></kd-input>
          </el-form-item>
        </el-col>    
        <el-col :span="12">
          <el-form-item label="可提现额度" :label-width="formLabelWidth">
            <kd-input :mode="'VIEW'" v-model="currentValue.creditWithdraw"></kd-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>          
          <el-form-item label="有效期" :label-width="formLabelWidth" required>
            <el-row>
              <el-col :span="11">
                <el-form-item prop="successTime">
                  <el-date-picker type="date" placeholder="开始日期" v-model="currentValue.successTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2" align="center">-</el-col>
              <el-col :span="11">
                <el-form-item prop="invalidTime">
                  <el-date-picker type="date" placeholder="结束日期" v-model="currentValue.invalidTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="总授信额度" :label-width="formLabelWidth" prop="creditTotal">
            <kd-input v-model="currentValue.creditTotal"></kd-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否有效" :label-width="formLabelWidth" prop="isBind">
            <kd-radio v-model="currentValue.isBind"
                    :options="currentValue.bindOptions"
                    @change="handleChangeBind"></kd-radio>           
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>      
        <el-form-item label="修改原因" :label-width="formLabelWidth" prop="remarks">
          <kd-input type="textarea" :rows="3" v-model="currentValue.remarks"></kd-input>
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog> -->
  <!--=======风控管理-用户额度管理-编辑授信额度弹窗 end===========-->
</template>

<script>
export default {
  props: {
    value: Object,
    dialogFormVisible: Boolean,
    formLabelWidth: String,
    rules: Object
  },
  components: {},
  data() {
    return {
      currentValue: {
        bindOptions: [],
        userPropertyId: "",
        loginName: "",
        userName: "",
        creditWithdraw: 0,
        startValidateTime: "",
        endValidateTime: "",
        creditTotal: 0,
        isBind: "",
        remarks: "",
        creditCurrent: 0
      },
      FormRules: {},
      showDialog: false
    };
  },
  computed: {},
  watch: {
    value: function(val, oldVal) {
      this.currentValue = val;
    },
    "value.bindOptions": function(val, oldVal) {
      this.setCurrentValue(val, "bindOptions");
    },
    rules: function(val, oldVal) {
      this.FormRules = val;
    },
    dialogFormVisible: function(val, oldVal) {
      this.showDialog = val;
    }
  },
  created() {
    this.currentValue = this.value;
    this.currentValue.bindOptions = this.value.bindOptions;
    this.FormRules = this.rules;
    this.showDialog = this.dialogFormVisible;
  },
  methods: {
    resetFields() {
      this.$refs["myEditAmountForms"].resetFields();
    },
    handleChangeBind(val) {
      this.$emit("change-bind", val);
    },
    handleSubmit(value) {
      value = this.currentValue;
      console.log("handleSubmit_value:", value);
      this.$refs["myEditAmountForms"].validate(valid => {
        if (valid) {
          this.$emit("submit", value);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCancel() {
      this.$emit("cancel");
    },
    setCurrentValue(val, key) {
      if (this.currentValue.hasOwnProperty(key)) {
        if (typeof val === "object" && val instanceof Array) {
          this.currentValue[key] = val;
        } else if (typeof val === "object") {
          for (const k in val) {
            if (this.currentValue[key].hasOwnProperty(k)) {
              this.currentValue[key][k] = val[k];
            }
          }
        } else {
          this.currentValue[key] = val;
        }
      }
    }
  }
};
</script>


