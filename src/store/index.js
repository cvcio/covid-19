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
		view: 'greece'
	},
	getters: {
		locale: state => state.locale,
		sidebar: state => state.sidebar,
		loading: state => state.loading,
		empty: state => state.empty,
		view: state => state.view
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

/*
import { json, csv } from 'd3';
import { storageSVC } from '@/services/storage.service';

Vue.use(Vuex);

function IsSafari () {
	var is_safari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
	return is_safari;
}

export default new Vuex.Store({
	state: {
		locale: {},
		sidebar: true,
		geo: storageSVC.get('geo') || null
	},
	getters: {
		locale: state => state.locale,
		sidebar: state => state.sidebar,
		geo: state => state.geo,
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
		},
		async fetchStaticData ({ commit, state }, data) {
			if (!IsSafari() && state[data.key] !== null) return;
			return json(data.file)
				.then(f => {
					commit(`set_${data.key}`, f);
					return f;
				})
				.catch(err => {
					console.log(`Error while fetching Static File ${data.key}: ${err}`);
					return err;
				});
		},
		async fetchDynamicData ({ commit }, data) {
			return csv(data.file)
				.then(f => {
					commit(`set_${data.key}`, f);
					return f;
				})
				.catch(err => {
					console.log(`Error while fetching Dynamic File ${data.key}: ${err}`);
					return err;
				});
		},
		async getGEO ({ commit }) {
			try {
				const res = await accountSVC.getOrganization(state.profile.organization);
				storageSVC.set(JSON.stringify('geo', res.data));
				return res;
			} catch (err) {
				// commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		}
	}
});
*/
