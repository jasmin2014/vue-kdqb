<!--风控管理-风控审核记录-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.risk-detail-box {
  box-shadow: 0 0 5px #ccc;
}
.data-blank {
  height: 120px;
  text-align: center;
  line-height: 120px;
  color: #666;
}
</style>
<template>
  <div class="box">
   <!--=======风控管理-风控审核记录详情页 start===========-->   
 
    
    <el-tabs v-model="activeName" type="card" @tab-click="handleChangeFirsTab">
      <el-tab-pane label="申请表信息" name="first">
        <el-tabs v-model="secondActiveName" type="border-card">
          <el-tab-pane v-for="(item,index) in classifyDatas" :label="item.label" :name="item.name" :key="index">
            <div v-if="item.applicationForms.length>0">
              <kd-base-units v-for="(props,key) in item.applicationForms" :key="key" :value="props" :title="props.title" :mode="'VIEW'"> </kd-base-units>                     
            </div>            
            <div v-else class="data-blank">暂无相关数据</div>
          </el-tab-pane>          
        </el-tabs>  
      </el-tab-pane>
      <el-tab-pane label="决策报告" name="second">
        <el-button type="primary" @click="getProccessAuditReports">决策报告</el-button>
      </el-tab-pane>     
    </el-tabs> 
   <!--=======风控管理-风控审核记录详情页 end===========-->
  </div>
</template>

<script>
import * as api from "../../api/risk.js";
import { getSysEnum } from "../../api/common.js";
export default {
  name: "RiskAmountPollingDetailPage",
  components: {},
  data() {
    return {
      applicationId: this.$route.params.id,
      activeName: "first",
      secondActiveName: "",
      dialogAddressList: false,
      pageSize: 10,
      historyActiveName: "loan",
      classifyDatas: [],
      _application: []
    };
  },
  watch: {
    secondActiveName: function(val, oldVal) {
      this.secondActiveName = val;
    }
  },
  created() {
    this.getFirstClassifyEnumsList(() => {
      this.secondActiveName =
        this.classifyDatas.length > 0 ? this.classifyDatas[0].name : "";
    });
  },
  methods: {
    //风控决策报告接口
    getProccessAuditReports() {
      api.getProccessAuditReports(this.applicationId).then(response => {
        if (response.data.code == 200) {
          var dlform = document.createElement("form");
          dlform.style = "display:none;";
          dlform.method = "get";
          dlform.action = response.data.body;
          dlform.target = "callBackTarget";
          var hdnFilePath = document.createElement("input");
          hdnFilePath.type = "hidden";
          hdnFilePath.name = "filePath";
          hdnFilePath.value = "";
          dlform.appendChild(hdnFilePath);
          document.body.appendChild(dlform);
          dlform.submit();
          document.body.removeChild(dlform);
        }
      });
    },
    //根据对象中的属性名称排序
    compareByProp(prop) {
      return function(obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      };
    },
    //点击切换申请表那个地方的tab切换时默认将申请表下面的一级分类下面的内容展示
    handleChangeFirsTab() {
      if (this.activeName === "first") {
        if (this.classifyDatas && this.classifyDatas.length > 0) {
          this.secondActiveName = this.classifyDatas[0].name;
        }
      }
    },
    //获取申请表以及分类的枚举名称(待调问题1:排序)
    getFirstClassifyEnumsList(callback) {
      let _this = this;
      getSysEnum(_this.$enum.APPLICATION_FORM_TYPE).then(response => {
        let res = response.data;
        if (res.code == 200 && res.body && res.body.length > 0) {
          _this.classifyDatas = [];
          res.body.forEach((item, index) => {
            let _item = {};
            _item.itemSort = item.itemSort;
            _item.label = item.itemName;
            _item.name = item.itemValue;
            let allParams = [];
            _this.getApplicationForms(_item, function() {
              allParams = _this._application.map(_ => ({
                title: _.menuName,
                baseUnits: _.baseUnits,
                baseDatas: _.baseDatas
              }));

              _item.applicationForms = allParams;
              _this.classifyDatas.push(_item);
              _this.classifyDatas.sort(_this.compareByProp("itemSort"));
              callback && callback();
            });
          });
          console.log("_this.classifyDatas:", _this.classifyDatas);
        }
      });
    },
    //根据申请表的一级分类的枚举值获取对应下面的内容
    getApplicationForms(item, callback) {
      let _this = this;
      api
        .getApplicationFormsInPolling(_this.applicationId, item.name)
        .then(response => {
          let res = response.data;
          if (res.code == 200 && res.body) {
            if (res.body.length > 0) {
              res.body.forEach(item => {
                if (item.list.length > 0) {
                  item.list.forEach((childItem, childIndex) => {
                    childItem.fieldEngName =
                      childItem.fieldType +
                      childItem.displayOrder +
                      "_" +
                      childIndex;
                  });
                  item.baseUnits = item.list.map((_, _i) => ({
                    itemSort: _.displayOrder,
                    name: _.fieldEngName,
                    label: _.fieldName,
                    type: _.fieldType === "fileUpload" ? "upload" : "input",
                    value: _.fieldValue ? _.fieldValue : ""
                  }));
                  let _obj = {};
                  item.baseUnits.forEach(_val => {
                    _obj[_val.name] = _val.value;
                  });
                  item.baseDatas = _obj;
                }
              });
            }
            _this._application = res.body;

            callback && callback();
          }
        });
    }
  }
};
</script>


