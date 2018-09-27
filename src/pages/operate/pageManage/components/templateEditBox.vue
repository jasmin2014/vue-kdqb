<template>
    <div class="box-wrap page-operate-form">
        <el-card class="box-card" v-if="appIndexEditBoxTypeGetter.index != -1">
            <div slot="header" class="clearfix">
                <span>{{title}}</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="handleClose">关闭</el-button>
            </div> 
            <div v-for="(item,key) in appIndexPageModuleGetter" :key="key">
                 <!-- 虚拟卡片 -->
                <el-form ref="form" :model="form" label-width="0" :rules="rules" v-if='item.select && item.type =="vituralCard"'> 
                    <el-form-item>
                        <el-checkbox v-model="item.hiddenUnderGap">隐藏下方间隙</el-checkbox>
                    </el-form-item>
                </el-form>
                 <!-- 功能入口 -->
                <el-form ref="form" :model="item" label-width="0" :rules="rules" v-if='item.select && item.type =="homeModuleAdvert"'>
                    <div style="background:#f9f9f9;height:60px;overflow:hidden;margin-bottom:10px;" v-for="(val,key2) in item.list" :key="key2">
                        <el-form-item class="fl" :rules="[
                        { required: true, message: '不能为空'}
                        ]"  :prop="'list.' +key2+'.imgSrc'">
                            <div class="img-upload-box">
                                <div class="inlinne-block arrow-box fl">
                                    <div class="arrow" @click='handleMoveTop({val:val,index:key2})'> 
                                        <span class="el-icon-caret-top"></span>
                                    </div>
                                    <div class="arrow" @click="handleMoveDown({val:val,index:key2})">
                                        <span class="el-icon-caret-bottom"></span>
                                    </div>
                                </div>
                                <div class="fl img-box">
                                    <el-upload
                                        class="avatar-uploader"
                                        ref="upload1"
                                        :http-request="Upload" 
                                        action=""
                                        :multiple="false"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess"
                                        :before-upload="beforeAvatarUpload"
                                        accept="image/jpeg,image/jpg,image/png"
                                        :data="{type:'homeModuleAdvert',position:key,index:key2}"
                                        >
                                       <img v-if="val.imgSrc" :src="val.imgSrc" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item class="fl" :rules="[
                        { required: true, message: '不能为空'}
                        ]"  :prop="'list.' +key2+'.link'">
                            <div class="input-box">
                                <el-input placeholder="请输入内容" v-model="val.link" clearable> </el-input>
                            </div>
                        </el-form-item>
                         <el-button circle icon="el-icon-delete" @click="handleDelete(item.list,key2)" style="margin-top:10px;">
                        </el-button>
                    </div>
                    <el-form-item>
                        <el-button  icon="el-icon-plus" style="width:100% !important;" @click="handleAddAdvert(5)">添加{{item.list.length}}/5</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="item.hiddenUnderGap">隐藏下方间隙</el-checkbox>
                    </el-form-item>
                </el-form>
                 <!-- 文本 -->
                <el-form ref="form" :model="item" label-width="0" :rules="rules" v-if='item.select && (item.type =="textPage")'>
                    <el-form-item label="" prop="content">
                        <el-input type="textarea" v-model="item.content" rows="8" maxlength="100" clearable></el-input>
                        
                        <span class="notice-length" v-if="item.content">{{item.content.length}}/100</span>
                        <span class="notice-length" v-else>100/100</span>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="item.centered">居中显示</el-checkbox>
                        <el-checkbox v-model="item.hiddenUnderGap">隐藏下方间隙</el-checkbox>
                        <p class="des">提示：默认左对齐显示。</p>
                    </el-form-item>
                </el-form> 
                 <!--公告  -->
                 <el-form ref="form" :model="item" label-width="0" :rules="rules" v-if='item.select && (item.type =="homeModuleNotice")'>
                    <el-form-item class="" label="标题" label-width='80px' prop="title">
                       <el-input placeholder="请输入内容" v-model="item.title" clearable> </el-input>
                    </el-form-item>
                    <el-form-item class="" label="链接" label-width='80px' prop="link">
                       <el-input placeholder="请输入内容" v-model="item.link" clearable> </el-input>
                    </el-form-item>
                    <el-form-item  prop="moreDetail">
                        <el-col :span="6">
                            <el-checkbox v-model="item.hasMore">显示"更多"</el-checkbox>
                        </el-col>
                        <el-col :span="18">
                              <el-input placeholder="请输入内容" v-model="item.moreDetail" clearable maxlength="10"> </el-input>
                        </el-col> 
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="item.hiddenUnderGap">隐藏下方间隙</el-checkbox>
                    </el-form-item>
                </el-form>  
                <!-- 轮播图 -->
                <el-form ref="form" :model="item" label-width="0" :rules="rules" v-if='item.select && item.type =="homeModuleRollPic"'>
                    <div style="background:#f9f9f9;height:60px;overflow:hidden;margin-bottom:10px;" v-for="(val,key2) in item.list" :key="key2" v-if="item.list">
                        <el-form-item class="fl" :rules="[
                        { required: true, message: '不能为空'}
                        ]"  :prop="'list.' +key2+'.imgSrc'">
                            <div class="img-upload-box">
                                <div class="inlinne-block arrow-box fl">
                                    <div class="arrow" @click='handleMoveTop({val:val,index:key2})'> 
                                        <span class="el-icon-caret-top"></span>
                                    </div>
                                    <div class="arrow" @click="handleMoveDown({val:val,index:key2})">
                                        <span class="el-icon-caret-bottom"></span>
                                    </div>
                                </div>
                                <div class="fl img-box">
                                    <el-upload
                                        class="avatar-uploader"
                                        ref="upload1"
                                        :http-request="Upload" 
                                        action=""
                                        :multiple="false"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess"
                                        :before-upload="beforeAvatarUpload"
                                        accept="image/jpeg,image/jpg,image/png"
                                        :data="{type:'homeModuleRollPic',position:key,index:key2}"
                                        >
                                       <img v-if="val.imgSrc" :src="val.imgSrc" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item class="fl" :rules="[
                        { required: true, message: '不能为空'}
                        ]"  :prop="'list.' +key2+'.link'">
                            <div class="input-box">
                                <el-input placeholder="请输入内容" v-model="val.link" clearable> </el-input>
                            </div>
                        </el-form-item>
                        <el-button circle icon="el-icon-delete" @click="handleDelete(item.list,key2)" style="margin-top:10px;">
                        </el-button>
                    </div>
                    <el-form-item class="" label="图片宽高比" label-width='100px' prop="aspectRatio">
                       <el-input placeholder="两位小数" v-model.number="item.aspectRatio" clearable type='number'> </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button  icon="el-icon-plus" style="width:100% !important;" @click="handleAddAdvert(6)">添加{{item.list ? item.list.length : 1}}/6</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="form.hiddenUnderGap">隐藏下方间隙</el-checkbox>
                    </el-form-item>
                </el-form>
                <!-- 单图片 -->
                <el-form ref="form" :model="item" label-width="0" :rules="rules" v-if='item.select && (item.type =="homeModuleOnePic")'>
                    <el-form-item  prop="title">
                        <el-col :span="6">
                            <el-checkbox v-model="item.hasTitle">标题</el-checkbox>
                        </el-col>
                        <el-col :span="18">
                              <el-input placeholder="请输入内容" v-model="item.title" clearable maxlength="10"> </el-input>
                        </el-col> 
                    </el-form-item>
                    <el-form-item  prop="moreDetail">
                        <el-col :span="6">
                            <el-checkbox v-model="item.hasMore">显示"更多"</el-checkbox>
                        </el-col>
                        <el-col :span="18">
                              <el-input placeholder="请输入内容" v-model="item.moreDetail" clearable maxlength="10"> </el-input>
                        </el-col> 
                    </el-form-item>
                    <div style="background:#f9f9f9;margin-bottom:10px;height:60px;overflow:hidden;">
                        <el-form-item class="fl" prop="imgSrc">
                            <div class="img-upload-box">
                                <div class="inlinne-block arrow-box fl">
                                    <div class="arrow" @click='handleMoveTop({val:val,index:key2})'> 
                                        <span class="el-icon-caret-top"></span>
                                    </div>
                                    <div class="arrow" @click="handleMoveDown({val:val,index:key2})">
                                        <span class="el-icon-caret-bottom"></span>
                                    </div>
                                </div>
                                <div class="fl img-box">
                                    <el-upload
                                        class="avatar-uploader"
                                        ref="upload1"
                                        :http-request="Upload" 
                                        action=""
                                        :multiple="false"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess"
                                        :before-upload="beforeAvatarUpload"
                                        accept="image/jpeg,image/jpg,image/png"
                                        :data="{type:'homeModuleOnePic',position:key,}"
                                        >
                                       <img v-if="item.imgSrc" :src="item.imgSrc" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item class="fl" prop="link">
                            <div class="input-box">
                                <el-input placeholder="请输入内容" v-model="item.link" clearable> </el-input>
                            </div>
                        </el-form-item>
                         <el-button circle icon="el-icon-delete" @click="handleDelete(item.list,key2)" style="margin-top:10px;" disabled="">
                        </el-button>
                    </div>
                    <el-form-item class="" label="图片宽高比" label-width='25%' prop="aspectRatio">
                       <el-input placeholder="两位小数" v-model.number="item.aspectRatio" clearable type='number'> </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="item.hiddenUnderGap">隐藏下方间隙</el-checkbox>
                    </el-form-item>
                </el-form>
                <!-- 双图片 -->
                 <el-form ref="form" :model="item" label-width="0" :rules="rules" v-if='item.select && (item.type== "homeModuleTwoPic")'>
                    <el-form-item  prop="title">
                        <el-col :span="6">
                            <el-checkbox v-model="item.hasTitle">标题</el-checkbox>
                        </el-col>
                        <el-col :span="18">
                              <el-input placeholder="请输入内容" v-model="item.title" clearable maxlength="10"> </el-input>
                        </el-col> 
                    </el-form-item>
                    <el-form-item  prop="moreDetail">
                        <el-col :span="6">
                            <el-checkbox v-model="item.hasMore">显示"更多"</el-checkbox>
                        </el-col>
                        <el-col :span="18">
                              <el-input placeholder="请输入内容" v-model="item.moreDetail" clearable maxlength="10"> </el-input>
                        </el-col> 
                    </el-form-item>
                    <div style="background:#f9f9f9;height:60px;overflow:hidden;margin-bottom:10px;" v-for="(val,key2) in item.list" :key="key2">
                        <el-form-item class="fl" :rules="[
                        { required: true, message: '不能为空'}
                        ]"  :prop="'list.' +key2+'.imgSrc'">
                            <div class="img-upload-box">
                                <div class="inlinne-block arrow-box fl">
                                    <div class="arrow" @click='handleMoveTop({val:val,index:key2})'> 
                                        <span class="el-icon-caret-top"></span>
                                    </div>
                                    <div class="arrow" @click="handleMoveDown(val)">
                                        <span class="el-icon-caret-bottom"></span>
                                    </div>
                                </div>
                                <div class="fl img-box">
                                    <el-upload
                                        class="avatar-uploader"
                                        ref="upload1"
                                        :http-request="Upload" 
                                        action=""
                                        :multiple="false"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess"
                                        :before-upload="beforeAvatarUpload"
                                        accept="image/jpeg,image/jpg,image/png"
                                        :data="{type:'homeModuleTwoPic',position:key,index:key2}"
                                        >
                                       <img v-if="val.imgSrc" :src="val.imgSrc" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item class="fl" :rules="[
                        { required: true, message: '不能为空'}
                        ]"  :prop="'list.' +key2+'.link'">
                            <div class="input-box">
                                <el-input placeholder="请输入内容" v-model="val.link" clearable> </el-input>
                            </div>
                        </el-form-item>
                         <el-button circle icon="el-icon-delete" @click="handleDelete(item.list,key2)" style="margin-top:10px;" disabled="">
                        </el-button>
                    </div>
                    <el-form-item class="" label="图片宽高比" label-width='100px' prop="aspectRatio">
                       <el-input placeholder="两位小数" v-model.number="item.aspectRatio" clearable type='number'> </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="item.hiddenUnderGap">隐藏下方间隙</el-checkbox>
                    </el-form-item>
                </el-form> 
                <!-- 左对齐 -->
                <el-form ref="form" :model="item" label-width="0" :rules="rules" v-if='item.select && (item.type =="homeModuleLeft")'>
                    <el-form-item class="" label="商品名称" label-width='80px' prop="goodName">
                       <el-input placeholder="请输入内容" v-model="item.goodName" clearable maxlength="22"> </el-input>
                    </el-form-item>
                    <el-form-item class="" label="商品价格" label-width='80px' prop="price">
                       <el-input placeholder="请输入内容" v-model.number="item.price" clearable type='number' > </el-input>
                    </el-form-item>
                    <div class="clearfix" style="100%；">
                        <el-form-item class="fl" label="月供金额" label-width='80px' prop="monthly" style="max-width:240px;">
                            <el-input placeholder="请输入金额" v-model.number="item.monthly" clearable type="number"> </el-input >
                        </el-form-item>
                       <div class="fl" style="line-height:40px;font-size:14px;color:#606266;margin:3px;">
                            X&nbsp;&nbsp;期数
                        </div>
                        <el-form-item class="fl" label="" label-width='0' prop="period" style="max-width:160px;">
                            <el-input placeholder="请输入期数" v-model.number="item.period" clearable type="number"> </el-input>
                         </el-form-item>
                    </div>
                    <div style="background:#f9f9f9;margin-bottom:10px;height:60px;overflow:hiddenl;">
                        <el-form-item class="fl" prop="imgSrc">
                            <div class="img-upload-box">
                                <div class="inlinne-block arrow-box fl">
                                    <div class="arrow" @click='handleMoveTop({val:val,index:key2})'> 
                                        <span class="el-icon-caret-top"></span>
                                    </div>
                                    <div class="arrow" @click="handleMoveDown({val:val,index:key2})">
                                        <span class="el-icon-caret-bottom"></span>
                                    </div>
                                </div>
                                <div class="fl img-box">
                                   <el-upload
                                        class="avatar-uploader"
                                        ref="upload1"
                                        :http-request="Upload" 
                                        action=""
                                        :multiple="false"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess"
                                        :before-upload="beforeAvatarUpload"
                                        accept="image/jpeg,image/jpg,image/png"
                                        :data="{type:'homeModuleLeft',position:key,}"
                                        >
                                       <img v-if="item.imgSrc" :src="item.imgSrc" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item class="fl" prop="link">
                            <div class="input-box">
                                <el-input placeholder="请输入链接" v-model="item.link" clearable> </el-input>
                            </div>
                        </el-form-item>
                         <el-button circle icon="el-icon-delete" @click="handleDelete(item.list,key2)" style="margin-top:10px;" disabled="">
                        </el-button>
                    </div>
                    <el-form-item>
                        <el-checkbox v-model="item.hiddenUnderGap">隐藏下方间隙</el-checkbox>
                    </el-form-item>
                </el-form>
                <!-- 两个宝贝 || 三个宝贝 || 滚动展示 -->
                <el-form ref="form" :model="item" label-width="0" :rules="rules" v-if='item.select && (item.type =="homeModuleTwoItem" || item.type == "homeModuleThreeItem" || item.type =="homeModuleRollItem")'>
                    <div v-for="(val,key2) in item.list" :key="key2" style="background:rgb(249, 249, 249);margin-bottom:10px;padding:10px 5px;">
                        <div style="background:#f9f9f9;height:60px;overflow:hidden;margin-bottom:10px;" >
                            <el-form-item class="fl" :rules="[
                            { required: true, message: '不能为空'}
                            ]"  :prop="'list.' +key2+'.imgSrc'">
                                <div class="img-upload-box">
                                    <div class="inlinne-block arrow-box fl">
                                        <div class="arrow" @click='handleMoveTop({val:val,index:key2})'> 
                                            <span class="el-icon-caret-top"></span>
                                        </div>
                                        <div class="arrow" @click="handleMoveDown({val:val,index:key2})">
                                            <span class="el-icon-caret-bottom"></span>
                                        </div>
                                    </div>
                                    <div class="fl img-box">
                                        <el-upload
                                            class="avatar-uploader"
                                            ref="upload1"
                                            :http-request="Upload" 
                                            action=""
                                            :multiple="false"
                                            :show-file-list="false"
                                            :on-success="handleAvatarSuccess"
                                            :before-upload="beforeAvatarUpload"
                                            accept="image/jpeg,image/jpg,image/png"
                                            :data="{type:item.type,position:key,index:key2}"
                                            >
                                        <img v-if="val.imgSrc" :src="val.imgSrc" class="avatar">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                    </div>
                                </div>
                            </el-form-item>
                            <el-form-item class="fl" :rules="[
                            { required: true, message: '不能为空'}
                            ]"  :prop="'list.' +key2+'.link'">
                                <div class="input-box">
                                    <el-input placeholder="请输入链接" v-model="val.link" clearable> </el-input>
                                </div>
                            </el-form-item>
                            <el-button circle icon="el-icon-delete" @click="handleDelete(item.list,key2)" style="margin-top:10px;margin-left:-5px;">
                            </el-button>
                        </div>
                        <el-form-item class="" label="商品名称" label-width='80px' :prop="'list.' +key2+'.goodName'" :rules="[
                            { required: true, message: '不能为空'}
                            ]">
                            <el-input placeholder="请输入内容" v-model="val.goodName" clearable maxlength="22"> </el-input>
                        </el-form-item>
                        <el-form-item class="" label="商品价格" label-width='80px' :prop="'list.' +key2+'.price'" >
                            <el-input placeholder="请输入内容" v-model.number="val.price" clearable type="number"> </el-input>
                        </el-form-item>
                        <div class="clearfix" style="100%;">
                            <el-form-item class="fl" label="月供金额" label-width='80px' :prop="'list.' +key2+'.monthly'" :rules="[
                            { required: true, message: '不能为空'},{ type: 'number', message: '必须为数字值' }
                            ]" style="max-width:240px;">
                                <el-input placeholder="请输入金额" v-model.number="val.monthly" clearable type="number">
                                </el-input >
                            </el-form-item>
                            <div class="fl" style="line-height:40px;font-size:14px;color:#606266;margin:3px;">
                                X&nbsp;&nbsp;期数
                            </div>
                            <el-form-item class="fl" label="" label-width='0' :prop="'list.' +key2+'.period'" :rules="[
                            { required: true, message: '不能为空'},{ type: 'number', message: '必须为数字值'}
                            ]" style="max-width:160px;">
                                <el-input placeholder="请输入期数" v-model.number="val.period" clearable maxlength="22" type="number"> </el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <el-form-item>
                        <el-checkbox v-model="item.hiddenUnderGap">隐藏下方间隙</el-checkbox>
                    </el-form-item>
                    <el-form-item v-if="item.type =='homeModuleRollItem'">
                        <el-button  icon="el-icon-plus" style="width:100% !important;" @click="handleAddAdvert(6)">添加{{item.list.length}}/6</el-button>
                    </el-form-item>
                </el-form>
                <!-- 底部导航 -->
                <el-form ref="form" :model="item" label-width="0" :rules="rules" v-if='item.select && item.type =="footNavigation"'>
                    <div v-for="(val,key2) in item.list" :key="key2" style="background:rgb(249, 249, 249);margin-bottom:10px;padding:10px 5px;">
                        <div style="" class="clearfix">
                            <el-form-item class="fl">
                                <div class="img-upload-box">
                                    <div class="inlinne-block arrow-box fl" style="margin-right:30px;">
                                        <div class="arrow"  @click='handleMoveTop({val:val,index:key2})'> 
                                            <span class="el-icon-caret-top"></span>
                                        </div>
                                        <div class="arrow"  @click='handleMoveDown({val:val,index:key2})'>
                                            <span class="el-icon-caret-bottom"></span>
                                        </div>
                                    </div>
                                </div>
                            </el-form-item>
                            <el-form-item class="fl" :rules="[
                            { required: true, message: '不能为空'}
                            ]"  :prop="'list.' +key2+'.normalImgUrl'">
                                <div class="fl" style="line-height:60px;color:#303133;margin-left:10px;">未选中:</div>
                                <div class="fl img-box">
                                    <el-upload
                                        class="avatar-uploader"
                                        ref="upload1"
                                        :http-request="Upload" 
                                        action=""
                                        :multiple="false"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess"
                                        :before-upload="beforeAvatarUpload"
                                        accept="image/jpeg,image/jpg,image/png"
                                        :data="{type:item.type,position:key,index:key2,subType:'normalImgUrl'}"
                                        >
                                    <img v-if="val.normalImgUrl" :src="val.normalImgUrl" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </div>
                            </el-form-item>
                            <el-form-item class="fl" :rules="[
                            { required: true, message: '不能为空'}
                            ]"  :prop="'list.' +key2+'.selectedImgUrl'">
                                <div class="fl" style="line-height:60px;color:#303133;margin-left:10px;">选中:</div>
                                <div class="fl img-box">
                                    <el-upload
                                        class="avatar-uploader"
                                        ref="upload1"
                                        :http-request="Upload" 
                                        action=""
                                        :multiple="false"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess"
                                        :before-upload="beforeAvatarUpload"
                                        accept="image/jpeg,image/jpg,image/png"
                                        :data="{type:item.type,position:key,index:key2,subType:'selectedImgUrl'}"
                                        >
                                    <img v-if="val.selectedImgUrl" :src="val.selectedImgUrl" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </div>
                            </el-form-item>
                             <!-- <el-button circle icon="el-icon-delete" @click="handleDelete(item.list,key2)" style="margin-top:10px;margin-left:10px;" disabled="">
                                    </el-button> -->
                        </div>
                         <el-form-item class="" :rules="[
                            { required: true, message: '不能为空'}
                            ]"  :prop="'list.' +key2+'.link'" label="链接" label-width="100px">
                            <div class="input-box">
                                <el-input placeholder="请输入链接" v-model="val.link" clearable> </el-input>
                            </div>
                        </el-form-item>
                        <el-form-item style="margin-left:40px;" :rules="[
                            { required: val.hasTitle? true:false, message: '勾选状态不能为空'}
                            ]"  :prop="'list.' +key2+'.title'">
                            <el-col :span="4">
                                <el-checkbox v-model="val.hasTitle">标题</el-checkbox>
                            </el-col>
                            <el-col :span="18" style="margin-left:-8px;">
                                <el-input placeholder="请输入内容" v-model.trim="val.title" clearable maxlength="3"> </el-input>
                            </el-col> 
                        </el-form-item>
                    </div>
                    <el-form-item>
                        <el-checkbox v-model="item.hiddenUnderGap">隐藏下方间隙</el-checkbox>
                    </el-form-item>
                </el-form>
            </div>
            <div class="bottom clearfix">
                <el-button  class="button" @click="handleSubmit('form')">保存</el-button>
            </div>
        </el-card>
    </div>
