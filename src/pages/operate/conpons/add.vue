<!--运营管理 卡券管理-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>

<template>
<div class="box">
  <!--=========运营管理-卡券管理页-新增卡券 start===========-->
  <el-form ref="ruleForm" :model="addForm" :rules="rules" label-width="96px" style="margin-top: 40px;margin-left: 20px;">
    <el-row>
      <el-col :span="12">
        <el-form-item label="卡券名称"  prop="couponName">
          <el-input v-model.trim="addForm.couponName" placeholder="该名称用于前端展示" :disabled="!!id"></el-input>
        </el-form-item>
        <el-form-item label="生成总数"  prop="totalNum">
          <el-input type="number" v-model.number="addForm.totalNum" placeholder="输入正整数（1-999999999）"></el-input>
        </el-form-item>
        <el-form-item label="用户限领"  prop="receiveLimit">
          <el-input type="number" v-model.number="addForm.receiveLimit" placeholder="输入正整数，不大于生成总数"></el-input>
        </el-form-item>
        <el-form-item label="使用场景" prop="useCase" >
          <kd-select v-model="addForm.useCase" :options="useCaseOptions" :disabled="!!id" placeholder="请选择"></kd-select>
        </el-form-item>
        <el-form-item label-width="30px" v-if="addForm.useCase">
          <!-- 商户 -->
          <div v-show="addForm.useCase == 'CONSUMER'">
            <source-table type="SHOP" @submit="handleSourceTableList" btntext="点击添加商户" :list="shopList"></source-table>
            <el-button size="mini" icon="el-icon-plus" @click="handleAddGoods">点击添加商品</el-button>
            <div v-if="goodsList.length > 0">
              <i class="el-icon-success" style="color:#67C23A"></i> 已成功添加商品<strong>{{goodsList.length}}</strong>条
            </div>
          </div>
          <!-- 渠道 -->
          <source-table type="CHANNEL" @submit="handleSourceTableList" btntext="点击添加渠道" :list="channelList"></source-table>
        </el-form-item>
        <el-form-item label="领取时间" prop="receiveBeginTime">
          <el-date-picker v-model="receiveDateRange" type="datetimerange" value-format="timestamp"  start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="使用时间" :prop="isTimeRange?'effectiveDate':'effectiveNum'">
          <div>
            <el-radio v-model="isTimeRange" :label="true">日期</el-radio>
            <el-radio v-model="isTimeRange" :label="false">天数</el-radio>
          </div>
          <el-date-picker v-if="isTimeRange" v-model="effecDateRange" type="datetimerange" value-format="timestamp" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          <el-input v-else v-model="addForm.effectiveNum" placeholder="请输入有效天数"></el-input>
        </el-form-item>
        <el-form-item label="卡券使用条件">
          <span style="color: #909399">满 <el-input type="number" v-model.number="addForm.applyAmount" style="width: 100px;display: inline-block;"></el-input> 金额可用</span>
        </el-form-item>
      </el-col>
      <el-col :span="11" :offset="1">
        <el-form-item label="单日限领" prop="dayLimit">
          <el-input type="number" v-model.number="addForm.dayLimit" placeholder="输入正整数，不大于生成总数"></el-input>
        </el-form-item>
        <el-form-item label="卡券类型" prop="couponCategory">
          <kd-select v-model="addForm.couponCategory" :options="conponTypeOptions"  :disabled="!!id" placeholder="请选择"></kd-select>
        </el-form-item>
        <el-card shadow="never" v-if="addForm.couponCategory" style="margin-left: 30px">
          <el-form-item label="选择期数" prop="monthNum">
              <kd-select v-model="addForm.monthNum" :options="monthNumOptions" placeholder="请选择期数"></kd-select>
          </el-form-item>
          <!-- 免息券 -->
          <el-form-item label="免息期数" prop="freeMonthNum"  v-if="addForm.couponCategory == 'INTEREST_FREE'">
                <kd-input v-model="addForm.freeMonthNum"  placeholder="免息期数" unit="期"></kd-input> 
          </el-form-item>
          <!-- 折扣券 -->
          <template v-if="addForm.couponCategory == 'DISCOUNT'">
            <el-form-item label="折扣数" prop="discount">
              <kd-input type="number" v-model.number="addForm.discount" placeholder="请输入0-99的正整数" unit="%"></kd-input>
            </el-form-item>
            <el-form-item label="是否存在最大利息折扣期数" label-width="193px" prop="isMaxDiscount">
                <el-radio v-model="addForm.isMaxDiscount" :label="true">是</el-radio>
                <el-radio v-model="addForm.isMaxDiscount" :label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="最大折扣" prop="maxDiscountNum" v-if="addForm.isMaxDiscount">
                 <kd-input v-model="addForm.maxDiscountNum"  placeholder="折扣期数" unit="期"></kd-input> 
            </el-form-item>
          </template>
        </el-card>

        <el-button type="primary" @click="handleSubmit" style="margin-top: 30px;width:100px;margin-left: 200px" :loading="submitLoading" :disabled="submitLoading">提交</el-button>

      </el-col>
    </el-row>
  </el-form>
  <!--=========运营管理-卡券管理页-新增卡券 end===========-->
  <!-- == 商品选择start  ====================== -->
  <el-dialog title="上传商品" :visible.sync="dialogGoodsVisible" width="620px">
    <addGoods @getgoods="handleGoodsSubmit" :list="goodsList"></addGoods>
  </el-dialog>
  <!-- == 商品选择start  ====================== -->
