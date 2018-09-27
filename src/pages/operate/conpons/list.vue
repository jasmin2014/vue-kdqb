<!--运营管理 卡券管理-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

<template>
<div class="box">
<!--=========运营管理-卡券管理页 start===========-->
  <el-form class="form-label flex fixed-width">
    <el-row>
      <el-col :span="6">
        <el-form-item label="状态筛选">
          <kd-select v-model="search.status"  @keyup.native.enter="handleSearch"  :options="statusOptions" clearable>
          </kd-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="卡券id">
          <el-input v-model="search.publishNo" @keyup.native.enter="handleSearch" placeholder="卡券id" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="卡券类型">
          <kd-select v-model="search.couponCategory" @keyup.native.enter="handleSearch"  :options="typeOptions" clearable>
          </kd-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" title="查询" @click="handleSearch"></el-button>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item>
          <el-button type="primary" title="新增卡券" @click="handleAddConpon">新增卡券</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <el-row>
    <el-table :data="list" border :loading="tableLoading">
      <!-- <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form  label-width="100px"  style="color:#333">
            <el-row class="el-form-item" style="margin-bottom: 0">
              <el-col :span="12">
                <el-form-item  label="可领取时间：">
                  <span>{{ scope.row.receiveBeginTime }} ~ {{ scope.row.receiveEndTime }}</span>
                </el-form-item>
                <el-form-item  label="可使用时间：" >
                  <span v-if="scope.row.effectiveNum">有效天数{{ scope.row.effectiveNum }}天</span>
                  <span v-else>{{ scope.row.effectiveTime }} ~ {{ scope.row.failureTime }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column> -->
      <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter" :width="col.width" :key="index" align="center"></el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="140">
        <template slot-scope="scope">                        
            <el-tooltip content="取消发行" v-if="scope.row.status == 'INEFFECTIVE'">
              <el-button type="danger" size="small" @click="handleCancelConpon(scope.row.id)">取消</el-button>
            </el-tooltip> 
            <el-tooltip content="下架" v-if="scope.row.status == 'PUBLISHED'">
              <el-button type="info" size="small" @click="handleDeleteConpon(scope.row.id)">下架</el-button>
            </el-tooltip> 
            <el-tooltip content="编辑" v-if="scope.row.status == 'INEFFECTIVE'">
              <el-button type="warning" size="small" icon="el-icon-edit" @click="handleEditConpon(scope.row.id)" ></el-button>
            </el-tooltip>
            <el-tooltip content="查看" v-if="scope.row.status != 'INEFFECTIVE'">
              <el-button type="primary" size="small" icon="el-icon-view" @click="handleViewConpon(scope.row.id)"></el-button>
            </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </el-row>  
  <el-row type="flex" justify="center" class="mgt20">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 50, 100]"
      :page-size="limit" layout="prev, pager, next,jumper,sizes,total" :total="total">
    </el-pagination>
  </el-row>
  
  

<!--=========运营管理-卡券管理页 end===========-->
</div>
</template>

<script>
import {
  getCouponList,
  publishInvalidate,
  getShopInfoList,
  getChannelList,
  publishCancel
} from "@/api/operate";
export default {
  name: "OperateCouponsPage",
  data() {
    return {
      total: 0, // 列表总数
      limit: 10, // 每页数量
      page: 1, // 当前页数
      tableLoading: false, // table状态
      list: [], // table数据
      search: {
        couponCategory: undefined, // 卡券类型
        publishNo: undefined, // 发行id
        status: undefined // 状态
      },
      table: [
        {
          label: "卡券id",
          width: "120px",
          prop: "publishNo"
        },
        {
          label: "卡券名称",
          prop: "couponName"
        },
        {
          label: "卡券类型",
          prop: "couponCategory",
          formatter: (row, col, val) => this.$enum.COUPON_TYPE_MAP[val]
        },
        {
          label: "卡券内容",
          formatter: (row, col, val) =>
            row.couponCategory == "INTEREST_FREE"
              ? `免期${row.freeMonthNum}期`
              : `折扣${row.discount}%`
        },
        {
          label: "卡券状态",
          prop: "status",
          formatter: (row, col, val) => this.$enum.COUPON_STATUS_MAP[val]
        },
        {
          label: "已领取数量",
          formatter: (row, col, val) => row.totalNum - row.remainNum
        },
        {
          label: "剩余数量",
          prop: "remainNum"
        },
        {
          label: "可领取时间",
          width: "164px",
          formatter: (row, col, val) =>
            row.receiveBeginTime + "~" + row.receiveEndTime
        },
        {
          label: "可使用时间",
          width: "164px",
          formatter: (row, col, val) =>
            row.effectiveNum
              ? "有效天数" + row.effectiveNum + "天"
              : row.effectiveTime + "~" + row.failureTime
        }
      ],
      statusOptions: Object.keys(this.$enum.COUPON_STATUS_MAP).map(i => {
        return { value: i, text: this.$enum.COUPON_STATUS_MAP[i] };
      }),
      typeOptions: Object.keys(this.$enum.COUPON_TYPE_MAP).map(i => {
        return { value: i, text: this.$enum.COUPON_TYPE_MAP[i] };
      })
    };
  },
  methods: {
    handleAddConpon() {
      this.$router.push({
        name: "OperateAddCouponPage"
      });
    },
    handleViewConpon(id) {
      this.$router.push({
        name: "OperateCouponDetailPage",
        params: { id }
      });
    },
    handleDeleteConpon(id) {
      this.$confirm(
        "卡券下架后将不能再恢复，且用户不可再领取。已领取的用户依然可使用",
        "提示",
        {
          type: "warning"
        }
      ).then(() => {
        publishInvalidate({ id }).then(res => {
          if (res.data.success) {
            this.$message({
              type: "success",
              message: "下架成功!"
            });
            this.getData();
          } else {
            this.$message({
              type: "error",
              message: res.data.message
            });
          }
        });
      });
    },
    handleCancelConpon(id) {
      this.$confirm("卡券取消发行后将不能再恢复", "提示", {
        type: "warning"
      }).then(() => {
        publishCancel({ id }).then(res => {
          if (res.data.success) {
            this.$message({
              type: "success",
              message: "取消发行成功!"
            });
            this.getData();
          } else {
            this.$message({
              type: "error",
              message: res.data.message
            });
          }
        });
      });
    },
    handleEditConpon(id) {
      this.$router.push({
        name: "OperateAddCouponPage",
        query: { id }
      });
    },
    handleSearch() {
      this.getData();
    },
    getData() {
      getCouponList({
        pageSize: this.limit,
        pageNum: this.page,
        ...this.search
      }).then(res => {
        if (res.data.code == "0") {
          this.list = res.data.data.list;
          this.total = res.data.data.total;
        }
      });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    }
  },
  mounted() {
    this.getData();
  }
};
</script>


