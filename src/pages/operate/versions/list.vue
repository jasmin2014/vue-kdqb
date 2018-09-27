<!--运营管理 版本管理-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<template>
  <div class="box">
    <!--=========运营管理-版本管理页 start===========-->    
    <el-row>
      <el-table :data="list" border>
        <!-- <el-table-column type="index" width="50" align="center" label="序号"></el-table-column> -->
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :width="col.width"
                         :key="index" align="center"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="150">
          <template slot-scope="scope">                     
            <el-tooltip content="修改">
              <el-button size="small" icon="el-icon-edit"></el-button>
            </el-tooltip>             
            <el-tooltip content="删除">
              <el-button size="small">删除</el-button>
            </el-tooltip>           
          </template>
        </el-table-column>
      </el-table>
    </el-row> 
    <!--=========运营管理-版本管理页 end===========-->
  </div>
</template>

<script>
export default {
  name: "OperateVersionsListPage",
  data() {
    return {
      list: [
        {
          id: "DCEM123467989"
        }
      ],
      table: [
        {
          label: "版本号",
          prop: "id"
        },
        {
          label: "更新类型",
          prop: "bb"
        },
        {
          label: "业务平台",
          prop: "cc"
        },
        {
          label: "Build No",
          prop: "dsg"
        },
        {
          label: "更新时间",
          prop: "dd"
        },
        {
          label: "版本日志",
          prop: "cc"
        },
        {
          label: "设备类型",
          prop: "dsg"
        }
      ]
    };
  },
  methods: {}
};
</script>


