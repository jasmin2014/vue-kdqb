<template>
    <div class="template-content-wrap" :class="{'preview-case':isPreview}">
        <div class="module-header module-item">
            <img src="../images/header.png" alt="">
        </div>
        <!-- 所有模块 -->
        <div class="module-wrap" v-for="(item,key) in appIndexPageModuleGetter" :key="key">
            <div class="module-wb module-item" :class="{'t-center':item.centered}" v-if="item.type == 'textPage'">
                <p>{{ item.content  || "text"}}</p>
                <div :class="{'under-gap':!item.hiddenUnderGap}"></div>
                <div class="moduel-des" @click="handleClickModuleDes(key)"  v-if="!moduelEditBtnVisiable[key]">文本</div>
                <ModuleEditBtnComponents :visiable="moduelEditBtnVisiable[key]" :contentData="item"  :index="key"/>
            </div>
            <div class="module-xnkp module-item" v-if="item.type == 'vituralCard'">
                <img src="../images/vituralCard.png" alt="">
                <div :class="{'under-gap':!item.hiddenUnderGap}"></div>
                <div class="moduel-des" @click="handleClickModuleDes(key)"  v-if="!moduelEditBtnVisiable[key]">虚拟卡骗</div>
                <ModuleEditBtnComponents :visiable="moduelEditBtnVisiable[key]" :contentData="item"  :index="key"/>
            </div>
            <div class="module-gnrk module-item" v-if="item.type == 'homeModuleAdvert'">
                <div class="module-gnrk-fake" v-if="!item.list || !item.list.length">
                      <img src="../images/no-content-1.png" alt="">
                </div>
                <div v-else class="module-gnrk-real">
                    <a class="module-gnrk-item" v-for="(val,key) in item.list" :key="key"  :href="val.link">
                        
                        <img :src="val.imgSrc" alt="" v-if="val.imgSrc && val.imgSrc != ''">
                        <img src="../images/no-content-2.png" alt="" v-else>
                        <!-- <p>{{val.title}}</p>  -->
                    </a>
                </div>
                <div :class="{'under-gap':!item.hiddenUnderGap}"></div>
                <div class="moduel-des" @click="handleClickModuleDes(key)"  v-if="!moduelEditBtnVisiable[key]">功能入口</div>
                <ModuleEditBtnComponents :visiable="moduelEditBtnVisiable[key]" :contentData="item"  :index="key"/>
            </div>
            <div class="module-gg module-item" v-if="item.type == 'homeModuleNotice'">
                <div>
                    <span class="label">口袋头条</span>
                    <span class="line">|</span>
                    <a class="content" :href="item.link">{{item.title}}</a>  
                </div>
                <div :class="{'under-gap':!item.hiddenUnderGap}" v-if="item.title"></div>
                <div class="moduel-des" @click="handleClickModuleDes(key)">公告</div>
                <ModuleEditBtnComponents :visiable="moduelEditBtnVisiable[key]" :contentData="item"  :index="key"/>
            </div>
            <div class="module-lbt module-item" v-if="item.type == 'homeModuleRollPic'">
                <div style="overflow:hidden;width:375px;" :style="{height:375/item.aspectRatio+'px'}">
                    <div style="width:1000px;" :style="{height:375/item.aspectRatio+'px'}">
                        <div class="module-lbt-content" v-if="!item.list || !item.list.length" :style="{height:375/item.aspectRatio+'px'}">
                            <img src="../images/no-content-1.png" alt="">
                        </div>
                        <div v-else class="module-lbt-content" :style="{height:375/item.aspectRatio+'px'}">
                            <a class="module-lbt-item" v-for="(val,key) in item.list" :key="key" :href="val.link" :style="{height:375/item.aspectRatio+'px'}">
                                <img :src="val.imgSrc" alt="">
                            </a>
                        </div>
                    </div>
                </div>
                <div :class="{'under-gap':!item.hiddenUnderGap}"></div>
                <div class="moduel-des" @click="handleClickModuleDes(key)"  v-if="!moduelEditBtnVisiable[key]">轮播图</div>
                <ModuleEditBtnComponents :visiable="moduelEditBtnVisiable[key]" :contentData="item"  :index="key"/>
            </div>
            <div class="module-dzt module-item" v-if="item.type == 'homeModuleOnePic'">
                <div class="module-dzt-content" :style="{height:375/item.aspectRatio+'px'}">
                    <img src="../images/no-content-1.png" alt=""  v-if="!item.imgSrc || item.imgSrc == ''">
                    <a :href="item.link"  v-else  style="display:block;" :style="{height:375/item.aspectRatio+'px'}" >
                        <img :src="item.imgSrc" alt="">
                    </a>
                </div>
                <div :class="{'under-gap':!item.hiddenUnderGap}"></div>
                <div class="moduel-des" @click="handleClickModuleDes(key)"  v-if="!moduelEditBtnVisiable[key]">单张图</div>
                <ModuleEditBtnComponents :visiable="moduelEditBtnVisiable[key]" :contentData="item"  :index="key"/>
            </div>
            <div class="module-szt module-item" v-if="item.type == 'homeModuleTwoPic'">
                <div class="module-szt-content" :style="{height:174/item.aspectRatio+'px'}">
                    <a :href="val.link" v-for="(val,key) in item.list" :key="key" :style="{height:174/item.aspectRatio+'px'}" style="display:block;">
                        
                         <img src="../images/no-content-2.png" alt=""  v-if="!val.imgSrc || val.imgSrc == ''">
                         <img :src="val.imgSrc" alt="" v-else>
                    </a>
                </div>
                <div :class="{'under-gap':!item.hiddenUnderGap}"></div>
                <div class="moduel-des" @click="handleClickModuleDes(key)"  v-if="!moduelEditBtnVisiable[key]">双张图</div>
                <ModuleEditBtnComponents :visiable="moduelEditBtnVisiable[key]" :contentData="item"  :index="key"/>
            </div>
            <div class="module-zdq module-item" v-if="item.type == 'homeModuleLeft'">
                <div class="module-zdq-content">
                    <a href="javascript:void(0)" v-if="!item.imgSrc || !item.imgSrc != ''">
                        <img src="../images/no-content-1.png" alt="" >
                    </a>
                    <a :href="item.link"  v-else>
                       <div class="img-wrap fl">
                           <img :src="item.imgSrc" alt="">
                       </div>
                       <div class="des-wrap fl">
                           <p class="title">{{item.goodName}}</p>
                            <div class="btn">
                                <span style="color:#ff2400;border:1px solid #ff2400;">免息</span>
                                <span style="color:#3b26ed;border:1px solid #3b26ed;">促销</span>
                            </div>
                            <p class="price">￥{{item.price}}</p>
                            <p class="monthly">月供<span style="color:#ff5000;">￥</span><span style="color:#ff5000;font-size:16px;">{{item.monthly}}</span>  <span>×{{item.period}}期</span></p>
                       </div>
                    </a>
                </div>
                <div :class="{'under-gap':!item.hiddenUnderGap}"></div>
                <div class="moduel-des" @click="handleClickModuleDes(key)" v-if="!moduelEditBtnVisiable[key]">左对齐</div>
                <ModuleEditBtnComponents :visiable="moduelEditBtnVisiable[key]" :contentData="item"  :index="key"/>
            </div>
            <div class="module-lgsp module-item" v-if="item.type == 'homeModuleTwoItem'">
                <div class="clearfix"  v-if="!item.list || !item.list.length">
                     <div class="module-lgsp-content">
                        <a href="javascript:void(0)" >
                            <img src="../images/no-content-3.png" alt="" >
                        </a>
                    </div>
                    <div class="module-lgsp-content">
                        <a href="javascript:void(0)" >
                            <img src="../images/no-content-3.png" alt="" >
                        </a>
                    </div>
                </div>
                <div class="clearfix">
                    <div class="module-lgsp-content" v-if="item.list" v-for="(val,key) in item.list" :key="key">
                        <a :href="val.link" >
                            <img :src="val.imgSrc" alt="" >
                            <p class="name">{{val.goodName}}</p>
                            <p class="price">￥{{val.price}}</p>
                            <p class="detail">￥<span class="monthly">{{val.monthly}}</span><span class="period">X&nbsp;{{val.period}}期</span></p>
                        </a>
                    </div>
                </div>
                <div :class="{'under-gap':!item.hiddenUnderGap}"></div>
                <div class="moduel-des" @click="handleClickModuleDes(key)"  v-if="!moduelEditBtnVisiable[key]">两个商品</div>
                <ModuleEditBtnComponents :visiable="moduelEditBtnVisiable[key]" :contentData="item"  :index="key"/>
            </div>
            <div  class="module-sgsp module-item" v-if="item.type == 'homeModuleThreeItem'">
                 <div class="clearfix"  v-if="!item.list || !item.list.length">
                     <img src="../images/no-content-4.png" alt="">
                </div>
                <div class="module-wrap">
                    <div class="module-sgsp-content"  v-if="item.list" v-for="(val,key) in item.list" :key="key">
                        <a :href="val.link" >
                            <img :src="val.imgSrc" alt="" >
                            <p class="name">{{val.goodName}}</p>
                            <p class="price">￥{{val.price}}</p>
                            <p class="detail">￥<span class="monthly">{{val.monthly}}</span><span class="period">X&nbsp;{{val.period}}期</span></p>
                        </a>
                    </div>
                </div>
                <div :class="{'under-gap':!item.hiddenUnderGap}"></div>
                <div class="moduel-des" @click="handleClickModuleDes(key)"  v-if="!moduelEditBtnVisiable[key]">三个商品</div>
                <ModuleEditBtnComponents :visiable="moduelEditBtnVisiable[key]" :contentData="item"  :index="key"/>
            </div>
            <div  class="module-sgsp module-item" v-if="item.type == 'homeModuleRollItem'">
                 <div class="clearfix"  v-if="!item.list || !item.list.length">
                     <img src="../images/no-content-4.png" alt="">
                </div>
                <div class="module-wrap">
                    <div class="module-sgsp-content"  v-if="item.list" v-for="(val,key) in item.list" :key="key">
                        <a :href="val.link" >
                            <img :src="val.imgSrc" alt="" >
                            <p class="name">{{val.goodName}}</p>
                            <p class="price">￥{{val.price}}</p>
                            <p class="detail">￥<span class="monthly">{{val.monthly}}</span><span class="period">X&nbsp;{{val.period}}期</span></p>
                        </a>
                    </div>
                </div>  
                <div :class="{'under-gap':!item.hiddenUnderGap}"></div>
                <div class="moduel-des" @click="handleClickModuleDes(key)"  v-if="!moduelEditBtnVisiable[key]">轮动商品</div>
                <ModuleEditBtnComponents :visiable="moduelEditBtnVisiable[key]" :contentData="item"  :index="key"/>
            </div>
            <div  class="module-dbdh module-item" v-if="item.type == 'footNavigation'">
                 <div class="clearfix"  v-if="!item.list || !item.list.length">
                     <img src="../images/no-content-4.png" alt="">
                </div>
                <div class="module-dbdh-content"  >
                    <a :href="val.link" v-if="item.list" v-for="(val,key) in item.list" :key="key">
                        <img :src="val.normalImgUrl" alt="" >
                        <p class="name">{{val.title}}</p>
                    </a>
                </div>
                <div :class="{'under-gap':!item.hiddenUnderGap}"></div>
                <div class="moduel-des" @click="handleClickModuleDes(key)"  v-if="!moduelEditBtnVisiable[key]">底部导航</div>
                <ModuleEditBtnComponents :visiable="moduelEditBtnVisiable[key]" :contentData="item" :index="key"/>
            </div>
        </div>
        <!-- 到底了 -->
        <div class="bottom-tip" v-if="appIndexPageModuleGetter.length">
            <img src="../images/bottom-tip.png" alt="">
            <span>到底了~</span>
        </div>
        <!--  添加按钮 -->
        <div class="add-btn" @click="handleClickAddBtn" v-if="!isPreview"><span></span><span >点击添加模块</span></div>
        <!-- 添加模块弹窗 -->
        <el-dialog title="请选择模板类型" :visible.sync="dialogAddModuleVisiable" :width="dialogAddModuleWidth">
            <el-form ref="form" :model="form" label-width="0" :rules="rules">
                <el-form-item label="" :label-width="dialogSelectWidth">
                    <el-select clearable placeholder="请选择活动区域" v-model="selectModuleType">
                        <el-option v-for="item in templateModuleList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddModuleVisiable = false">取 消</el-button>
                <el-button type="primary" @click="handleAddModule">确 定</el-button>
            </div>
        </el-dialog>
    </div>  
    
