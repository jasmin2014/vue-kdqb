<!--运营管理 卡券管理-已领取用户列表-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>

<template>
<div class="box">
<!--=========运营管理-卡券管理-已领取用户列表页 start===========-->
  <el-form class="form-label flex fixed-width">
    <el-row>
      <el-col :span="6">
        <el-form-item label="卡券id">
          <el-input v-model="search.publishNo" @keyup.native.enter="handleSearch"  placeholder="卡券id" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="用户手机号">
          <el-input v-model="search.phone"  @keyup.native.enter="handleSearch" placeholder="用户手机号" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="状态筛选">
          <kd-select v-model="search.status" @keyup.native.enter="handleSearch"  :options="statusOptions"  clearable>
          </kd-select>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" title="查询" @click="handleSearch"></el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
       <el-col>
        <el-form-item>
          <el-button type="primary" title="发放卡券" @click="handleDispatchConpon">发放卡券</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <el-row>
    <el-table :data="list" border :loading="tableLoading">
      <el-table-column label="序号" align="center" width="50">
        <template slot-scope="scope">
            {{scope.$index + 1 + (page - 1) * limit}}
        </template>
      </el-table-column>
      <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter" :width="col.width" :key="index" align="center"></el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="80">
        <template slot-scope="scope">
            <el-tooltip content="查看用户">
              <el-button type="primary" size="small" icon="el-icon-view" @click="handleViewUser(scope.row.userId)"></el-button>
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

  <!-- ====================  发放卡券start  == -->
  <el-dialog title="发放卡券" :visible.sync="dialogDispatchVisible" width="500px">
    <el-form label-width="70px" label-position="left">
      <el-form-item label="卡券选择">
        <kd-select v-model="params.publishNo" :options="publishedListOptions" @change="dialogSelectChange"></kd-select>
      </el-form-item>
      <div style="display: flex;justify-content: space-around;margin-bottom: 20px;">
        <a :href="getPublicDownloadUrl"><el-button>下载导入模板</el-button></a>
        <el-upload
          :action="origin+getPublicUploadUrl"
          :headers="{'Authorization': token}"
          :on-success="handleImportSuccess"
          :on-error="handleImportError"
          :show-file-list="false"
          :file-list="fileList">
          <el-button>上传导入模板</el-button>
        </el-upload>
      </div>
      <div style="height:20px;" v-if="successCount >= 0">
        <i class="el-icon-success" style="color: #67C23A;"></i> 
        已成功发放 <strong>{{successCount}}</strong> 条，<el-button type="text" @click="dialogDispatchVisible = false">查看</el-button>。
        <template v-if="failCount>0">发放失败 <strong>{{failCount}}</strong> 条，<el-button  type="text" @click="handleExportErr">下载失败数据</el-button>。</template>
      </div>
    </el-form>
    <div class="dialog-footer" style="text-align: center;margin-top: 20px;">
      <el-button type="primary" @click="handleSubmitDispatch" :disabled="dialogSubmitLoading" :loading="dialogSubmitLoading">提交</el-button>
    </div>
  </el-dialog>
  <!-- ===================  发放卡券end  == -->
<!--=========运营管理-卡券管理-已领取用户列表页 end===========-->
  </div>
</template>

