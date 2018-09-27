<!--风控管理-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
<template>
  <!--=======风控管理-用户额度管理-编辑记录弹窗 start===========-->
 <el-dialog title="编辑记录" :visible.sync="showDialog" @closed="handleCloseDialog">
  <el-table :data="currentValue.recordsDates">
    <el-table-column v-for="(col,index) in currentValue.tableHeader" :prop="col.prop" :label="col.label" :width="col.width" :formatter="col.formatter" :key="index"></el-table-column>    
  </el-table>
  <el-row type="flex" justify="center" class="mgt20">
    <el-pagination
      @size-change="changeRecordsPage"
      @current-change="changeRecordsPage"
      :current-page="1"
      :page-size="currentValue.pageSize"
      layout="sizes, total, prev, pager, next, jumper"
      :total="currentValue.pageTotal">
    </el-pagination>
  </el-row>
</el-dialog>
  <!--=======风控管理-用户额度管理-编辑记录弹窗 end===========-->
</template>

<script>
export default {
  props: {
    value: Object,
    pageSize: Number,
    pageTotal: Number,
    tableHeader: Array,
    recordsVisible: Boolean
  },
  components: {},
  data() {
    return {
      currentValue: {
        recordsDates: [],
        tableHeader: [],
        pageSize: 10,
        pageTotal: 0
      },
      currentTableHeader: [],
      showDialog: false
    };
  },
  computed: {},
  watch: {
    value: function(val, oldVal) {
      this.currentData = val;
    },
    "value.recordsDates": function(val, oldVal) {
      this.setCurrentValue(val, "recordsDates");
    },
    "value.tableHeader": function(val, oldVal) {
      this.setCurrentValue(val, "tableHeader");
    },
    recordsVisible: function(val, oldVal) {
      this.showDialog = val;
    }
  },
  created() {
    this.currentValue = this.value;
    // this.currentTableHeader = this.tableHeader;
    this.showDialog = this.recordsVisible;
  },
  methods: {
    handleCloseDialog() {
      this.$emit("close");
    },
    changeRecordsPage(pageNumber) {
      this.$emit("size-change", pageNumber);
    },
    setCurrentValue(val, key) {
      if (this.currentValue.hasOwnProperty(key)) {
        if (typeof val === "object" && val instanceof Array) {
          this.currentValue[key] = val;
        } else if (typeof val === "object") {
          for (const k in val) {
            if (this.currentValue[key].hasOwnProperty(k)) {
              this.currentValue[key][k] = val[k];
            }
          }
        } else {
          this.currentValue[key] = val;
        }
      }
    }
  }
};
</script>


