<!--运营管理 版本管理-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<template>
  <div class="box">
    <!--=========运营管理-版本管理-版本内容管理页 start===========-->    
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
            <el-tooltip content="禁用">
              <el-button size="small">禁用</el-button>
            </el-tooltip>           
          </template>
        </el-table-column>
      </el-table>
    </el-row> 
    <!--=========运营管理-版本管理-版本内容管理页 end===========-->
  </div>
</template>

<script>
export default {
  name: "OperateVersionContentPage",
  data() {
    return {
      list: [
        {
          id: "DCEM123467989"
        }
      ],
      table: [
        {
          label: "位置编号",
          prop: "id"
        },
        {
          label: "平台",
          prop: "bb"
        },
        {
          label: "控件位置",
          prop: "cc"
        },
        {
          label: "控件名称",
          prop: "dsg"
        },
        {
          label: "IOS版本范围",
          prop: "dd"
        },
        {
          label: "安卓版本范围",
          prop: "cc"
        },
        {
          label: "更新时间",
          prop: "dsg"
        },
        {
          label: "状态",
          prop: "dsg"
        }
      ]
    };
  },
  methods: {}
};
</script>