</template>
<script>
import { mapState,mapGetters,mapMutations } from 'vuex'
import { putPageContent } from "@/api/operate.js"
import { ossUpload } from '@/api/front'
export default {
    name:"TemplateEditBox",
    data(){
        var validateTitle = (rule,value,callback) =>{
            if(this.$refs.form[0].model.hasTitle && (value== undefined || value === '')){
                 callback(new Error('勾选状态下不能为空'));
            } else {
            callback();
            }
        };
        var validateMoreDetail = (rule,value,callback) =>{
            if(this.$refs.form[0].model.hasMore && (value== undefined || value === '')){
                 callback(new Error('勾选状态下不能为空'));
            } else {
            callback();
            }
        };
        var validateGoodName = (rule,value,callback) =>{
            if(value== undefined || value === ''){
                 callback(new Error('商品名称不能为空'));
            } else {
                callback();
            }
        };
        var validatePrice = (rule,value,callback) =>{
            if(value != '' || value ===0){
                let reg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/; //价格
                if(!reg.test(value) || value == 0){
                     callback(new Error('商品价格不合法'));
                }
            } else {
                callback();
            }
        };
        var validateMonthly =(rule,value,callback) =>{
            let reg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/ ;//价格
            if(value== undefined || value === ''){
                callback(new Error('月供金额不能为空'));
            }else if(!reg.test(value)){
                callback(new Error('月供金额不合法'));
            } else {
                callback();
            }
        };
        var validatePeriod =(rule,value,callback) =>{
            let reg = /^\+?[1-9][0-9]*$/; //正整数
            if(value== undefined || value === ''){
                callback(new Error('期数不能为空'));
            }else if(!reg.test(value)){
                callback(new Error('期数不合法'));
            } else {
                callback();
            }
        };
        return {
            form:{
            },
            homeModuleAdvert:[],
            rules: {
                content:[
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                title:[
                     { validator: validateTitle, trigger: 'blur' }
                ],
                moreDetail:[
                    { validator: validateMoreDetail, trigger: 'blur' }
                ],
                title:[
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                goodName:[
                    { validator: validateGoodName, trigger: 'blur' }
                ],
                link:[
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                imgSrc:[
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                price:[
                    // { validator: validatePrice, trigger: 'blur' },
                    // { type: 'numnber', message: '必须为数字类型', trigger: 'blur' }
                ],
                monthly:[
                    // { validator: validateMonthly, trigger: 'blur' },
                    { required: true, message: '不能为空', trigger: 'blur' },
                    
                ],
                period:[
                    // { validator: validatePeriod, trigger: 'blur' },
                    { required: true, message: '不能为空', trigger: 'blur' },
                ],
                aspectRatio:[
                    { required: true, message: '不能为空', trigger: 'blur' },
                    {
                        pattern: /^\d+(\.\d{1,2})?$/,
                        message: "请输入正确的图片宽高比",
                        trigger: "blur"
                    }
                ]               
            },
            imageUrl:"",
            title:"",
            inputModel:"",
        }
    },
    methods:{
        handleAvatarSuccess(res, file) {
            // this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            // const isJPGorPng = file.type === 'image/jpeg' || 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            // if (!isJPGorPng) {
            // this.$message.error('上传头像图片只能是 JPG或者PNG 格式!');
            // }
            if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isLt2M;
        },
        handleClose(){
            this.$store.commit("appIndexEditBoxTypeMutation",{index:-1,data:{}})
            this.$store.dispatch('appIndexPageModuleAction',{pageId:this.$route.query.id})
        },
        handleSubmit(formName){
            let moduleFormData = this.appIndexEditBoxTypeGetter.data
            switch (moduleFormData.type){
                case 'homeModuleAdvert':
                    if(moduleFormData.list.length < 4){
                        this.$message({
                            message: `需至少添加四个功能入口`,
                            type: 'warning'
                        });
                        return
                    }
                    break;

            }
            this.$refs[formName][0].validate((valid) => {
                if (valid) {
                    let dispatchData = this.appIndexPageModuleGetter
                    for(let i = 0 ;i < this.appIndexPageModuleGetter.length;i++){
                        if(i==this.appIndexEditBoxTypeGetter.index){
                            this.$store.dispatch("updateIndexPageModuleAction",{pageId:this.$route.query.id,body:this.appIndexPageModuleGetter})

                            this.$store.commit("appIndexEditBoxTypeMutation",{index:-1,data:{}})
                        }
                    }
                } else {
                    return false;
                }
            });
        },
        handleAddAdvert(num){
            for(var i of this.appIndexPageModuleGetter){
                if(i.select){
                    if(i.list && i.list.length >= num){
                        return 
                    }
                    i.list.push(
                        {
                            title:"",
                            imgSrc:"",
                            link:""
                        }
                    )
                }
            }
        },
        handleDelete(data,index){
            for(var i of this.appIndexPageModuleGetter){
                if(i.select){
                    for(let j =0;j<i.list.length;j++){
                        if(j == index){
                            data.splice(index, 1);
                        }
                    }
                }
            }
        },
        Upload(file){
            console.log(file)
            //区分上传的哪张图片
            let imgIndex = file.data.index
            let imgPosition = file.data.position
            let imgType = file.data.type
            var fileObj = file.file;
            var imgSubType = file.data.subType
            // FormData 对象
            var form = new FormData();
            // 请求参数
            form.append("file", fileObj);
            form.append("suffix", file.file.type.split('/')[1]);
            form.append("perpetual", true);
            ossUpload(form).then(res =>{
                let _from = this.form
                 for(var i = 0;i<this.appIndexPageModuleGetter.length;i++){
                    if(this.appIndexPageModuleGetter[i].type === imgType && i == imgPosition){
                        if(this.appIndexPageModuleGetter[i].list){
                            if(imgType == 'footNavigation'){
                                console.log(this.appIndexPageModuleGetter[i].list)
                                console.log(imgSubType)
                                this.appIndexPageModuleGetter[i].list[imgIndex][imgSubType] = res.data.body.url
                            }else{
                                this.appIndexPageModuleGetter[i].list[imgIndex].imgSrc = res.data.body.url
                            }
                        }else{
                            this.appIndexPageModuleGetter[i].imgSrc = res.data.body.url
                        }
                        return
                    }
                }
            })
        },
        handleMoveTop(data){
            this.$store.commit('moveUpModuleItemMutation',data)
        },
        handleMoveDown(data){
            this.$store.commit('moveDownModuleItemMutation',data)
        }
    },
    created(){
    },
    computed:{
        ...mapGetters([
         'appIndexEditBoxTypeGetter','appIndexPageModuleGetter'
        ])
    },
    watch:{
        "appIndexEditBoxTypeGetter"(newVal,oldVal){
           switch (newVal.data.type){
                case "textPage":
                    this.title = "文本"
                    break;
                case "vituralCard":
                    this.title = "虚拟卡片"
                    break;
                case "homeModuleAdvert":
                    this.title = "功能入口"
                    break;
                case "homeModuleNotice":
                    this.title = "消息中心"
                    break;
                case "textPage":
                    this.title = "文本"
                    break;
                case "textPage":
                    this.title = "公告"
                    break;
                case "homeModuleRollPic":
                    this.title = "轮播图"
                    break;
                case "homeModuleOnePic":
                    this.title = "单图片"
                    break;
                case "homeModuleTwoPic":
                    this.title = "双图片"
                    break;
                case "homeModuleLeft":
                    this.title = "左对齐"
                    break;
                case "homeModuleTwoItem":
                    this.title = "两个商品"
                    break;
                case "homeModuleThreeItem":
                    this.title = "三个商品"
                    break;
                case "homeModuleRollItem"  :
                    this.title = "商品滚动"
                    break;
                case "footNavigation":
                    this.title = "底部导航"
                    break;
           }
              
        }
    }
}
</script>
<style lang="scss">
    .fl{
        float: left;
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
    .inlinne-block{
        display: inline-block;
    }
    .des{
        color: #F56C6C;
        line-height: 1;
        margin:0;
    }
    .notice-length{
        position: absolute;
        bottom: 0;
        right:10px;
        font-size: 12px;
    }
    .img-upload-box{
        height: 60px;
        // line-height: 60px;
        background: rgba(249, 249, 249, 1);
        padding:0 5px;
        margin-bottom: 10px;
        .arrow{
            padding: 0;
            margin: 0;
            height: 30px;
            line-height: 30px;
            font-size: 20px;
            color:#999;
            cursor: pointer;
        }  
    }
    .img-box{
        margin-right: 10px;
        margin-left: 10px;
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 60px;
            height: 60px;
            line-height: 60px;
            text-align: center;
        }
        .avatar {
            width: 60px;
            height: 60px;
            display: block;
        }
    }
    .input-box{
        margin-top: 10px;
        width: 300px;
        margin-right: 10px;
    }
    .delete-btn{
        font-size: 32px;
        line-height: 60px;
        color:#666 !important;
        cursor: pointer;
        float: left;;
    }
 </style>

 