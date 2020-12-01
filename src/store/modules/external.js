import { externalSVC } from '@/services/external.service';

export default {
	namespaced: true,
	state: {
		mapData: []
	},
	getters: {
		mapData: state => state.mapData
	},
	mutations: {
		setMapData (state, data) {
			state.mapData = data;
		}
	},
	actions: {
		async getMapData ({ commit }, playload) {
			try {
				const res = await externalSVC.getMapData(playload);
				commit('setMapData', res);

				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		},
		async getGreeceTotal ({ state, commit }, playload) {
			try {
				const res = await externalSVC.getGreeceTotal(playload);
				if (res[0].last_updated_at && !state.lastUpdateAt) {
					commit('setLastUpdatedAt', res[0].last_updated_at, { root: true });
				}
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		},
		async getGlobalTotal ({ commit }, playload) {
			try {
				const res = await externalSVC.getGlobalTotal(playload);
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		},
		async getGlobal ({ commit }, playload) {
			try {
				const res = await externalSVC.getGlobal(playload);
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		},

		async getGreeceAGG ({ commit }, playload) {
			try {
				const res = await externalSVC.getGreeceAGG(playload);
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		},

		async getGlobalAGG ({ commit }, playload) {
			try {
				const res = await externalSVC.getGlobalAGG(playload);
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		}
	}
};
