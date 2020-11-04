import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		locale: {},
		sidebar: true
	},
	getters: {
		locale: state => state.locale,
		sidebar: state => state.sidebar
	},
	mutations: {
		setLocale (state, playload) {
			state.locale = playload;
		},
		setSidebar (state, playload) {
			state.sidebar = playload;
		}
	},
	actions: {
		setLocale ({ commit }, playload) {
			commit('setLocale', playload);
		},
		setSidebar ({ commit }, playload) {
			commit('setSidebar', playload);
		}
	}
});
