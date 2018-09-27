<!--运营管理 卡券管理-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<template>
  <div class="box">
    <!--=========运营管理-卡券管理页-查看卡券 start===========-->    
    <el-form label-width="120px" style="margin-top: 40px;">
      <el-form-item label="卡券类型：">
        {{info.couponCategory | couponFilter}}
      </el-form-item>
      <el-form-item label="卡券名称：">
        {{info.couponName}}
      </el-form-item>
      <el-row>
        <el-col :span="5">
          <el-form-item label="生成总数：">
            {{info.totalNum}}张
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="已领取数量：" label-width="100px">
            {{info.totalNum-info.remainNum}}张
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="单个用户限领：" label-width="120px">
            {{info.receiveLimit}}张
          </el-form-item>
        </el-col>
         <el-col :span="9">
          <el-form-item label-width="0">
            卡券需满{{info.applyAmount}}元可使用，单日限发{{info.dayLimit==-1?'无上限':info.dayLimit+'张'}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="最大免息期数："  v-if="info.couponCategory =='INTEREST_FREE'">
            <el-table border  :data="interstData">
              <el-table-column label="期数" prop="month"></el-table-column>
              <el-table-column label="免息期数" prop="num"></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="最大折扣期数："  v-if="info.isMaxDiscount && info.couponCategory =='DISCOUNT'">
            <el-table border :data="discountData">
              <el-table-column label="期数" prop="month"></el-table-column>
              <el-table-column label="最大折扣期数" prop="num"></el-table-column>
            </el-table>
          </el-form-item>
           <el-form-item label="折扣：" v-if="info.couponCategory =='DISCOUNT'">
            {{info.discount}}%
          </el-form-item>
          <el-form-item label="可领取时间：">
            {{info.receiveBeginTime | dataFilter}} ~ {{info.receiveEndTime | dataFilter}}
          </el-form-item>
          <el-form-item label="可使用时间：">
            <span v-if="info.effectiveNum">有效天数{{ info.effectiveNum }}天</span>
            <span v-else>{{info.effectiveDate | dataFilter}} ~ {{info.failureDate | dataFilter}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="适用渠道：">
            <el-table border :data="channelList">
              <el-table-column prop="id" label="渠道id" align="center"></el-table-column>
              <el-table-column prop="name" label="渠道名称" align="center"></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="适用商户：">
            <el-table border :data="shopList">
              <el-table-column prop="id" label="商户id" align="center"></el-table-column>
              <el-table-column prop="name" label="商户名称" align="center"></el-table-column>
            </el-table>
          </el-form-item>
          <el-button @click="close()" type="primary" style="margin-top: 30px;width:100px;margin-left: 38px;">关闭</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!--=========运营管理-卡券管理页-查看卡券 end===========-->
  </div>
</template>

<script>
const COUPON_TYPE_MAP = {
  INTEREST_FREE: '免息券',
  DISCOUNT: '折扣券'
}
import {getCouponInfo} from '@/api/operate'
export default {
  name: "OperateCouponDetailPage",
  data() {
    return {
      info: {},
      interstData: [],
      discountData: [],
      channelList: [],
      shopList: []
    }
  },
  methods: {
    close () {
      this.$router.go(-1)
    },
    getData() {
      getCouponInfo(this.$route.params.id).then(res => {
        if(res.data.code == '0') {
          this.info = res.data.data
          this.interstData = [{month: this.info.monthNum, num: this.info.freeMonthNum}]
          this.discountData = [{month: this.info.monthNum, num: this.info.maxDiscountNum}]
          this.channelList = this.info.channelTag.split(',').map(i => {
            return {id: i, name: this.$store.state.couponStore.channelMap[i]}
          })
          this.shopList = this.info.bizTag.split(',').map(i => {
            return {id: i, name: this.$store.state.couponStore.shopMap[i]}
          })
        }
      })
    }
  },
  created() {
    this.$store.dispatch('initShopChannelOptions')
  },
  mounted() {
    this.getData()
  },
  filters: {
    couponFilter: function(value) {
      return COUPON_TYPE_MAP[value]
    },
    dataFilter: function (date, fmt = 'YYYY-MM-DD HH:mm:ss'){
        if (!date) {
            return ''
        }
        if (typeof date === 'string') {
            date = new Date(date.replace(/-/g, '/'))
        }
        if (typeof date === 'number') {
            date = new Date(date)
        }
        var o = {
            'M+': date.getMonth() + 1,
            'D+': date.getDate(),
            'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
            'H+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S': date.getMilliseconds()
        }
        var week = {
            '0': '\u65e5',
            '1': '\u4e00',
            '2': '\u4e8c',
            '3': '\u4e09',
            '4': '\u56db',
            '5': '\u4e94',
            '6': '\u516d'
        }
        if (/(Y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
        }
        return fmt
    }
  }
};
</script>


