<template>
  <el-select v-if="!readonly || disabled" v-model="currentValue" :disabled="disabled" :placeholder="placeholder" :clearable="clearable"
    @input="handleInput" @change="handleChange" @clear="handleClear" @visible-change="handleVisibleChange" @remove-tag="handleRemoveTag">
    <el-option v-for="option in currentOptions" :label="option.text" :value="option.value" :key="option.value"></el-option>
  </el-select>
  <el-input v-else-if="!text" v-model="displayValue" :class="readonly ? 'is-readonly' : ''" :readonly="readonly" @click="handleSeeHistoryRecords"></el-input>
  <span v-else>
    {{ displayValue }}
  </span>
</template>

<script>
import { getSysEnum, getRegionEnum, getChannelList } from "../../api/common.js";

const BOOLEAN_OPTIONS = [
  {
    text: "是",
    value: true
  },
  {
    text: "否",
    value: false
  }
];

export default {
  name: "KdSelect",
  props: {
    value: [String, Number, Boolean],
    text: Boolean,
    type: {
      type: String, // enum, region, org, boolean
      default: "enum"
    },
    group: String,
    visible: Number,
    region: String,
    org: String,
    orgStatus: Number,
    options: Array,
    mode: String,
    disabled: Boolean,
    placeholder: String,
    clearable: Boolean,
    noGroup: Boolean,
    noOwner: Boolean,
    channel: String
  },
  data() {
    return {
      currentValue: this.value,
      currentOptions: this.options || []
    };
  },
  computed: {
    readonly() {
      return this.mode === "VIEW";
    },
    displayValue() {
      const result = this.currentOptions.filter(
        _ => _.value === this.currentValue
      );
      return result.length > 0 ? result[0].text : this.currentValue;
    }
  },
  watch: {
    value(val, oldValue) {
      this.setCurrentValue(val);
    },
    options(val, oldValue) {
      this.currentOptions = val;
    },
    region(val, oldValue) {
      if (val) {
        this.getRegions(val);
      } else {
        this.currentOptions = [];
      }
      if (oldValue) {
        this.$emit("input", "");
      }
    },
    group(val, oldValue) {
      if (val) {
        this.getOptions(val);
      } else {
        this.currentOptions = [];
      }
      if (oldValue) {
        this.$emit("input", "");
      }
    },
    channel(val, oldValue) {
      if (val) {
        let _val = val === "true" ? true : false;
        this.getChannelList();
      }
    }
    // org(val, oldValue) {
    //   if (val) {
    //     this.getOrgList(val, this.orgStatus)
    //   } else {
    //     this.currentOptions = [];
    //   }
    //   if (oldValue) {
    //     this.$emit('input', '')
    //   }
    // }
  },
  created() {
    if (!this.options) {
      if (this.group || this.noGroup) {
        this.getOptions(this.group);
      } else if (this.region) {
        this.getRegions(this.region);
      } else if (this.type === "boolean") {
        this.currentOptions = BOOLEAN_OPTIONS;
      } else if (this.channel) {
        this.getChannelList();
      }
    }
  },
  methods: {
    setCurrentValue(value) {
      if (value !== this.currentValue) {
        this.currentValue = value;
        // this.handleChange(value);
      }
      this.$emit("input", value);
    },
    handleSeeHistoryRecords(value) {
      this.$emit("see-records", value);
    },
    handleInput(value) {
      this.setCurrentValue(value);
    },
    handleChange(value) {
      const kv = this.currentOptions.find(_ => _.value === value);
      this.$emit("kv-change", kv);
      if (this.region) {
        const addressName = this.currentOptions.find(_ => _.value === value)
          .text;
        value = addressName;
        this.$emit("change", value);
        return;
      }
      this.$emit("change", value);
    },
    handleClear(value) {
      this.$emit("clear", value);
    },
    handleVisibleChange(value) {
      this.$emit("visible-change", value);
    },
    handleRemoveTag(value) {
      this.$emit("remove-tag", value);
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
    },

    //城市获取
    getRegions(region) {
      const regions = this.$store.state.regions;
      console.log("regions:", regions);
      if (regions[region]) {
        this.currentOptions = regions[region];
        return;
      }

      getRegionEnum().then(
        response => {
          let res = response.data;

          if (res.code == 200) {
            let regions = {};

            let province = [];
            res = res.body || [];
            res = res.data || [];
            res.forEach(item => {
              console.log(item);
              province.push({ text: item.name, value: item.code });
              let city = [];
              item.children &&
                item.children.forEach(cityItem => {
                  city.push({ text: cityItem.name, value: cityItem.code });
                  let district = [];
                  cityItem.children &&
                    cityItem.children.forEach(districtItem => {
                      district.push({
                        text: districtItem.name,
                        value: districtItem.code
                      });
                    });
                  regions[cityItem.name] = district;
                });
              regions[item.name] = city;
            });

            regions["省"] = province;

            this.$store.commit("saveRegions", regions);
            this.currentOptions = regions[region];
          } else {
            this.$message({
              showClose: true,
              message: result.message,
              type: "error"
            });
          }
        },
        err => {}
      );
    },
    getChannelList() {
      if (this.channel == "true") {
        const allEnableChannels = this.$store.state.allEnableChannels;
        if (allEnableChannels.length) {
          this.currentOptions = allEnableChannels;
          return;
        }
      } else {
        const allChannels = this.$store.state.allChannels;
        if (allChannels.length) {
          this.currentOptions = allChannels;
          return;
        }
      }
      getChannelList(this.channel).then(response => {
        let res = response.data;
        let channelOption = [];
        if (res.code == 200) {
          res.body.forEach(ele => {
            channelOption.push({
              text: ele.channelName,
              value: ele.channelCode
            });
          });
          this.$store.commit("getAllEnableChannel", channelOption);
          this.currentOptions = channelOption;
        }
      });
    }
    //      getOrgList(orgType, statusEnable) {
    //        getOrgList(orgType, statusEnable).then(response => {
    //          const res = response.data;
    //          if (res.code === 200) {
    //            this.currentOptions = res.body.map(_ => ({text: _.name, value: _.partyId}))
    //          }
    //        }, () => {})
    //      }
  }
};
</script>