<script>
import {
  getInfoPageList,
  getPublishedList,
  couponPublicExport,
  couponPublicDirect,
  getPublicDownloadUrl,
  getPublicUploadUrl
} from "@/api/operate";
const USERS_STATUS_MAP = {
  UNUSED: "未使用",
  USED: "已使用",
  EXPIRED: "已过期"
  // UNRECEIVED: '未领取',
  // FROZEN: '已冻结', // 已使用
  // REVOKED: '已吊销'
};
export default {
  name: "OperateCouponUsersPage",
  data() {
    return {
      getPublicUploadUrl: getPublicUploadUrl,
      getPublicDownloadUrl: getPublicDownloadUrl,
      token: this.$getLocalStorage("token"),
      origin: location.origin,
      fileList: [],
      total: 0, // 列表总数
      limit: 10, // 每页数量
      page: 1, // 当前页数
      tableLoading: false, // table状态
      list: [],
      search: {
        publishNo: undefined, // 发行单号-卡券id
        phone: undefined, // 用户手机号
        status: undefined // 卡券状态
      },
      statusOptions: Object.keys(USERS_STATUS_MAP).map(i => {
        return { value: i, text: USERS_STATUS_MAP[i] };
      }),
      table: [
        {
          label: "用户手机号",
          prop: "phone"
          // formatter:(row, col, val) => (val ? val : row.userId)
        },
        {
          label: "卡券id",
          prop: "publishNo"
        },
        {
          label: "优惠券状态",
          prop: "status",
          formatter: (row, col, val) => USERS_STATUS_MAP[val]
        },
        {
          label: "账单号",
          prop: "orderNo",
          formatter: (row, col, val) => (val ? val : "-")
        },
        {
          label: "领取时间",
          prop: "receiveTime"
        }
      ],
      params: {
        publishNo: undefined, // 发行单号
        publishDetail: undefined // 用户id，用,隔开
      },
      successCount: undefined, // 成功条数
      failCount: undefined, // 失败条数
      failList: [], // 下载失败数据
      //  == 是否展示弹窗
      publishedListOptions: [],
      dialogDispatchVisible: false,
      submitDialogCount: 0,
      dialogSubmitLoading: false,
    };
  },
  methods: {
    dialogSelectChange(val) {
      this.submitDialogCount = 0 // 重置提交次数      
    },
    // 导出错误信息
    handleExportErr() {
      if (this.fileList == undefined) {
        this.$message.error("请先提交数据");
      } else if (this.fileList.length == 0) {
        this.$message.error("暂无失败数据");
      } else {
        couponPublicExport({ failInfo: this.fileList }).then(res => {
          let data = res.data;
          let filename = res.headers["content-disposition"]
            ? res.headers["content-disposition"].split("filename=")[1]
            : "发放失败信息.xlsx";
          filename = decodeURI(filename);
          filename = filename.replace(/\"/g, "");
          this.$downloadExcel(data, filename);
        });
      }
    },
    // 文件上传失败
    handleImportError(res) {
      this.$message.error(res.error.description || "文件上传失败");
    },
    // 文件上传成功
    handleImportSuccess(res, file, fileList) {
      res = String(res)
      if (res.length) {
        this.$message.success("文件上传成功");
        this.params.publishDetail = res;
        this.submitDialogCount = 0 // 重置提交次数
      } else {
        this.$message.error("模板不为空，请重新上传");
      }
    },
    // 发放卡券-提交
    handleSubmitDispatch() {
      if (this.params.publishNo == undefined) {
        this.$message.error("请先选择卡券");
      } else if (this.params.publishDetail == undefined) {
        this.$message.error("请先上传导入模板");
      } else {
        if(this.submitDialogCount >= 1) {
          this.$confirm(
            "此卡券模板，您已提交"+this.submitDialogCount+"次，点击提交会导致重复发放，是否确认提交？",
            "提示",
            {
              type: "warning"
            }
          ).then(() => {
            this.couponPublicDirect()
          });
        } else {
            this.couponPublicDirect()
        }
      }
    },
    couponPublicDirect() {
      this.dialogSubmitLoading = true
      couponPublicDirect(this.params).then(res => {
        if (res.data.code == "0") {
          this.successCount = res.data.data.successNum;
          this.failCount = res.data.data.failList.length;
          this.fileList = res.data.data.failList;
          this.submitDialogCount++
          this.getData()
        } else {
          this.$message.error(res.data.message)
          this.successCount = undefined
        }
      }).finally(_ => {
        this.dialogSubmitLoading = false
      });
    },
    // 发放卡券弹窗
    handleDispatchConpon() {
      this.dialogDispatchVisible = true;
    },
    // 获取领取状态中的卡券列表
    getPublishedList() {
      getPublishedList().then(res => {
        if (res.data.code == "0") {
          this.publishedListOptions = res.data.data.map(i => {
            return { text: i.couponName, value: i.publishNo };
          });
        }
      });
    },
    // ====list
    handleViewUser(id) {
      this.$router.push({
        name: "UserDetailPage",
        params: { id }
      });
    },
    // 搜索
    handleSearch() {
      this.getData();
    },
    // 获取列表数据
    getData() {
      this.tableLoading = true;
      getInfoPageList({
        pageSize: this.limit,
        pageNum: this.page,
        ...this.search
      })
        .then(res => {
          if (res.data.code == "0") {
            this.list = res.data.data.list;
            this.total = res.data.data.total;
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
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
    this.getPublishedList();
  }
};
</script>


