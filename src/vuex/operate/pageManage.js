
import { getPageContent ,putPageContent} from "@/api/operate.js" 
import { Notification } from 'element-ui';
const state = {
    appIndexPageModuleData:[],
    appIndexEditBoxType:{
        data:{},
        index:-1,
    }
}
const getters = {
    appIndexPageModuleGetter:state => {
        return state.appIndexPageModuleData
    },
    appIndexEditBoxTypeGetter:state => {
        return state.appIndexEditBoxType
    }
}
const mutations = {
    getIndexPageModuleMutation:(state,data)=>{
        state.appIndexPageModuleData = data.data
    },
    addIndexPageModuleMutation :(state,data)=> {
        state.appIndexPageModuleData.push(data)
    },
    updateIndexPageModuleMutation:(state,data)=>{
        state.appIndexPageModuleData = state.appIndexPageModuleData
        // Notification.success("保存成功")
    }, 
    deleteIndexPageModuleMutation:(state,data)=>{
        for(let i =0;i<state.appIndexPageModuleData.length;i++){
            if(i == data.index){
                state.appIndexPageModuleData.splice(data.index, 1);
                return
            }
        }
    },
    moveUpIndexPageModuleMutation:(state,data)=>{
        for(let i =0;i<state.appIndexPageModuleData.length;i++){
            if(i == data.index){
                if(i == 0 ){
                    return 
                }
                state.appIndexPageModuleData.splice(i, 1);
                state.appIndexPageModuleData.splice(i-1, 0, data.data);
            }
        }
    },
    moveDownIndexPageModuleMutation:(state,data)=>{
        for(let i =0;i<state.appIndexPageModuleData.length;i++){
            if(i == data.index){
                if(i == state.appIndexPageModuleData.length -1){
                    return 
                }
                state.appIndexPageModuleData.splice(i, 1);
                state.appIndexPageModuleData.splice(i+1, 0, data.data);
            }
        }
    },
    appIndexEditBoxTypeMutation:(state,data)=>{
        state.appIndexEditBoxType = data
        for(let i =0;i<state.appIndexPageModuleData.length;i++){
            state.appIndexPageModuleData[i].select = false
            if(i == data.index && state.appIndexPageModuleData[i].type == data.data.type){
                state.appIndexPageModuleData[i].select = true
                // return
            }
        }
    },
    moveUpModuleItemMutation:(state,data) =>{
        for(let i =0;i<state.appIndexPageModuleData.length;i++){
            if(state.appIndexEditBoxType.index == i && state.appIndexEditBoxType.data.type == state.appIndexPageModuleData[i].type){
                for(let j in state.appIndexPageModuleData[i].list){
                    if(j == data.index){
                        if(j == 0){
                            return
                        }
                        state.appIndexPageModuleData[i].list.splice(Number(j), 1);
                        state.appIndexPageModuleData[i].list.splice(Number(j)-1, 0, data.val);
                    }
                }
            }
        }
    },
    moveDownModuleItemMutation:(state,data) =>{
        for(let i =0;i<state.appIndexPageModuleData.length;i++){
            if(state.appIndexEditBoxType.index == i && state.appIndexEditBoxType.data.type == state.appIndexPageModuleData[i].type){
                for(let j in state.appIndexPageModuleData[i].list){
                    if(j == data.index){
                        if(j == state.appIndexPageModuleData[i].list.length -1){
                            return
                        }
                        state.appIndexPageModuleData[i].list.splice(Number(j), 1);
                        state.appIndexPageModuleData[i].list.splice(Number(j)+1, 0, data.val);
                    }
                }
            }
        }
    }
}
const actions = {
    appIndexPageModuleAction:({ commit }, data)=>{
        getPageContent(data).then(res => {
            let  commitData = res.data.items
            if(commitData.length){
                for(let i =0;i<commitData.length;i++){
                    commitData[i].select = false
                }
            }
            commit('getIndexPageModuleMutation', { data: commitData})
        })
    },
    updateIndexPageModuleAction:({commit},data)=>{
        putPageContent(data).then(res => {
            for(let i of data.body){
                i.isNew = false
            }
            commit('updateIndexPageModuleMutation', { data: data.body})
            Notification.success("保存成功")
        })
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}