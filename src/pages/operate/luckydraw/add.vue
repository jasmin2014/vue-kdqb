<template>
    <div class="box">
        <el-form :model="form" ref="form" label-width="100px" class="demo-dynamic">  
            <el-form-item label="抽奖名称" prop="luckyDrawName" :rules="[
                        { required: true, message: '不能为空'}
                        ]" >
                <el-col :span="10" >
                    <el-input v-model.trim="form.luckyDrawName"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="奖池配置">
                <el-table :data="luckyDrawPrizes" border>
                    <el-table-column v-for="col in tableHeader" :key="col.prop" :label="col.label" align="center"> 
                    <template slot-scope="scope">
                        <el-form :model="scope.row">
                            <el-form-item :prop="col.prop">
                                <div v-if="scope.row.prizeType == 'THANKS_PARTICIPATION'"> 
                                    <div v-if="col.prop == 'prizeName' || col.prop == 'prizeBindId' || col.prop == 'totalAmount' || col.prop == 'dayLimit'">
                                            --
                                    </div>
                                    <div v-else>
                                        <div v-if='col.type== "select"'>
                                            <kd-select v-model.trim="scope.row[col.prop]" :options="col.data" clearable :disabled='scope.row.isMinimumGuarantee == 1? true:false'
                                            @change="handleSelectChange(scope)">
                                            </kd-select>
                                        </div>
                                        <div v-if="col.type == 'input'">
                                            <el-input v-model.trim="scope.row[col.prop]" :placeholder="col.des" :disabled="scope.row.isMinimumGuarantee == 1? true:false" :type="col.modelType" clearable>
                                                <template slot-scope="append" v-if="col.prop == 'probability'">%</template>
                                            </el-input >
                                        </div>
                                    </div>
                                </div>
                                <div v-if="scope.row.prizeType == 'COUPON'">
                                    <div v-if="col.prop == 'prizeBindId'">
                                        <span>{{scope.row.prizeBindId}}</span>
                                        <el-button size="small" icon="el-icon-edit" @click="handlePublish(scope)">绑定</el-button>
                                    </div>
                                    <div v-else> 
                                        <div v-if='col.type== "select"'>
                                            <kd-select v-model.trim="scope.row[col.prop]" :options="col.data" clearable
                                            @change="handleSelectChange(scope)">
                                            </kd-select>
                                        </div>
                                        <div v-if="col.type == 'input'">
                                        <el-input v-model.trim="scope.row[col.prop]" :placeholder="col.des" :type="col.modelType" clearable>
                                            <template slot-scope="append" v-if="col.prop == 'probability'">%</template>
                                        </el-input>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="scope.row.prizeType != 'COUPON' && scope.row.prizeType != 'THANKS_PARTICIPATION'">
                                    <div v-if="col.prop == 'prizeBindId'">
                                        --
                                    </div>
                                    <div v-else>
                                        <div v-if='col.type== "select"'>
                                            <kd-select v-model.trim="scope.row[col.prop]" :options="col.data" clearable
                                            @change="handleSelectChange(scope)">
                                            </kd-select>
                                        </div>
                                        <div v-if="col.type == 'input'">
                                            <el-input v-model.trim="scope.row[col.prop]" :placeholder="col.des" :type="col.modelType" clearable>
                                                <template slot-scope="append" v-if="col.prop == 'probability'">%</template>
                                            </el-input>
                                        </div>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-form>
                    </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center"  v-if="pageType =='edit'">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.isEnabled ? '下架':'上架'">
                                <el-button size="small"  @click="handleSwitch(scope.row)">
                                    {{scope.row.isEnabled ? '下架':'上架'}}
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <!-- <el-form-item label="保底奖品">
                <el-col :span="6" style="margin-right:10px;">
                    <el-select v-model="form.region" placeholder="奖品类型">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-col>
                 <el-col :span="6" style="margin-right:10px;">
                    <el-input v-model="form.email" placeholder="奖品描述"></el-input>
                </el-col>
                 <el-col :span="6">
                    <el-select v-model="form.region" placeholder="奖品绑定">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-col>
            </el-form-item> -->
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">保存</el-button>
                 <!-- <el-button  @click="resetForm('form')">重置</el-button> -->
            </el-form-item>
        </el-form>
        <el-dialog :title="sourceTitle" :visible.sync="showDialog" width="900px">
            <source-dialog  @submit="dialogSubmit" :isradio="isradio" :table='dialogTable' :list="dialogList" :total="dialogTotal" :limit="dialogLimit" :page="dialogPage" @pagination="handlePagination"></source-dialog>
        </el-dialog>
    </div>
</template>

