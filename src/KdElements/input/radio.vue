<template>
  <el-radio-group v-model="currentValue"
                  :disabled="disabled"
                  @change="handleChange">
    <el-radio v-for="option in currentOptions"
              :label="option.value"
              :key="option.value"
              :border="border">{{ option.text }}</el-radio>
  </el-radio-group>
</template>

<script>
import { getSysEnum } from "../../api/common";

export default {
  name: "KdRadio",
  props: {
    value: [String, Number, Boolean],
    mode: String,
    options: Array,
    group: String,
    border: Boolean,
    disabled: Boolean
  },
  data() {
    return {
      currentValue: this.value || [],
      currentOptions: this.options || []
    };
  },
  watch: {
    value(val, oldVal) {
      this.setCurrentValue(val);
    },
    options(val, oldValue) {
      this.currentOptions = val;
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
      if (value === this.currentValue) return;
      this.currentValue = value;
    },
    handleInput(value) {
      this.$emit("input", value);
      this.setCurrentValue(value);
    },
    handleChange(value) {
      this.$emit("change", value);
    },
    getOptions(group) {
      const enums = this.$store.state.enums;
      if (enums && enums[`${group}`]) {
        this.currentOptions = enums[`${group}`];
        return;
      }
      getSysEnum(group).then(
        response => {
          const res = response.data;
          if (res.code == 200 && res.body) {
            if (this.noOwner) {
              this.currentOptions = res.body
                .map(_ => ({
                  text: _.itemName,
                  value: _.itemValue
                }))
                .filter(_ => _.value != "PP_MYSELF");
            } else {
              this.currentOptions = res.body.map(_ => ({
                text: _.itemName,
                value: _.itemValue
              }));
            }
          }
        },
        () => {}
      );
    }
  }
};
</script>
