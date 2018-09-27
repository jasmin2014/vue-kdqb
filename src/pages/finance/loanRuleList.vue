<!--财务管理-财务放款规则-->
<template>
  <div class="box">
    <el-row>
      <el-button type="primary" @click="handleAdd">添加</el-button>
    </el-row>
    <el-row>
      <el-table :data="list" border class="mgt20">
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :width="col.width"
                         :key="index" align="center"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="150">
          <template slot-scope="scope">
            <el-tooltip content="编辑">
              <el-button size="small" type="warning" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
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

    <el-dialog :title="ruleTitle" :visible.sync="dialog" @close="handleClose" width="600px">
      <el-form :model="ruleModels" label-width="150px" ref="ruleModels" :rules="rules">
        <el-row v-if="mode == 'CREATE'">
          <el-col :span="20">
            <el-form-item label="财务规则名称" prop="ruleName">
              <el-input v-model="ruleModels.ruleName" auto-complete="off" placeholder="必填"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="自动放款金额限制" prop="autoLimit">
              <kd-input v-model="ruleModels.autoLimit" :disabled="mode == 'VIEW'" type="number"
                        placeholder="必填"></kd-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="dialog-footer">
          <el-button type="primary" v-if="mode !=='VIEW'" @click="handleSave">确定</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import * as api from "../../api/finance.js";

  export default {
    name: "FinanceLoanReviewPage",
    components: {},
    data() {
      const numberRule = (rule, value, callback) => {
        if (!Number.isInteger(value)) {
          callback('请输入大于0的整数!')
        } else if (value <= 0) {
          callback('请输入大于0的金额!')
        } else {
          callback();
        }
      };
      const inviteCodeRule = (rule, value, callback) =>
        this.$valid.inviteCodeRule(rule, value, callback, 24);
      return {
        dialog: false,
        ruleModels: {
          ruleName:'',
          autoLimit: ""
        },
        search: {
          pageNum: 1,
          pageSize: 10
        },
        mode: "",
        ruleTitle: "",
        list: [],
        pageTotal: 0,
        grantRuleId: "",
        table: [
          {
            label: "财务规则编号",
            prop: "ruleNo"
          },
          {
            label: "财务规则名称",
            prop: "ruleName"
          },
          {
            label: "自动放款限额",
            prop: "autoLimit"
          },
          {
            label: "操作人",
            prop: "operatorName"
          },
          {
            label: "最后操作时间",
            prop: "updatedTime"
          }
        ],
        rules: {
          ruleName: [
            {required: true, message: '请输入24个以内字符', trigger: 'blur'},
            {validator: inviteCodeRule, trigger: 'blur'}
          ],
          autoLimit: [
            {required: true, message: '请输入自动放款金额限制', trigger: 'blur'},
            {validator: numberRule, trigger: 'blur'}
          ]
        }
      };
    },
    created() {
      this.getData(this.search.pageSize,this.search.pageNum)
    },
    methods: {
      handleCurrentChange(val){
        this.search.pageNum = val
        this.getData(this.search.pageSize,val);
      },
      handleSizeChange(val){
        this.search.pageSize = val
        this.getData(val,this.search.pageNum)
      },
      getData(pageSize,pageNum) {
        const mySearch = this.$deepcopy(this.search);
        mySearch.pageSize = pageSize;
        mySearch.pageNum = pageNum;
        api.getGrantRules(mySearch).then(response => {
          let res = response.data;
          if (res.code == 200 && res.body.content) {
            this.list = res.body.content;
            this.pageTotal = res.body.total;
          }
        });
      },
      handleSave() {
        this.$refs.ruleModels.validate(val => {
          if (val) {
            if(this.mode == 'CREATE'){
              this.addGrantRule();
            }else if(this.mode == 'EDIT'){
              this.editGrantRule();
            }
          } else {
            return false;
          }
        })
      },
      handleAdd(){
        this.ruleTitle = "添加放款规则";
        this.mode = "CREATE";
        this.dialog = true
      },
      editGrantRule() {
        let _params = this.$deepcopy(this.ruleModels);
        _params.autoLimit = Number(_params.autoLimit)
          ? Number(_params.autoLimit)
          : 0;
        _params.prdGrantRuleId = this.prdGrantRuleId;
        api.editGrantRule(_params).then(response => {
          if (response.data.code == 200) {
            this.getGrantRules(1);
            this.dialog = false;
          }
        });
      },
      handleEdit(row) {
        this.ruleTitle = "编辑放款规则";
        this.dialog = true;
        this.mode = "EDIT";
        this.prdGrantRuleId = row.prdGrantRuleId;
      },
      handleClose() {
        this.dialog = false;
        this.$refs.ruleModels.resetFields();
      },
      //新增
      addGrantRule(){
        const ruleModels = this.$deepcopy(this.ruleModels);
        api.addGrantRule(ruleModels).then(response => {
          const res = response.data;
          if(res.code == 200){
            this.$message({
              type:'success',
              message:'添加成功!'
            })
            this.dialog = false;
            this.getGrantRules(this.search.pageNum);
          }else {
            this.$message({
              type:'success',
              message: res.message
            })
          }
        })
      }
    }
  };
</script>

<style scoped>
</style>
