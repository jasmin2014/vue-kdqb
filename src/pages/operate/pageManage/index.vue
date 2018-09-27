<!--运营管理 页面管理-->
<style lang="scss" scoped>
</style>
<template>
  <div class="box">
    <el-form class="form-label flex fixed-width">
    <el-row>       
      <el-col>
        <el-form-item>
          <el-button type="primary" title="新增页面" @click="handleAddPage">新增页面</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :width="col.width"
                         :key="index" align="center"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="400">
          <template slot-scope="scope">                        
            <el-tooltip content="发布" v-if="scope.row.status =='unrelease'">
              <el-button type="success" size="small" @click="releaseSwitch(scope.row)">发布</el-button>
            </el-tooltip>  
            <el-tooltip content="下架" v-if="scope.row.status =='release'">
              <el-button type="info" size="small" @click="releaseSwitch(scope.row)">下架</el-button>
            </el-tooltip>
            <el-tooltip content="编辑" >
              <el-button type="warning" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
            </el-tooltip> 
            <el-tooltip content="删除">
              <el-button type="danger" size="small" @click="handleDelete(scope.row)" :disabled="scope.row.status =='release'">删除</el-button>
            </el-tooltip>
             <el-tooltip content="复制链接">
              <el-button type="primary" size="small" class="copy-btn" :data-clipboard-text="scope.row.link" @click="handleClipboard(scope.row.link)" :disabled="scope.row.pageType =='homepage'">复制链接</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row> 
    <el-row type="flex" justify="center" class="mgt20">
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNo"
        :page-sizes="pagesizes"
        :page-size="page.pageSize"
        layout="prev, pager, next,jumper,sizes,total"
        :total="total">
      </el-pagination>
    </el-row>
    <!-- 新增页面弹窗 -->
      <el-dialog title="请选择模板类型" :visible.sync="dialogAddModuleVisiable" :width="dialogAddModuleWidth">
          <el-form ref="form" :model="form" label-width="0" :rules="rules">
              <el-form-item label="" required prop="pageName">
                  <el-input v-model="form.pageName" rows="8" maxlength="8" clearable placeholder="页面名称"></el-input>
              </el-form-item>
              <el-form-item label="" required :label-width="dialogSelectWidth" prop="pageType">
                  <el-select clearable placeholder="请选择页面专题" v-model="form.pageType">
                      <el-option v-for="item in pageTypeList" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                  </el-select>
              </el-form-item>
              <!-- <el-form-item label="" required prop="link" v-if="form.pageType == 'subject'">
                  <el-input v-model="form.link" rows="8" maxlength="100" clearable placeholder="页面链接"></el-input>
              </el-form-item> -->
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="dialogAddModuleVisiable = false">取 消</el-button>
              <el-button type="primary" @click="submitAdd('form')">确 定</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
import { getPageList, addPage, switchPage, deletePage } from "@/api/operate.js";
export default {
  name: "PageManageIndex",
  data() {
    return {
      list: [],
      total: 0,
      pagesizes: [10, 20, 30, 40],
      page: { pageSize: 20, pageNo: 1 },
      table: [
        {
          label: "页面名称",
          prop: "pageName"
        },
        {
          label: "页面类型",
          prop: "pageType",
          formatter: (row, col, val) => (val == "homepage" ? "首页" : "专题页")
        },
        {
          label: "更新时间",
          prop: "upateDate",
          formatter: (row, col, val) => (val = this.$formatDate(val))
        },
        {
          label: "创建人",
          prop: "operatorUserName"
        },
        {
          label: "状态",
          prop: "status",
          formatter: (row, col, val) =>
            val == "unrelease" ? "未发布" : "已发布"
        }
      ],
      form: {
        pageType: ""
      },
      dialogAddModuleVisiable: false,
      dialogSelectWidth: "",
      dialogAddModuleWidth: "600px",
      selectModuleType: null,
      pageTypeList: [
        {
          label: "首页",
          value: "homepage"
        },
        {
          label: "专题",
          value: "subject"
        }
      ],
      rules: {
        pageName: [{ required: true, message: "不能为空", trigger: "blur" }],
        pageType: [{ required: true, message: "不能为空", trigger: "change" }],
        link: [
          {
            type: "string",
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleAddPage() {
      this.dialogAddModuleVisiable = true;
    },
    getPageList(pageNo, pageSize) {
      this.page.pageNo = pageNo;
      this.page.pageSize = pageSize;
      getPageList(this.page).then(res => {
        this.list = res.data.data;
        this.total = res.data.totalCount;
      });
    },
    submitAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addPage(this.form).then(res => {
            this.dialogAddModuleVisiable = false;
            this.$router.push({
              name: "AppIndexManage",
              query: { id: res.data.data.pageId }
            });
          });
        }
      });
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getPageList(this.page.pageNo, this.page.pageSize);
    },
    handleCurrentChange(val) {
      this.page.pageNo = val;
      this.getPageList(this.page.pageNo, this.page.pageSize);
    },
    releaseSwitch(data) {
      let params = {
        pageId: data._id,
        status: ""
      };
      params.status = data.status == "release" ? "unrelease" : "release";
      switchPage(params).then(res => {
        let mesDes = data.status == "release" ? "下架" : "发布";
        this.$notify({
          title: "成功",
          message: `${mesDes}成功`,
          type: "success"
        });
        this.getPageList(1, 20);
      });
    },
    handleDelete(data) {
      this.$confirm("确定删除页面？", "删除提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).then(() => {
        deletePage({ pageId: data._id }).then(res => {
          this.$notify({
            title: "成功",
            message: `页面删除成功`,
            type: "success"
          });
          this.getPageList(1, 20);
        });
      });
    },
    handleEdit(row) {
      this.$router.push({ name: "AppIndexManage", query: { id: row._id } });
    },
    handleClipboard(link) {
      link = link ? link : "";
      this.$alert(`链接 ${link} 已复制成功`, {
        confirmButtonText: "确认",
        callback: action => {
          // this.$message({
          //   message: `链接${link}已复制成功`,
          //   type: 'success'
          // });
        }
      });
    }
  },
  created() {
    this.getPageList(1, 20);
    new ClipboardJS(".copy-btn");
  }
};
</script>


