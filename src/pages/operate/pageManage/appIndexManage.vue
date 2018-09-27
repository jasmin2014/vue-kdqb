<!--运营管理 app首页配置管理-->
<style lang="scss" scoped>
    .preview-wrap{
        // position: 
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.6);
        position: absolute;
        top: 0;
        left: 0;
        min-height: 1000px;
        z-index: 1000;
        .close{
            color: #fff;  
            position: absolute;
            right:20px;
            top:20px;
            font-size: 42px;  
            cursor: pointer;
        }
        .content{
            width: 430px;
            height: 910px;
            background: url(images/phone.png) no-repeat;
            background-size: 100% 100%;
            padding-top: 120px;
            position: absolute;
            left: 50%;
            top:.4rem;
            margin-left: -215px;
            z-index: 100000；
        }
    }
</style>
<template>
  <div class="box">
     <el-row type="flex" justify="left" style="margin-bottom:20px;">
         <el-button type="primary" @click="handleSave">保存</el-button>
         <el-button type="success" @click="handlePreview">预览</el-button>
         <el-button type="warning" @click="handlePub">发布</el-button>
    </el-row>
    <el-row>
        <el-col :span="3">
            <TemplateClass />
        </el-col>
        <el-col :span="8">
            <TemplateContent/>
        </el-col>
        <el-col :span="11" style="margin-left:8%;max-width:520px;">
            <TemplateEditBox />
        </el-col>
    </el-row> 
    <div class="preview-wrap" v-if="previewVisible">
        <div class="close el-icon-close" @click="handleClose">
        </div>
        <div class="content">
            <TemplateContent :isPreview="true"/>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters,mapMutations } from 'vuex'
import { getPageContent,switchPage } from "@/api/operate.js"
import TemplateClass from './components/templateClass.vue'
import TemplateContent from './components/templateContent.vue'
import TemplateEditBox from './components/templateEditBox.vue'
export default {
  name: "AppIndexManage",
  data() {
    return {
        pageContentData:[],
        previewVisible:false,
        col_width_1:2,
    }; 
  },
  components:{
      TemplateClass,
      TemplateContent,
      TemplateEditBox
  },
  methods: {
    getPageContent(){
        this.$store.dispatch('appIndexPageModuleAction',{pageId:this.$route.query.id})
    },
    handleSave(){
        this.$store.dispatch("updateIndexPageModuleAction",{pageId:this.$route.query.id,body:this.appIndexPageModuleGetter})
    },
    handlePreview(){
        this.previewVisible = true 
    },
    handleClose(){
        this.previewVisible = false
    },
    handlePub(){
        this.$confirm('发布会影响前端展示内容请确认发布内容，确认发布？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                    switchPage({pageId:this.$route.query.id,status:'release'}).then(res =>{
                        this.handleSave()
                    })
            })
    }
    
  },
  created(){
      this.getPageContent()
      console.log(window.screen.availWidth,111,document.body.clientWidth )
      if(document.body.clientWidth > 1440){
          this.col_width_1 = 3
      }
      if(document.body.clientWidth < 1440){
          this.col_width_1 = 1
      }
  },
  computed:{
    ...mapGetters([
        'appIndexPageModuleGetter',
    ])
},
};
</script>


