<!--运营管理 策略促销-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>

<template>
<div class="box">
<!--=========运营管理-策略促销页 start===========-->

  <el-form class="form-label flex fixed-width">
    <el-row>
      <el-col :span="6">
        <el-form-item label="促销类型">
          <kd-select v-model="search.type" @keyup.native.enter="handleSearch"  :options="typeOptions" placeholder="请选择" ></kd-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="促销名称">
          <el-input v-model="search.name" @keyup.native.enter="handleSearch"  placeholder="促销名称" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="促销id">
          <el-input v-model="search.strategyId" @keyup.native.enter="handleSearch"  placeholder="促销id" clearable></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-form-item label="促销状态">
          <kd-select v-model="search.isEnabled" @keyup.native.enter="handleSearch"  :options="statusOptions" placeholder="请选择"></kd-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" title="搜索" @click="handleSearch"></el-button>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item>
          <el-button type="primary" title="新增促销" @click="handleAdd">新增促销</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <el-row>
    <el-table :data="list" border>
      <!-- <el-table-column type="index" width="50" align="center" label="序号"></el-table-column> -->
      <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter" :width="col.width" :key="index" align="center"></el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template slot-scope="scope">   
            <el-tooltip content="查看">
              <el-button type="primary" size="small"  icon="el-icon-view" @click="handleViewRow(scope.row)" ></el-button>
            </el-tooltip>                     
            <el-tooltip :content="!scope.row.isEnabled? '启用':'停用'">
              <el-button size="small" :type="scope.row.isEnabled ? 'info': 'success'" @click="handleEnableRow(scope.row)">{{!scope.row.isEnabled ? '启用':'停用'}}</el-button>
            </el-tooltip> 
            <el-tooltip content="删除">
              <el-button type="danger" size="small"  icon="el-icon-delete" @click="handleDeleteRow(scope.row)"  :disabled="!scope.row.isEnabled ? false : true"></el-button>
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

<!--=========运营管理-策略促销页 end===========-->
</div>
</template>

<script>
import { getPromotionList, switchPromotion, delPromotion } from "@/api/operate";

export default {
  name: "OperateStategiesPage",
  data() {
    return {
      total: 0, // 列表总数
      limit: 10, // 每页数量
      page: 1, // 当前页数
      // ======== 搜索
      search: {
        type: undefined,
        name: undefined,
        strategyId: undefined,
        isEnabled: undefined
      },
      typeOptions: [
        {
          value: undefined,
          text: "默认"
        }
      ].concat(
        Object.keys(this.$enum.PROMOTION_TYPE_MAP).map(i => {
          return { value: i, text: this.$enum.PROMOTION_TYPE_MAP[i] };
        })
      ),
      statusOptions: [
        {
          value: undefined,
          text: "默认"
        },
        {
          value: true,
          text: "启用"
        },
        {
          value: false,
          text: "停用"
        }
      ],
      // =========== 表格
      list: [
        {
          id: "DCEM123467989"
        }
      ],
      table: [
        {
          label: "促销id",
          prop: "strategyId"
        },
        {
          label: "促销名称",
          prop: "name"
        },
        {
          label: "促销类型",
          prop: "type",
          formatter: (row, col, val) => this.$enum.PROMOTION_TYPE_MAP[val]
        },
        {
          label: "促销状态",
          prop: "isEnabled",
          formatter: (row, col, val) => (val ? "启用" : "停用")
        },
        {
          label: "备注",
          prop: "memo"
        }
      ]
    };
  },
  methods: {
    // 新增促销-跳转
    handleAdd() {
      this.$router.push({
        name: "OperateAddStategiesPage"
      });
    },
    // 表格搜索
    handleSearch() {
      this.getData();
    },
    // 查看跳转
    handleViewRow(row) {
      this.$router.push({
        name: "OperateAddStategiesPage",
        query: { id: row.strategyId }
      });
    },
    // 启用停用操作
    handleEnableRow(row) {
      this.$confirm(
        `操作不可撤销,您确定${!row.isEnabled ? "启用" : "停用"}活动么?`,
        "提示",
        {
          type: "warning"
        }
      ).then(() => {
        switchPromotion(row.strategyId, !row.isEnabled ? "1" : "0").then(
          res => {
            if (res.data.code == 200) {
              this.$message.success(`${!row.isEnabled ? "启用" : "停用"}成功`);
              this.getData();
            } else {
              this.$message.error("失败：" + res.data.message);
            }
          }
        );
      });
    },
    // 删除操作
    handleDeleteRow(row) {
      this.$confirm("数据删除后不可恢复，是否继续", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delPromotion(row.strategyId).then(res => {
            if (res.data.code == 200) {
              this.$message.success("删除成功");
              this.getData();
            } else {
              this.$message.error("失败：" + res.data.message);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 获取数据
    getData() {
      getPromotionList({
        ...this.search,
        pageSize: this.limit,
        pageNum: this.page
      }).then(res => {
        if (res.data.code === "200") {
          this.page = res.data.body.pageNum;
          this.limit = res.data.body.pageSize;
          this.total = res.data.body.total;
          this.list = res.data.body.content;
        }
      });
    },
    // 每页页数变动时重新获取数据
    handleSizeChange(val) {
      this.limit = val;
      this.getData();
    },
    // 当前页数变动时重新获取数据
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