</template>
<style lang="scss" scoped>
    .template-content-wrap{
        // background: #f4f4f4;
        // margin-left: 30px;
        width: 405px;
        min-height: 667px;
        // height: auto;;
        // overflow-y: auto;
        overflow-x: hidden;
        position: relative;
        font-size: 14px;
        .fl{
            float:left;
        }
        img{
            width: 100%;
            height: 100%;
        }
        p{
            margin: 0;
            padding:0;
        }
        .clearfix { 
        *zoom: 1; 
        } 
        .clearfix:before, 
        .clearfix:after { 
        display: table; 
        line-height: 0; 
        content: ""; 
        } 
        .clearfix:after { 
        clear: both; 
        } 

        .module-wrap{
            position: relative;
        }
        .module-item{
            width: 375px;
            position: relative;
        }
        .moduel-des{
            position: absolute;
            width: 30px;
            height: auto;
            right: -35px;
            top: 0px;
            line-height: 1;
            background: #fff;
            padding:5px;
            cursor: pointer;
            font-size: 14px;
        }
        .add-btn{
            width:375px;
            height:36px;
            background: #f56c6c;
            text-align: center;
            line-height: 36px;
            cursor: pointer;
            color: #fff;
            font-size: 14px;
            // position: fixed;
            margin-top: 30px;;
            // position: absolute;
            // bottom:0;
            // left:0;
        }
        .t-center{
            text-align: center;
        }
        .under-gap{
            // margin-bottom: 10px;
            height: 10px;
            width:375px;
            background: #f4f4f4;
        }
        .module-header{
            height: 75px;
            // position: absolute;
            top:0;
            left:0;
        }
        .module-wb{
            // height: 50px;
            line-height: 50px;
            font-size: 16px;
            color:#2b2b2b;
            p{
                width: 375px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            // font-weight: 900;
        }
        .module-xnkp{
            height: 99px;
        }
        .module-gnrk{
            .module-gnrk-item{
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                width: 72px;
                height: 72px;
                padding-top: 15px;
                img{
                    // width: 40px;
                    // height: 40px;
                }
                p{
                    margin:0;
                    height: 30px;
                    line-height: 30px;
                    color:#333333;
                    font-size: 11px;
                }
            }
        }
         .module-gnrk-fake{
            height: 85px;
            width: 375px;
        }
        .module-gnrk-real{
            height: 85px;
            display: flex;
            display: -webkit-flex;
            align-items: center;
            justify-content: space-around;
            flex-wrap: wrap ;
        }
        .module-gg {
            border-top: 2px solid #f5f5f5;
            height: 48px;
            line-height: 50px;
            font-size: 14px;
            padding-left:10px;
            background: #fff;
            span{
                float: left;
            }
            .label{
                color:#ff4f37;
                font-style: italic;
                font-weight: 900;
            }
            .line{
                color:#eaeaea;
                margin: 0 10px;
            }
            .content{
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                width: 260px;
                display: block;
                font-size: 16px;
            }
        }
        .module-lbt{
            .module-lbt-content{
                display: block;
                float: left;
                .module-lbt-item{
                    display: block;
                    width: 375px;;
                }
            }
        }
        .module-dzt{
            .module-dzt-content{
                // height: 90px;
                // background: #f4f4f4;
                // padding: 15px 20px;
                img{
                    // border-radius: 45px;
                }
            }
        }
        .module-szt{
            .module-szt-content{
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    overflow: hidden;
                a{
                    height: 170px;
                    width: 174px;
                }
               
            }
        }
        .module-zdq{
            margin: 0 15px;
            border-top: 1px solid #eef0f3;
            width: 360px;
            .module-zdq-content{
                height: 125px;
                .img-wrap{
                    width:125px;
                    height: 125px;
                }
                .des-wrap{
                    padding-left:8px;
                    .title{
                        margin-top: 17px;
                        margin-bottom: 10px;
                        line-height: 1;
                        width: 200px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .btn{
                        margin-bottom: 13px;
                        span{
                            display: inline-block;
                            width: 30px;
                            height: 14px;
                            box-sizing: border-box;
                            text-align: center;
                            line-height: 14px;
                            font-size: 10px;
                            border-radius: 2px;
                        }
                    }
                    .price{
                        color:#999999;
                        line-height: 1;
                        font-size: 13px;
                        margin-bottom: 14px;
                    }
                    .monthly{
                        color:#353535;
                        font-size: 13px;
                        line-height: 1;
                    }
                }
            }
        }
        .module-lgsp{
            border-bottom: 1px solid #e8eaee;
            .module-lgsp-content{
                width: 50%;
                // height: 250px;
                box-sizing: border-box;
                float: left;
                padding:12px 14px;
                border:1px solid #e8eaee;
                border-bottom:0 none;
                border-left:0 none;
                img{
                    height: 160px;
                    margin-bottom: 12px;
                }
                p{
                    color: #333333;
                    font-size: 13px;
                    width: 160px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    line-height: 1;
                }
                .name{
                    margin-bottom: 14px;
                }
                .price{
                    color:#8b8b8b;
                    margin-bottom: 10px;
                }
                .detail{
                    font-size: 14px;
                    color: #ff3000;
                    line-height: 1;
                    vertical-align: baseline; 
                    margin-bottom: 7px;
                    .period{
                        color:#8b8b8b;
                        margin-left: 8px;
                        font-size: 12px;
                    }
                }
            }
            .module-lgsp-content:nth-child(even){
                border-right:0 none;
            }
        }
        .module-sgsp{
            .module-wrap{
                 display: flex;
                flex-wrap: nowrap;
                justify-content: center;
                align-items: center;
                width: 375px;
                overflow: hidden;
                .module-sgsp-content{
                    width: 100px;
                    margin-right: 15px;
                    img{
                        width: 100px;
                        height: 100px;
                        margin-top: 15px;
                        margin-bottom: 16px;
                    }
                    p{
                        line-height: 1;
                        color: #333333;
                        font-size: 12px;
                        width: 100px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .name{
                        margin-bottom: 14px;
                    }
                    .price{
                        color: #8b8b8b;
                        text-align: center;
                        margin-bottom: 8px;
                    }
                    .detail{
                        color:#ff3000;
                        margin-bottom: 32px;
                        .period{
                            color: #8b8b8b;
                            font-size: 12px;
                        }
                    }
                }
            }
            
        }
        .module-dbdh{
            border-top:1px solid #e4e4e4;
            .module-dbdh-content{
                display: flex;
                justify-content: space-around;
                height: 50px;
                
                a{
                    padding-top:7px;
                    width: 40px;
                    text-align: center;
                    color: #8b8b8b;
                    img{
                        // width: 20px;
                        max-width: 24px;
                        max-height: 20px;
                    }
                }
                a:nth-child(1){
                   color: #ff5200;
                }
                p{
                    line-height: 1;
                    font-size: 12px;
                    text-align: center;
                    width: 40px;
                }
            }
        }
        .bottom-tip{
            width:375px;
            height: 70px;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                width: 35px;
                height: 55px;
                margin-right: 10px;
            }
            span{
                color:#b8b8b8;
                font-size: 12px;
            }
        }
    }
    .preview-case{
        width: 375px;
        background: #fff;
        margin-left: 28px;
        height:580px ;
        overflow-y: auto;

        .module-dbdh{
            // position: fixed;
            // bottom: -60px;
            // left:0;
        }
       
    }
    .preview-case::-webkit-scrollbar {
        display: none;
    }
</style>
<script>
import { mapGetters,mapMutations } from 'vuex'
import ModuleEditBtnComponents from './moduleEditBtn.vue'
export default {
    props:["isPreview"],
    name: "TemplateContent",
    data(){
        return {
            dialogAddModuleVisiable:false,
            templateModuleList:[
                {
                    label:"虚拟卡片",
                    value:"vituralCard"
                },
                {
                    label:"功能入口",
                    value:"homeModuleAdvert"
                },
                {
                    label:"公告",
                    value:"homeModuleNotice"
                },
                {
                    label:"轮播图",
                    value:"homeModuleRollPic"
                },
                {
                    label:"单图片",
                    value:"homeModuleOnePic"
                },{
                    label:"双图片",
                    value:"homeModuleTwoPic"
                },{
                    label:"文本",
                    value:"textPage"
                },{
                    label:"左对齐(商品展示)",
                    value:"homeModuleLeft"
                },{
                    label:"三个商品",
                    value:"homeModuleThreeItem"
                },
                {
                    label:"两个商品",
                    value:"homeModuleTwoItem"
                },
                {
                    label:"轮动展示商品",
                    value:"homeModuleRollItem"
                },
                 {
                    label:"底部导航",
                    value:"footNavigation"
                },
                
            ],
            dialogAddModuleWidth:"400px",
            dialogSelectWidth:"",
            selectModuleType:null,
            moduelEditBtnVisiable:[false,false,false,false,false,false,false,false,false,false,false],
            rules:{
               
            },
            form:{

            }
        }
    },
    components:{
        ModuleEditBtnComponents

    },
    methods:{
        handleClickAddBtn(){
            if(this.appIndexPageModuleGetter.length){
                for(let i of this.appIndexPageModuleGetter){
                    if(i.isNew){
                        this.$notify({
                            title: '',
                            message: '您有内容未编辑，请先编辑保存',
                            type: 'warning'
                        });
                        return
                    }
                }
            }
            this.dialogAddModuleVisiable = true;
        },
        handleAddModule(){
            let commitData = {type:this.selectModuleType,isNew:true,hiddenUnderGap:false}
            this.dialogAddModuleVisiable = false
            switch (this.selectModuleType){
                case "textPage":
                    break;
                case "vituralCard":
                    break;
                case "homeModuleAdvert":
                    commitData.list = [
                        {
                            "imgSrc":"",
                            "link":""
                        }, 
                        {
                            "imgSrc":"",
                            "link":""
                        },
                        {
                            "imgSrc":"",
                            "link":""
                        },
                        {
                            "imgSrc":"",
                            "link":""
                        },
                        {
                            "imgSrc":"",
                            "link":""
                        },
                    ]
                    break;
                case "homeModuleNotice":
                    break;
                case "homeModuleRollPic":
                    commitData.list = []
                    break;
                case "homeModuleOnePic":
                    commitData.imgSrc ='';
                    break;
                case "homeModuleTwoPic":
                    commitData.list = [
                        {
                            "imgSrc":"",
                            "link":""
                        },
                        {
                            "imgSrc":"",
                            "link":""
                        },
                    ]
                    break;
                case "homeModuleLeft":
                    commitData.imgSrc ='';
                    break;
                case "homeModuleTwoItem":
                    commitData.list = [
                        {
                            "goodName":"",
                            "imgSrc":"",
                            "link":""
                        },
                        {
                            "goodName":"",
                            "imgSrc":"",
                            "link":""
                        },
                    ]
                
                    break;
                case "homeModuleThreeItem":
                    commitData.list = [
                        {
                            "goodName":"",
                            "imgSrc":"",
                            "link":""
                        },
                        {
                            "goodName":"",
                            "imgSrc":"",
                            "link":""
                        },
                        {
                            "goodName":"",
                            "imgSrc":"",
                            "link":""
                        },
                    ]
                    break;
                case "homeModuleRollItem":
                    commitData.list = [
                        // {
                        //     "goodName":"",
                        //     "imgSrc":"",
                        //     "link":""
                        // }
                    ]
                    break;
                     
                case "footNavigation":
                    commitData.list = [
                        {
                            "title":"",
                            "hasTitle":false,
                            "link":"",
                            "normalImgUrl":"",
                            "selectedImgUrl":""
                        },{
                            "title":"",
                            "hasTitle":false,
                            "link":"",
                            "normalImgUrl":"",
                            "selectedImgUrl":""
                        },{
                            "title":"",
                            "hasTitle":false,
                            "link":"",
                            "normalImgUrl":"",
                            "selectedImgUrl":""
                        },{
                            "title":"",
                            "hasTitle":false,
                            "link":"",
                            "normalImgUrl":"",
                            "selectedImgUrl":""
                        },
                    ]
                    break;
            }
            this.$store.commit('addIndexPageModuleMutation',commitData)
            this.$store.commit("appIndexEditBoxTypeMutation",{index:-1,data:{}})
            this.hideModuleBtn()
        },
        hideModuleBtn(){
            this.moduelEditBtnVisiable = [false,false,false,false,false,false,false,false,false,false,false]
        },
        handleClickModuleDes(key){
            this.hideModuleBtn()
            this.moduelEditBtnVisiable[key] = true
        }
    },
    computed:{
        ...mapGetters([
            'appIndexPageModuleGetter','appIndexEditBoxTypeGetter',
        ])
    },
    watch:{
        "appIndexEditBoxTypeGetter":{
            handler(newVal, oldVal) {
               if(newVal.index == -1){
                     this.moduelEditBtnVisiable = [false,false,false,false,false,false,false,false,false,false,false]
               }
            },
            deep: true
          
        }
        
    }
    
}
</script>


