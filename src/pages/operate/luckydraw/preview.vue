<template>
    <div class="preview-wrap" :style="{ background:'#'+getLuckyDrawPageDetailGetter.pageBgColor }">
        <div class="nav-bar">
            {{getLuckyDrawPageDetailGetter.pageTitle}}
        </div>
        <div class="banner">
            <img :src="getLuckyDrawPageDetailGetter.bannerImg" alt="" v-if="getLuckyDrawPageDetailGetter.bannerImg">
            <img src="./images/no-content-1.png" alt="" v-else>
        </div>
        <div class="content" :style="{backgroundImage:'url('+  getLuckyDrawPageDetailGetter.luckyDrawBgImg+')'}">
            <p class="remain">您今日还有  <span>3</span> 次抽奖机会</p>
            <ul class="prize">
                <li class="prize-item" v-for="(val,index) in getLuckyDrawPageDetailGetter.prizeList" :key='index'>
                    <img :src="val.prizeImg" alt="">
                </li>
            </ul>
        </div>
        <div class="winner" v-if="getLuckyDrawPageDetailGetter != {}">
            <div class="fl">
                <span class="icon"></span>
                <span class="user">138******1234</span>
            </div>
            <div class="fr">
                抽中首期5折免息券   
            </div>
        </div>
        <div class="btn-wrap">
            <a class="btn fl" href="javascript:void(0)" style="margin-right:24px;">
                <img :src="getLuckyDrawPageDetailGetter.activityRuleBgImg" alt="" v-if="getLuckyDrawPageDetailGetter.activityRuleBgImg">
                <span v-else>活动规则</span>
            </a>
            <a class="btn fl" href="javascript:void(0)">
                <img :src="getLuckyDrawPageDetailGetter.prizeWinningRecordImg" alt="" v-if="getLuckyDrawPageDetailGetter.prizeWinningRecordImg"
                >
                <span v-else>中奖纪录</span>
            </a>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    img{
        width: 100%;
        height: 100%;
    }
    ul,li{
        margin:0;
        padding:0;
    }
    .fl{
        float: left;
    }
    .fr{
        float:right;
    }
    .preview-wrap{
        width: 375px;
        height: auto;
        background:#fff;
        padding-bottom: 30px;
        .nav-bar{
            height: 64px;
            background: url("images/nav_bar.png") no-repeat;
            background-size: contain;
            text-align: center;
            line-height: 80px;
            color: #111111;
            font-size: 18px;
        }
        .banner{
            width: 375px;
            height: 175px;
        }
        .content{
            width: 328px;
            height: 312px;
            background-size: contain;
            margin:0 auto;

            .remain{
                font-size: 15px;
                color:#fff;
                text-align: center;
                margin-top: 7px;
                margin-bottom: 18px;
                span{
                    // color:#f7ec3e;
                    font-size: 18px;
                }
            }
            .prize{
                width: 301px;
                height: 256px;
                margin: 0 auto;
                padding-top: 3px;
                padding-left: 5px;
                .prize-item{
                    width: 96px;
                    height: 81px;
                    float: left;
                    margin-right: 2px;
                    margin-bottom: 3px;
                    cursor: pointer;
                }
            }
        }
        .winner{
            height: 45px;
            line-height: 45px;
            color:#fff;
            font-size: 12px;
            padding: 0 24px;
            .fl{
                padding-left: 3px;
                .icon{
                    width: 12px;
                    height: 13px;
                    display: inline-block;
                    margin-left: 6px;
                }
                .user{
                    color: #ffd583;
                }
            }
            .fr{
                padding-right: 14px;
            }
        }
        .btn-wrap{
            height: 41px;
            padding:0 24px;
            .btn{
                width: 150px;
                height: 41px;
            }
        }
    }
    
   
</style>
<script>
import { mapGetters } from 'vuex'
export default {
    name:"PreviewLuckyDraw",
    data(){
        return {
            prizeList:[]
        }
    },
    created(){
        if(this.$route.query.type == 'edit' && this.$route.query.id){
            this.$store.dispatch('getLuckyDrawPageDetailAction',{"luckyDrawPageId":this.$route.query.id})
        }else{
            this.$store.commit("updateLuckyDrawPageMutation",{})
        }

    },
    computed: {
        ...mapGetters([
            'getLuckyDrawPageDetailGetter'
        ])
    }
}
</script>

