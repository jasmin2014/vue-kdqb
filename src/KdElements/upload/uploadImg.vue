<template>
    <div>
      <el-button :id="id" icon="el-icon-plus" :disabled="isUpDisabled||isDisabled"></el-button>
    </div>
</template>

<script>
require("plupload/js/plupload.dev.js");
require("qiniu-js/dist/qiniu.min.js");
import * as api from "../../api/common";
export default {
  name:"UploadImg",
  props: [
    "id",
    "imgUrl",
    "isDisabled",
    "isUpDisabled"
  ],
  data() {
    return {
      qiniutoken: ""
    };
  },
  methods: {
    //获取Token
    getToken() {
        api.getQiniuToken().then(res => {
            if (res.data.code === 200) {
                this.qiniutoken = res.data.body;
                this.init();
                this.$store.commit('saveQiniuToken', res.data.body);
            }
            }, () => {})
    },
    init() {
      if (this.isUpDisabled) {
        //判断活动页管理是否可更改
        this.$message.warning("活动当前进行中，只能编辑活动时间和活动是否开启！");
        return;
      } else if (this.isDisabled) {
        //判断活动编辑是否可更改
        this.$message.warning("活动当前进行中，仅活动结束时间可编辑");
        return;
      } else {
        let that = this;
        let uploader = Qiniu.uploader({
          runtimes: "html5,flash,html4", // 上传模式，依次退化
          browse_button: that.id, // 上传选择的点选按钮，必需
          uptoken: that.qiniutoken, // uptoken是上传凭证，由其他程序生成
          domain: "http://7xjivo.com2.z0.glb.qiniucdn.com/", // bucket域名，下载资源时用到，必需
          max_file_size: "100mb", // 最大文件体积限制
          flash_swf_url: "plupload/js/Moxie.swf", //引入flash，相对路径
          chunk_size: "4mb", // 分块上传时，每块的体积
          auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
          save_key: true, // 默认 false。若在服务端生成 uptoken 的上传策略中指定了 `save_key`，则开启，SDK在前端将不对key进行任何处理
          dragdrop: true, // 开启可拖曳上传
          filters: {
            //文件类型过滤，这里限制为图片类型
            mime_types: [{
              title: "Image files",
              extensions: "jpg,jpeg,gif,png"
            }]
          },
          init: {
            FilesAdded: function(up, files) {
              plupload.each(files, function(file) {
                // 文件添加进队列后,处理相关的事情
              });
            },
            BeforeUpload: function(up, file) {
              // 每个文件上传前，处理相关的事情
            },
            UploadProgress: function(up, file) {
              // 每个文件上传时，处理相关的事情
            },
            FileUploaded: function(up, file, info) {
              let res = JSON.parse(info);
              let addr = "https://jfimg.tairanmall.com/";
              that.$emit("getImgUrl", addr+ res.key);
            },
            Error: function(up, err, errTip) {
              if (err.status == 400) {
                that.$message.error("请求报文格式错误，报文构造不正确或者没有完整发送，请排除错误后刷新重试。");
              } else if (err.status == 401) {
                that.$message.error("上传凭证无效，请排除错误后刷新重试。" );
              } else if (err.status == 413) {
                that.$message.error("上传内容长度大于 fsizeLimit 中指定的长度限制，请排除错误后刷新重试。");
              } else if (err.status == 579) {
                that.$message.error("回调业务服务器失败，请排除错误后刷新重试。");
              } else if (err.status == 599) {
                that.$message.error("七牛服务端操作失败，请排除错误后刷新重试。");
              } else if (err.status == 614) {
                that.$message.error("目标资源已存在，请排除错误后刷新重试。");
              } else {
                that.$message.error(JSON.parse(err.response).error);
              }
            },
            UploadComplete: function() {
              //队列文件处理完毕后，处理相关的事情
            },
            Key: function(up, file) {
              // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
              // 该配置必须要在unique_names: false，save_key: false时才生效
              var key = "";
              // do something with key here
              return key;
            }
          }
        });
      }
    }
  },
  created() {
    this.getToken();
    // this.init();
  },
  computed: {
    
  }
};
</script>

<style>
</style>