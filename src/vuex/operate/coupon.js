import {getShopInfoList, getChannelList} from '@/api/operate'
const state = {
  shopMap: {},
  channelMap: {}
}

const getters = {

}

const mutations = {
  saveShop(state, datamap) {
    state.shopMap = datamap
  },
  saveChannel(state, datamap) {
    state.channelMap = datamap
  }
}

const actions = {
    initShopChannelOptions({commit}) {
      getShopInfoList({pageSize: 100, pageNum: 1}).then(res => {
        if(res.data.code == '200') {
          let obj = {}
          res.data.body.content.forEach(i => { 
            obj[i.shopCode] = i.shopName
          })
          commit('saveShop', obj)
        }
      })
      getChannelList({pageSize: 100, pageNum: 1}).then(res => {
        if(res.data.code == '200') {
          let obj = {}
          res.data.body.content.forEach(i => { 
            obj[i.channelCode] = i.channelName
          })
          commit('saveChannel', obj)
        }
      })
    }
}

export default {
  state,
  getters,
  mutations,
  actions
}
