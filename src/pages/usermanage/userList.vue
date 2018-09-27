<!-- 用戶列表 -->
<style lang="scss" scoped>
</style>
<template>
  <div class="box">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="手机号码">
            <el-input v-model="search.cellphone" type="number" placeholder="手机号码" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="姓名">
            <el-input v-model="search.realName" placeholder="姓名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="渠道名称">
            <kd-select v-model="search.channelSource" :channel="'true'" placeholder="渠道名称" clearable></kd-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="注册时间">
            <kd-date-picker v-model="appDate" type="daterange" clearable>
            </kd-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" title="查找" @click="handleSearch"></el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :width="col.width"
                         :key="index" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="250">
          <template slot-scope="scope">
            <el-tooltip content="查看详情">
              <el-button size="small" type="primary" icon="el-icon-view" @click="handleDetail(scope.row)">
              </el-button>
            </el-tooltip>
            <el-tooltip content="重置密码">
              <el-button type="warning" size="small" @click="handleResetPsd(scope.row)">
                重置密码
              </el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.accountStatus == false" content="解锁账号">
              <el-button type="danger" size="small" @click="handleLock(scope.row)">
                解锁账号
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="search.pageNum"
        :page-size="search.pageSize"
        layout="sizes,total, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </el-row>

    <!--重置密码-->
    <el-dialog title="重置密码" :visible.sync="dialog" @close="handleClose">
      <el-form :model="resetModel" label-width="100px" ref="resetModel" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="resetModel.phone" disabled auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="重置密码" prop="password">
              <el-input v-model="resetModel.password" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="handleSave">确 认</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import * as api from "../../api/user.js";
export default {
  name: "UsersPage",
  data() {
    return {
      dialog: false,
      search: {
        cellphone: "",
        realName: "",
        channelSource: "",
        registerStartDate: "",
        registerEndDate: "",
        pageNum: 1,
        pageSize: 10
      },
      pageTotal: 0,
      list: [],
      table: [
        {
          label: "编号",
          prop: "partyId"
        },
        {
          label: "姓名",
          prop: "realName"
        },
        {
          label: "手机号码",
          prop: "cellphone"
        },
        {
          label: "账户性质",
          prop: "accountNature",
          formatter: (row, col, val) =>
            this.$filter(val, this.$enum.ACCOUNT_NATURE)
        },
        {
          label: "是否绑卡",
          prop: "bankCardBoolean",
          formatter: (row, col, val) => (val == true ? "已绑卡" : "未绑卡")
        },
        {
          label: "是否实名",
          prop: "realNameBoolean",
          formatter: (row, col, val) => (val == true ? "已实名" : "未实名")
        },
        {
          label: "注册时间",
          prop: "registerTime"
        },
        {
          label: "流量推广来源",
          prop: "flowSource"
        },
        {
          label: "渠道名称",
          prop: "channelSource"
        },
        {
          label: "账号状态",
          prop: "accountStatus",
          formatter: (row, col, val) =>
            this.$filter(val, this.$enum.ENABLE_STATUS)
        },
        {
          label: "最后登录时间",
          prop: "lastLoginTime"
        }
      ],
      resetModel: {
        phone:'',
        password:''
      },
      rules: {
        password: [{ required: true, message: "请输入密码!", trigger: "blur" }]
      },
      enabledTitle: "",
      enabledModels: {
        remark: ""
      },
      enabledDialog: false,
      enabledRow: {},
      rules1: {
        remark: [{ required: true, message: "请输入理由!", trigger: "blur" }]
      }
    };
  },
  computed: {
    appDate: {
      get() {
        if (this.search.registerStartDate || this.search.registerEndDate) {
          let dateRange = [];
          dateRange[0] = this.search.registerStartDate;
          dateRange[1] = this.search.registerEndDate;
          return dateRange;
        } else {
          return [];
        }
      },
      set(range) {
        if (range) {
          this.search.registerStartDate = range[0];
          this.search.registerEndDate = range[1];
        } else {
          this.search.registerStartDate = "";
          this.search.registerEndDate = "";
        }
      }
    }
  },
  created() {
    this.getData(this.search.pageSize, this.search.pageNum);
  },
  methods: {
    handleSearch() {
      this.search.pageNum = 1;
      this.getData(this.search.pageSize, this.search.pageNum);
    },
    handleCurrentChange(val) {
      this.search.pageNum = val;
      this.getData(this.search.pageSize, val);
    },
    handleSizeChange(val) {
      this.search.pageSize = val;
      this.getData(val, this.search.pageNum);
    },
    getData(pageSize, pageNum) {
      const mySearch = this.$deepcopy(this.search);
      mySearch.pageSize = pageSize;
      mySearch.pageNum = pageNum;
      api.getUserList(mySearch).then(response => {
        const res = response.data;
        if (res.code == 200) {
          this.list = res.body.content;
          this.pageTotal = res.body.total;
        }
      });
    },
    handleDetail(row) {
      const { href } = this.$router.resolve({
        name: "UserDetailPage",
        params: {
          id: row.partyId
        }
      });
      window.open(href, "_blank");
    },
    //重置密码
    handleResetPsd(row) {
      this.resetModel.phone = row.cellphone;
      this.dialog = true;
    },
    handleSave() {
      this.$refs.resetModel.validate(val => {
        if (val) {
          this.resetPsd();
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.dialog = false;
      this.$refs.resetModel.resetFields();
    },
    handleCancel() {
      this.dialog = false;
      this.$refs.resetModel.resetFields();
    },
    //解锁账号
    handleLock(row) {
      this.$confirm("确定解锁账号?", "提示", {
        type: "warning"
      }).then(() => {
        this.locked(row.partyId, row.cellphone);
      });
    },
    locked(id, phone) {
      api.locked(id, phone).then(response => {
        const res = response.data;
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "解锁成功!"
          });
          this.getData(this.search.pageSize, this.search.pageNum);
        } else {
          this.$message({
            type: "warring",
            message: "解锁失败!"
          });
        }
      });
    },

    //重置密码
    resetPsd() {
      const resetModel = this.$deepcopy(this.resetModel);
      api.resetPsd(resetModel).then(response => {
        const res = response.data;
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "重置密码成功!"
          });
          this.dialog = false;
          this.getData(this.search.pageSize, this.search.pageNum);
        } else {
          this.$message({
            type: "warning",
            message: res.message
          });
        }
      });
    }
  }
};
</script>
