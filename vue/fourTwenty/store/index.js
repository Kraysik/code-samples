import Vue from 'vue';
import Vuex from 'vuex';
import tickets from '@/store/modules/tickets';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    tickets,
  }
});
