<style >
.el-form-item .input-border_normal .el-input__inner{
  border: 1px solid #dcdfe6;
}
</style>

<template>
  <!-- == 来源选择start  ====================== -->
  <div style="position: relative" class="input-border_normal">
    <el-table :data="list" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="80" v-if="!isradio"></el-table-column> 
      <el-table-column label="选择" width="80" align="center" v-else>
          <template slot-scope="scope">
            <el-radio style="padding-left:10px;line-height: 23px" class="radio" v-model="radio"  :label="scope.$index"  @change.native="getCurrentRow(scope.$index)" >&nbsp;</el-radio>
          </template>
        </el-table-column>
      <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter" :width="col.width" :key="index" align="center"></el-table-column>
    </el-table>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination @size-change="handleSizeChangeSource" @current-change="handleCurrentChangeSource" :current-page="pageSource" :page-sizes="[10, 20, 50, 100]"
        :page-size="limitSource" layout="prev, pager, next,jumper,sizes,total" :total="total">
      </el-pagination>
    </el-row>
    <div class="dialog-footer mgt20" style="text-align: center;">
      <el-button type="primary" @click="handleSubmitSource">提交</el-button>
    </div>
  </div>
  <!-- == 来源选择end  ======================== -->
</template>

<script>
export default {
  props:{
    // 表格
    table: {
      type: Array,
      required: true
    },
    // 列表
    list: {
      type: Array,
      required: true
    },
    // 是否单选
    isradio: {
      default: false
    },
    // 列表总数
    total: {
      type: Number
    },
    // 每页数量
    limit: {
      type: Number,
      default: 10
    },
    // 当前页数
    page: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      // 来源选择 =====================
      limitSource: this.limit, // 每页数量
      pageSource: this.page, // 当前页数
      multipleSelection: [], // 列表的选择
      radio: undefined
    }
  },
  methods: {
    // =================来源选择================
    handleSizeChangeSource(val) {
      this.limitSource = val
      this.$emit('pagination', this.limitSource, this.pageSource)
    },
    handleCurrentChangeSource(val) {
      this.pageSource = val
      this.$emit('pagination', this.limitSource, this.pageSource)
    },
    handleSubmitSource() {
      if(this.multipleSelection.length == 0) {
        this.$message.error('请先选择')
        return
      }
      this.$emit('submit', this.multipleSelection)
    }, 
    // 单选取值 -- return Object: {}
    getCurrentRow(index) {
      this.multipleSelection = this.list[index]
    },
    // 多选取值 -- return Array: []
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
  }
}
</script>
