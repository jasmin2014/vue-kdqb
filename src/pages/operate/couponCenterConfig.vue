<!--运营管理 抽奖促销-->
<style lang="scss" scoped>
.el-upload {
  width: 80px;
  height: 80px;
  img {
    max-width: 80px;
    max-height: 80px;
  }
}
</style>
<template>
  <div class="box">
    <el-form class="form-label flex fixed-width" :model="search" >
      <el-row>
        <el-col :span="6">
            <el-form-item label="组件类型" >
                <kd-select v-model="search.type" :options="options_1" clearable>
                </kd-select>
            </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="状态" >
                <kd-select v-model="search.isEnabled" :options="options_2" clearable>
                </kd-select>
            </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="组件状态" >
                <kd-select v-model="search.status" :options="options_3" clearable>
                </kd-select>
            </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="卡券id">
            <el-input v-model="search.couponId" placeholder="卡券id" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="活动id">
            <el-input v-model="search.activityId" placeholder="活动id" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
             <el-form-item>
                <el-button type="primary" icon="el-icon-search" title="查询" @click="handleSearch"></el-button>
            </el-form-item>
        </el-col> 
        <el-col :span="2" style="margin-right:30px;">
            <el-form-item>
                <el-button type="primary" title="组件增加" @click="handleAdd">组件增加</el-button>
            </el-form-item>
        </el-col>
        <el-col :span="3">
            <el-form-item>
                <el-button type="primary" title="卡券组件批量添加" @click="handleBatchAdd">卡券组件批量添加</el-button>
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
            <el-tooltip content="已领取用户">
              <el-button type="primary" size="small" icon="el-icon-view" @click="handleDetail(scope.row)">
              </el-button>
            </el-tooltip>
            <el-tooltip content="编辑">
              <el-button type="warning" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)" :disabled="scope.row.status =='ON_GOING'">
              </el-button>
            </el-tooltip>
            <el-tooltip content="关闭" v-if="scope.row.status =='ON_GOING'">
              <el-button type="info" size="small"  @click="handleSwitch(scope.row)">
                 关闭
              </el-button>
            </el-tooltip>
            <el-tooltip content="开启" v-if="scope.row.status !='ON_GOING'">
              <el-button type="success" size="small"  @click="handleSwitch(scope.row)">
                 开启
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
    <!-- 已领取用户弹窗 -->
    <el-dialog title="已领取用户清单" :visible.sync="showDialog" @closed="showDialog == false">
        <el-table :data="detailTableData">
            <el-table-column v-for="(col,index) in detailTable" :prop="col.prop" :label="col.label" :width="col.width" :formatter="col.formatter" :key="index" align="center"></el-table-column>
        </el-table>
          <el-row type="flex" justify="center" class="mgt20">
            <el-pagination
                @size-change="handleDetailSizeChange"
                @current-change="handleDetailCurrentChange"
                :current-page="searchDetail.pageNum"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="searchDetail.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalDetail">
            </el-pagination>
            </el-row>
    </el-dialog>
    <!-- 新增/修改组件弹窗 -->
    <el-dialog title="组件配置" :visible.sync="dialogAddModuleVisiable" width="600px">
        <el-form ref="form" :model="form" label-width="0" :rules="rules" >
            <el-form-item label="组件类型" required label-width="80px" prop="type">
                <kd-select v-model="form.type" :options="options_1" clearable :disabled='this.formType == "edit"'>
            </kd-select>
            </el-form-item>
            <el-form-item label="优先级" required label-width="80px" prop="priority">
                <el-input v-model="form.priority" clearable placeholder="优先级" type='number'></el-input>
            </el-form-item>
            <div v-if="form.type && form.type != ''">
            <el-form-item label="卡券来源" required label-width="80px" v-if="form.type == 'COUPON_RECEIVE'" prop="couponSource">
                    <kd-select v-model="form.couponSource" :options="options_4">
                </kd-select>
            </el-form-item >
            <el-form-item label="卡券id" required label-width="80px" v-if="form.type == 'COUPON_RECEIVE'" prop="bindId">
                <el-input v-model="form.bindId" clearable placeholder="卡券id" type='text'></el-input>
            </el-form-item>
            <el-form-item label="活动id" required label-width="80px" v-if="form.type == 'COUPON_ACTIVITY'" prop="bindId">
                <el-input v-model="form.bindId" clearable placeholder="活动id" type='text'></el-input>
            </el-form-item>
            <el-form-item label="图片上传" label-width="80px" prop="imageUrl">
                <el-upload
                    class="avatar-uploader"
                    ref="upload1"
                    :http-request="Upload" 
                    action=""
                    :multiple="false"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    accept="image/jpeg,image/jpg,image/png"
                    style="max-width:80px;max-height:80px;">
                    <img v-if="form.imageUrl && form.imageUrl != ''" :src="form.imageUrl" class="avatar">
                    <el-button size="small" type="primary" v-else>点击上传</el-button>
                </el-upload>
            </el-form-item>
            <!-- 链接配置 -->
            <el-form-item label="链接配置" required label-width="80px" v-if="form.type == 'ADVERTISEMENT_CONFIG'" prop="link">
                <el-input v-model="form.link" clearable placeholder="链接配置" type='text'></el-input>
            </el-form-item>
            <el-form-item label="描述" required label-width="80px" v-if="form.type != 'ADVERTISEMENT_CONFIG'" prop="description">
                <el-input v-model="form.description" clearable placeholder="描述" type='text'></el-input>
            </el-form-item>
            <el-form-item label="备注" required label-width="80px" prop="memo">
                <el-input v-model="form.memo" clearable placeholder="备注" type='text'></el-input>
            </el-form-item>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAddModuleVisiable = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 批量增加卡券 -->
    <el-dialog title="发放卡券" :visible.sync="dialogDispatchVisible" width="500px">
        <el-form label-width="70px" label-position="left">
        <el-form-item label="卡券来源">
            <kd-select v-model="params.couponSource" :options="options_4"></kd-select>
        </el-form-item>
        <div style="display: flex;justify-content: space-between;margin-bottom: 20px;">
            <el-button @click="handleExportTemplate">下载导入模板</el-button>
            <el-upload
                :action="origin+'/api/common/promotion/admin/coupon/center/batch/upload'"
                :headers="{'Authorization': token}"
                :on-success="handleImportSuccess"
                :on-error="handleImportError"
                :show-file-list="false"
                :file-list="fileList">
                <el-button>上传导入模板</el-button>
            </el-upload>
            <el-button @click="handleExportErr">下载失败数据</el-button>
        </div>
        <div style="text-align: center; color:#999;font-size:12px;">提示：重新上传数据会覆盖上一次数据</div>
        <div style="height:20px;" v-if="successCount"><i class="el-icon-success" style="color: #67C23A;"></i> 已成功导入数据 <strong>{{successCount}}</strong> 条</div>
        </el-form>
        <div class="dialog-footer" style="text-align: center;margin-top: 20px;">
        <el-button type="primary" @click="handleSubmitDispatch">提交</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
