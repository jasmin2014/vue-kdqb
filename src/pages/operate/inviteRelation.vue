<!--运营管理 邀请关系-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<template>
  <div class="box">
    <!--=========运营管理-邀请关系页 start===========-->
    
    <el-row>
      <el-table :data="list" border>
        <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :width="col.width"
                         :key="index" align="center"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template slot-scope="scope">            
            <el-tooltip content="查看">
              <el-button size="small" icon="el-icon-view"></el-button>
            </el-tooltip>           
          </template>
        </el-table-column>
      </el-table>
    </el-row> 
    <!--=========运营管理-邀请关系页 end===========-->
  </div>
</template>

<script>
export default {
  name: "OperateInviteRelationPage",
  data() {
    return {
      list: [
        {
          id: "DCEM123467989"
        }
      ],
      table: [
        {
          label: "邀请时间",
          prop: "id"
        },
        {
          label: "邀请人姓名",
          prop: "bb"
        },
        {
          label: "邀请人手机号",
          prop: "cc"
        },
        {
          label: "受邀人姓名",
          prop: "dsg"
        },
        {
          label: "受邀人手机号",
          prop: "dd"
        },
        {
          label: "授信申请笔数",
          prop: "ee"
        }
      ]
    };
  },
  methods: {}
};
</script>


