import { storageSVC } from '@/services/storage.service';
import { internalSVC } from '@/services/internal.service';
import { IsSafari } from '@/utils';

export default {
	namespaced: true,
	state: {
		geo: storageSVC.get('geo') || null,
		annotations: [],
		posts: { greece: [], global: [] }
	},
	getters: {
		geo: state => state.geo,
		annotations: state => state.annotations,
		posts: state => state.posts
	},
	mutations: {
		setGeo (state, data) {
			state.geo = data;
		},
		setAnnotations (state, data) {
			state.annotations = data;
		},
		setPosts (state, data) {
			state.posts = data;
		}
	},
	actions: {
		async getGeo ({ commit }) {
			try {
				const res = await internalSVC.getGeo();
				if (!IsSafari()) storageSVC.set('geo', res);
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
		},
		async getPosts ({ commit }) {
			try {
				const res = await internalSVC.getPosts();
				commit('setPosts', res);
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		}
	}
};