const COMPONENT_TYPE = {
  COUPON_RECEIVE: "卡券领取",
  COUPON_ACTIVITY: "活动卡券",
  ADVERTISEMENT_CONFIG: "广告图"
};
const STATUS_OPTIONS = {
  true: "开启",
  false: "关闭"
};
const COMPONENT_STATUS = {
  ON_GOING: "进行中",
  NOT_STARTED: "待领取",
  HAS_ENDED: "已结束"
};
const COUPON_SOURCE = {
  //   trc: "电商"
  loan: "口袋"
};
import {
  couponCenterList,
  couponReceiveList,
  addCouponConfig,
  getCouponConfigById,
  putCouponConfig,
  downloadTemplate,
  switchCouponConfig,
  uploadCouponBatch,
  batchAddConponConfig,
  downloanErrorCouponData
} from "@/api/operate";
import { ossUpload } from "@/api/front";
export default {
  name: "luckDrawList",
  components: {},
  data() {
    return {
      search: {
        pageNum: 1,
        pageSize: 10
      },
      searchDetail: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      list: [],
      table: [
        {
          label: "组件类型",
          prop: "type",
          formatter: (row, col, val) => COMPONENT_TYPE[val]
        },
        {
          label: "备注",
          prop: "memo"
        },
        {
          label: "组件状态",
          prop: "status",
          formatter: (row, col, val) => COMPONENT_STATUS[val]
        },
        {
          label: "状态",
          prop: "isEnabled",
          formatter: (row, col, val) => STATUS_OPTIONS[val]
        },
        //剩余总数
        {
          label: "卡券id",
          prop: "couponCenterId"
        },
        {
          label: "活动id",
          prop: "bindId"
        },
        {
          label: "优先级",
          prop: "priority"
        },
        {
          label: "剩余总数",
          prop: "remainingAmount"
        }
      ],
      options_1: Object.keys(COMPONENT_TYPE).map(i => {
        return { value: i, text: COMPONENT_TYPE[i] };
      }),
      options_2: Object.keys(STATUS_OPTIONS).map(i => {
        return { value: i, text: STATUS_OPTIONS[i] };
      }),
      options_3: Object.keys(COMPONENT_STATUS).map(i => {
        return { value: i, text: COMPONENT_STATUS[i] };
      }),
      options_4: Object.keys(COUPON_SOURCE).map(i => {
        return { value: i, text: COUPON_SOURCE[i] };
      }),
      totalDetail: 0,
      detailTable: [
        {
          label: "用户id",
          prop: "phone"
        },
        {
          label: "领取时间",
          prop: "receiveTime"
        }
      ],
      detailTableData: [],
      rules: {
        type: [{ required: true, message: "组件类型必须", trigger: "blur" }],
        priority: [
          { required: true, message: "优先级不能为空", trigger: "blur" },
          {
            pattern: /^[1-9][0-9]{0,1}$/,
            message: "优先级须为1-99的整数",
            trigger: "blur"
          }
        ],
        couponSource: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        bindId: [{ required: true, message: "id不能为空", trigger: "blur" }],
        description: [{ required: true, message: "不能为空", trigger: "blur" }],
        link: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            pattern: this.$valid.webSite,
            message: "链接地址格必须为http或者https开头",
            trigger: "blur"
          }
        ],
        memo: [{ required: true, message: "备注不能为空", trigger: "blur" }]
      },
      showDialog: false,
      showDialogList: false,
      dialogAddModuleVisiable: false,
      form: {
        imageUrl: ""
      },
      formType: "add",
      dialogDispatchVisible: false,
      params: {},
      origin: location.origin,
      token: this.$getLocalStorage("token"),
      fileList: [],
      successCount: undefined, // 成功条数
      batchParams: {},
      curFile: undefined
    };
  },
  computed: {},
  created() {
    this.getData();
  },
  methods: {
    getData() {
      couponCenterList({ ...this.search }).then(res => {
        this.list = res.data.body.content;
        this.total = res.data.body.total;
      });
    },

    handleSearch() {
      this.getData();
    },
    handleDetail(row) {
      this.showDialog = true;
      let params = {
        couponCenterId: row.couponCenterId,
        pageSize: this.searchDetail.pageSize,
        pageNum: this.searchDetail.pageNum
      };
      couponReceiveList(params).then(res => {
        this.detailTableData = res.data.body.list;
        this.totalDetail = res.data.body.total;
      });
    },
    handleSwitch(row) {
      let isEnabled = row.isEnabled ? 0 : 1;
      switchCouponConfig({
        couponCenterId: row.couponCenterId,
        isEnabled: isEnabled
      }).then(res => {
        let mesDes = row.isEnabled ? "关闭" : "开启";
        if (res.data.code == 200) {
          this.$notify({
            title: "成功",
            message: `${mesDes}成功`,
            type: "success"
          });
          this.getData();
        }
      });
    },
    handleDetailList() {
      this.showDialog = false;
      this.showDialogList = true;
    },
    handleAdd() {
      this.dialogAddModuleVisiable = true;
      this.form = {};
      this.formType = "add";
      this.form.couponSource = "loan";
    },
    handleEdit(row) {
      this.dialogAddModuleVisiable = true;
      this.selectCouponCenterId = row.couponCenterId;
      this.formType = "edit";
      getCouponConfigById({ couponCenterId: row.couponCenterId }).then(res => {
        this.form = res.data.body;
        this.form.couponSource = "loan";
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
        });
        this.getData();
      });
    },
    handleSizeChange(val) {
      this.search.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.search.pageNum = val;
      this.getData();
    },
    handleDetailSizeChange(val) {
      this.searchDetail.pageSize = val;
      this.handleDetail();
    },
    handleDetailCurrentChange(val) {
      this.searchDetail.pageNum = val;
      this.handleDetail();
    },
    submitForm(formName) {
      this.$refs[formName].validate().then(valid => {
        if (valid) {
          let params = Object.assign({}, this.form);
          if (this.formType == "add") {
            addCouponConfig(params).then(res => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "成功",
                  message: "新增成功",
                  type: "success"
                });
                this.dialogAddModuleVisiable = false;
                this.getData();
              }
            });
          } else {
            params.couponCenterId = this.selectCouponCenterId;
            putCouponConfig(params).then(res => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "成功",
                  message: "编辑成功",
                  type: "success"
                });
                this.dialogAddModuleVisiable = false;
                this.getData();
              }
            });
          }
        }
      });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 或者PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleAvatarSuccess(res, file) {},
    Upload(file) {
      //区分上传的哪张图片
      var fileObj = file.file;
      // FormData 对象
      var form = new FormData();
      // 请求参数
      form.append("file", fileObj);
      form.append("suffix", file.file.type.split("/")[1]);
      form.append("perpetual", true);
      ossUpload(form).then(res => {
        this.form.imageUrl = res.data.body.url;
        // this.$set(this.form, imageUrl, res.data.body.url);
      });
    },
    // 文件上传失败
    handleImportError(res) {
      this.$message.error(res.error.description || "文件上传失败");
    },
    // 文件上传成功
    handleImportSuccess(res, file, fileList) {
      if (res.code == 200) {
        if (res.body != undefined && res.body.length) {
          this.$message.success("文件上传成功");
          this.batchParams.couponIdList = res.body;
          this.curFile = file.raw;
          this.successCount = res.body.length;
          for (let i in this.batchParams.couponIdList) {
            this.batchParams.couponIdList[i] = this.batchParams.couponIdList[
              i
            ].couponId;
          }
        } else {
          this.$message.error("文件内容为空");
        }
      }
    },
    // 导出错误信息
    handleExportErr() {
      downloanErrorCouponData(this.curFile).then(res => {
        let data = res.data;
        let filename = res.headers["content-disposition"]
          ? res.headers["content-disposition"].split("filename=")[1]
          : "发放失败信息.xlsx";
        filename = decodeURI(filename);
        filename = filename.replace(/\"/g, "");
        this.$downloadExcel(data, filename);
      });
    },
    handleSubmitDispatch() {
      this.batchParams.couponSource = "loan";
      if (this.batchParams.couponIdList == undefined) {
        this.$message.error("请先上传导入模板");
      } else {
        batchAddConponConfig(this.batchParams).then(res => {
          if (res.data.code == "200") {
            this.dialogDispatchVisible = false;
            this.$message.success("批量添加成功");
          }
        });
      }
    },
    handleBatchAdd() {
      this.params.couponSource = "loan";
      this.dialogDispatchVisible = true;

      this.batchParams.couponIdList = [];
      this.successCount = undefined;
    },
    handleExportTemplate() {
      downloadTemplate().then(response => {
        let data = response.data;
        let filename = response.headers["content-disposition"]
          ? response.headers["content-disposition"].split("filename=")[1]
          : "repayed_list.xlsx";
        filename = decodeURI(filename);
        this.$downloadExcel(data, filename);
      });
    }
  }
};
</script>

