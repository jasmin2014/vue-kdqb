
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<!--资产管理-字典表配置-->
<template>
  <div class="box">
    <el-form class="form-label flex fixed-width">
        <el-row>
          <el-col :span="6">
            <el-form-item label="配置名称">
              <el-input v-model="search.paramName" placeholder="配置名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="配置ID">
              <el-input v-model="search.configId" placeholder="配置ID" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="配置编码">
              <el-input v-model="search.paramCode" placeholder="配置编码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" title="搜索" @click="handleSearch"></el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item>
              <el-button type="primary" title="添加配置" @click="handleAddConfig">添加配置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-table :data="list" border class="table-center">
            <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label"
                            :formatter="col.formatter"
                            :width="col.width" :key="index" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-tooltip content="修改">
                  <el-button type="warning" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
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
          layout="sizes,total,prev, pager, next,jumper"
          :total="total">
        </el-pagination>
      </el-row>
    </el-form>
    <!-- 编辑弹框 -->
    <el-dialog :title="dialogTitle" :visible.sync="showDialog" width="600px" @close="handleDialogClose">
      <el-form :model="configDetail" :rules="rules" ref="configForm" label-width="100px">
        <el-form-item label="配置名称:" prop="paramName">
          <kd-input v-model="configDetail.paramName" :disabled="mode == 'EDIT'" placeholder="请输入36个以内的字符"></kd-input>
        </el-form-item>
        <el-form-item label="配置编码:" prop="paramCode">
          <kd-input v-model="configDetail.paramCode" :disabled="mode == 'EDIT'"></kd-input>
        </el-form-item>
        <el-form-item label="配置类型:" prop="configType" v-if="mode == 'CREATE'">
          <kd-select v-model="configDetail.configType"
                      :options = "configTypeOptions"
                      @change="handleConfigType"
                      clearable>
          </kd-select>
        </el-form-item>
        <el-form-item label="配置类型:" prop="configTypeInput" v-if="mode == 'EDIT'">
          <kd-input v-model="configDetail.configTypeInput" disabled></kd-input>
        </el-form-item>
        <el-form-item label="配置参数:" prop="paramValue" v-if="argConfigShow">
          <kd-input v-model="configDetail.paramValue" placeholder="请输入英文或者数字"></kd-input>
        </el-form-item>
        <el-form-item label="配置状态:" prop="paramValue" v-if="enableConfigShow">
          <kd-radio v-model="configDetail.paramValue" :mode="mode" :group="this.$enum.ENABLE_STATUS" @change="handleChange"></kd-radio>
        </el-form-item>
        <el-form-item label="配置描述:" prop="remarks">
          <el-input type="textarea" v-model="configDetail.remarks" :rows="5" placeholder="请输入48个以内的字符"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">确定</el-button>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getpageList,
  addSysConfigInfo,
  querySysConfigByParamCode,
  updateSysConfigInfo
} from "../../api/system";
export default {
  name: "SystemParameterPage",
  data() {
    const inviteCodeRule = (rule, value, callback) =>
      this.$valid.inviteCodeRule(rule, value, callback, 36);
    const codeRule = (rule, value, callback) => {
      const codeReg = /^[0-9A-Za-z]+$/g;
      if (value && value != "true" && value != "false") {
        if (!codeReg.test(value)) {
          callback("限制数字或英文");
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      search: {
        paramName: "",
        configId: "",
        paramCode: "",
        pageSize: 10,
        pageNum: 1
      },
      dialogTitle: "",
      list: [],
      updatedBys: [],
      showDialog: false,
      total: 0,
      mode: "",
      configDetail: {
        paramName: "",
        configType: "",
        paramValue: "",
        remarks: "",
        paramCode: ""
      },
      argConfigShow: false,
      enableConfigShow: false,
      configTypeOptions: [
        {
          text: "参数配置",
          value: "argConfig"
        },
        {
          text: "启用禁用配置",
          value: "enableConfig"
        }
      ],
      table: [
        {
          label: "配置名称",
          prop: "paramName"
        },
        {
          label: "配置ID",
          prop: "configId"
        },
        {
          label: "配置编码",
          prop: "paramCode"
        },
        {
          label: "配置描述",
          prop: "remarks",
          formatter: (row, col, val) => this.$tableDefFormat(row, col, val)
        },
        {
          label: "配置参数",
          prop: "paramValue",
          formatter: (row, col, val) =>
            val == "true" ? "启用" : val == "false" ? "禁用" : val
        },
        {
          label: "最近更新时间",
          prop: "updatedTime"
        },
        {
          label: "最近更新人",
          prop: "updatedBy",
          formatter: (row, col, val) => this.$filterUpdate(val, this.updatedBys)
        }
      ],
      rules: {
        paramName: [
          { required: true, message: "请输入配置名称", trigger: "blur" },
          { validator: inviteCodeRule, trigger: "blur" }
        ],
        paramCode: [
          { required: true, message: "请输入配置编码", trigger: "blur" },
          {
            pattern: /^[A-Za-z_]+$/g,
            message: "请输入正确的配置编码",
            trigger: "blur"
          }
        ],
        configType: [
          { required: true, message: "请选择配置类型", trigger: "change" }
        ],
        paramValue: [
          {
            required: true,
            message: "请输入配置参数",
            trigger: ["blur", "change"]
          },
          { validator: codeRule, trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    "configDetail.configType": function(val, oldVal) {
      this.clearParamValue(val);
    }
  },
  created() {
    this.getpageList(this.search.pageSize, this.search.pageNum);
  },
  methods: {
    clearParamValue(val) {
      if (this.$refs["configForm"].$children.length > 0) {
        this.$refs["configForm"].$children.forEach(item => {
          if (item.prop === "paramValue") {
            item.resetField();
          }
        });
      }
      if (this.mode === "CREATE") {
        if (val === "enableConfig") {
          this.configDetail.paramValue = "true";
        } else {
          this.configDetail.paramValue = "";
        }
      }
    },
    getpageList(pageSize, pageNum) {
      const search = this.$deepcopy(this.search);
      search.pageSize = pageSize;
      search.pageNum = pageNum;

      getpageList(search).then(response => {
        const res = response.data;
        const updatedBys = [];
        if (res.code == 200) {
          res.body.content.forEach(ele => {
            updatedBys.push(ele.updatedBy);
          });
          if (updatedBys.length != 0) {
            this.$getPartyRealName(updatedBys).then(data => {
              this.updatedBys = data;
              this.list = res.body.content;
              this.total = res.body.total;
            });
          }else{
            this.list = []
            this.total = 0
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
    handleSearch() {
      this.search.pageNum = 1;
      this.getpageList(this.search.pageSize, this.search.pageNum);
    },
    handleCurrentChange(val) {
      this.search.pageNum = val;
      this.getpageList(this.search.pageSize, this.search.pageNum);
    },
    handleSizeChange(val) {
      this.search.pageSize = val;
      this.getpageList(this.search.pageSize, this.search.pageNum);
    },
    handleAddConfig() {
      this.mode = "CREATE";
      this.dialogTitle = "添加参数配置管理";
      this.showDialog = true;
      this.argConfigShow = false;
      this.enableConfigShow = false;
      this.configDetail.paramValue = ""
    },
    handleEdit(row) {
      this.mode = "EDIT";
      this.dialogTitle = "编辑参数配置管理";
      this.showDialog = true;
      this.querySysConfigByParamCode(row.paramCode);
    },
    querySysConfigByParamCode(paramCode) {
      querySysConfigByParamCode({ paramCode: paramCode }).then(response => {
        const res = response.data;
        if (res.code == 200) {
          this.configDetail = res.body;
          if (
            this.configDetail.paramValue == "true" ||
            this.configDetail.paramValue == "false"
          ) {
            this.configDetail.configTypeInput = "启用禁用配置";
            this.argConfigShow = false;
            this.enableConfigShow = true;
          } else {
            this.configDetail.configTypeInput = "参数配置";
            this.argConfigShow = true;
            this.enableConfigShow = false;
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
    handleConfirm(response, message) {
      const res = response.data;
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: message
        });
        this.showDialog = false;
        this.search.pageNum = 1;
        this.getpageList(this.search.pageSize, this.search.pageNum);
      } else {
        this.$message({
          showClose: true,
          type: "error",
          message: res.message
        });
      }
    },
    handleConfigType(val) {
      this.clearParamValue(val);
      if (val == "argConfig") {
        this.argConfigShow = true;
        this.enableConfigShow = false;
      } else if (val == "enableConfig") {
        this.argConfigShow = false;
        this.enableConfigShow = true;
      } else {
        this.argConfigShow = false;
        this.enableConfigShow = false;
      }
    },
    handleSave() {
      this.$refs.configForm.validate(valid => {
        if (valid) {
          delete this.configDetail.configType;
          delete this.configDetail.configTypeInput;
          if (this.mode == "CREATE") {
            addSysConfigInfo(this.configDetail).then(response => {
              this.handleConfirm(response, "添加成功");
            });
          } else {
            updateSysConfigInfo(this.configDetail).then(response => {
              this.handleConfirm(response, "编辑成功");
            });
          }
        } else {
          return false;
        }
      });
    },
    handleCancel() {
      this.showDialog = false;
      this.$refs.configForm.resetFields();
    },
    handleChange(val) {
      this.configDetail.paramValue = val;
    },
    handleDialogClose() {
      this.$refs.configForm.resetFields();
    }
  }
};
</script>

