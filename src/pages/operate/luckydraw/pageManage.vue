<template>
    <div class="box">
         <el-row>
            <el-col :span="14" style="margin-right:5%">
                <!-- {{form}} -->
                <el-form ref="form" :model="form" label-width="150px" :rules="rules">
                    <el-form-item label="title">
                        <el-input v-model="form.pageTitle"></el-input>
                    </el-form-item> 
                    <el-form-item label="banner" prop='bannerImg'>
                        <el-upload
                            class="avatar-uploader"
                            ref="upload1"
                            :http-request="Upload" 
                            action=""
                            :multiple="false"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :on-remove="handleRemove"
                            accept="image/jpeg,image/jpg,image/png"
                            :data="{type:'bannerImg'}"
                            width="300"
                            >
                            <img v-if="form.bannerImg" :src="form.bannerImg" class="avatar">
                            <!-- <p v-if="form.bannerImg.url">重新上传</p> -->
                            <el-button size="small" type="primary" v-if="!form.bannerImg">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="背景色" prop="pageBgColor">
                        <el-input v-model="form.pageBgColor" placeholder="输入内容如：000000/FFFFFF"></el-input>
                    </el-form-item>
                    <el-form-item label="活动id" prop="prizeList">
                        <el-button size="small" @click='luckDrawUsableActivity'>点击选择</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-card class="box-card" v-if="form.prizeList && form.prizeList != '' ">
                            <div class="text item">
                                {{'活动名称 ' + form.luckyDrawActivity.name }}
                            </div>
                            <div class="text item">
                                {{'活动时间 ' + form.luckyDrawActivity.beginTime + ' ~ ' +form.luckyDrawActivity.endTime }}
                            </div>
                            <div class="text item">
                                活动状态 {{form.luckyDrawActivity.status | luckyDrawActivityStatus}}
                            </div>
                            <el-table :data="form.prizeList" style="margin-top:10px;">
                            <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                                            :width="col.width"
                                            :key="index" align="center"></el-table-column>
                                <el-table-column label="操作" align="center" width="200">
                                <template slot-scope="scope">
                                    <el-upload
                                    style="float:left;margin-right:10px;"
                                        class="upload"
                                        :http-request="Upload" 
                                        action=""
                                        :multiple="false"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess"
                                        :before-upload="beforeAvatarUpload"
                                        :on-remove="handleRemove"
                                        accept="image/jpeg,image/jpg,image/png"
                                        :data="{'type':'prizeImg','data':scope}"
                                        >
                                        <img v-if="scope.row.prizeImg" :src="scope.row.prizeImg" class="avatar" width="30" height="30">
                                        <el-tooltip content="选择图片" v-else>
                                            <el-button size="small" icon="el-icon-plus">
                                            </el-button>
                                        </el-tooltip>
                                    </el-upload>
                                    <el-tooltip content="上移" style="float:left">
                                        <el-button size="small" icon="el-icon-caret-top" @click="handleMoveUp(scope.row)">
                                        </el-button>
                                    </el-tooltip>
                                    <el-tooltip content="下移" style="float:left">
                                        <el-button size="small" icon="el-icon-caret-bottom" @click="handleMoveDown(scope.row)">
                                        </el-button>
                                    </el-tooltip>
                                </template>
                                </el-table-column>
                            </el-table>
                        </el-card>
                    </el-form-item>
                    <el-form-item label="活动规则" prop="activityRuleText">
                        <el-input type="textarea" v-model="form.activityRuleText" rows="6" maxlength="300" placeholder="最多可以输入300个字节"></el-input>
                    </el-form-item>
                    <el-form-item label="抽奖背景">
                        <el-upload
                            class="avatar-uploader"
                            ref="upload1"
                            :http-request="Upload" 
                            action=""
                            :multiple="false"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :on-remove="handleRemove"
                            accept="image/jpeg,image/jpg,image/png"
                            :data="{type:'luckyDrawBgImg'}"
                            >
                            <img v-if="form.luckyDrawBgImg" :src="form.luckyDrawBgImg" class="avatar">
                            <el-button size="small" type="primary" v-else>点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="抽奖按钮" prop="luckyDrawButtonImg">
                        <el-upload
                            class="avatar-uploader"
                            ref="upload1"
                            :http-request="Upload" 
                            action=""
                            :multiple="false"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :on-remove="handleRemove"
                            accept="image/jpeg,image/jpg,image/png"
                            :data="{type:'luckyDrawButtonImg'}"
                            >
                            <img v-if="form.luckyDrawButtonImg" :src="form.luckyDrawButtonImg" class="avatar">
                            <el-button size="small" type="primary" v-else>点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="规则按钮背景">
                        <el-upload
                            class="avatar-uploader"
                            ref="upload1"
                            :http-request="Upload" 
                            action=""
                            :multiple="false"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :on-remove="handleRemove"
                            accept="image/jpeg,image/jpg,image/png"
                            :data="{type:'activityRuleBgImg'}"
                            >
                            <img v-if="form.activityRuleBgImg" :src="form.activityRuleBgImg" class="avatar">
                            <el-button size="small" type="primary" v-else>点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="中奖纪录按钮背景">
                        <el-upload
                            class="avatar-uploader"
                            ref="upload1"
                            :http-request="Upload" 
                            action=""
                            :multiple="false"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :on-remove="handleRemove"
                            accept="image/jpeg,image/jpg,image/png"
                            :data="{type:'prizeWinningRecordImg'}"
                            >
                            <img v-if="form.prizeWinningRecordImg" :src="form.prizeWinningRecordImg" class="avatar">
                            <el-button size="small" type="primary" v-else>点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="中奖名单背景">
                        <el-upload
                            class="avatar-uploader"
                            ref="upload1"
                            :http-request="Upload" 
                            action=""
                            :multiple="false"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :on-remove="handleRemove"
                            accept="image/jpeg,image/jpg,image/png"
                            :data="{type:'prizeWinningBgImg'}"
                            >
                            <img v-if="form.prizeWinningBgImg" :src="form.prizeWinningBgImg" class="avatar">
                            <el-button size="small" type="primary" v-else>点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                     <el-form-item label="分享图标">
                        <el-upload
                            class="avatar-uploader"
                            ref="upload1"
                            :http-request="Upload" 
                            action=""
                            :multiple="false"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :on-remove="handleRemove"
                            accept="image/jpeg,image/jpg,image/png"
                            :data="{type:'shareImg'}"
                            >
                            <img v-if="form.shareImg" :src="form.shareImg" class="avatar">
                            <el-button size="small" type="primary" v-else>点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="分享主标题">
                        <el-input v-model="form.shareMainTitle"></el-input>
                    </el-form-item> 
                    <el-form-item label="分享副标题">
                        <el-input v-model="form.shareSubTitle"></el-input>
                    </el-form-item> 
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')">立即{{this.$route.query.type == 'edit' ? '更新':'创建'}}</el-button>
                        <el-button  @click="handlePreviewPage">更新预览</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="6">
                <PreviewLuckyDraw />
            </el-col>
        </el-row>
        
    <el-dialog :title="sourceTitle" :visible.sync="showDialog" width="600px">
        <source-dialog  @submit="dialogSubmit" :isradio="isradio" :table='dialogTable' :list="dialogList" :total="dialogTotal" :limit="dialogLimit" :page="dialogPage" @pagination="handlePagination"></source-dialog>
    </el-dialog>
    </div>
