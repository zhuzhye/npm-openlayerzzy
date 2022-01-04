import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ships: []
  },
  mutations: {
    addship(state, shipsdata) {
      state.ships = shipsdata
    }
  },
  actions: {
  },
  getters: {
    shipsId(state) {
      let ids = []
      state.ships.forEach(item => {
        ids.push(item.id)
      })
      return ids
    }
  },
  modules: {
  }
})
