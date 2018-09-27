<!--运营管理 抽奖促销-->
<style lang="scss" scoped>
</style>
<template>
  <div class="box">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="页面title">
            <el-input v-model="search.pageTitle" placeholder="页面title" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="活动id">
            <el-input v-model="search.activityId" placeholder="活动id" clearable></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="6">
          <el-form-item label="奖池id">
            <el-input v-model="search.luckyDrawId" placeholder="奖池id" clearable></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="2">
             <el-form-item>
                <el-button type="primary" icon="el-icon-search" title="查询" @click="handleSearch"></el-button>
            </el-form-item>
        </el-col>
        <el-col :span="2">
            <el-form-item>
                <el-button type="primary" title="新增卡券" @click="handleAdd">新增抽奖页面</el-button>
            </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :width="col.width"
                         :key="index" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="280">
          <template slot-scope="scope">
            <el-tooltip content="编辑">
              <el-button type="warning" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="search.pageNum"
        :page-sizes="[1,10, 20, 30, 40]"
        :page-size="search.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import { getLuckyDrawPageList } from "@/api/operate";
export default {
  name: "luckDrawList",
  components: {},
  data() {
    return {
      search: {
        pageNum: 1,
        pageSize: 10
      },
      pageTotal: 0,
      total: 0,
      list: [],
      table: [
        {
          label: "页面title",
          prop: "pageTitle"
        },
        {
          label: "页面链接",
          prop: "pageUrl"
        },
        {
          label: "活动id",
          prop: "activityId"
        },
        {
          label: "抽奖id",
          prop: "luckyDrawId"
        }
      ]
    };
  },
  computed: {},
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getLuckyDrawPageList({ ...this.search }).then(res => {
        this.list = res.data.body.content;
        this.total = res.data.body.total;
      });
    },
    handleSearch() {
      this.getData();
    },
    handleEdit(row) {
      this.$router.push({
        name: "LuckyDrawpageManage",
        query: { type: "edit", id: row.luckyDrawPageId }
      });
    },
    handleAdd() {
      this.$router.push({
        name: "LuckyDrawpageManage",
        query: { type: "add" }
      });
    },
    handleSizeChange(val) {
      this.search.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.search.pageNum = val;
      this.getData();
    }
  }
};
</script>

