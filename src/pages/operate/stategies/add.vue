<!--运营管理 策略促销-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>

<template>
<div class="box">
<!--=========运营管理-策略促销页-新增 start===========-->  
    <el-form :model="addForm" ref="ruleForm" :rules="rules" label-width="140px" style="width: 600px;margin: 30px 50px;">

      <el-form-item label="促销名称" prop="name">
        <el-input :disabled="!!id" v-model.trim="addForm.name"  placeholder="促销名称（15字内字符）" maxlength="15"></el-input>
      </el-form-item>

      <el-form-item label="促销类型" prop="type">
        <kd-select :disabled="!!id" v-model="addForm.type" :options="addTypeOptions"></kd-select>
      </el-form-item>

      <el-card shadow="never" style="margin-bottom:22px" v-if="addForm.type">
          <!-- PROMOTION_INTEREST_FREE -->
          <el-form-item label="最大免息金额" label-width="100px" v-if="addForm.type == 'PROMOTION_INTEREST_FREE'">
            <el-input :disabled="!!id" type="number" v-model.number="addForm.maxInterestFreeAmount" placeholder="最大免息金额（为空，则无免息金额上限）"></el-input>
          </el-form-item>
          <!-- PROMOTION_DISCOUNT -->
          <template v-if="addForm.type == 'PROMOTION_DISCOUNT'">
            <el-form-item label="折扣数"  prop="discountRate" label-width="100px" >
              <kd-input :disabled="!!id" type="number"  v-model="addForm.discountRate" placeholder="折扣数(0-100数字)" unit="%"></kd-input>
            </el-form-item>
            <el-form-item label="是否存在最大利息折扣期数" style="margin-bottom:5px" label-width="280px" >
              <el-radio :disabled="!!id" v-model="addForm.hasMaxDiscountPeriods" :label="true">是</el-radio>
              <el-radio :disabled="!!id" v-model="addForm.hasMaxDiscountPeriods" :label="false">否</el-radio>
            </el-form-item>
          </template>
          <!-- 'PROMOTION_INTEREST_FREE' || hasMaxDiscountPeriods -->
          <el-form-item :label="addForm.type == 'PROMOTION_INTEREST_FREE' ? '免息配置':' '"  label-width="100px" v-if="addForm.type == 'PROMOTION_INTEREST_FREE' || addForm.hasMaxDiscountPeriods">
            <el-table border :data="addForm.promotionPeriodsList">
                <el-table-column prop="loanPeriods" label="期数" align="center"></el-table-column>
                <el-table-column label="免X期" align="center">
                  <template slot-scope="scope">
                    <el-form :model="scope.row" :ref="'tableRef' + scope.$index">
                      <el-form-item prop="promotionPeriods" :rules="tableRules[scope.$index]" :style="!id?'margin-bottom: 18px;':''">
                        <el-input :disabled="!!id" type="number" size="mini"  v-model.number="scope.row.promotionPeriods"  :placeholder="`请输入免息期数(数字0-${scope.row.loanPeriods})`"  style="text-align: center;"></el-input>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
            </el-table>
          </el-form-item>
      </el-card>

      <el-form-item label="备注">
        <el-input :disabled="!!id" v-model="addForm.memo" maxlength="50" type="textarea" placeholder="备注" ></el-input>
      </el-form-item>

      <el-form-item  label-width="240px">
        <el-button type="primary" @click="handleSubmitAdd" :loading="submitLoading" :disabled="submitLoading" v-if="!id">提交</el-button>
      </el-form-item>
    </el-form>
<!--=========运营管理-策略促销页-新增 end===========-->
</div>
</template>

