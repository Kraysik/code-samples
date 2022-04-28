import Vue from 'vue';
import Vuex from 'vuex';

import tournaments from "@/Vuex/modules/tournaments";

Vue.use(Vuex)
const store = new Vuex.Store({
    modules: {
        tournaments,
    }
})

export default store;
