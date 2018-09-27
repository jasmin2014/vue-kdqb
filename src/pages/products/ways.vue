
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<!--产品管理-渠道列表-->
<template>
  <div class="box">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col>
          <el-form-item>
            <el-button type="primary" title="添加渠道" @click="handleAddWay">添加渠道</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border class="table-center">
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label"
                         :formatter="col.formatter"
                         :width="col.width" :key="index" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-tooltip content="修改">
              <el-button size="small" type="warning" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="禁用" v-if="scope.row.isEnable == true">
              <el-button size="small" @click="handleDisable(scope.row)" type="danger">禁用</el-button>
            </el-tooltip>
            <el-tooltip content="启用" v-if="scope.row.isEnable == false">
              <el-button size="small" @click="handleDisable(scope.row)" type="success">启用</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
       <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="page.pageNum"
        :page-size="page.pageSize"
        layout="sizes,total,prev, pager, next,jumper"
        :total="total">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import { getChannelByPage, enableChannel } from "../../api/products";
export default {
  name: "ProductsWaysPage",
  components: {},
  data() {
    return {
      updatedBys: [],
      list: [],
      busTypeList: [],
      page: {
        pageSize: 10,
        pageNum: 1
      },
      total: 0,
      product: [],
      table: [
        {
          label: "渠道名称",
          prop: "channelName"
        },
        {
          label: "编号",
          prop: "channelCode"
        },
        {
          label: "借款类型",
          prop: "busTypeList"
        },
        {
          label: "最近更新时间",
          prop: "updatedTime"
        },
        {
          label: "最近更新人",
          prop: "updatedBy",
          formatter: (row, col, val) => this.$filterUpdate(val, this.updatedBys)
        },
        {
          label: "状态",
          prop: "isEnable",
          formatter: (row, col, val) =>
            this.$filter(val, this.$enum.ENABLE_STATUS)
        }
      ]
    };
  },
  created() {
    this.getChannelByPage();
  },
  methods: {
    getChannelByPage() {
      getChannelByPage(this.page).then(response => {
        const res = response.data;
        const updatedBys = [];
        if (res.code == 200) {
           res.body.content.forEach(ele => {
            this.busTypeList = [];
            updatedBys.push(ele.updatedBy);
            ele.busTypeList.forEach(col => {
              let businessTypeList = [];
              let businessTypeName = "";
              businessTypeList = this.$store.state.enums[
                "BUSINESS_TYPE"
              ].filter(_ => _.value == col.businessTypeCode);
              businessTypeName =
                businessTypeList && businessTypeList[0]
                  ? businessTypeList[0].text
                  : col.businessTypeCode;
              this.busTypeList.push(businessTypeName);
            });
            ele.busTypeList = this.busTypeList.join("/");
          });
          if (updatedBys.length != 0) {
            this.$getPartyRealName(updatedBys).then(data => {
              this.updatedBys = data;
              this.list = res.body.content;
              this.total = res.body.total;
            });
          }
        } else {
          this.$message({
            showClose: true,
            type: "error",
            message: res.message
          });
        }
      });
    },
    enableChannel(channelCode, isEnable) {
      enableChannel({ channelCode: channelCode, isEnable: isEnable }).then(
        response => {
          const res = response.data;
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "成功"
            });
            setTimeout(() => {
              this.getChannelByPage();
            }, 500);
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: res.message
            });
          }
        }
      );
    },
    handleAddWay() {
      const { href } = this.$router.resolve({
        name: "ProductAddWayPage",
        query: { mode: "CREATE" }
      });
      window.open(href, "_blank");
    },
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.getChannelByPage();
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getChannelByPage();
    },
    handleEdit(row) {
      const { href } = this.$router.resolve({
        name: "ProductEditWayPage",
        params: { id: row.channelCode },
        query: { mode: "EDIT" }
      });
      window.open(href, "_blank");
    },
    handleDisable(row) {
      this.$confirm(
        `${row.isEnable ? "禁用" : "启用"}操作将影响前端用户使用，确定操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.enableChannel(row.channelCode, row.isEnable ? false : true);
        })
        .catch(() => {});
    }
  }
};
</script>

