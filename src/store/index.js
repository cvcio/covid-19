import Vue from 'vue';
import Vuex from 'vuex';
import modules from '@/store/modules';
import { getLocale } from '@/locale';
import moment from 'moment';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		locale: {},
		sidebar: false,
		loading: false,
		empty: false,
		view: 'greece',
		lastUpdatedAt: null,
		embedDialog: false,
		embed: {}
	},
	getters: {
		locale: state => state.locale,
		sidebar: state => state.sidebar,
		loading: state => state.loading,
		empty: state => state.empty,
		view: state => state.view,
		lastUpdatedAt: state => state.lastUpdatedAt,
		embedDialog: state => state.embedDialog,
		embed: state => state.embed
	},
	mutations: {
		setLocale (state, data) {
			moment.locale(data.code);
			state.locale = data;
		},
		setSidebar (state, data) {
			state.sidebar = data;
		},
		setLoading (state, data) {
			state.loading = data;
		},
		setEmpty (state, data) {
			state.empty = data;
		},
		setView (state, data) {
			state.view = data;
		},
		setLastUpdatedAt (state, data) {
			state.lastUpdatedAt = data;
		},
		setEmbedDialog (state, data) {
			state.embedDialog = data;
		},
		setEmbed (state, data) {
			state.embed = data;
		}
	},
	actions: {
		setLocale ({ commit }, playload) {
			commit('setLocale', typeof playload === 'string' ? getLocale(playload) : playload);
		},
		setSidebar ({ commit }, playload) {
			commit('setSidebar', playload);
		},
		setView ({ commit }, playload) {
			commit('setView', playload);
		}
	},
	modules
});
