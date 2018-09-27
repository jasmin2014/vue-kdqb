<!--商户管理-订单管理-->
<template>
  <div class="box">
    <!--=======商户管理-订单管理页-筛选条件===start========-->
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="订单类型">
            <kd-select v-model="searchParams.goodsType" :group="$enum.ORDER_TYPE" placeholder="请选择订单类型" clearable></kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品订单号">
            <el-input v-model="searchParams.platOrderId" placeholder="请输入商品订单号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="贷款编号">
            <el-input v-model="searchParams.loanApplyId" placeholder="请输入贷款订单号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商家订单号">
            <el-input v-model="searchParams.shopOrderNo" placeholder="请输入商家订单号" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="所属商家">
            <el-input v-model="searchParams.shopName" placeholder="请输入所属商家" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单名称">
            <el-input v-model="searchParams.orderTitle" placeholder="请输入订单名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户姓名">
            <el-input v-model="searchParams.buyPartyName" placeholder="请输入买家姓名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户手机号">
            <el-input v-model="searchParams.buyMobile" placeholder="请输入买家手机号" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="searchParams.createdTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="交易状态">
            <kd-select v-model="searchParams.orderStatus" :group="$enum.DEAL_STATUS" placeholder="请选择交易状态" clearable></kd-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" title="查询" @click="handleSearch"></el-button>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" title="导出 Excel" @click="handleExport">导出 Excel</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--=======商户管理-订单管理页-筛选条件===end========-->

    <!--=======商户管理-订单管理页-列表===start========-->
    <el-row>
      <el-table :data="orderList" border>
        <el-table-column label="订单类型" prop="goodsType" align="center" fixed="left" :formatter="(row, col, val)=>$filter(val, this.$enum.ORDER_TYPE)"></el-table-column>
        <el-table-column label="商品订单号" align="center" fixed="left">
          <template slot-scope="scope">
            <el-tooltip content="查看订单详情">
              <el-button size="small" type="text" @click="handleDetail(scope.row,'orderDetail')">{{scope.row.platOrderId}}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="贷款编号" align="center" fixed="left">
          <template slot-scope="scope">
            <el-tooltip content="查看贷款详情">
              <el-button v-if="scope.row.loanApplyId" size="small" type="text" @click="handleDetail(scope.row,'applyDetail')">{{scope.row.loanApplyId||'-'}}</el-button>
              <label v-if="!scope.row.loanApplyId" size="small" type="text">-</label>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-for="(col, index) in orderTable" :prop="col.prop" :label="col.label" :key="index" align="center" :formatter="col.formatter||$tableDefFormat"></el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="total, prev, pager, next, jumper" :total="searchParams.total" :page-size="searchParams.pageSize" :current-page.sync="searchParams.pageNum"
                     @current-change="handleSearch"></el-pagination>
    </el-row>
    <!--=======商户管理-订单管理页-列表===end========-->

  </div>
</template>

<script>

  // 获取订单列表
  import {getOrderList, exportOrderExcel} from '../../api/shop';

  export default {
    data() {
      return {
        // 订单列表筛选条件
        searchParams: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        // 订单列表数据
        orderList: [],
        // 订单列表title
        orderTable: [
          {
            label: "渠道",
            prop: "channelName"
          },
          {
            label: "商家订单号",
            prop: "shopOrderNo"
          },
          {
            label: "所属商家",
            prop: "shopName"
          },
          {
            label: "订单名称",
            prop: "orderTitle"
          },
          {
            label: "订单金额",
            prop: "orderAmount"
          },
          {
            label: "姓名",
            prop: "buyPartyName"
          },
          {
            label: "手机号",
            prop: "buyMobile"
          },
          {
            label: "创建时间",
            prop: "createdTime"
          },
          {
            label: "交易状态",
            prop: "orderStatus",
            formatter: (row, col, val) => this.$filter(val, this.$enum.DEAL_STATUS)
          }
        ]
      };
    },
    created() {
      this.handleSearch()
    },
    methods: {
      /**
       * 获取订单列表数据
       */
      handleSearch() {
        const _self = this;

        // 时间控件处理，将起始时间拆分赋值到createdTimeStart、createdTimeEnd
        if (_self.searchParams.createdTime && _self.searchParams.createdTime.length === 2) {
          _self.searchParams.createdTimeStart = _self.searchParams.createdTime[0];
          _self.searchParams.createdTimeEnd = _self.searchParams.createdTime[1];
        } else {
          delete _self.searchParams.createdTimeStart;
          delete _self.searchParams.createdTimeEnd;
        }

        getOrderList(_self.searchParams)
          .then((result => {
            result = result.data;
            if (result.code == 200) {
              _self.searchParams.total = result.body.total;
              _self.orderList = result.body.content;

            } else {
              _self.$message({
                showClose: true,
                message: result.message,
                type: 'error'
              });
            }
          }))
      },
      /**
       * 导出Excel
       */
      handleExport() {
        const _self = this;
        exportOrderExcel(_self.searchParams)
          .then((result => {
            if (result.status == 200) {
              let data = result.data;
              let filename = result.headers["content-disposition"]
                ? result.headers["content-disposition"].split("filename=")[1]
                : "order_list.xlsx";
              this.$downloadExcel(data, filename);
            }
          }))
      },
      /**
       * 查看订单详情，执行后跳转至订单详情页面 或 贷款详情页面
       * @param row  orderId订单id
       * @param type orderDetail:订单详情、applyDetail:贷款详情
       */
      handleDetail(row, type) {

        if (type === 'orderDetail') {
          this.$router.push({
            name: 'ShopOrderDetailPage',
            params: {id: row.orderId},
          });
        } else {
          const {href} = this.$router.resolve({
            name: "FinanceCreditManageDetailPage",
            params: {
              id: row.loanApplyId
            }
          });
          window.open(href, "_blank");
        }
      }
    }
  };
</script>
