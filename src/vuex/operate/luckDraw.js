import { getLuckyDrawPageDetail } from "@/api/operate.js" 
import { Notification } from 'element-ui';

const state = {
    luckyDrawPageDetail:{
    }
}
const getters = {
    getLuckyDrawPageDetailGetter:state =>{
        if(state.luckyDrawPageDetail.prizeList){
            state.luckyDrawPageDetail.prizeList.splice(4,0,{prizeImg:state.luckyDrawPageDetail.luckyDrawButtonImg})
        }
        return state.luckyDrawPageDetail
    }
}
const mutations = {
    getLuckyDrawPageMutation:(state,data) =>{
        state.luckyDrawPageDetail = data.data
    },
    updateLuckyDrawPageMutation:(state,data)=>{
        state.luckyDrawPageDetail = data
    }
}

const actions = {
    getLuckyDrawPageDetailAction:({commit},data) =>{
        getLuckyDrawPageDetail(data).then(res =>{
            commit('getLuckyDrawPageMutation', { data: res.data.body})
        })
    }
    
}

export default {
    state,
    getters,
    mutations,
    actions
}