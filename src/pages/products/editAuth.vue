
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.authmodel-content {
  // position: relative;
  .checkout-title {
    position: absolute;
    left: 1px;
    top: 5px;
    color: #909399;
    z-index: 11;
    font-size: 14px;
    font-weight: bold;
    width: 98px;
    background: #fff;
    text-align: center;
  }
}
</style>
<!--产品管理-认证模型-->
<template>
  <div class="box">
    <el-form :model="authModel" ref="authModel" label-width="180px" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="认证模型名称:" prop="modelName">
            <kd-input v-model.trim ="authModel.modelName" auto-complete="off" :disabled="mode != 'CREATE'"></kd-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="认证模型编号:" prop="modelCode" v-if="this.mode == 'EDIT'">
            <kd-input v-model="authModel.modelCode" auto-complete="off" :disabled="mode != 'CREATE'"></kd-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="适用于渠道:" prop="channelCode">
            <kd-select v-model="authModel.channelCode" :channel="'true'" placeholder="请选择" v-if="mode == 'CREATE'" @change="changeAuthModelType('changeChannel')"></kd-select>
            <kd-select v-model="authModel.channelCode" :channel="'false'" placeholder="请选择"  disabled v-else></kd-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="认证模型类型:" prop="modelTypeCode">
             <kd-select v-model="authModel.modelTypeCode"
                         :group="this.$enum.AUTH_MODEL_TYPE"
                         :disabled = "this.mode != 'CREATE'" @change="changeAuthModelType"></kd-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="认证模型内容:" prop="prdAuthModelItemList" class="authmodel-content">
            <span class="checkout-title">选择</span>
            <el-table :data="prdAuthModelItemList" border class="table-center" ref="authTable" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName">
              <el-table-column type="selection" :selectable="selectable" width="100">
              </el-table-column>
              <el-table-column label="名称" prop="authItemName"></el-table-column>
              <el-table-column label="认证有效期" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.authValidityPeriod}}&nbsp;天</span>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="mode != 'VIEW'">
        <el-col :span="8" style="margin-left:180px">
          <el-button type="primary" @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleAdd" :disabled="editDisabled">编辑模型</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog :title="dialogTitle" :visible.sync="showDialog" width="800px">
      <auth-dialog @show="handleVisible" :authModelList="authModelList" @updown="handleUpDown"  @save="handleSave"></auth-dialog>
    </el-dialog>
  </div>
</template>

