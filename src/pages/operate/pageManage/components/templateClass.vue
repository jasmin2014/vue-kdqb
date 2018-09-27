<template>
    <div>
        <h4 class="template-class"><span class="el-icon-caret-bottom"></span>通用类</h4>
        <div class="template-content template-content-1">
            <div class="template-img">
            </div>
            <p class="template-title">虚拟卡片</p>
        </div>
            <div class="template-content template-content-2"  >
            <div class="template-img" style="height:15px;">
                <img src="@/assets/imgs/icon-template-lbt.png" alt="">
            </div>
            <p class="template-title">功能入口</p>
        </div>
            <div class="template-content template-content-3">
            <div class="template-img"><img src="@/assets/imgs/icon-template-anucement.png" alt=""></div>
            <p class="template-title">公告</p>
        </div>
        <h4 class="template-class"><span class="el-icon-caret-bottom"></span>营销类</h4>
            <div class="template-content template-content-4">
            <div class="template-img"><img src="@/assets/imgs/icon-template-lbt.png" alt=""></div>
            <p class="template-title">轮播图</p>
        </div>
        <div class="template-content template-content-5">
            <div class="template-img"></div>
            <p class="template-title">单图片</p>
        </div>
        <div class="template-content template-content-6">
            <div class="template-img" style="width:17px"></div>
            <div class="template-img" style="width:17px;"></div>
            <p class="template-title">双图片</p>
        </div>
        <div class="template-content template-content-7">
            <div class="template-img"><img src="@/assets/imgs/icon-template-text.png" alt=""></div>
            <p class="template-title">文本</p>
        </div>
        <h4 class="template-class"><span class="el-icon-caret-bottom"></span>商品展示</h4>
        <div class="template-content template-content-5">
            <div class="template-img"  style="background:#fff;">
                <img src="@/assets/imgs/icon-template-zdq.png" alt="">
            </div>
            <p class="template-title">左对齐</p>
        </div>
        <div class="template-content template-content-5">
            <div class="template-img">
                <img src="@/assets/imgs/icon-template-lgsp.png" alt="">
            </div>
            <p class="template-title">两个宝贝</p>
        </div>
        <div class="template-content template-content-5">
            <div class="template-img">
                <img src="@/assets/imgs/icon-template-sgsp.png" alt="">
            </div>
            <p class="template-title">三个宝贝</p>
        </div>
        <div class="template-content template-content-5">
            <div class="template-img">
                <img src="@/assets/imgs/icon-template-gdzs.png" alt="">
            </div>
            <p class="template-title">轮动展示</p>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .template-class{
        font-size: 14px;
        color:#303133;
        border: 0 none;
        span{
            border:0 none;
        }
    }
    .template-content{
        padding-left: 24px;
        // display: inline-block;
        margin-bottom: 20px;
        .template-title{
            color:#303133;
            font-size: 12px;
            text-align: left;
            margin: 0;
            line-height: 24px;
        }
        .template-img{
            width:35px;
            height: 25px;
            text-align: center;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
    .template-content-1,.template-content-5,.template-content-6{
         .template-img{
            background: #8a8a8a;
        }
    }
    .template-content-2{
        .template-img{
            // height: 25px;
            // background: #8a8a8a;
        }
    }
    .template-content-5{
        .template-img{
            height: 30px;
        }
    }
    .template-content-6{
        .template-img{
            display: inline-block;
            height: 30px;
            width:30px;
        }
    }
    .tempalte-view{
        margin-left: 30px;;
        height: 1000px;
        border: 3px solid #999;
    }
</style>
<script>
export default {
    name:"TemplateClass"
}
</script>