<script>
import {addPromotion, queryPromotion} from '@/api/operate'
export default {
  name: "OperateAddStategiesPage",
  data() {
    var validateDiscountRate = (rule, value, callback) => {
      if(!Number.isInteger(value) || value < 0 || value > 100 ) {
        callback(new Error('生成总数应为0-100整数'))
      } else {
        callback()
      }
    }
    var validateNumber3 = (rule, value, callback) => {
      if(!Number.isInteger(value) || value < 0 || value > 3 ) {
        callback(new Error('期数应为0-3整数'))
      } else {
        callback()
      }
    }
    var validateNumber6 = (rule, value, callback) => {
      if(!Number.isInteger(value) || value < 0 || value > 6 ) {
        callback(new Error('期数应为0-6整数'))
      } else {
        callback()
      }
    }
    var validateNumber12 = (rule, value, callback) => {
      if(!Number.isInteger(value) || value < 0 || value > 12 ) {
        callback(new Error('期数应为0-12整数'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        name: [
          { required: true, message: '请输入促销名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择促销类型', trigger: 'change' }
        ],
        discountRate: [
          { required: true, message: '请输入折扣数', trigger: 'blur' },
          { validator: validateDiscountRate, trigger: 'blur' }],
      },
      tableRules: [
        [{ required: true, message: '请输入期数', trigger: 'blur' }, {validator: validateNumber3, trigger: 'blur' }],
        [{ required: true, message: '请输入期数', trigger: 'blur' }, {validator: validateNumber6, trigger: 'blur' }],
        [{ required: true, message: '请输入期数', trigger: 'blur' }, {validator: validateNumber12, trigger: 'blur' }],
      ],
      id: undefined, // 查询id
      // =========== 增加促销
      submitLoading: false,
      dialogAddVisible: false,
      addForm:{
        type: undefined, // 促销类型
        name:undefined, // 促销名称
        maxInterestFreeAmount: undefined, // 最大免息金额
        discountRate: undefined, // 折扣数
        promotionPeriodsList: [{
          loanPeriods: 3,
          promotionPeriods: undefined
        },{
          loanPeriods: 6,
          promotionPeriods: undefined
        },{
          loanPeriods: 12,
          promotionPeriods: undefined
        }], // 免息期数集合
        hasMaxDiscountPeriods: false, // 是否有最大折扣期数
        memo: undefined // 备注
      },
      // 促销类型的options
      addTypeOptions: Object.keys(this.$enum.PROMOTION_TYPE_MAP).map(i => {return {value: i, text: this.$enum.PROMOTION_TYPE_MAP[i]}}),
    };
  },

  methods: {
    // ================ 活动配置
    handleSubmitAdd() {
      // 将免息配置进行过滤，没有填期数的不上传
      let listTmp = this.addForm.promotionPeriodsList.filter(i => !!i.promotionPeriods)
      let arr = [false]
      if(this.addForm.type == 'PROMOTION_INTEREST_FREE' || this.addForm.hasMaxDiscountPeriods) {
        arr = [false,false,false,false]
        this.$refs.tableRef0.validate((valid) => {if(valid) { arr[1] = true}})
        this.$refs.tableRef1.validate((valid) => {if(valid) { arr[2] = true}})
        this.$refs.tableRef2.validate((valid) => {if(valid) { arr[3] = true}})
      }
      this.$refs.ruleForm.validate((valid) => {if(valid) { arr[0] = true}})
      if(arr.every(i => i)) {
        this.submitLoading = true
        if(this.addForm.type == 'PROMOTION_INTEREST_FREE') {
           this.addForm.hasMaxDiscountPeriods = true
        }
        addPromotion({...this.addForm, promotionPeriodsList: listTmp}).then(res => {
          if(res.data.code == '200') {
            this.$message.success('新增成功')
            this.$router.push({name: "OperateStategiesPage"})
          }else {
            this.$message.error('失败：'+res.data.message)
          }
        }).finally(_ => {
          this.submitLoading = false
        })
      }
    }
  },
  mounted(){
    this.id = this.$route.query.id
    if(!!this.id){
      this.$route.meta.title = '策略促销-编辑'
      queryPromotion(this.id).then(res => {
        this.addForm = res.data.body
      })
    }else{
      this.$route.meta.title = '策略促销-新增'
    }
  }
};
</script>