</div>
</template>

<script>
import {addCouponInfo, getCouponInfo, editCouponInfo} from '@/api/operate'
import sourceTable from '../components/sourceTable'
import addGoods from '../components/addGoods'

export default {
  name: "OperateAddCouponPage",
  components: {sourceTable, addGoods},
  data() {
    var validateReceiveLimit = (rule, value, callback) => {
      if(!Number.isInteger(value)) {
        callback(new Error('请输入正整数'))
      } else if(value > this.addForm.totalNum) {
        callback(new Error('用户限领不大于生成总数'))
      } else {
        callback()
      }
    }
    var validateDayLimit = (rule, value, callback) => {
      if(value == undefined || value == '') {
        callback()
      } else if(!Number.isInteger(value)) {
        callback(new Error('请输入正整数'))
      } else if(value > this.addForm.totalNum) {
        callback(new Error('单日限领不大于生成总数'))
      } else {
        callback()
      }
    }
    var validateTotalNum = (rule, value, callback) => {
      if(!Number.isInteger(value) || value < 1 || value > 999999999 ) {
        callback(new Error('生成总数应为1-999999999整数'))
      } else {
        callback()
      }
    }
    var validateFreeMonthNum = (rule, value, callback) => {
      if(value > Number(this.addForm.monthNum)) {
        callback(new Error('所填期数不大于选择的期数'))
      } else {
        callback()
      }
    }
    var validateDiscount = (rule, value, callback) => {
      if(!Number.isInteger(value) || value < 0 || value > 99 ) {
        callback(new Error('折扣数应为0-99整数'))
      } else {
        callback()
      }
    }
    return {
      submitLoading: false,
      dialogGoodsVisible: false,
      dialogGoodsViewVisible: false,
      id: undefined, // 卡券id
      addForm: {
        couponName: undefined, // 卡券名称
        couponCategory: undefined, // 卡券类型
        totalNum: undefined, // 生成总数
        receiveLimit: undefined, // 用户限领
        useCase: undefined, // 使用场景
        channelTag: undefined, // 渠道
        bizTag: undefined, // 商户
        itemIds: undefined, // 商品
        receiveBeginTime: undefined, // 领取开始时间（时间戳毫秒格式）
        receiveEndTime: undefined, // 领取结束时间（时间戳毫秒格式）
        effectiveDate: undefined, // 卡券有效开始时间（时间戳毫秒格式）
        failureDate: undefined, // 卡券有效结束时间（时间戳毫秒格式）
        effectiveNum: undefined,  // 卡券有效天数（与卡券有效时间二选一）
        applyAmount: undefined,  // 卡券使用条件，不填时默认为0
        dayLimit: undefined, // 单日限领（不填时默认为-1）
        discount: undefined, // 折扣数（类型为折扣券时必填）
        isMaxDiscount: undefined, // 是否存在最大折扣,是：true;否：false
        maxDiscountNum: undefined, // 最大折扣期数，折扣券时必传
        monthNum: undefined, // 期数
        freeMonthNum: undefined, // 免息期数（免息券时必传）
      },
      isTimeRange: true,
      useCaseOptions: Object.keys(this.$enum.USE_CASE_MAP).map(i => {return {value: i, text: this.$enum.USE_CASE_MAP[i]}}),
      conponTypeOptions: Object.keys(this.$enum.COUPON_TYPE_MAP).map(i => {return {value: i, text: this.$enum.COUPON_TYPE_MAP[i]}}),
      monthNumOptions: [{value: '3', text: '3'},{value: '6', text: '6'},{value: '12', text: '12'}],
      rules: {
        couponName: [
          { required: true, message: '请输入卡券名称', trigger: 'blur' }],
        totalNum: [
          { required: true, message: '请输入生成总数', trigger: 'blur' },
          { validator: validateTotalNum, trigger: 'blur' }],
        receiveLimit: [
          { required: true, message: '请输入用户限领数量', trigger: 'blur' },
          { validator: validateReceiveLimit, trigger: 'blur' }],
        useCase: [
          { required: true, message: '请选择使用场景', trigger: 'change' }],
        receiveBeginTime: [
          { required: true, message: '请选择领取时间', trigger: 'change' }],
        effectiveDate: [
          { required: true, message: '请选择使用时间', trigger: 'change' }],
        effectiveNum: [
          { required: true, message: '请输入有效天数', trigger: 'blur' }],
        dayLimit: [
          { validator: validateDayLimit, trigger: 'blur' }],
        couponCategory:[
          { required: true, message: '请选择卡券类型', trigger: 'change' }],
        monthNum: [
          { required: true, message: '请选择期数', trigger: 'change' }],
        freeMonthNum: [
          { required: true, message: '请输入免息期数', trigger: 'blur' },
          { validator: validateFreeMonthNum, trigger: 'blur'}],
        discount: [
          { required: true, message: '请输入折扣数', trigger: 'blur' },
          { validator: validateDiscount, trigger: 'blur' }],
        isMaxDiscount: [
          { required: true, message: '请选择是否存在最大折扣期数', trigger: 'change' }],
        maxDiscountNum: [
          { required: true, message: '请输入最大折扣期数', trigger: 'blur' },
          {validator: validateFreeMonthNum, trigger: 'blur'}],
      },
      // ==
      channelList: [],
      shopList: [],
      goodsList: []
    };
  },
  computed: {
    receiveDateRange: {
      get() {
        if (this.addForm.receiveBeginTime || this.addForm.receiveEndTime) {
          return [this.addForm.receiveBeginTime, this.addForm.receiveEndTime];
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.addForm.receiveBeginTime = range[0];
          this.addForm.receiveEndTime = range[1];
        } else {
          this.addForm.receiveBeginTime = undefined;
          this.addForm.receiveEndTime = undefined;
        }
      }
    },
    effecDateRange: {
      get() {
        if (this.addForm.effectiveDate || this.addForm.failureDate) {
          return [this.addForm.effectiveDate, this.addForm.failureDate];
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.addForm.effectiveDate = range[0];
          this.addForm.failureDate = range[1];
        } else {
          this.addForm.effectiveDate = undefined;
          this.addForm.failureDate = undefined;
        }
      }
    },
  },
  methods: {
    handleViewGoods() {
      this.$refs.dialogGoodsRef && this.$refs.dialogGoodsRef.initListFun(this.goodsList) 
      this.dialogGoodsViewVisible = true
    },
    handleGoodsSubmit(val) {
      this.dialogGoodsVisible = false
      this.goodsList = val
      this.addForm.itemIds = this.goodsList.map(i => i.goodsId).join(',')
    },
    // 商户渠道传递列表处理
    handleSourceTableList(list, type) {
      let arr = (list.map(i => i.sourceId)).join(',')
      if(type == 'SHOP') {
        this.addForm.bizTag = arr
      }
      if(type == 'CHANNEL') {
        this.addForm.channelTag = arr
      }
    },
    handleAddGoods() {
      this.dialogGoodsVisible = true
    },
    // 提交保存
    handleSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.handleSubmitFormat() // 提交格式处理
          this.submitLoading = true
          let res
          this.id ? res = editCouponInfo(this.addForm) : res = addCouponInfo(this.addForm) // 如果存在id, 走编辑接口，不存在id，走新增接口
          res.then(res => {
            if(res.data.success) {
              this.$message.success(`卡券${!this.id ? '新增' : '编辑'}成功`)
                this.$router.push({
                name: "OperateCouponsPage"
              })
            } else {
              this.$message.success(res.data.message || `卡券${!this.id ? '新增' : '编辑'}失败`)
            }
          }).catch(err => {
            this.$message.error(err.data.error.description || `卡券${!this.id ? '新增' : '编辑'}失败`)
          }).finally(_ => {this.submitLoading = false})
        }
      })
    },

    // 提交格式处理
    handleSubmitFormat() {
      if(this.isTimeRange) {
        // 时间范围时，有效天数清空
        this.addForm.effectiveNum = undefined  
      } else {
        // 有效天数时，时间范围清空
        this.addForm.effectiveDate = undefined
        this.addForm.failureDate = undefined
      }
      if(this.addForm.couponCategory == 'DISCOUNT') {
        // 折扣时，免息的数据清空
        this.addForm.freeMonthNum = undefined
        // 如果不存在最大利息折扣期数，那么折扣期数等于选择期数
        if(!this.addForm.isMaxDiscount) {
          this.addForm.maxDiscountNum = this.addForm.monthNum
        }
      } else {
        // 免息时，折扣的数据清空
        this.addForm.maxDiscountNum = undefined  
        this.addForm.isMaxDiscount = undefined
        this.addForm.discount = undefined
      }
    },
    // 编辑格式初始化处理
    handleInitFormat () {
      if(this.addForm.effectiveNum) {
        // 如果存在有效天数，默认显示有效天数, 并将时间范围重置
        this.isTimeRange = false
        this.addForm.effectiveDate = undefined
        this.addForm.failureDate = undefined
      } else {
        // 如果没有有效天数，则将有效天数清空
        this.isTimeRange = true
        this.addForm.effectiveNum = undefined
      }
      if(this.addForm.dayLimit == -1) {
        // 单日限领为-1时，默认清空
        this.addForm.dayLimit = undefined
      }
      // 如果不存在最大利息折扣期数，那么折扣期数清空
      if(this.addForm.couponCategory == 'DISCOUNT' && !this.addForm.isMaxDiscount) {
          this.addForm.maxDiscountNum = undefined
      }
    }
  },
  created() {
    this.$store.dispatch('initShopChannelOptions')
  },
  mounted() {
    this.id = this.$route.query.id
    if(!!this.id){
      this.$route.meta.title = '编辑卡券'
      getCouponInfo(this.id).then(res => {
        if(res.data.code == '0') {
          this.addForm = {...this.addForm, ...res.data.data}
          this.addForm.channelTag && this.addForm.channelTag.split(',').forEach((i, index) => {
            this.$set(this.channelList, index, {channelCode: i, channelName: this.$store.state.couponStore.channelMap[i], disabled: true})
          })
          this.addForm.bizTag && this.addForm.bizTag.split(',').forEach((i, index) => {
            this.$set(this.shopList, index, {shopCode: i, shopName: this.$store.state.couponStore.shopMap[i], disabled: true})
          })
          this.addForm.itemIds && this.addForm.itemIds.split(',').forEach((i, index) => {
            this.$set(this.goodsList, index, {number: index + 1, goodsId: i, disabled: true})
          })
          this.handleInitFormat() // 编辑格式初始化处理
        }
      })
    }else{
      this.$route.meta.title = '新增卡券'
    }
  }
};
</script>


