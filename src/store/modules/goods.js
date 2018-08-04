const state = {
  edit_goods: ''
}

const mutations = {
  setEditGoods (state, data) {
    state.edit_goods = data
  }
}

const actions = {
  editGoods ({commit}, goodsData) {
    commit('setEditGoods', goodsData)
  }
}

const getters = {
  edit_goods: (state) => {
    return state.edit_goods
  }
}

export default{
  state,
  mutations,
  actions,
  getters
}
