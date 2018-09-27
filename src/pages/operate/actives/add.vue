<!--运营管理 活动列表-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>

<template>
<div class="box">
  <!-- ==  活动配置start  ====================== -->
    <el-form label-width="130px" style="width: 550px;margin: 35px 50px;" ref="ruleFormRef" :model="addForm" :rules="rules">
          <el-form-item label="活动名称" prop="name">
            <el-input :disabled="!!id" v-model="addForm.name" placeholder="活动名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="活动时间" prop="beginTime">
            <el-date-picker :disabled="!!id" v-model="appDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="活动类型" prop="type">
            <kd-select :disabled="!!id" v-model="addForm.type" :options="activityTypeOptions"></kd-select>
          </el-form-item>

          <el-form  v-show="addForm.type == 'PROMOTION'" label-width="130px" ref="promotionFormRef" :model="addForm.promotionActivityRuleReq" :rules="rules.promotionRules">
            <!-- ==  活动配置-策略促销start  ====================== -->
            <el-form-item label="绑定促销" v-if="!!id">
              <span  style="color:#999">{{addForm.strategyName}}</span>
            </el-form-item>
            <el-form-item label="绑定促销" v-if="!id" prop="strategyName">
              <!-- <el-input v-show="false" v-model="addForm.promotionActivityRuleReq.strategyName"></el-input> -->
              <source-table type="PROMOTION" @submit="handleSourceTableList" :isradio="true"></source-table>
            </el-form-item>
            <el-form-item label="使用场景" prop="activitySceneMap">
              <kd-select :disabled="!!id" v-model="addForm.promotionActivityRuleReq.activitySceneMap" :options="activitySceneMapOptions"></kd-select>
            </el-form-item>
            <el-form-item label-width="30px" v-show="addForm.promotionActivityRuleReq.activitySceneMap" prop="promotionSourceList">
              <!-- 商户 -->
              <div v-if="addForm.promotionActivityRuleReq.activitySceneMap == 'CONSUMER'">
                <source-table type="SHOP" @submit="handleSourceTableList" btntext="点击添加商户" :addgoods="true" :list="sourceTableShopListPromotion"></source-table>
              </div>
              <!-- 渠道 -->
              <source-table type="CHANNEL" @submit="handleSourceTableList" btntext="点击添加渠道" :list="sourceTableChannelListPromotion"></source-table>
            </el-form-item>
            <el-form-item label="优先级" prop="priority">
              <el-input v-model.number="addForm.promotionActivityRuleReq.priority" type="number" placeholder="优先级(0-99)，不填默认为99" clearable></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="addForm.memo" maxlength="50" type="textarea" placeholder="备注" ></el-input>
            </el-form-item>
            <!-- ==  活动配置-策略促销end  ======================== -->
          </el-form>

          <el-form  v-show="addForm.type == 'LUCKY_DRAW'" label-width="130px" ref="luckyFormRef" :model="addForm.luckyDrawRuleReq" :rules="rules.luckyRules">
            <!-- ==  活动配置-抽奖start  ====================== -->
            <el-form-item label="绑定抽奖" v-if="id">
              <span  style="color:#999">{{addForm.strategyName}}</span>
            </el-form-item>
            <el-form-item label="绑定抽奖" prop="luckyDrawName"  v-else>
              <source-table type="LUCKY_DRAW" @submit="handleSourceTableList" :isradio="true"></source-table>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="addForm.memo" maxlength="50" type="textarea" placeholder="备注" ></el-input>
            </el-form-item>
            <el-form-item label="抽奖次数设置"></el-form-item>
            <el-form-item label="活动期间有" prop="timesPerDay">
              <kd-input type="number" v-model.number="addForm.luckyDrawRuleReq.timesPerDay" placeholder="0-999" unit="次"></kd-input>
            </el-form-item>
            <el-form-item label="额外抽奖次数" prop="hasExtraTimes">
              <el-radio-group @change="handleLuckyRadioChange" v-model="addForm.luckyDrawRuleReq.hasExtraTimes">
                <el-radio  :label="true">是</el-radio>
                <el-radio  :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-card shadow="never" style="color: #606266;margin-bottom: 22px;" v-if="addForm.luckyDrawRuleReq.hasExtraTimes">
              <el-form-item  label-width="0" prop="luckyShopList">
                支持商户<source-table type="SHOP" @submit="handleSourceTableList" :list="sourceTableShopListLucky"></source-table>
              </el-form-item>
              <el-form-item label-width="0" prop="loanStandard" style="display: inline-block">
                消费贷账单单笔满<kd-input type="number" v-model.number="addForm.luckyDrawRuleReq.loanStandard" placeholder="1-9999999" size="mini" style="width: 160px" unit="元"></kd-input>
              </el-form-item>
              <el-form-item label-width="0" prop="timesPerLoanStandard" style="display: inline-block">
                可增加<kd-input type="number" v-model.number="addForm.luckyDrawRuleReq.timesPerLoanStandard" placeholder="0-999" size="mini" style="width: 130px" unit="次"></kd-input>
              </el-form-item>

              <el-form-item label-width="0" prop="luckyChannelList" style="margin-top: 40px;">
                支持渠道<source-table type="CHANNEL" @submit="handleSourceTableList"  :list="sourceTableChannelListLucky"></source-table>
              </el-form-item>
              <el-form-item  label-width="0" prop="withdrawStandard" style="display: inline-block">
                单笔提现满<kd-input type="number" v-model.number="addForm.luckyDrawRuleReq.withdrawStandard" placeholder="1-9999999" size="mini" style="width: 160px" unit="元"></kd-input>
              </el-form-item>
              <el-form-item  label-width="0" prop="timesPerWithdrawStandard" style="display: inline-block">
                可增加<kd-input type="number" v-model.number="addForm.luckyDrawRuleReq.timesPerWithdrawStandard" placeholder="0-999" size="mini" style="width: 130px"  unit="次"></kd-input>
              </el-form-item>

              <el-row  style="margin-top: 40px;">
                <el-col :span="12">
                  <el-form-item label-width="0" prop="timesIncreaseLimit">
                    额度增加可增加<kd-input type="number" v-model.number="addForm.luckyDrawRuleReq.timesIncreaseLimit" placeholder="0-999" size="mini" style="width: 130px" unit="次"></kd-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label-width="0" prop="timesCredit">
                    授信成功可增加<kd-input type="number" v-model.number="addForm.luckyDrawRuleReq.timesCredit" placeholder="0-999" size="mini" style="width: 130px" unit="次"></kd-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <!-- ==  活动配置-抽奖end  ======================== -->
          </el-form>

          <el-form v-show="addForm.type == 'COUPON'" label-width="130px" ref="couponFormRef" :model="addForm.couponActivityRuleReq" :rules="rules.couponRules">
            <!-- ==  活动配置-卡券发放start  ====================== -->
              <el-form-item label="卡券绑定" prop="couponPackage">
                <source-table type="COUPON" @submit="handleSourceTableList" :list="sourceTableListCoupon"></source-table>
              </el-form-item>
              <el-form-item label="用户可领取次数" prop="limitUserReceive">
                <el-input v-model.number="addForm.couponActivityRuleReq.limitUserReceive"  :disabled="!!id" type="number" placeholder="用户可领取次数(0-999)" ></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="addForm.memo" maxlength="50" type="textarea" placeholder="备注" ></el-input>
              </el-form-item>
            <!-- ==  活动配置-卡券发放end  ======================== -->
          </el-form>
          <el-form-item>
            <el-button type="primary" :loading="saveLoading" :disabled="saveLoading" @click="handleSubmit()">提交</el-button>
          </el-form-item>
    </el-form>
  <!-- ==  活动配置end  ======================== -->
