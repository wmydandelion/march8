import Vue from 'vue';
import VueX from 'vuex'
Vue.use(VueX)

const state = {
    title: 'movie',
    bgColor: 'rgb(33,150,243)',
    btn: '首页',
    photoData: []
}
const mutations = {
    changeTitle(state, status) {
        state.title = status[0];
        state.bgColor = status[1];
        state.btn = status[2];
    },
    changeData(states, status) {
        state.photoData = status;
    }
}

const actions = {
    changeTitle: ({ commit }, status) => commit('changeTitle', status),
    changeData: ({ commit }, { status }) => commit('changeData', 'status')
}

const getters = {}
export default new VueX.Store({
    state,
    mutations,
    actions,
    getters
});