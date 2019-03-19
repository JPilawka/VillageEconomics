import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    max_people: 10,
    available_people: 10,
    warehouse:[],
    buildings: [],
    map: [],
    village_name: "Village name",
    food: 0,
    points: 0,
    coins: 0
  },
  mutations: {

  },
  actions: {

  }
})