</div>
</template>

<script>
import {queryActivity, addActivity, putActivity} from '@/api/operate'
import sourceTable from '../components/sourceTable'
export default {
  name: "OperateAddActivesPage",
  components: {sourceTable},
  computed: {
    appDate: {
      get() {
        if (this.addForm.beginTime || this.addForm.endTime) {
          return [this.addForm.beginTime, this.addForm.endTime];
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.addForm.beginTime = range[0];
          this.addForm.endTime = range[1];
        } else {
          this.addForm.beginTime = undefined;
          this.addForm.endTime = undefined;
        }
      }
    }
  },
  data() {
    var promotionSourceListValidate = (rule, value, callback) => {
      if(this.sourceChannelListPromotion.length == 0){
        callback(new Error('渠道不为空'))
      }else {
        callback()
      }
    }
    var priorityValidate = (rule, value, callback) => {
      if(value == '' || value == undefined) {
        callback()
      }
      if(!Number.isInteger(value) || value < 0 || value > 99 ) {
        callback(new Error('优先级应为0-99整数'))
      } else {
        callback()
      }
    }
    var timesPer999Validate = (rule, value, callback) => {
      if(!Number.isInteger(value) || value < 0 || value > 999 ) {
        callback(new Error('请输入0-999整数'))
      } else {
        callback()
      }
    }

    var hasExtraTimesValidate = (rule, value, callback) => {
      const {loanStandard, timesPerLoanStandard, withdrawStandard, timesPerWithdrawStandard, timesCredit, timesIncreaseLimit} = this.addForm.luckyDrawRuleReq
      if(value) {
        if((loanStandard != '' || timesPerLoanStandard != '' || this.sourceShopListLucky.length != 0) && !(loanStandard != '' && timesPerLoanStandard != '' && this.sourceShopListLucky.length != 0 ) ) {
          if (this.sourceShopListLucky.length == 0 ) callback(new Error('请选择支持商户'))
          else if (loanStandard == '') callback(new Error('请输入消费贷账单单笔金额'))
          else if (timesPerLoanStandard == '') callback(new Error('请输入消费贷账单增加次数'))
        }  else if((withdrawStandard != '' || timesPerWithdrawStandard != '' || this.sourceChannelListLucky.length != 0) &&!(withdrawStandard != '' && timesPerWithdrawStandard != '' && this.sourceChannelListLucky.length != 0)) {
          if (this.sourceChannelListLucky.length == 0 ) callback(new Error('请选择支持渠道'))
          else if (withdrawStandard == '') callback(new Error('请输入单笔提现金额'))
          else if (timesPerWithdrawStandard == '') callback(new Error('请输入单笔提现增加次数'))
        } else if(timesCredit != '' 
          || timesIncreaseLimit != '' 
          || (loanStandard != '' && timesPerLoanStandard != '' && this.sourceShopListLucky.length != 0 ) 
          || (withdrawStandard != '' && timesPerWithdrawStandard != '' && this.sourceChannelListLucky.length != 0)) {
          callback()
        }else {
            callback(new Error('若有额外抽奖次数，消费贷、单笔提现、额度增加、授信成功应至少填写一项'))
        }
      } else {
        callback()
      }
    }
    var luckyListValidate = (rule, value, callback) => {
      this.$refs.luckyFormRef.validateField('hasExtraTimes') // 提交的时候验证表单 
      callback()
    }
    var standardValidate = (rule, value, callback) => {
      this.$refs.luckyFormRef.validateField('hasExtraTimes') // 提交的时候验证表单      
      if(value == '') {
        callback()
      } else if(!Number.isInteger(value) || value < 1 || value > 9999999 ) {
        callback(new Error('金额应为1-9999999整数'))
      } else {
        callback()
      }
    }
    var timesPerValidate = (rule, value, callback) => {
      this.$refs.luckyFormRef.validateField('hasExtraTimes') // 提交的时候验证表单      
      if(value == '') {
        callback()
      } else if(!Number.isInteger(value) || value < 0 || value > 999 ) {
        callback(new Error('次数应为0-999整数'))
      } else {
        callback()
      }
    }

    var couponPackageValidate = (rule, value, callback) => {
      if(this.addForm.couponActivityRuleReq.couponPackage.length == 0){
        callback(new Error('卡券不为空'))
      }else {
        callback()
      }
    }

    
    return {
      // rules
      rules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        beginTime: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
        type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
        promotionRules: {
          strategyName: [{ required: true, message: '请绑定促销', trigger: 'change' }],
          activitySceneMap: [{ required: true, message: '请选择使用场景', trigger: 'change' }],
          promotionSourceList: [{validator: promotionSourceListValidate, trigger: 'change'}],
          priority: [{validator: priorityValidate, trigger: 'blur'}]
        },
        luckyRules: {
          luckyDrawName: [{ required: true, message: '请绑定抽奖', trigger: 'change' }],
          timesPerDay: [{ required: true, message: '请输入活动期间次数', trigger: 'blur' },{validator: timesPer999Validate, trigger: 'blur'}],
          hasExtraTimes: [{validator: hasExtraTimesValidate, trigger: 'blur'}],
          luckyShopList: [{validator: luckyListValidate, trigger: 'change'}],
          loanStandard: [{validator: standardValidate, trigger: 'blur'}],
          timesPerLoanStandard: [{validator: timesPerValidate, trigger: 'blur'}],
          luckyChannelList: [{validator: luckyListValidate, trigger: 'change'}],
          withdrawStandard: [{validator: standardValidate, trigger: 'blur'}],
          timesPerWithdrawStandard: [{validator: timesPerValidate, trigger: 'blur'}],
          timesIncreaseLimit: [{validator: timesPerValidate, trigger: 'blur'}],
          timesCredit: [{validator: timesPerValidate, trigger: 'blur'}],
        },
        couponRules: {
          couponPackage: [{validator: couponPackageValidate, trigger: 'change'}],
          limitUserReceive:[{ required: true, message: '请输入用户可领取次数', trigger: 'blur' },{validator: timesPer999Validate, trigger: 'blur'}],
        }
      },
      // edit
      id: undefined, // 编辑时的id获取
      // 活动配置 ====================
      addForm: {
        name: undefined, // 活动名称
        beginTime: undefined, 
        endTime: undefined,
        type: undefined, // 活动类型,
        memo: undefined, // 备注
        // ======================= 策略促销
        promotionActivityRuleReq: {
          strategyId: undefined, // 策略ID 
          strategyName: undefined, // 策略名称 
          activitySceneMap: undefined, // 使用场景
          goodsList: [],
          priority: undefined, // 优先级
        },
        // ======================= 抽奖
        luckyDrawRuleReq: {
          luckyDrawId: undefined, // 抽奖ID
          luckyDrawName: undefined, // 抽奖名称 
          timesPerDay: undefined, // 每N天有M次机会:增加机会次数
          hasExtraTimes: false,  // 是否有额外的抽奖次数 
          loanStandard: '', // 消费贷满N元标准 
          timesPerLoanStandard: '', // 消费贷满N元增加M次:增加次数
          withdrawStandard: '',  // 提现标准
          timesPerWithdrawStandard: '', // 笔提现满N元增加M次:增加次数
          timesIncreaseLimit: '', // 额度增加可增加次数
          timesCredit: '', // 授信成功可增加次数
          goodsList: [
            // {
            //   goodsId: undefined, // 商品ID ,
            //   sourceId: undefined, // 商户ID、渠道ID ,
            //   sourceName: undefined, // 商户名称 ,
            //   sourceType: undefined // 来源类型
            // }
          ]
        },
        // ======================= 卡券发放
        couponActivityRuleReq: { // 卡券活动相关配置
          couponPackage: '', // 卡券ID,多个卡券用逗号分隔 ,
          limitUserReceive: 1, // 用户可领取
        }
      },
      saveLoading: false, // 保存时的loading
      // 活动类型
      activityTypeOptions: Object.keys(this.$enum.ACTIVITY_TYPE_MAP).map(i => {return {value: i, text: this.$enum.ACTIVITY_TYPE_MAP[i]}}),
      //  策略促销 - 使用场景map
      activitySceneMapOptions: Object.keys(this.$enum.USE_CASE_MAP).map(i => {return {value: i, text: this.$enum.USE_CASE_MAP[i]}}),
      // ==== lucky
      sourceShopListLucky: [], // 提交的list child->parent
      sourceChannelListLucky: [], // 提交的list child->parent
      sourceTableShopListLucky: [], // 编辑传递的list parent->child
      sourceTableChannelListLucky: [], //  编辑传递的list parent->child
      // ==== promotion
      sourceShopListPromotion: [], // 提交的list child->parent
      sourceChannelListPromotion: [], // 提交的list child->parent
      sourceTableShopListPromotion: [], // 编辑传递的list parent->child
      sourceTableChannelListPromotion: [], //  编辑传递的list parent->child
      //  ===== coupon
      sourceTableListCoupon: [],  //  编辑传递的list parent->child
      
    };
  },
  methods: {
    handleLuckyRadioChange(val) {
      this.$refs.luckyFormRef.validateField('hasExtraTimes') // 提交的时候验证表单
    },
    // 获得列表 -- child->parent数据， 根据type的不同类型进行数据处理
    handleSourceTableList(val, type) {
      // 活动类型 - 促销
      if(this.addForm.type == 'PROMOTION') {
        if (type == 'PROMOTION') {
          this.addForm.promotionActivityRuleReq.strategyId = val.id
          this.addForm.promotionActivityRuleReq.strategyName = val.name
          this.$refs.promotionFormRef.validateField('strategyName') // 提交的时候验证表单
        }
        if(type == 'SHOP') {
          this.sourceShopListPromotion = val
        }
        if(type == 'CHANNEL') {
          this.sourceChannelListPromotion = val
          this.$refs.promotionFormRef.validateField('promotionSourceList') // 提交的时候验证表单
        }
        this.addForm.promotionActivityRuleReq.goodsList = this.sourceShopListPromotion.concat(this.sourceChannelListPromotion)
      }
      //  活动类型 - 抽奖
      if(this.addForm.type == 'LUCKY_DRAW') {
        if(type == 'LUCKY_DRAW') {
          this.addForm.luckyDrawRuleReq.luckyDrawId = val.id
          this.addForm.luckyDrawRuleReq.luckyDrawName = val.name
          this.$refs.luckyFormRef.validateField('luckyDrawName') // 提交的时候验证表单
        }
        if(type == 'SHOP') {
          this.sourceShopListLucky = val
          this.$refs.luckyFormRef.validateField('luckyShopList') // 提交的时候验证表单
        }
        if(type == 'CHANNEL') {
          this.sourceChannelListLucky = val
          this.$refs.luckyFormRef.validateField('luckyChannelList') // 提交的时候验证表单
        }
        this.addForm.luckyDrawRuleReq.goodsList = this.sourceShopListLucky.concat(this.sourceChannelListLucky)
      }
      //  活动类型 - 卡券
      if(this.addForm.type == 'COUPON') {
        this.addForm.couponActivityRuleReq.couponPackage = val.map(i => i.publishNo).join(',')
        this.$refs.couponFormRef.validateField('couponPackage') // 提交的时候验证表单
      }
    },

    // 提交
    handleSubmit() {
      let totalRule = false
      let partRule = false
      this.$refs.ruleFormRef.validate((valid) => { if (valid) { totalRule = true }})
      if (this.addForm.type == 'PROMOTION') {
        this.$refs.promotionFormRef.validate((valid) => { if (valid) { partRule = true }})
      } else if(this.addForm.type == 'LUCKY_DRAW') {
        this.$refs.luckyFormRef.validate((valid) => { if (valid) { partRule = true }})
      } else if (this.addForm.type == 'COUPON') {
        this.$refs.couponFormRef.validate((valid) => { if (valid) { partRule = true }})
      }
      if(totalRule && partRule) {
        let params = this.paramsFormat()
          let res
          this.saveLoading = true
          if(!!this.id) {
            res = putActivity(this.id, params)
          } else {
            res = addActivity(params)
          }
          res.then(res => {
            if(res.data.code == 200) {
              this.$message.success(`${!!this.id?'编辑':'新增'}成功`)
              this.$router.push({
                name: "OperateActivesPage"
              })
            }
          }).finally(err => {
              this.saveLoading = false
          })
      }
    },

    // 提交的时候的params格式化
    paramsFormat() {
      let params = {
        memo: this.addForm.memo, // 备注
      }
      // ============= 编辑
      if(!!this.id) {
        //  活动类型 - 促销
        if(this.addForm.type == 'PROMOTION') {
          params.priority = this.addForm.promotionActivityRuleReq.priority,
          params.promotionActivityRuleReq = { 
            goodsList: this.addForm.promotionActivityRuleReq.goodsList 
          }
        }
        //  活动类型 - 抽奖
        if(this.addForm.type == 'LUCKY_DRAW') {
          if(this.addForm.luckyDrawRuleReq.hasExtraTimes) {
            params.luckyDrawRuleReq = this.addForm.luckyDrawRuleReq
          } else {
            params.luckyDrawRuleReq = {
              luckyDrawId: this.addForm.luckyDrawRuleReq.luckyDrawId, // 抽奖ID
              luckyDrawName: this.addForm.luckyDrawRuleReq.luckyDrawName, // 抽奖名称 
              timesPerDay: this.addForm.luckyDrawRuleReq.timesPerDay, // 每N天有M次机会:增加机会次数
              hasExtraTimes: false,  // 是否有额外的抽奖次数 
            }
          }
        }
        //  活动类型 - 卡券
        if(this.addForm.type == 'COUPON') {
          params.couponActivityRuleReq = this.addForm.couponActivityRuleReq
        }
      } 
      // ============= 新增
      else {
        params = {
          ...params,
          name: this.addForm.name, // 活动名称
          beginTime: this.addForm.beginTime, 
          endTime: this.addForm.endTime,
          type: this.addForm.type, // 活动类型,
        }
        //  活动类型 - 促销
        if(this.addForm.type == 'PROMOTION') {
          // 将activitySceneMap的格式从字符串 'COMSUMER' 转换为 {COMSUMER: '消费贷'}的形式
          let asMap = this.addForm.promotionActivityRuleReq.activitySceneMap 
          let obj = {}
          obj[asMap] = this.$enum.USE_CASE_MAP[asMap]

          params.promotionActivityRuleReq = {
            ...this.addForm.promotionActivityRuleReq,
              activitySceneMap: obj,
          }
          params.priority = this.addForm.promotionActivityRuleReq.priority
        }
        //  活动类型 - 抽奖
        if(this.addForm.type == 'LUCKY_DRAW') {
          if(this.addForm.luckyDrawRuleReq.hasExtraTimes) {
            params.luckyDrawRuleReq = this.addForm.luckyDrawRuleReq
          } else {
            params.luckyDrawRuleReq = {
              luckyDrawId: this.addForm.luckyDrawRuleReq.luckyDrawId, // 抽奖ID
              luckyDrawName: this.addForm.luckyDrawRuleReq.luckyDrawName, // 抽奖名称 
              timesPerDay: this.addForm.luckyDrawRuleReq.timesPerDay, // 每N天有M次机会:增加机会次数
              hasExtraTimes: false,  // 是否有额外的抽奖次数 
            }
          }
        }
        //  活动类型 - 卡券
        if(this.addForm.type == 'COUPON') {
          params.couponActivityRuleReq = this.addForm.couponActivityRuleReq
        }
      }
      return params
    },

    // 初始化编辑状态
    initEditFormat() {
      //  活动类型 - 促销
      if(this.addForm.type == 'PROMOTION') {
        // 将shop类型，根据shopid进行goodsid归类{shopid: [{goodsId}]}
        let map = {}
        this.addForm.participateGoodsList.forEach((i, ix) => {
          if(i.sourceType == 'SHOP' && i.goodsId) {
            if(i.sourceId in map) {
              map[i.sourceId].push({goodsId: i.goodsId, disabled: true})
            } else {
              map[i.sourceId] = [{goodsId: i.goodsId, disabled: true}]
            }
          }
        })
        // 将数据，转换成sourceTable的表格数据
        this.addForm.participateGoodsList.forEach((i, ix) => {
          if(i.sourceType == 'SHOP') {
            if(i.sourceId in map) { 
              if(map[i.sourceId] && map[i.sourceId].length > 0) {
                this.sourceTableShopListPromotion.push({shopName: i.sourceName, shopCode: i.sourceId, shopGoodsList: map[i.sourceId], disabled: true})
              }
              map[i.sourceId] = []
            } else {
              this.sourceTableShopListPromotion.push({shopName: i.sourceName, shopCode: i.sourceId, disabled: true})
            }
            this.sourceShopListPromotion.push({ sourceType: i.sourceType, sourceName: i.sourceName, sourceId: i.sourceId, goodsId: i.goodsId}) // 临时数据-提交格式
          }
          if(i.sourceType == 'CHANNEL') {
            this.sourceTableChannelListPromotion.push({channelName: i.sourceName, channelCode: i.sourceId, disabled: true})
            this.sourceChannelListPromotion.push({sourceType: i.sourceType, sourceName: i.sourceName, sourceId: i.sourceId}) // 临时数据-提交格式
          }
        })
        this.addForm.promotionActivityRuleReq = { 
          priority: this.addForm.priority, // 优先级
          activitySceneMap: this.addForm.activityParticipateSceneList[0].sceneCode, // 使用场景
          goodsList: this.sourceChannelListPromotion.concat(this.sourceShopListPromotion) // 商户渠道列表
        }
      }
      //  活动类型 - 抽奖
      if (this.addForm.type == 'LUCKY_DRAW') {
        // 将数据，转换成sourceTable的表格数据
        this.addForm.activityParticipateSourceList.forEach((i, ix) => {
          if(i.sourceType == 'SHOP') {
            this.sourceTableShopListLucky.push({shopName: i.sourceName, shopCode: i.sourceId, disabled: true}) // 传值到sourcetable
            this.sourceShopListLucky.push({ sourceType: i.sourceType, sourceName: i.sourceName, sourceId: i.sourceId}) // 临时数据-编辑提交格式
          }
          if(i.sourceType == 'CHANNEL') {
            this.sourceTableChannelListLucky.push({channelName: i.sourceName, channelCode: i.sourceId, disabled: true}) // 传值到sourcetable
            this.sourceChannelListLucky.push({sourceType: i.sourceType, sourceName: i.sourceName, sourceId: i.sourceId}) // 临时数据-编辑提交格式
          }
        })
        let timesPerDay, withdrawStandard, timesPerWithdrawStandard, loanStandard, timesPerLoanStandard
        this.addForm.strategyConfigList.forEach((i, ix) => {
          // 活动期间内每key天增加value次
          if(i.paramCode == 'DAY_PERIODS')  {
            timesPerDay = i.paramValue
          }
          // 单笔提现达到key元可增加value次
          if(i.paramCode == 'CASH_STANDARD')  {
            withdrawStandard = i.paramKey
            timesPerWithdrawStandard = i.paramValue
          }
          // 消费贷账单单笔达到key元可增加value次
          if(i.paramCode == 'CONSUMER_STANDARD')  {
            loanStandard = i.paramKey
            timesPerLoanStandard = i.paramValue
          }
        })
        // 返回number
        function initNumHelper(value) {
          value = Number(value)
          if(isNaN(value)) value = ''
          return value
        }
        const {timesPerIncreaseLimit, timesCredit, hasExtraTimes} = this.addForm.luckyDrawStrategy
        this.addForm.luckyDrawRuleReq = {
          timesPerDay: initNumHelper(timesPerDay), // 每N天有M次机会:增加机会次数
          hasExtraTimes: hasExtraTimes,  // 是否有额外的抽奖次数 
          loanStandard: initNumHelper(loanStandard), // 消费贷满N元标准 
          timesPerLoanStandard: initNumHelper(timesPerLoanStandard), // 消费贷满N元增加M次:增加次数
          withdrawStandard: initNumHelper(withdrawStandard) ,  // 提现标准
          timesPerWithdrawStandard: initNumHelper(timesPerWithdrawStandard) , // 单笔提现满N元增加M次:增加次数
          timesIncreaseLimit: initNumHelper(timesPerIncreaseLimit) , // 额度增加可增加次数
          timesCredit: initNumHelper(timesCredit) , // 授信成功可增加次数
          goodsList: this.sourceShopListLucky.concat(this.sourceChannelListLucky) // 商户渠道列表
        }
      }
      //  活动类型 - 卡券
      if (this.addForm.type == 'COUPON') {
        let couponList = this.addForm.couponStrategy.couponDetailList
        couponList.forEach((i, index) => {
            this.sourceTableListCoupon.push({...i, disabled: true}) 
        })
        this.addForm.couponActivityRuleReq.couponPackage = couponList.map(i => i.publishNo).join(',')
        this.addForm.couponActivityRuleReq.limitUserReceive = this.addForm.couponStrategy.limitUserReceive

      }
    }
  },
  mounted () {
    this.id = this.$route.query.id
    if(!!this.id){
      this.$route.meta.title = '活动配置-编辑'
      queryActivity(this.id).then(res => {
        if(res.data.code == 200) {
          this.addForm = {...this.addForm, ...res.data.body}  
          this.initEditFormat() // 初始化编辑状态
        }
      })

    }else{
      this.$route.meta.title = '活动配置-新增'
    }
  }
}
</script>