<script>
const COUPON_STATUS_MAP = {
  INEFFECTIVE: "未生效",
  PUBLISHED: "已发放",
  CANCELED: "取消发行",
  DISCARDED: "已废弃"
};
import {
  addLuckyDraw,
  getLuckyDrawPrizeList,
  prizeStatusSwitch,
  updateLuckyDrawById,
  getCouponPublishedList
} from "@/api/operate";
import sourceDialog from "../components/sourceDialog.vue";
export default {
  data() {
    const integerrule = (rule, value, callback) => {
      if (isNaN(value) || value < 0) {
        callback("请输入正确的数字");
      } else {
        callback();
      }
    };
    const numberRule = (rule, value, callback) => {
      if (isNaN(value) || value < 0) {
        callback("请输入正确日利率");
      } else if (!this.$valid.floatValidator(value, 2)) {
        callback("保留2位小数");
      } else {
        callback();
      }
    };
    return {
      form: {},
      tableHeader: [
        {
          prop: "prizeType",
          label: "奖品类型",
          type: "select",
          isBlur: true,
          data: [
            { text: "卡券", value: "COUPON" },
            { text: "实物商品", value: "PHYSICAL_COMMODITY" },
            { text: "话费充值", value: "PHONE_FARE" },
            { text: "油卡充值", value: "FUEL_CARD" },
            { text: "谢谢惠顾", value: "THANKS_PARTICIPATION" }
          ],
          des: ""
        },
        {
          prop: "prizeName",
          label: "奖品描述",
          type: "input",
          isBlur: true,
          des: "奖品描述",
          modelType:"text"
        },
        {
          prop: "prizeBindId",
          label: "奖品绑定",
          type: "input",
          isBlur: true,
          des:
            "卡券需手动绑定。实物商品“-”。话费充值或油卡充值输入对应数字，表示奖品的面额",

          modelType:"text"
        },
        {
          prop: "totalAmount",
          label: "奖品总数量",
          type: "input",
          isBlur: true,
          des: "奖品总数量",
          modelType:"number"
        },
        {
          prop: "probability",
          label: "抽中概率",
          type: "input",
          isBlur: true,
          des: "0-99的正整数",
          modelType:"number"
        },
        {
          prop: "dayLimit",
          label: "日上限",
          type: "input",
          isBlur: true,
          des: "正整数",
          modelType:"number"
        }
      ],
      luckyDrawPrizes: [],
      formRowData: {
        dayLimit: "",
        prizeBindId: "",
        prizeName: "",
        prizeType: "",
        probability: "",
        receivedCurrentDayAmount: "",
        receivedTotalAmount: "",
        totalAmount: "",
      },
      sourceTitle: "卡券绑定",
      showDialog: false,
      isradio: true,
      dialogTable: [
        {
          label: "卡券名称",
          prop: "couponName"
        },
        {
          label: "卡券id",
          prop: "publishNo"
        },
        {
          label: "卡券状态",
          prop: "status",
          formatter: (row, col, val) => COUPON_STATUS_MAP[val]
        }
      ],
      dialogList: [],
      dialogTotal: 0,
      dialogLimit: 10,
      dialogPage: 1,
      PUBLISHED_INDEX: 0,
      pageType:'add',
    };
  },
  components: {
    sourceDialog
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.validateForm().then(() =>{
              let params = {
                luckyDrawName: this.form.luckyDrawName,
                prizeList: this.luckyDrawPrizes
              };
              let postData = this.$deepcopy(params)
              postData.prizeList.map(val => {
                val.probability = val.probability / 100;
              });
              if (this.$route.query.type == "edit" && this.$route.query.id) {
                postData.luckyDrawId = this.$route.query.id;
                updateLuckyDrawById(postData).then(res => {
                    if(res.data.code ==200){
                        this.$notify({
                            title: "成功",
                            message: "修改成功",
                            type: "success"
                        });
                        this.getData();
                    }
                })
              } else {
              addLuckyDraw(postData).then(res => {
                  if(res.data.code == 200 ){
                      this.$notify({
                          title: "成功",
                          message: "新增成功",
                          type: "success"
                      });
                      this.$router.push({name:"LuckyDrawActivityList"});
                  }
              });
              }
          })
          
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      
    },
    validateForm(){
      let _this = this
      let probabilityReg = /^100$|^(\d|[1-9]\d)(\.\d+)*$/
      return new Promise((resolve,reject) => {
        this.luckyDrawPrizes.map(val => {
          if(val.prizeType == ""){
            this.$message({
              message: `奖品类型不能为空`,
              type: "warning"
            });
            reject()
          }else if(val.prizeType != 'THANKS_PARTICIPATION' &&val.prizeName ==""){
            this.$message({
              message: `奖品描述不能为空`,
              type: "warning"
            });
            reject()
          }else  if(val.prizeType != 'THANKS_PARTICIPATION' &&val.totalAmount==''){
           this.$message({
              message: `奖品总量不能为空`,
              type: "warning"
            });
            reject()
          }else if(val.prizeType != 'THANKS_PARTICIPATION' &&val.dayLimit ==''){
              this.$message({
                message: `奖品日上限不能为空`,
                type: "warning"
              });
            reject()
          }else if(val.prizeType != 'THANKS_PARTICIPATION' && !_this.$valid.integer.test(val.totalAmount)){
            if(val.totalAmount != -1){
               this.$message({
                message: "奖品总数必须为大于0的整数或-1",
                type: "warning"
              });
              reject()
            }
          }else if(val.prizeType != 'THANKS_PARTICIPATION' && !_this.$valid.integer.test(val.dayLimit)){
            if(val.dayLimit != -1){
               this.$message({
                message: "奖品日上限必须为大于0的整数或-1",
                type: "warning"
              });
              reject()
            }
          }else if(!probabilityReg.test(val.probability)){
            this.$message({
              message: "奖品概率必须为大于0小于100的数字",
              type: "warning"
            });
            reject()
          }
        })
        resolve()
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSwitch(row) {
      let params = {
        prizeId: row.prizeId,
        isEnabled: row.isEnabled ? 0 : 1
      };
      prizeStatusSwitch(params).then(res => {
        this.$message({
          message: `商品已${row.isEnabled ? "下架" : "上架"}`,
          type: "success"
        });
        this.getData();
      });
    },
    getData() {
      getLuckyDrawPrizeList({ luckyDrawId: this.$route.query.id }).then(res => {
        this.luckyDrawPrizes = res.data.body.prizeList;
        this.form.luckyDrawName = res.data.body.luckyDrawName;
        for (let i in this.luckyDrawPrizes) {
          this.luckyDrawPrizes[i].probability =
            this.luckyDrawPrizes[i].probability * 100;
        }
      });
    },
    handlePublish(scope) {
      this.showDialog = true;
      this.PUBLISHED_INDEX = scope.$index;
      this.getCouponPublishedList();
    },
    getCouponPublishedList() {
      getCouponPublishedList().then(res => {
        this.dialogList = res.data.data.list;
        this.dialogTotal = res.data.data.dialogTotal;
      });
    },
    dialogSubmit(data) {
      this.showDialog = false;
      this.luckyDrawPrizes[this.PUBLISHED_INDEX].prizeBindId =
        data.publishNo;
    },
    handlePagination(limit, page) {
      this.dialogPage = page;
      this.dialogLimit = limit;
      this.getCouponPublishedList();
    },
    handleSelectChange(scope){
      for(let i in this.luckyDrawPrizes){
        if(i == scope.$index){
          if(this.luckyDrawPrizes[i].prizeType != 'THANKS_PARTICIPATION'){
              this.luckyDrawPrizes[i].prizeName = ''
              this.luckyDrawPrizes[i].totalAmount = ''  
              this.luckyDrawPrizes[i].priority = ''              
              this.luckyDrawPrizes[i].dayLimit = ''              

          } 
        }
      }
    }
  },
  created() {
    this.pageType = this.$route.query.type
    if (this.$route.query.type == "add") {
      for (var i = 0; i < 7; i++) {
        if (i >= 7) {
          return;
        }
        this.luckyDrawPrizes.push({
          dayLimit: "",
          prizeBindId: "",
          prizeName: "",
          prizeType: "",
          probability: "",
          receivedCurrentDayAmount: "",
          receivedTotalAmount: "",
          totalAmount: "",
          isMinimumGuarantee: 0,
        });
      }
      this.luckyDrawPrizes.push({
        dayLimit: "",
        prizeBindId: "",
        prizeName: "",
        prizeType: "THANKS_PARTICIPATION",
        probability: "",
        receivedCurrentDayAmount: "",
        receivedTotalAmount: "",
        totalAmount: "",
        isMinimumGuarantee: 1,
      });
    } else if (this.$route.query.type == "edit" && this.$route.query.id) {
      this.getData();
    }
  },
  mounted() {
    this.$route.meta.title =
      this.$route.query.type == "add" ? "新增抽奖" : "编辑抽奖";
  },
  watch: {
    luckyDrawPrizes: {
      handler(newVal, oldVal) {
        let totalProbability = 0;
        for (let i in newVal) {
          if (!newVal[i].isMinimumGuarantee) {
            totalProbability += Number(newVal[i].probability);
          } else {
            newVal[i].probability = 100 - totalProbability;
          }
        }
        this.luckyDrawPrizes = newVal;
      },
      deep: true,
      immediate: true
    }
  }
};
</script>