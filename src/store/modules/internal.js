import { storageSVC } from '@/services/storage.service';
import { internalSVC } from '@/services/internal.service';

export default {
	namespaced: true,
	state: {
		geo: storageSVC.get('geo') || null
	},
	getters: {
		geo: state => state.geo
	},
	mutations: {

	},
	actions: {
		async getGeo ({ commit }) {
			try {
				const res = await internalSVC.getGeo();
				storageSVC.set('geo', res);
				console.log(res);
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		}
	}
};
