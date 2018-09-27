<template>
  <div class="base-datas">
    <h3 v-if="!isArray"><span class="base-data-title">{{title}}</span><span v-if="isNeedClose" class="base-data-toggle" @click="isOpen = !isOpen">{{isOpen ? '收起' : '展开'}}<i :class="[isOpen ? 'el-icon-caret-top' : 'el-icon-caret-bottom']"></i></span></h3>
    <el-form v-if="isOpen" :model="currentValue.baseDatas" class="form-label flex fixed-width" :class="{'base-main':!isArray}">
      <el-row class="row-bg" justify="space-between" :gutter="20">
        <el-col :span="colWidth" v-for="item in baseElseUnits" :key="item.name">
          <el-form-item :label="item.label">
            <span v-if="item.type === 'select'">
              <kd-select v-if="item.group" :mode="mode" v-model="currentValue.baseDatas[item.name]" :group="item.group"></kd-select>
              <kd-select v-else-if="item.isRegion" :mode="mode" v-model="currentValue.baseDatas[item.name]" :region="item.region"></kd-select>
              <kd-select v-else-if="item.options" :mode="mode" v-model="currentValue.baseDatas[item.name]" :options="item.options"></kd-select>
            </span>
            <kd-input v-else-if="item.type === 'input'" :mode="mode" v-model="currentValue.baseDatas[item.name]"></kd-input><!-- :unit="'see'" @see-records="handleSeeHistoryRecords"-->
            <kd-input v-else-if="item.type === 'textarea'" :type="item.type" :rows="item.rows" :mode="mode" v-model="currentValue.baseDatas[item.name]"></kd-input>
            <el-date-picker v-else-if="item.type === 'date'"
              v-model="currentValue.baseDatas[item.name]"
              type="date"
              placeholder="选择日期" @change="handleChange">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="base-uploads" :gutter="20">
        <el-col :span="colWidth" v-for="item in baseUploads" :key="item.name">
          <el-form-item :label="item.label">
            <kd-upload v-model="currentValue.baseDatas[item.name]" :mode="mode" :text="item.label" :limit="item.limit" @success="uploadSuccess(currentValue.baseDatas[item.name])"
                        @remove="handleRemove(currentValue.baseDatas[item.name])"></kd-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "KdBaseUnits",
  props: {
    mode: String, //组件的状态，编辑，删除，查看等
    title: String, //组件的名称
    value: Object, //组件表格里面需要传的值
    isArray: Boolean,
    isNeedClose: {
      default: true,
      type: Boolean
    },
    colWidth: {
      type: Number,
      default: 8
    }
  },
  data() {
    return {
      currentValue: {
        baseDatas: {},
        baseUnits: []
      },
      isOpen: true,
      baseElseUnits: [],
      baseUploads: []
    };
  },
  watch: {
    "value.baseDatas"(val, oldval) {
      this.setCurrentValue(this.$deepcopy(val), "baseDatas");
    },
    "value.baseUnits"(val, oldval) {
      this.setCurrentValue(this.$deepcopy(val), "baseUnits");
      this.setBaseUploads();
    }
  },
  created() {
    this.currentValue = this.value ? this.$deepcopy(this.value) : {};
    this.currentValue.baseDatas = this.value.baseDatas
      ? this.$deepcopy(this.value.baseDatas)
      : {};
    this.currentValue.baseUnits = this.value.baseUnits
      ? this.$deepcopy(this.value.baseUnits)
      : {};
    this.setBaseUploads();
  },
  methods: {
    handleSeeHistoryRecords(value) {
      this.$emit("see-records", value);
    },
    getCurrentValue() {
      return this.currentValue.baseDatas;
    },
    handleSetValue(val, name) {
      let value = {
        name: name,
        val: val
      };
      this.$emit("set", value);
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
    },
    setBaseUploads() {
      let _item = {};
      this.baseUploads = [];
      this.baseElseUnits = [];
      if (
        this.currentValue.baseUnits &&
        this.currentValue.baseUnits.length > 0
      ) {
        this.currentValue.baseUnits.forEach(item => {
          if (item.type === "upload") {
            this.baseUploads.push(item);
          } else {
            this.baseElseUnits.push(item);
          }
        });
      }
    },
    getBaseDatas() {},
    uploadSuccess(row) {},
    handleRemove(row) {},
    handleChange() {}
  }
};
</script>

<style  lang="scss">
.base-datas {
  h3 {
    span.base-data-title {
      color: #ff6600;
      border-left: 2px solid #ff6600;
      line-height: 2em;
      font-size: 14px;
      padding-left: 1em;
    }
    span.base-data-toggle {
      color: #409eff;
      font-size: 14px;
      line-height: 30px;
      margin-left: 10px;
    }
  }
  .upload-demo {
    display: flex;
    align-content: space-between;
  }
  .base-uploads {
    .el-upload--picture-card {
      width: 128px;
      height: 128px;
      line-height: 126px;
      .el-upload__text {
        position: absolute;
        left: 0;
        bottom: 10px;
        width: 130px;
        font-size: 12px;
        color: #999;
        line-height: 30px;
      }
    }
  }
}
</style>
