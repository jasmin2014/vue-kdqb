<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Utils from "./lib/method";
import { getAllSysEnum, getRegionEnum, getChannelList } from "./api/common";
export default {
  name: "App",
  created() {
    if (
      Utils.$getLocalStorage("token") &&
      Utils.$getLocalStorage("token") != ""
    ) {
      this.getSysEnums();
      this.getRegionEnum();
      this.getChannelList(false);
    }
  },
  methods: {
    getSysEnums() {
      getAllSysEnum().then(
        response => {
          const res = response.data;
          if (res.code == 200) {
            const enums = res.body.reduce((accumulator, item) => {
              const key = `${item.dicCode}`.trim();
              accumulator[key] = accumulator[key] || [];
              accumulator[key].push({
                text: item.itemName,
                value: item.itemValue
              });
              return accumulator;
            }, {});
            // console.log(JSON.stringify(enums));
            this.$store.commit("saveSysEnums", enums);
          }
        },
        () => {}
      );
    },
    getRegionEnum() {
      getRegionEnum().then(
        response => {
          let res = response.data;

          if (res.code == 200) {
            let regions = {};

            let province = [];
            let result = res.body.data || [];

            result.forEach(item => {
              province.push({ text: item.name, value: item.code });
              let city = [];
              let _provinces = item.children || [];
              _provinces.forEach(cityItem => {
                city.push({ text: cityItem.name, value: cityItem.code });
                let district = [];
                let _cities = cityItem.children || [];
                _cities.forEach(districtItem => {
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
    getChannelList(isEnable) {
      getChannelList(isEnable).then(response => {
        let channelOption = [],
          channels = {};
        const res = response.data;
        if (res.code == 200) {
          res.body.forEach(ele => {
            channelOption.push({
              text: ele.channelName,
              value: ele.channelCode
            });
            channels[ele.channelCode] = ele.channelName;
            this.$store.commit("saveSysChannels", channels);
          });
          this.$store.commit("getAllChannel", channelOption);
        }
      });
    }
  }
};
</script>

<style>
</style>