<script>
import {
  editAuth,
  createAuth,
  getModelByCode,
  getModelByChannel
} from "../../api/products";
import { getSysEnum } from "../../api/common";
import authDialog from "./components/authDialog.vue";
export default {
  name: "ProductsAuthEditPage",
  components: {
    authDialog
  },
  data() {
    const inviteCodeRule = (rule, value, callback) =>
      this.$valid.inviteCodeRule(rule, value, callback, 24);
    return {
      channelOptions: [],
      mode: "",
      id: "",
      value: "",
      showDialog: false,
      isUpdown: false,
      indexList: [],
      authmodelTypeList:{},
      isDisable: false, //判断当前行可不可选和当前行的背景色
      authModel: {
        modelName: "",
        modelCode: "",
        channelCode: "",
        modelTypeCode: "",
        prdAuthModelItemList: []
      },
      editDisabled: true,
      authModelList: [],
      dialogTitle: "编辑认证模型内容",
      prdAuthModelItemList: [],
      prdAuthModelList:[],
      rules: {
        modelName: [
          { required: true, message: "请输入认证模型名称", trigger: "blur" },
          { validator: inviteCodeRule, trigger: "blur" }
        ],
        channelCode: [
          { required: true, message: "请选择渠道名称", trigger: "change" }
        ],
        modelTypeCode: [
          { required: true, message: "请选择认证模型类型", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.mode = this.$route.query.mode;
    this.id = this.$route.params.id;
    this.getSysEnum().then(data => {
      if (this.id) {
        this.getModelByCode(this.id);
      }else{
        this.prdAuthModelItemList = data
      }
    });
  },
  methods: {
    getSysEnum() {
      return new Promise((resolve, reject) => {
        getSysEnum(this.$enum.AUTH_MODEL)
          .then(response => {
            response.data.body.forEach(ele => {
              this.prdAuthModelList.push({
                authItemName: ele.itemName,
                authValidityPeriod: ele.attr1,
                sort: ele.itemSort,
                authItemCode: ele.itemValue
              });
            });
            resolve(this.prdAuthModelList);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getModelByCode(id) {
      getModelByCode({ modelCode: id }).then(response => {
        const res = response.data;
        if (res.code == 200) {
          this.authModel = res.body;
          if(this.mode == 'VIEW'){
            this.authModel.prdAuthModelItemList.forEach(ele=>{
              let currentList = []
              currentList = this.prdAuthModelList.filter(_ => _.authItemCode === ele.authItemCode)
              this.prdAuthModelItemList.push({
                authItemName:ele.authItemName,
                authValidityPeriod:currentList[0].authValidityPeriod,
                sort:ele.sort,
                authItemCode:ele.authItemCode
              })
            })
            this.prdAuthModelItemList.forEach((row)=>{
              this.$refs.authTable.toggleRowSelection(row)
            })
          }else{
            this.prdAuthModelItemList = this.prdAuthModelList
            this.changeAuthModelType()
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
    handleSave() {
      this.authModel.prdAuthModelItemList = this.authModelList;
      this.authModel.prdAuthModelItemList.forEach((ele, index) => {
        ele.sort = index;
        delete ele.authValidityPeriod
      });
      delete this.authModel.updatedTime;
      this.$refs.authModel.validate(valid => {
        if (valid) {
          if (this.mode == "CREATE") {
            createAuth(this.authModel).then(response => {
              this.handleSubmit(response, "添加成功");
            });
          } else {
            editAuth(this.authModel).then(response => {
              this.handleSubmit(response, "编辑成功");
            });
          }
        } else {
          return false;
        }
      });
    },
    handleSubmit(response, message) {
      const res = response.data;
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: message
        });
        this.showDialog = false;
        window.opener.location.href = window.opener.location.href;
        setTimeout(() => {
          window.close();
        }, 100);
      } else {
        this.$message({
          showClose: true,
          type: "error",
          message: res.message
        });
      }
    },
    handleCancel() {
      window.opener.location.href = window.opener.location.href;
      setTimeout(() => {
        window.close();
      }, 100);
    },
    changeAuthModelType(val) {
      const currentObjList = Object.keys(this.authmodelTypeList).length
      if(val == 'changeChannel' || currentObjList == 0){
        getModelByChannel({ channelCode: this.authModel.channelCode }).then(
          response => {
            this.authmodelTypeList = response.data.body;
            this.handleChangeAuthModelType()
          }
        )
      }else{
        this.handleChangeAuthModelType()
      }
    },
    handleChangeAuthModelType(){
      const credit = this.authmodelTypeList.CREDIT.prdAuthModelItemList;
      const increase = this.authmodelTypeList.INCREASE_LIMIT.prdAuthModelItemList;
      const customer = this.authmodelTypeList.CUSTOMER_CREDIT.prdAuthModelItemList;
      this.indexList = []
      this.$refs.authTable.clearSelection()
      this.value = this.authModel.modelTypeCode;
      //添加认证模型时，判断该渠道该认证类型模型是否已存在
      if (this.mode == "CREATE") {
        for (let key in this.authmodelTypeList) {
          if (key == this.value && this.authmodelTypeList[key].isExist) {
            this.$message({
              showClose: true,
              message: "已存在该渠道该类型认证项！",
              type: "error"
            });
            return false;
          }
        }
      }
      //编辑认证模型时，回显数据
      if (this.mode == "EDIT") {
        this.authModel.prdAuthModelItemList.forEach(ele => {
          this.prdAuthModelItemList.forEach(row => {
            if (ele.authItemName == row.authItemName) {
              this.$refs.authTable.toggleRowSelection(row);
            }
          });
        });
      }
      //当前认证模型类型为消费授信时，判断预借现金授信和提额授信是否存在
      if (this.value == "CUSTOMER_CREDIT") {
        if ((credit && !increase) || (credit && increase)) {
          this.indexList = credit;
          this.isDisable = true;
        } else if (!credit && increase) {
          this.isDisable = false;
          this.indexList = increase;
        }
      }

      //当前认证模型为预借现金授信，判断消费授信和提额授信是否存在
      if (this.value == "CREDIT") {
        this.isDisable = false;
        if (customer) {
          this.indexList = customer;
          this.indexList.forEach(ele => {
            this.prdAuthModelItemList.forEach(row => {
              if (ele.authItemName == row.authItemName) {
                //当前认证模型是预借现金授信，此时给消费授信打标记，并且消费授信为选中状态
                row.modelTypeCode = "CUSTOMER_CREDIT";
                if (this.mode == "CREATE") {
                  this.$refs.authTable.toggleRowSelection(row);
                }
              }
            });
          });
          if (increase) {
            increase.forEach(ele => {
              this.indexList.push(ele);
            });
          }
        } else if (!customer && increase) {
          this.indexList = increase;
        }
      }

      //当前认证模型为提额认证
      if (this.value == "INCREASE_LIMIT") {
        //添加认证模型时，判断消费授信和预借现金授信
        if (this.mode == "CREATE") {
          //判断消费授信和预借现金授信至少有一项已存在
          if (!customer && !credit) {
            this.$message({
              showClose: true,
              message: "请先设置授信认证项",
              type: "error"
            });
            return false;
          }
          //切换借款授信和提额授信时，复选框要取消选中
          if (this.authModelList.length) {
            customer.forEach(ele => {
              this.prdAuthModelItemList.forEach(row => {
                if (ele.authItemName == row.authItemName) {
                  this.$refs.authTable.toggleRowSelection(row);
                }
              });
            });
          }
        }
        this.isDisable = false;
        if (customer && !credit) {
          this.indexList = customer;
        } else if ((!customer && credit) || (customer && credit)) {
          this.indexList = credit;
        }
      }
    },
    handleSelectionChange(val) {
      //判断是否使用过上下箭头改变过顺序
      if (val.length > 0) {
        this.editDisabled = false;
      } else {
        this.editDisabled = true;
      }
      if (this.isUpdown) {
        if (this.authModelList.length < val.length) {
          this.authModelList.push(val[val.length - 1]);
        } else {
          //找出取消选中的值
          this.authModelList.forEach((ele, $index) => {
            if (JSON.stringify(val).indexOf(ele.authItemName) == -1) {
              this.authModelList.splice($index, 1);
            }
          });
        }
      } else {
        this.authModelList = val;
      }
    },
    handleAdd() {
      this.showDialog = true;
    },
    handleVisible() {
      this.showDialog = false;
    },
    handleUpDown(val) {
      this.isUpdown = true;
      this.authModelList = val;
    },
    tableRowClassName({ row, rowIndex }) {
      if (this.value) {
        if (this.indexList.length) {
          if (
            this.indexList.some(el => {
              return el.authItemName == row.authItemName;
            })
          ) {
            if (this.isDisable) {
              return "";
            } else {
              return "warning-row";
            }
          } else {
            if (this.isDisable) {
              return "warning-row";
            } else {
              return "";
            }
          }
        }
      } else {
        return "";
      }
    },
    selectable(row, index) {
      if(this.mode == 'VIEW'){
        return false
      }else{
        if (this.value) {
          if (this.indexList.length) {
            if (
              this.indexList.some(el => {
                return el.authItemName == row.authItemName;
              })
            ) {
              if (this.isDisable) {
                return true;
              }
            } else {
              if (!this.isDisable) {
                return true;
              }
            }
          } else {
            return true;
          }
        } else {
          return true;
        }
      }
    }
  }
};
</script>

