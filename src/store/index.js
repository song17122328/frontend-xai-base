// 该文件用于创建Vuex中的核心store

import Vue from 'vue'
import Vuex from 'vuex'

//使用Vuex插件
Vue.use(Vuex)
//准备actions--用于响应组件中的动作
const actions={}
//准备mutations--用于操作数据（state）
const mutations={
  updateFusionTree(state, data) {
    state.FusionTree = data;
  },
  updateRedundancyEliminationTree(state, data) {
    state.RedundancyEliminationTree = data;
  }
}

//准备state--用于存储数据
const state={
  FusionTree:{},
  //冗余消除树RETree。RE:Redundancy Elimination,
  RedundancyEliminationTree:{}
}

//创建并导出store
export default new Vuex.Store({
  actions:actions,
  mutations:mutations,
  state:state
})

