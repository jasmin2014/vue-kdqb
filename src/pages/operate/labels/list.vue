<!--运营管理 用户标签管理-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<template>
  <div class="box">
    <!--=========运营管理-用户标签管理页 start===========-->    
    <el-row>
      <el-table :data="list" border>
        <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :width="col.width"
                         :key="index" align="center"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="300">
          <template slot-scope="scope">  
            <el-tooltip content="查看">
              <el-button size="small" icon="el-icon-view" @click="handleSeeDetail(scope.row)">
              </el-button>
            </el-tooltip>            
            <el-tooltip content="编辑">
              <el-button size="small" icon="el-icon-edit" @click="handleEditLabel(scope.row)"></el-button>
            </el-tooltip>  
            <el-tooltip content="上移">
              <el-button size="small">上移</el-button>
            </el-tooltip>   
            <el-tooltip content="下移">
              <el-button size="small">下移</el-button>
            </el-tooltip>           
          </template>
        </el-table-column>
      </el-table>
    </el-row> 
    <!--=========运营管理-用户标签管理页 end===========-->
  </div>
</template>

<script>
export default {
  name: "OperateUserLabelsPage",
  data() {
    return {
      list: [
        {
          id: "DCEM123467989",
          bb: 'lkk'
        },
        {
          id: "DCEM123467989",
          bb: 'lkk'
        }
      ],
      table: [
        {
          label: "用户标签",
          prop: "id"
        },
        {
          label: "标签类型",
          prop: "bb"
        },
        {
          label: "标签人数",
          prop: "cc"
        },
        {
          label: "标签有效期",
          prop: "dsg"
        },
        {
          label: "描述",
          prop: "dd"
        }
      ]
    };
  },
  methods: {
    handleSeeDetail(row) {
      this.$router.push({
        name: "OperateSeeLabelsPage",
        query: { id: row.id }
      });
    },
    handleEditLabel(row) {
      this.$router.push({
        name: "OperateEditLabelsPage",
        query: { id: row.id }
      });
    }
  }
};
</script>


