<template>
  <el-date-picker
      v-model="currentValue"
      :class="readonly ? 'is-readonly' : ''"
      :readonly="readonly"
      :disabled="disabled"
      type="datetimerange"
      range-separator="至"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :picker-options="pickerOptions"
      :default-time="['00:00:00', '23:59:59']"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @pick="handlePick"
      @dodestroy="handleDodestroy">
    </el-date-picker> 
</template>

<script>
export default {
  name: "KdDateTimePicker",
  props: {
    value: {},
    valueFormat: {
      default: "yyyy-MM-dd HH:mm:ss",
      type: String
    },
    mode: String,
    type: String,
    disabled: Boolean,
    shortcuts: Array,
    startPlaceholder: {
      default: "开始时间",
      type: String
    },
    endPlaceholder: {
      default: "结束日期",
      type: String
    }
  },
  data() {
    return {
      currentValue: this.value,
      pickerOptions: {
        disabledDate: time => {
          if (this.disableFuture) {
            return time.getTime() > Date.now();
          } else {
            return false;
          }
        },
        shortcuts: this.shortcuts
        // || [
        //   {
        //     text: "最近一周",
        //     onClick(picker) {
        //       const end = new Date();
        //       const start = new Date();
        //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        //       picker.$emit("pick", [start, end]);
        //     }
        //   },
        //   {
        //     text: "最近一个月",
        //     onClick(picker) {
        //       const end = new Date();
        //       const start = new Date();
        //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        //       picker.$emit("pick", [start, end]);
        //     }
        //   },
        //   {
        //     text: "最近三个月",
        //     onClick(picker) {
        //       const end = new Date();
        //       const start = new Date();
        //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        //       picker.$emit("pick", [start, end]);
        //     }
        //   }
        // ]
      }
    };
  },
  computed: {
    readonly() {
      return this.mode === "VIEW";
    }
  },
  watch: {
    value(val, oldValue) {
      this.setCurrentValue(val);
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
    handleFocus(event) {
      this.$emit("focus", event);
    },
    handleBlur(event) {
      this.$emit("blur", event);
    },
    handlePick(event) {
      this.$emit("pick", event);
    },
    handleDodestroy(event) {
      this.$emit("dodestroy", event);
    }
  }
};
</script>