</template>
<script>
  import {addLuckyDrawPageList,getActivityList,getLuckDrawUsableActivity,getLuckyDrawById,getLuckyDrawPageDetail,updateLuckyDrawPage,getPrizeListByActivityId} from '@/api/operate'
  import { ossUpload } from '@/api/front'
  import PreviewLuckyDraw from './preview.vue'
  import sourceDialog from '../components/sourceDialog.vue'
  import { mapGetters } from 'vuex'
  var qs = require('qs')
  export default {
    data() {
      return {
        form: {
            // bannerImg:{},
            // luckyDrawBgImg:{},
            // luckyDrawButtonImg:{},
            // activityRuleBgImg:{},
            // prizeWinningRecordImg:{},
            // prizeWinningBgImg:{},
            // shareImage:{}
            prizeList:[],
            luckyDrawActivity:{}
        },
        dialogImageUrl:"",
        showDialog:false,
        selectActivity:{},
        tableData:[],
        isradio:true,
        sourceTitle:'抽奖活动绑定',
        list:[
        ],
        table: [
            {
                label: '奖品',
                prop: 'prizeName',
            },
            {
                label: '概率',
                prop: 'probability',
            },
            {
                label: '剩余数量',
                prop: 'remainingAmount',
            }
        ],
        dialogTable: [
            {
                label: "抽奖名称",
                prop: "name"
            }
        ],
        dialogList:[],
        dialogTotal:0,
        dialogLimit:10,
        dialogPage:1,
        rules:{
            bannerImg:[
                { required: true, message: '不能为空', trigger: 'blur' }
            ],
            pageBgColor:[
                { required: true, message: '不能为空', trigger: 'blur' }
            ],
            prizeList:[
                { required: true, message: '不能为空', trigger: 'blur' }
            ],
            activityRuleText:[
                { required: true, message: '不能为空', trigger: 'blur' }
            ],
            luckyDrawButtonImg:[
                { required: true, message: '不能为空', trigger: 'blur' }
            ],
        }
      }
    },
    components:{PreviewLuckyDraw,sourceDialog},
    methods: {
        onSubmit(formName) {
            let postData = Object.assign({},this.form)
            
            let prizeList = []
            for(var i in this.form.prizeList){
                prizeList.push({
                    priority:i,
                    prizeId:this.form.prizeList[i].prizeId,
                    prizeImg:this.form.prizeList[i].prizeImg
                })
            } 
            postData.prizeList = prizeList

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    postData.prizeList.map(val => {
                        if(!val.prizeImg || val.prizeImg == ''){
                             this.$message.error('奖品图片必传')
                        }   
                        return false
                    })
                     if(this.$route.query.type == 'edit' && this.$route.query.id){
                        updateLuckyDrawPage(postData).then(res =>{
                            this.$notify({
                                title: '成功',
                                message: '更新成功',
                                type: 'success'
                            });
                            this.$store.dispatch('getLuckyDrawPageDetailAction',{"luckyDrawPageId":this.$route.query.id})
                        })
                    }else{
                        addLuckyDrawPageList(postData).then(res => {
                            this.$notify({
                                title: '成功',
                                message: '新增成功',
                                type: 'success'
                            });
                        })
                        this.$router.push(
                            {name:"LuckyDrawPageList"}
                        )
                    }
                } else {
                    return false;
                }
            });
           
        },
        getActivityList(){
            getActivityList({pageNum: this.dialogPage, pageSize: this.dialogLimit}).then(res => {
                this.dialogList = res.data.body.content
                this.dialogTotal = res.data.body.total
            })
        },
        Upload(file){
            //区分上传的哪张图片
            let imgData = file.data.data
            let imgType = file.data.type
            var fileObj = file.file;
            // FormData 对象
            var form = new FormData();
            // 请求参数
            form.append("file", fileObj);
            form.append("suffix", file.file.type.split('/')[1]);
            form.append("perpetual", true);
            ossUpload(form).then(res =>{
                if(imgType == 'prizeImg'){
                    for(var i = 0;i<this.form.prizeList.length;i++){
                        if(this.form.prizeList[i].prizeName === imgData.row.prizeName && i == imgData.$index){
                            this.$set(this.form.prizeList[i], 'prizeImg', res.data.body.url)
                            return
                        }
                    }
                }else{
                    this.$set(this.form, imgType , res.data.body.url)
                }
            })
        },
        handleAvatarSuccess(res,file){
        },
        getPageDetail(){
            getLuckyDrawPageDetail({"luckyDrawPageId":this.$route.query.id}).then(res => {
                this.form = res.data.body
            })
        },
        handleRemove(){

        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 或者PNG格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        luckDrawUsableActivity(){
            this.showDialog = true
            getLuckDrawUsableActivity().then(res => {
                 this.dialogList = res.data.body.content
                this.dialogTotal = res.data.body.total
            })
        },
        dialogSubmit(data){
            this.showDialog = false 
            this.form.activityId= data.activityId
            getPrizeListByActivityId({activityId: this.form.activityId}).then(res => {
                this.form.prizeList = res.data.body
                this.form.luckyDrawActivity = data
            })
        },
        handleMoveUp(data){
            for(let i =0;i<this.form.prizeList.length;i++){
                if(this.form.prizeList[i].prizeName === data.prizeName){
                    if(i ==  0){
                        return
                    }
                    this.form.prizeList.splice(i, 1);
                    this.form.prizeList.splice(i-1, 0, data);
                    return
                }
            }
        },
        handleMoveDown(data){
            for(let i =0;i<this.form.prizeList.length;i++){
                if(this.form.prizeList[i].prizeName === data.prizeName){
                    if(i == this.form.prizeList.length -1){
                        return
                    }
                    this.form.prizeList.splice(i, 1);
                    this.form.prizeList.splice(i+1, 0, data);
                    return
                }
            } 
        },
        handlePagination(limit, page) {
            this.dialogPage = page
            this.dialogLimit = limit
            this.getActivityList()
        },
        handlePreviewPage(){
            let postData = Object.assign({},this.form)
            let prizeList = []
            for(var i in this.form.prizeList){
                prizeList.push({
                    priority:i,
                    prizeId:this.form.prizeList[i].prizeId,
                    prizeImg:this.form.prizeList[i].prizeImg
                })
            } 
            postData.prizeList = prizeList
            this.$store.commit("updateLuckyDrawPageMutation",postData)
        }
    },
    created(){
        if(this.$route.query.type == 'edit' && this.$route.query.id){
           this.getPageDetail()
        }
    },
    computed: {
        ...mapGetters([
            'getLuckyDrawPageDetailGetter'
        ])
    },
    watch:{
       "list":{
            handler(newVal,oldVal){
            },
            deep:true
        }
    },
    filters: {
        luckyDrawActivityStatus: function (value) {
            switch(value) {
                case 'NOT_STARTED':
                    return "未开始"
                break;  
                 case 'ON_GOING':
                    return "进行中"
                break; 
                 case 'HAS_ENDED':
                    return "已结束"
                break; 
                 case 'CLOSED':
                    return "已关闭"
                break;  
            }
        }
    }
    
  }
</script>
<style lang="scss" scoped>
.el-upload{
    max-width: 300px;
    img{
        width: 100%;
    }
}
.cell{
    .el-upload{
        img{
            width: 40px;
            height: 30px;
        }
    }
}
.text{
    color:#606266;
    line-height: 24px;
    font-size: 14px;
}
</style>
