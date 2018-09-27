<!--商户管理-退款退货列表-->
<template>
  <div class="box">

    <!--=======商户管理-退款退货列表页-筛选条件===start========-->
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="退货/售后编号">
            <el-input v-model="searchParams.returnOrderNo" placeholder="请输入退货/售后编号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单编号">
            <el-input v-model="searchParams.shopOrderNo" placeholder="请输入订单编号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="贷款编号">
            <el-input v-model="searchParams.loanApplyId" placeholder="请输入贷款编号" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="发起时间">
            <el-date-picker v-model="searchParams.applyDate" type="daterange" value-format="yyyy-MM-dd"
                            range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商家订单号">
            <el-input v-model="searchParams.sellerOrderNo" placeholder="请输入商家订单号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="姓名">
            <el-input v-model="searchParams.buyPartyName" placeholder="请输入姓名" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="登录账号">
            <el-input v-model="searchParams.buyMobile" placeholder="请输入登录账号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商户名称">
            <el-input v-model="searchParams.goodsName" placeholder="请输入商户名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="退货状态">
            <kd-select v-model="searchParams.returnStatus" :group="$enum.RETURN_GOODS_STATUS" placeholder="请选择退货状态" clearable></kd-select>
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
    <!--=======商户管理-退款退货列表页-筛选条件===end========-->

    <!--=======商户管理-退款退货列表页-列表数据===start========-->
    <el-row>
      <el-table :data="returnList" border>
        <el-table-column v-for="(col, index) in returnTable" :prop="col.prop" :label="col.label" :key="index" align="center" :formatter="$tableDefFormat"></el-table-column>
        <el-table-column label="退款金额" align="center" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="退款退货详情">
              <el-button size="small" type="text" @click="handleDialog(scope.row.returnOrderNo)">{{scope.row.returnAmount}}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="退货状态" prop="returnStatus" align="center" fixed="right" :formatter="(row, col, val)=>$filter(val, this.$enum.RETURN_GOODS_STATUS)"></el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="total, prev, pager, next, jumper" :total="searchParams.total" :page-size="searchParams.pageSize" :current-page.sync="searchParams.pageNum"
                     @current-change="handleSearch"></el-pagination>
    </el-row>
    <!--=======商户管理-退款退货列表页-列表数据===end========-->

    <!--=======商户管理-退款退货列表页-退货还款详情===start========-->
    <el-dialog title="退货还款详情" :visible.sync="detailDialog">
      <el-table :data="returnDetail" border>
        <el-table-column v-for="(col, index) in returnDetailTable" :prop="col.prop" :label="col.label" :key="index" align="center" :formatter="$tableDefFormat"></el-table-column>
      </el-table>
    </el-dialog>
    <!--=======商户管理-退款退货列表页-退货还款详情===end========-->

  </div>
</template>

<script>

  // 获取退款退货数据
  import {getReturnList, exportReturnExcel, getReturnDetail} from '../../api/shop';

  export default {
    data() {
      return {
        // 筛选条件
        searchParams: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        // 退款退货列表数据
        returnList: [],
        // 列表title
        returnTable: [
          {
            label: "退货/售后编号",
            prop: "returnOrderNo"
          },
          {
            label: "订单编号",
            prop: "shopOrderNo"
          },
          {
            label: "贷款编号",
            prop: "loanApplyId"
          },
          {
            label: "发起时间",
            prop: "applyDate"
          },
          {
            label: "商家订单号",
            prop: "sellerOrderNo"
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
            label: "商品名称",
            prop: "goodsName"
          },
          {
            label: "订单名称",
            prop: "orderTitle"
          },
          {
            label: "订单金额",
            prop: "orderAmount"
          }
        ],
        //详情弹出框dialog
        detailDialog: false,
        // 退款退货列表数据
        returnDetail: [],
        // 详情title
        returnDetailTable: [
          {
            label: "实还本金",
            prop: "principal"
          },
          {
            label: "实还基本利息1",
            prop: "fee1"
          },
          {
            label: "实还基本利息2",
            prop: "fee2"
          },
          {
            label: "实还综合管理费",
            prop: "manage"
          },
          {
            label: "实还账户管理费",
            prop: "account"
          },
          {
            label: "实还逾期罚息",
            prop: "overdueFee"
          },
          {
            label: "实还逾期管理费",
            prop: "overdueManage"
          }
        ]
      };
    },
    created() {
      this.handleSearch();
    },
    methods: {
      /**
       * 获取退款退货列表数据
       */
      handleSearch() {
        const _self = this;


        // 时间控件处理，退款退货发起时间拆分赋值到applyDateStart、applyDateStart
        if (_self.searchParams.applyDate && _self.searchParams.applyDate.length === 2) {
          _self.searchParams.applyDateStart = _self.searchParams.applyDate[0];
          _self.searchParams.applyDateEnd = _self.searchParams.applyDate[1];
        } else {
          delete _self.searchParams.applyDateStart;
          delete _self.searchParams.applyDateEnd;
        }


        getReturnList(_self.searchParams).then((result => {
          result = result.data;
          if (result.code == 200) {
            _self.searchParams.total = result.body.total;
            _self.returnList = result.body.content;
          } else {
            _self.$message({
              showClose: true,
              message: result.message,
              type: 'error'
            });
          }
        }))
      },
      handleExport() {
        const _self = this;
        exportReturnExcel(_self.searchParams)
          .then((result => {
            if (result.status == 200) {
              let data = result.data;
              let filename = result.headers["content-disposition"]
                ? result.headers["content-disposition"].split("filename=")[1]
                : "return_list.xlsx";
              this.$downloadExcel(data, filename);
            }
          }))
      },
      handleDialog(returnOrderNo) {

        const _self = this;
        getReturnDetail({returnOrderNo: returnOrderNo}).then((result => {
          result = result.data;
          if (result.code == 200) {
            _self.returnDetail = [];
            _self.returnDetail.push(result.body);
            this.detailDialog = true;
            // _self.searchParams.total = result.body.total;
            // _self.returnList = result.body.content;
          } else {
            _self.$message({
              showClose: true,
              message: result.message,
              type: 'error'
            });
          }
        }));
      }
    }
  };
</script>
