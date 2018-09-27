<!--商户管理-订单详情-->
<template>
  <div class="box">
    <!--=======商户管理-订单详情页-订单信息===start========-->
    <label>订单信息</label>
    <el-form label-width="100px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="订单编号:">{{shopOrder.platOrderId}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商户:">{{shopOrder.shopName}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商户账号:">{{shopOrder.loginMobile}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单状态:">{{$filter(shopOrder.orderStatus, this.$enum.DEAL_STATUS)}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="创建时间:">{{shopOrder.createdTime}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="最后更新时间:">{{shopOrder.updatedTime}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--=======商户管理-订单详情页-订单信息===end========-->

    <br/>
    <br/>
    <!--=======商户管理-订单详情页-商品信息===start========-->
    <label>商品信息</label>
    <div class="box">
      <label>订单总金额(元)：{{shopOrder.orderAmount}}</label>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <label>订单总成本价(元)：{{shopOrder.settleAmount}}</label>
      <br/>
      <br/>
      <el-table :data="shopOrderGoodsList" border>
        <el-table-column v-for="(col, index) in shopTable" :prop="col.prop" :label="col.label" :key="index" align="center"></el-table-column>
      </el-table>
    </div>
    <!--=======商户管理-订单详情页-商品信息===end========-->

    <br/>
    <br/>
    <!--=======商户管理-订单详情页-备注信息===start========-->
    <label>备注：</label>
    <br/>
    <br/>
    <label>订单日志：</label>
    <div class="box">
      <el-col :span="12">
        <el-table :data="shopOrderOperLogList" border>
          <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
          <el-table-column v-for="(col, index) in logTable" :prop="col.prop" :label="col.label" :key="index" align="center"></el-table-column>
        </el-table>
      </el-col>
    </div>
    <!--=======商户管理-订单详情页-备注信息===end========-->

  </div>
</template>

<script>

  // 获取订单详情信息
  import {getOrderDetail} from '../../api/shop';

  export default {
    data() {
      return {
        // 订单收货人信息、订单信息、商品信息
        shopOrder: {},
        // 订单商品列表数据
        shopOrderGoodsList: [],
        // 订单备注列表数据
        shopOrderOperLogList: [],
        // 商品信息title
        shopTable: [
          {
            label: "商品编号",
            prop: "orderGoodsId" // todo 这个商品编号 目前泰然城那边不会传给我们  那我们只能取orderGoodsId
          },
          {
            label: "商品名称",
            prop: "goodsName"
          },
          {
            label: "商品数量",
            prop: "goodsNum"
          },
          {
            label: "商品单价",
            prop: "goodsAmount"
          }
        ],
        // 订单日志title
        logTable: [
          {
            label: "时间",
            prop: "operDate"
          },
          {
            label: "订单节点",
            prop: "content"
          }
        ]
      };
    },
    created() {
      this.getOrderDetail();
    },
    methods: {
      /**
       * 获取订单详细信息
       */
      getOrderDetail() {
        const _self = this;
        getOrderDetail({orderId: _self.$route.params.id}).then((result => {
          result = result.data;
          if (result.code == 200) {
            _self.shopOrder = result.body.shopOrder;
            _self.shopOrderGoodsList = result.body.shopOrderGoodsList;
            _self.shopOrderOperLogList = result.body.shopOrderOperLogList;
          } else {
            _self.$message({
              showClose: true,
              message: result.message,
              type: 'error'
            });
          }
        }))
      },
    }
  };
</script>
