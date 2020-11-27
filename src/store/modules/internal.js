import { storageSVC } from '@/services/storage.service';
import { internalSVC } from '@/services/internal.service';

export default {
	namespaced: true,
	state: {
		geo: storageSVC.get('geo') || null,
		annotations: []
	},
	getters: {
		geo: state => state.geo,
		annotations: state => state.annotations,
	},
	mutations: {
		setGeo (state, data) {
			state.geo = data;
		},
		setAnnotations (state, data) {
			state.annotations = data;
		}
	},
	actions: {
		async getGeo ({ commit }) {
			try {
				const res = await internalSVC.getGeo();
				storageSVC.set('geo', res);
				commit('setGeo', res);
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		},
		async getAnnotations ({ commit }) {
			try {
				const res = await internalSVC.getAnnotations();
				commit('setAnnotations', res);
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		}
	}
};
