'use strict'
import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions.js'
import mutations from './mutations.js'
import getters from './getters.js'
import goods from './modules/goods.js'

Vue.use(Vuex)

const state = {
  userInfo: null,
  token: true
}

export default new Vuex.Store({
  modules: {
    goods: goods
  },
  state,
  getters,
  actions,
  mutations
})
