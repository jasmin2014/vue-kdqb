<template>
  <el-checkbox-group v-model="currentValue"
                     :disabled="mode === 'VIEW'"
                     @input="handleInput"
                     @change="handleChange">
    <el-checkbox v-for="option in currentOptions"
                 :label="option.value"
                 :key="option.value"
                 :border="border">{{ option.text }}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
import { getSysEnum } from "../../api/common";

export default {
  name: "KdCheckbox",
  props: {
    value: Array,
    mode: String,
    options: Array,
    group: String,
    border: Boolean
  },
  data() {
    return {
      currentValue: this.$deepcopy(this.value) || [],
      currentOptions: this.options || []
    };
  },
  watch: {
    value(val, oldVal) {
      this.setCurrentValue(val);
    },
    options(val, oldValue) {
      this.currentOptions = val;
    },
    group(val, oldValue) {
      if (val) {
        this.getOptions(val);
      } else {
        this.currentOptions = [];
      }
    },
    currentOptions(val, oldVal) {
      this.setCurrentValue(
        this.currentValue.filter(_ => val.some(option => option.value === _))
      );
    }
  },
  created() {
    if (!this.options) {
      if (this.group) {
        this.getOptions(this.group);
      }
    }
  },
  methods: {
    setCurrentValue(value) {
      if (JSON.stringify(value) !== JSON.stringify(this.currentValue)) {
        this.currentValue = value;
      }
      this.$emit("input", value);
    },
    handleInput(value) {
      this.setCurrentValue(value);
    },
    handleChange(value) {
      console.log("checkBox_handleChange:", value);
      this.$emit("input", value);
      this.$emit("change", value);
    },
    getOptions(group) {
      const enums = this.$store.state.enums;
      if (enums && enums[`${group}`]) {
        this.currentOptions = enums[`${group}`];
        return;
      }
      return getSysEnum(group).then(
        response => {
          const res = response.data;
          if (res.code == 200) {
            this.currentOptions = res.body.map(_ => ({
              text: _.itemName,
              value: _.itemValue
            }));
          }
        },
        () => {}
      );
    }
  }
};
</script>
