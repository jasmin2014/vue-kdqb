<!--商户管理-商户列表-->
<!--<style scoped>-->
<!--.fun-btns {-->
<!--margin-bottom: 22px;-->
<!--}-->
<!--</style>-->
<template>
  <div class="box">
    <!--=======商户管理-商户列表页-筛选条件===start========-->
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="商户编号">
            <el-input v-model="searchParams.shopCode" placeholder="请输入商户编号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商户名称">
            <el-input v-model="searchParams.shopName" placeholder="请输入商户名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" title="查询" @click="handleSearch"></el-button>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" title="添加商户" @click="handleDetail('CREATE')">添加商户</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--<el-row class="fun-btns">-->
    <!--<el-col>-->
    <!--<el-button type="primary" @click="handleDetail('CREATE')">添加商户</el-button>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--=======商户管理-商户列表页-筛选条件===end========-->

    <!--=======商户管理-商户列表页-列表===start========-->
    <el-row>
      <el-table :data="shopList" border>
        <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
        <el-table-column v-for="(col, index) in shopTable" :prop="col.prop" :label="col.label" :key="index" align="center" :formatter="$tableDefFormat"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template slot-scope="scope">
            <el-tooltip content="查看">
              <el-button type="primary" size="small" icon="el-icon-view" @click="handleDetail('VIEW',scope.row.shopInfoId)"></el-button>
            </el-tooltip>
            <el-tooltip content="编辑">
              <el-button type="warning" icon="el-icon-edit" size="small" @click="handleDetail('EDIT',scope.row.shopInfoId)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="total, prev, pager, next, jumper" :total="searchParams.total" :page-size="searchParams.pageSize" :current-page.sync="searchParams.pageNum" @current-change="handleSearch"></el-pagination>
    </el-row>
    <!--=======商户管理-商户列表页-列表===end========-->
  </div>
</template>

<script>
// 获取商户列表数据API
import { getShopList } from "../../api/shop";

export default {
  data() {
    return {
      // 商户列表筛选条件
      searchParams: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      // 商户列表数据
      shopList: [],
      // 商户列表title
      shopTable: [
        {
          label: "商户编号",
          prop: "shopCode"
        },
        {
          label: "商户名称",
          prop: "shopName"
        },
        {
          label: "关联账号",
          prop: "loginMobile"
        }
      ]
    };
  },
  created() {
    this.handleSearch();
  },
  methods: {
    /**
     * 获取商户列表数据
     */
    handleSearch() {
      const _self = this;
      getShopList(_self.searchParams).then(result => {
        result = result.data;
        if (result.code == 200) {
          _self.searchParams.total = result.body.total;
          _self.shopList = result.body.content;
        }
      });
    },
    /**
     *
     * 查看商户详情，执行后跳转至商户详情页面
     *
     * @param modeStr 跳转至详情页面操作类型，CREATE:添加商户，VIEW:查看商户，EDIT:编辑商户
     * @param shopInfoId 商户id
     */
    handleDetail(modeStr, shopInfoId) {
      this.$router.push({
        name: "ShopDetailPage",
        query: Object.assign(
          { mode: modeStr },
          shopInfoId ? { shopInfoId: shopInfoId } : {}
        )
      });
    }
  }
};
</script>


