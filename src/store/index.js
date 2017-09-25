import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions' // * as，es6语法
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
// vue的插件，每次修改会打出详细数据
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

// 线上模式不应该用，开发环境用
// 线下调试时debug为true，开启，如果上线用，就应该为false关闭
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug, // 开启严格模式，线下调试时debug为true，开启，如果上线用，就应该为false关闭
  plugins: debug ? [createLogger()] : []
})
