<!--用户等级-->
<template>
  <div>
    <el-row style="margin-bottom:30px">
      <el-col :span="22">
        <el-table :data="authModelList" border>
          <el-table-column label="名称" prop="authItemName"></el-table-column>
          <el-table-column label="认证有效期" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.authValidityPeriod}}&nbsp;天</span>
            </template>
          </el-table-column>
          <el-table-column label="排序" align="center">
            <template slot-scope="scope">
              <el-button @click="handleUp(scope.row,scope.$index)" type="text" size="small" icon="el-icon-sort-up" :disabled="(scope.$index == 0 ) || (scope.row.modelTypeCode == 'CUSTOMER_CREDIT') || (scope.$index == customerIndex)"></el-button>
              <el-button @click="handleDown(scope.row,scope.$index)" type="text" size="small" icon="el-icon-sort-down" :disabled="(scope.$index == lastIndex) || (scope.row.modelTypeCode == 'CUSTOMER_CREDIT')"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button  @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "addAuthModel",
  props: {
    authModelList:{
      type:Array,
      default:[]
    }
  },
  computed:{
    lastIndex(){
      return this.authModelList.length - 1
    },
    customerIndex(){
      const arr = []
      if(this.authModelList.length){
        this.authModelList.forEach(ele=>{
          if(ele.modelTypeCode == 'CUSTOMER_CREDIT'){
            arr.push(ele)
          }
        })
        return arr.length
      }
    }
  },
  methods: {
    handleSave() {
      this.$emit('save')
    },
    handleCancel(){
      this.$emit('show')
    },
    handleUp(row,$index){
      const authModelContent = this.$deepcopy(this.authModelList);
      const data = authModelContent[$index]
      authModelContent[$index] = authModelContent[$index-1]
      authModelContent[$index-1] = data
      this.$emit('updown',authModelContent)
    },
    handleDown(row,$index){
      const authModelContent = this.$deepcopy(this.authModelList);
      const data = authModelContent[$index]
      authModelContent[$index] = authModelContent[$index+1]
      authModelContent[$index+1] = data
      this.$emit('updown',authModelContent)
    },
  }
}

</script>
<style lang="scss" scoped>
</style>
