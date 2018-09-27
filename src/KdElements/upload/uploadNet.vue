<template>
  <div class="net-upload">
    <el-upload v-if="mode === 'VIEW' && currentValue && currentValue.length" ref="upload" class="upload-view" :action="''" :file-list="fileList"
      :show-file-list="true" :auto-upload="false" :list-type="listType" :on-preview="handlePreview" :disabled="true">
    </el-upload>
    <div v-else-if="mode === 'VIEW'" class="upload no-pic">
      <div class="text">无凭证</div>
    </div>
    <el-upload v-else ref="upload" :class="customClass" :action="action" :file-list="fileList" :limit="limit" :accept="accept"
      :data="postData" :show-file-list="true" :list-type="listType" :before-upload="handleBeforeUpload" :on-remove="handleRemove"
      :on-success="handleSuccess" :on-error="handleError" :on-change="handleChange" :on-preview="handlePreview">
      <template>
        <div class="text">
          <i class="icon iconfont icon-plus-pic"></i>
          <div class="el-upload__text">
            <i v-if="required" class="required"></i>选择上传</div>
          <div class="el-upload__placeholder">{{ placeholder }}</div>
        </div>
      </template>
    </el-upload>
  </div>

</template>

<script>
  import * as api from '../../api/common'

  export default {
    name: 'NetUpload',
    props: {
      uploadTitle: String,
      mode: String,
      value: Object,
      kind: String,
      text: String,
      flag: String,
      accept: {
        type: String,
        default: 'image/*'
      },
      listType: {
        type: String,
        default: 'picture-card'
      },
      action: {
        type: String,
        default: 'http://upload.qiniu.com/'
      },
      limit: {
        type: Number,
        default: Infinity
      },
      placeholder: String,
      noDelete: Boolean,
      required: Boolean
    },
    data() {
      return {
        currentValue: [],
        fileList: [],
        imgType: "",
        hideUploadButtonClass: 'upload-view',
        defaultClass: 'upload',
        postData: {
          token: ''
        },
        size: 0
      }
    },
    created() {
      if (this.flag == 'baiDuStatus') {
        this.imgType = "BAIDU";
        this.currentValue = this.value.baiDuImgList;
      } else if (this.flag == 'executeStatus') {
        this.imgType = "EXECUTE";
        this.currentValue = this.value.executeImgList;
      } else if (this.flag == 'frankOceanStatus') {
        this.imgType = "FRANK_OCEAN";
        this.currentValue = this.value.frankOceanImgList;
      }
      this.size = this.currentValue ? this.currentValue.length : 0;
    },
    computed: {
      customClass() {
        this.size = this.currentValue ? this.currentValue.length : 0;
        let ret = this.size >= this.limit ? this.hideUploadButtonClass : this.defaultClass;
        if (this.noDelete) {
          ret += ' no-delete'
        }
        return ret;
      }
    },
    watch: {
      value: {
        handler: function (val, oldVal) {
          this.setCurrentValue(val, oldVal)
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      setCurrentValue(val, oldVal) {
        if (JSON.stringify(val) === JSON.stringify(this.currentValue)) return;
        if (this.flag == 'baiDuStatus') {
          this.imgType = "BAIDU";
          this.currentValue = val.baiDuImgList;
        } else if (this.flag == 'executeStatus') {
          this.imgType = "EXECUTE";
          this.currentValue = val.executeImgList;
        } else if (this.flag == 'frankOceanStatus') {
          this.imgType = "FRANK_OCEAN";
          this.currentValue = val.frankOceanImgList;
        }
        if (this.currentValue && this.currentValue.length) {
          this.currentValue[0].url = this.currentValue[0].fileUri;
          if (this.$isUrl(this.currentValue[0].url)) {
            this.fileList = this.$deepcopy(this.currentValue);
          } else {
            const urls = this.currentValue.map(_ => _.key);
            this.getPicUrls(urls).then(({
              data
            }) => {
              this.fileList = data.body.map((_, i) => ({
                url: _,
                id: this.currentValue[i].id
              }));
            }, () => {})
          }
        } else {
          this.fileList = [];
          if (this.$refs.upload) {
            this.$refs.upload.uploadFiles = [];
          }
        }
        this.size = val.length;
      },
      handlePreview(file) {
        const fileList = this.$refs.upload.uploadFiles;
        const index = fileList.map(_ => _.uid).indexOf(file.uid);
        this.$preview(fileList, index);
      },
      handleRemove(file, fileList) {
        if (this.imgType == "BAIDU") {
          this.value.baiDuImgList = [];
        } else if (this.imgType == "EXECUTE") {
          this.value.executeImgList = [];
        } else if (this.imgType == "FRANK_OCEAN") {
          this.value.frankOceanImgList = [];
        }
        this.size = fileList.length;
        this.$emit('remove', file, fileList);
      },
      handleChange(file, fileList) {
        this.size = fileList.length;
      },
      handleSuccess(response, file, fileList) {
        let _keys = [];
        const fileName = file.raw.name.split('.');
        const suffix = fileName.length > 1 ? fileName[fileName.length - 1] : '';

        let values = {
          key: response.key,
          type: suffix.toLowerCase(),
          name: file.raw.name.slice(0, 20)
        };

        _keys.push(response.key);
        this.getPicUrls(_keys).then(({
          data
        }) => {
          values.fileUri = data.body[0];
          values.url = data.body[0];
        });
        values.kind = this.imgType;
        if (this.imgType == "BAIDU") {
          this.value.baiDuImgList = [];
          this.value.baiDuImgList.push(values);
        } else if (this.imgType == "EXECUTE") {
          this.value.executeImgList = [];
          this.value.executeImgList.push(values);
        } else if (this.imgType == "FRANK_OCEAN") {
          this.value.frankOceanImgList = [];
          this.value.frankOceanImgList.push(values);
        }
        console.log("values",values)
        this.$emit('success', values, this.value);
      },
      handleError(response, file, fileList) {
        const status = response.status;
        if (status === 400) {
          this.$message.error('无上传凭证，请重试');
          api.getQiniuToken().then(res => {
            if (res.data.code === 200) {
              this.$store.commit('saveQiniuToken', res.data.body);
            }
          }, () => {})
        } else if (status === 401) {
          this.$message.error('上传凭证过期，请重试');
          api.getQiniuToken().then((res) => {
            if (res.data.code === 200) {
              this.$store.commit('saveQiniuToken', res.data.body);
            }
          }, () => {})
        }
        this.$emit('error', response)
      },
      handleBeforeUpload(file) {
        const isIMG = /^image\/(png)|(jpeg)|(pdf)/i.test(file.type);
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isIMG) {
          this.$message.error('只能上传pdf、png和jpeg格式图片');
        }
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 5MB');
        }
        this.postData.token = this.$store.state.qiniu;
        if (isIMG && isLt5M) {
          this.$emit('start');
        }
        return isIMG && isLt5M
      },
      getPicUrls(urls) {
        return api.getPicUrls(urls)
      }
    }
  }

