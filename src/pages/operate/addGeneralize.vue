<!--运营管理 流量推广管理-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>

<template>
<div class="box">
  <!--=========运营管理-添加推广页 start===========-->
  <el-form ref="ruleForm" :model="form" label-width="140px" :rules="rules" style="margin-top: 40px;width:45%">
    <el-form-item label="渠道名称" prop="channelName">
      <el-input v-model="form.channelName"  placeholder="渠道名称" clearable></el-input>
    </el-form-item>
    <el-form-item label="渠道编号" prop="channelNo" v-if="id">
      <el-input v-model="form.channelNo"  placeholder="渠道编号" clearable :disabled="!!id"></el-input>
    </el-form-item>
    <el-form-item label="推广链接" prop="link">
      <el-input v-model="form.link" placeholder="推广链接" clearable></el-input>
    </el-form-item>
    <el-form-item label="合作方式" prop="cooperType">
        <kd-select v-model="form.cooperType" :options="Options" placeholder="请选择" clearable></kd-select>
    </el-form-item>
    <!-- <el-form-item label="状态" required prop="enable">
      <el-radio v-model="form.enable" :label="true">启用</el-radio>
      <el-radio v-model="form.enable" :label="false">禁用</el-radio>
    </el-form-item> -->
    <el-form-item>
      <el-button type="primary" @click="handleSave()" :loading="submitLoading" :disabled="submitLoading">确定</el-button>
    </el-form-item>
  </el-form>
  <!--=========运营管理-添加推广页 end===========-->
</div>
</template>

<script>
import {addPromote, putPromote, getFlowInfo} from '@/api/operate'
export default {
  name: "OperateAddGeneralizePage",
  data() {
    return {
      submitLoading: false,
      form: {
        channelName: undefined, //  渠道来源名称
        channelNo: undefined, // 渠道编号
        channelId: undefined, // 渠道配置表Id
        enable: undefined, // 是否启用
        link: undefined, // 推广链接 
        cooperType: undefined // 合作方式 
      },
      id: undefined,
      rules: {
        channelName: [{
          required: true, message: '请输入渠道名称', trigger: 'blur'
        }],
        channelNo: [{
          required: true, message: '请输入渠道编号', trigger: 'blur'
        }],
        enable: [{
          required: true, message: '请选择状态', trigger: 'blur'
        }],
        link: [{
          required: true, message: '请输入推广链接', trigger: 'blur'
        }],
        cooperType: [{
          required: true, message: '请选择合作方式', trigger: 'blur'
        }]
      },
      Options: [{
        value: 'CPA',
        text: 'CPA：单价*注册数'
      },{
        value: 'CPS',
        text: 'CPS：点位*(放款额+消费额)'
      },{
        value: 'A+S',
        text: 'A+S：单价*注册数+点位*(放款额+消费额)'
      }]
    };
  },
  methods: {
    handleSave() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          let res
          if(this.id) {
            res = putPromote(this.form)
          } else {
            res = addPromote(this.form)
          }
          res.then(res => {
            if(res.data.code == 200) {
              this.$message.success(`${this.id ? '修改':'添加'}成功`)
              this.$router.push({
                name: "OperateFlowGeneManagePage"
              })
            }
          }).finally(_ => {
            this.submitLoading = false
          })
        } else {
          return false
        }
      })
    },
    getFlowInfo() {
      getFlowInfo(this.id).then(res => {
        if(res.data.code == '200') {
          this.form = res.data.body
        }
      })
    }
    
  },
  mounted() {
    this.id = this.$route.query.id
    if(!!this.id){
      this.$route.meta.title = '编辑推广'
      this.form.channelId = this.id
      this.getFlowInfo()
    }else{
      this.$route.meta.title = '添加推广'
    }
  }
};
</script>


