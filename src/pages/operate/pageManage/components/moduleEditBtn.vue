<template>
    <div class="module-edit-btn" v-if="visiable">
        <span class="el-icon-setting" @click="handleSettingClick"></span>
        <span class="el-icon-caret-top" @click="handleMoveUpClick"></span>
        <span class="el-icon-caret-bottom" @click="handleMOveDownClick"></span>
        <span class="el-icon-delete" @click="handleDeleteClick"></span>
    </div>
</template>
<script>
export default {
    props:["visiable","contentData","index"], 
    name:"ModuleEditBtnComponent",
    data(){
        return {
           
        }
    },
    methods:{
        handleSettingClick(){
           this.$store.commit("appIndexEditBoxTypeMutation",{index:this.index,data:this.contentData})
        },
        handleMoveUpClick(){
            this.$store.commit('moveUpIndexPageModuleMutation',{index:this.index,data:this.contentData})
        },
        handleMOveDownClick(){
            this.$store.commit('moveDownIndexPageModuleMutation',{index:this.index,data:this.contentData})
        },
        handleDeleteClick(){
            this.$store.commit('deleteIndexPageModuleMutation',{index:this.index,data:this.contentData})
        }
    }
}
</script>
<style lang="scss" scoped>
    .module-edit-btn{
        position: absolute;
        width: 30px;
        height: auto;
        right: -30px;
        top: 0px;
        line-height: 1;
        background: #fff;
        padding-left: 8px;
        font-size: 16px;
        color:#909399;
        z-index: 100;
        span{
            cursor: pointer;
        }
    }
</style>