</script>

<style lang="scss">
  .net-upload {
    margin-top: 3px;
  }

  .net-upload label {
    line-height: 30px;
    font-size: 14px;
    padding-left: 10px;
  }

  .net-upload .upload {
    margin: 0 auto;
  }


  .net-upload .el-upload-list--picture-card .el-upload-list__item {
    width: 100% !important;
    height: 42px !important;
    margin: 0;
  }

  .net-upload .text {
    box-sizing: border-box;
    padding-top: 6px;
    color: #8c939d;
    width: 100%;
    height: 100%;
    line-height: 30px;
    text-align: center;
  }

  .net-upload .text i {
    font-size: 32px;
  }

  .net-upload .text .text-upload {
    display: block;
    margin-top: -10px;
  }

  .net-upload {
    margin-right: 0px;
    margin-bottom: 0px;
    & .no-pic {
      border: 1px dashed #c0ccda;
      width: 100% !important;
      height: 42px !important;
    }
    .el-upload-list--picture-card .el-upload-list__item {
      width: 100% !important;
      height: 42px !important;
    }

    .el-upload--picture-card {
      width: 100% !important;
      height: 42px !important;
      /*background: #eee;*/
      .text {
        i {
          font-size: 32px;
        }
      }

      .text-upload {
        display: block;
        margin-top: -10px;
      }
    }
  }
  .el-upload-list__item .el-icon-close-tip {
    display: none!important;
  }

</style>
