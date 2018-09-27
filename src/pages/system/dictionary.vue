
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<!--资产管理-字典表配置-->
<template>
  <div class="box">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="字典编码">
            <el-input v-model="search.dicCode" placeholder="字典编码" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="子项值">
            <el-input v-model="search.itemValue" placeholder="子项值" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="子项名称">
            <el-input v-model="search.itemName" placeholder="子项名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" title="搜索" @click="handleSearch"></el-button>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item>
            <el-button type="primary" title="清除缓存" @click="handleDeleteRedis">清除缓存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="list" border class="table-center">
          <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label"
                          :formatter="col.formatter"
                          :width="col.width" :key="index" align="center"></el-table-column>
        </el-table>
      </el-row>
      <el-row type="flex" justify="center" class="mgt20">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="page.pageNum"
          :page-size="page.pageSize"
          layout="sizes,total,prev, pager, next,jumper"
          :total="total">
        </el-pagination>
      </el-row>
    </el-form>
    <!-- 清除缓存弹框 -->
    <el-dialog :title="dialogTitle" :visible.sync="showDialog" width="600px" @close="handleDialogClose">
        <el-form :model="redisData" :rules="rules" ref="redisForm" label-width="120px">
          <el-form-item label="清除缓存密码:" prop="password">
            <kd-input v-model="redisData.password"></kd-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import {deleteBatchRedisCache,dicItemPageList} from '../../api/system'

export default {
  name: "SystemParameterPage",
  data() {
    return {
      search:{
        dicCode:'',
        itemValue:'',
        itemName:'',
        pageSize:10,
        pageNum:1
      },
      redisData:{
       password:''
      },
      dialogTitle:'清除缓存',
      list: [],
      showDialog:false,
      total:0,
      page:{
        pageSize:10,
        pageNum:1
      },
      table: [
        {
          label: "数据字典子项ID",
          prop: "dicItemId",
        },
        {
          label: "字典ID",
          prop: "dicId"
        },
        {
          label: "字典编码",
          prop: "dicCode"
        },
        {
          label: "字典类型名称",
          prop: "dicName"
        },
        {
          label: "子项名称",
          prop: "itemName",
        },
        {
          label: "子项值",
          prop: "itemValue"
        },
        {
          label: "子项排序",
          prop: "itemSort"
        },
        {
          label: "使用范围",
          prop: "useScope"
        },
        {
          label: "备用字段1",
          prop: "attr1",
          formatter: (row, col, val) => this.$tableDefFormat(row, col, val)
        },
        {
          label: "备用字段2",
          prop: "attr2",
          formatter: (row, col, val) => this.$tableDefFormat(row, col, val)
        },
      ],
      rules:{
        password: [
            {required: true, message: '请输入清除缓存密码', trigger: 'blur'},
        ],
      }
    };
  },
  created() {
    this.getDicItemPageList(this.page)
  },
  methods: {
    getDicItemPageList(search){
      dicItemPageList(search).then(response=>{
        const res = response.data
        if (res.code == 200) {
          this.list = res.body.content;
          this.total = res.body.total;
        }else{
          this.$message({
            showClose: true,
            type: 'error',
            message:res.message
          })
        }
      })
    },
    handleSearch(){
      this.getDicItemPageList(this.search)
    },
    handleCurrentChange(val){
      this.page.pageNum = val
      this.getDicItemPageList(this.page)
    },
    handleSizeChange(val){
      this.page.pageSize = val
      this.getDicItemPageList(this.page)
    },
    handleDeleteRedis(){
      this.showDialog = true
    },
    handleCancel(){
      this.showDialog = false
      this.$refs.redisForm.resetFields()
    },
    handleDialogClose(){
      this.$refs.redisForm.resetFields()
    },
    handleSubmit(){
      this.$refs.redisForm.validate((valid) => {
        if (valid) {
          deleteBatchRedisCache({password:this.redisData.password}).then(response=>{
            const res = response.data
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: "清除缓存成功"
              })
              this.showDialog = false
              this.redisData.password = ''
              this.getDicItemPageList(this.page)
            }else{
              this.$message({
                type: 'error',
                message: res.message
              });
            }
          })
        }else{
          return false
        }
      })
    }



  }
}
</script>


