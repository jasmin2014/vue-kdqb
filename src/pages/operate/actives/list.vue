<!--运营管理 活动列表-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>

<template>
<div class="box">
<!--=========运营管理-活动列表页 start===========-->

  <el-form class="form-label flex fixed-width">
    <el-row>
      <el-col :span="6">
        <el-form-item label="活动id">
          <el-input v-model="search.activityId" @keyup.native.enter="handleSearch"  placeholder="活动id" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="活动名称">
          <el-input v-model="search.name" @keyup.native.enter="handleSearch"  placeholder="活动名称" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="活动类型">
          <kd-select v-model="search.type" @keyup.native.enter="handleSearch"  :options="typeOptions" >
          </kd-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-form-item label="活动状态">
          <kd-select v-model="search.status" @keyup.native.enter="handleSearch"  :options="statusOptions" >
          </kd-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="促销id">
          <el-input v-model="search.promotionId" @keyup.native.enter="handleSearch"  placeholder="促销id" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" title="查询" @click="handleSearch"></el-button>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item>
          <el-button type="primary" title="新增活动" @click="handleAdd">新增活动</el-button>
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
          <el-tooltip content="编辑">
            <el-button type="warning" size="small" icon="el-icon-edit" @click="handleEditRow(scope.row)" :disabled="scope.row.status != 'HAS_ENDED' ? false : true"></el-button>
          </el-tooltip>   
          <el-tooltip :content="scope.row.status == 'NOT_STARTED' || scope.row.status == 'ON_GOING' ? '关闭':'开启'">
            <el-button :disabled="scope.row.status == 'HAS_ENDED'" size="small" :type="scope.row.status == 'NOT_STARTED' || scope.row.status == 'ON_GOING' ? 'info': 'success'" @click="handleEnableRow(scope.row, scope.row.status == 'NOT_STARTED' || scope.row.status == 'ON_GOING' ? 0:1)">{{scope.row.status == 'NOT_STARTED' || scope.row.status == 'ON_GOING' ? '关闭':'开启'}}</el-button>
          </el-tooltip>       
          <el-tooltip content="删除">
            <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDeleteRow(scope.row)" :disabled="scope.row.status == 'HAS_ENDED' || scope.row.status == 'CLOSED' ? false : true">
            </el-button>
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

<!--=========运营管理-活动列表页 end===========-->
</div>
</template>

<script>
import { getActivityList, switchActivity, delActivity } from "@/api/operate";
export default {
  name: "OperateActivesPage",
  data() {
    return {
      total: 0, // 列表总数
      limit: 10, // 每页数量
      page: 1, // 当前页数
      search: {
        activityId: undefined,
        type: undefined,
        status: undefined,
        promotionId: undefined,
        name: undefined
      },
      typeOptions: [
        {
          value: undefined,
          text: "默认"
        }
      ].concat(
        Object.keys(this.$enum.ACTIVITY_TYPE_MAP).map(i => {
          return { value: i, text: this.$enum.ACTIVITY_TYPE_MAP[i] };
        })
      ),
      statusOptions: [
        {
          value: undefined,
          text: "默认"
        }
      ].concat(
        Object.keys(this.$enum.ACTIVITY_STATUS_MAP).map(i => {
          return { value: i, text: this.$enum.ACTIVITY_STATUS_MAP[i] };
        })
      ),
      list: [],
      table: [
        {
          label: "活动id",
          prop: "activityId"
        },
        {
          label: "活动名称",
          prop: "name"
        },
        {
          label: "活动类型",
          prop: "type",
          formatter: (row, col, val) => this.$enum.ACTIVITY_TYPE_MAP[val]
        },
        {
          label: "促销名称",
          prop: "strategyName"
        },
        {
          label: "促销Id",
          prop: "strategyId"
        },
        {
          label: "优先级",
          prop: "priority"
        },
        {
          label: "活动时间",
          formatter: (row, col, val) => row.beginTime + " ~ " + row.endTime
        },
        {
          label: "活动状态",
          prop: "status",
          formatter: (row, col, val) => this.$enum.ACTIVITY_STATUS_MAP[val]
        }
      ]
    };
  },
  methods: {
    handleAdd() {
      this.$router.push({
        name: "OperateAddActivesPage"
      });
    },
    handleSearch() {
      this.getData();
    },
    handleEditRow(row) {
      this.$router.push({
        name: "OperateAddActivesPage",
        query: { id: row.activityId }
      });
    },
    handleDeleteRow(row) {
      this.$confirm("删除操作不可撤销,您确定删除活动么?", "提示", {
        type: "warning"
      })
        .then(() => {
          delActivity(row.activityId).then(res => {
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
    handleEnableRow(row, isEnabled) {
      this.$confirm(
        `操作不可撤销,您确定${isEnabled ? "开启" : "关闭"}活动么?`,
        "提示",
        {
          type: "warning"
        }
      ).then(() => {
        switchActivity(row.activityId, isEnabled).then(res => {
          if (res.data.code == 200) {
            this.$message.success(`${isEnabled ? "开启" : "关闭"}成功`);
            this.getData();
          } else {
            this.$message.error("失败：" + res.data.message);
          }
        });
      });
    },
    getData() {
      getActivityList({
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


