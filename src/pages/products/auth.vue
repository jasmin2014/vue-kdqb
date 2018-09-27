
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<!--产品管理-认证模型-->
<template>
  <div class="box">
    <!--=======产品管理-认证模型页===start========-->
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col>
          <el-form-item>
            <el-button type="primary" title="添加认证模型" @click="handleCreate">添加认证模型</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border class="table-center">
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label"
                         :formatter="col.formatter"
                         :width="col.width" :key="index" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip content="查看">
              <el-button size="small" icon="el-icon-view" @click="handleLook(scope.row)" type="primary"></el-button>
            </el-tooltip>
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
        :current-page="page.pageNum"
        :page-size="page.pageSize"
        layout="sizes,total,prev, pager, next,jumper"
        :total="total">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import { getModelByPage } from '../../api/products'
export default {
  name: "ProductsAuthPage",
  data() {
    return {
      updatedBys:[],
      list: [],
      table: [
        {
          label: "认证模型名称",
          prop: "modelName"
        },
        {
          label: "认证模型类型",
          prop: "modelTypeName"
        },
        {
          label: "渠道",
          prop: "channelName"
        },
        {
          label: "最近更新人",
          prop: "updatedBy",
          formatter: (row, col, val) => this.$filterUpdate(val,this.updatedBys)
        },
        {
          label: "最近更新时间",
          prop: "updatedTime"
        }
      ],
      total:0,
      page:{
        pageSize:10,
        pageNum:1
      },
    };
  },
  created() {
    this.getModelByPage()
  },
  methods: {
    getModelByPage(){
      getModelByPage(this.page).then(response=>{
        const res = response.data
        const updatedBys = []
        if (res.code == 200) {
          res.body.content.forEach(ele=>{
            updatedBys.push(ele.updatedBy)
          })
          if(updatedBys.length!=0){
            this.$getPartyRealName(updatedBys).then(data=>{
              this.updatedBys = data
              this.list = res.body.content
              this.total = res.body.total
            })
          }
        }else{
          this.$message({
            showClose: true,
            type: 'error',
            message:res.message
          })
        }
      })
    },
    handleCreate(){
      const { href } = this.$router.resolve({
        name: "ProductsAuthAddPage",
        query:{mode:'CREATE'}
      });
      window.open(href, "_blank");
    },
    handleEdit(row) {
      const { href } = this.$router.resolve({
        name: "ProductsAuthEditPage",
        params: {id:row.modelCode},
        query:{mode:'EDIT'}
      });
      window.open(href, "_blank");
    },
    handleLook(row){
      const { href } = this.$router.resolve({
        name: "ProductsAuthLookPage",
        params: {id:row.modelCode},
        query:{mode:'VIEW'}
      });
      window.open(href, "_blank");
    },
    handleCurrentChange(val){
      this.page.pageNum = val
      this.getModelByPage()
    },
    handleSizeChange(val){
      this.page.pageSize = val
      this.getModelByPage()
    }
  }
};
</script>

