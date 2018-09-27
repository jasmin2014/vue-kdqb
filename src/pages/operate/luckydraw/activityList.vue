<!--运营管理 抽奖促销-->
<style lang="scss" scoped>
</style>
<template>
  <div class="box">
    <el-form class="form-label flex fixed-width" :model="search" >
      <el-row>
        <el-col :span="6">
            <el-form-item label="抽奖状态" >
                <kd-select v-model="search.isEnabled" :options="options_1" clearable>
                </kd-select>
            </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="抽奖名称">
            <el-input v-model="search.luckyDrawName" placeholder="抽奖名称" clearable></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="2">
             <el-form-item>
                <el-button type="primary" icon="el-icon-search" title="查询" @click="handleSearch"></el-button>
            </el-form-item>
        </el-col> 
        <el-col :span="2">
            <el-form-item>
                <el-button type="primary" title="新增卡券" @click="handleAdd">新增抽奖活动</el-button>
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
            <el-tooltip content="查看">
              <el-button type="primary" size="small" icon="el-icon-view" @click="handleDetail(scope.row)">
                
              </el-button>
            </el-tooltip>
            <el-tooltip content="编辑">
              <el-button type="warning" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)" :disabled="scope.row.relatedActivityAmount > 0">
              </el-button>
            </el-tooltip>
            <el-tooltip content="关闭">
              <el-button type="info" size="small"  @click="handleSwitch(scope.row)">
                  {{!scope.row.enabled ? '开启' : '关闭'}}
              </el-button>
            </el-tooltip>
             <el-tooltip content="删除">
              <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)" :disabled="scope.row.relatedActivityAmount > 0">
              </el-button>
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
        :page-sizes="[10, 20, 30, 40]"
        :page-size="search.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-row>
    <el-dialog title="奖池查看" :visible.sync="showDialog" @closed="showDialog == false">
        <el-table :data="detailTableData">
            <el-table-column v-for="(col,index) in detailTable" :prop="col.prop" :label="col.label" :width="col.width" :formatter="col.formatter" :key="index" align="center"></el-table-column>
        </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  getLuckyDrawList,
  getLuckyDrawById,
  switchLuckyDrawStatus,
  deleteLuckDraw
} from "@/api/operate";
export default {
  name: "luckDrawList",
  components: {},
  data() {
    return {
      dialog: false,
      search: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      list: [],
      options_1: [
        {
          text: "请选择",
          value: ""
        },
        {
          text: "开启",
          value: "1"
        },
        {
          text: "关闭",
          value: "0"
        }
      ],
      table: [
        {
          label: "抽奖id",
          prop: "luckyDrawId"
        },
        {
          label: "抽奖名称",
          prop: "luckyDrawName"
        },
        {
          label: "状态",
          prop: "enabled",
          formatter: (row, col, val) => (val === true ? "开启" : "关闭") || "--"
        },
        {
          label: "关联活动个数",
          prop: "relatedActivityAmount"
        }
      ],
      detailTable: [
        {
          label: "奖品",
          prop: "prizeName"
        },
        {
          label: "概率",
          prop: "probability",
          formatter: (row, col, val) => (val = val * 100 + "%")
        },
        {
          label: "已抽取数量",
          prop: "receivedTotalAmount"
        },
        {
          label: "剩余数量",
          prop: "remainingAmount",
          formatter: (row, col, val) => (val === -1 ? "无限" : val)
        }
      ],
      detailTableData: [],
      rules: {
        psd: [{ required: true, message: "请输入密码!", trigger: "blur" }]
      },
      showDialog: false,
      showDialogList: false
    };
  },
  computed: {},
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getLuckyDrawList({ ...this.search }).then(res => {
        this.list = res.data.body.content;
        this.total = res.data.body.total;
      });
    },
    handleSearch() {
      this.getData();
    },
    handleDetail(row) {
      this.showDialog = true;
      console.log(row);
      getLuckyDrawById({ luckyDrawId: row.luckyDrawId }).then(res => {
        this.detailTableData = res.data.body;
      });
    },
    handleSwitch(row) {
      let isEnabled = row.enabled ? 0 : 1;
      switchLuckyDrawStatus({
        luckyDrawId: row.luckyDrawId,
        isEnabled: isEnabled
      }).then(res => {
        this.getData();
        let mesDes = row.enabled ? "关闭" : "开启";
        this.$notify({
          title: "成功",
          message: `${mesDes}成功`,
          type: "success"
        });
      });
    },
    handleDetailList() {
      this.showDialog = false;
      this.showDialogList = true;
    },
    handleAdd() {
      this.$router.push({
        name: "LuckyDrawAddPage",
        query: { type: "add" }
      });
    },
    handleEdit(row) {
      this.$router.push({
        name: "LuckyDrawAddPage",
        query: { type: "edit", id: row.luckyDrawId }
      });
    },
    handleDelete(row) {
      this.$confirm("确定删除页面？", "删除提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).then(() => {
        deleteLuckDraw({ luckyDrawId: row.luckyDrawId }).then(res => {
          this.$notify({
            title: "成功",
            message: `删除成功`,
            type: "success"
          });
          this.getData();
        });
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

