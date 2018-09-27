<!--风控管理-风控审核记录-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<template>
  <!--=======风控管理-风控审核记录详情页 start===========-->    
  <el-form class="form-label flex fixed-width">
    <kd-base-units :value="currentValue" :title="currentValue.menuName" :mode="mode" :col-width="colWidth"> </kd-base-units>    
    <el-row>
      <el-button type="success" @click="handleAutoFill">自动填充</el-button>
      <!-- <el-button type="primary">提交保存</el-button> -->
    </el-row>
    
  </el-form> 
  <!--=======风控管理-风控审核记录详情页 end===========-->
</template>

<script>
export default {
  components: {},
  prop: {
    values: Object,
    mode: {
      default: "VIEW",
      type: String
    },
    colWidth: {
      default: 6,
      type: Number
    }
  },
  data() {
    return {
      mode: this.mode,
      colWidth: this.colWidth,
      currentValue: {
        menuName: "",
        baseUnits: [],
        baseDatas: []
      }
    };
  },
  watch: {
    values: function(val, oldVal) {
      values.forEach(item => {
        this.currentValue = item;
      });
    },
    "value.baseUnits"(val, oldVal) {
      this.setCurrentValue(val, "baseUnits");
    },
    "value.baseDatas"(val, oldVal) {
      this.setCurrentValue(val, "baseDatas");
    }
  },
  created() {
    // this.currentValue.menuName = this.value.menuName;
    // this.currentValue.baseUnits = this.value.baseUnits;
    // this.currentValue.baseDatas = this.value.baseDatas;
  },
  methods: {
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
    },
    handleAutoFill(val) {
      this.$emit("auto-fill", val);
    }
  }
};
</script>


