// 该文件用于创建Vuex中的核心store

import Vue from 'vue'
import Vuex from 'vuex'

//使用Vuex插件
Vue.use(Vuex)
//准备actions--用于响应组件中的动作
const actions={}
//准备mutations--用于操作数据（state）
const mutations={

}

//准备state--用于存储数据
const state={
  // 当前激活的流程:描述符树构建为1，描述符树选取为2
    localActive:"1",
    Score:[],
    SelectScore:[]
}

//创建并导出store
export default new Vuex.Store({
  actions:actions,
  mutations:mutations,
  state:state
})

