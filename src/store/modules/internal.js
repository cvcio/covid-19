import { storageSVC } from '@/services/storage.service';
import { internalSVC } from '@/services/internal.service';
import { isChrome } from '@/utils';
import { parse } from 'zipson';
// import { stringify } from 'zipson';

export default {
	namespaced: true,
	state: {
		geoc: storageSVC.get(`encoded_regionalUnitsC-v${process.env.VUE_APP_VERSION}`) || null,
		geov: storageSVC.get(`encoded_regionalUnitsV-v${process.env.VUE_APP_VERSION}`) || null,
		geom: storageSVC.get(`encoded_municipalities-v${process.env.VUE_APP_VERSION}`) || null,
		annotations: [],
		posts: { greece: [] },
		description: { }
	},
	getters: {
		geoc: state => state.geoc,
		geov: state => state.geov,
		geom: state => state.geom,
		annotations: state => state.annotations,
		posts: state => state.posts,
		description: state => state.description
	},
	mutations: {
		setGeoC(state, data) {
			state.geoc = parse(data);
			//  try {
			//   const _encoded = stringify(data)
			//   console.log(_encoded)
			//   state.geo = parse(_encoded);
			//   console.log(state.geo)
			//  } catch (error) { console.log("error in parse"); console.log(error) }
		},
		setGeoV(state, data) {
			state.geov = parse(data);
			//  try {
			//   const _encoded = stringify(data)
			//   console.log(_encoded)
			//   state.geo = parse(_encoded);
			//   console.log(state.geo)
			//  } catch (error) { console.log("error in parse"); console.log(error) }
		},
		setGeoM(state, data) {
			state.geom = parse(data);
			// try {
			// 	const _encoded = stringify(data)
			// 	console.log(_encoded)
			// 	state.geo = parse(_encoded);
			// 	console.log(state.geo)
			// } catch (error) { console.log("error in parse"); console.log(error) }
		},
		setAnnotations(state, data) {
			state.annotations = data;
		},
		setPosts(state, data) {
			state.posts = data;
		},
		setDescription(state, data) {
			state.description = data;
		}
	},
	actions: {
		async getGeoRegionalUnitsC({ commit }) {
			try {
				if (typeof window.localStorage !== 'undefined') {
					if (storageSVC.get('geo') !== null) {
						storageSVC.remove('geo');
					}
					if (storageSVC.get('geo-2.1.0') !== null) {
						storageSVC.remove('geo-2.1.0');
					}
					if (storageSVC.get('geo-2.2.0') !== null) {
						storageSVC.remove('geo-2.2.0');
					}
					if (storageSVC.get('encoded_regionalUnits-v3.0.0') !== null) {
						storageSVC.remove('encoded_regionalUnits-v3.0.0');
					}
				}
				const res = await internalSVC.getGeoRegionalUnitsC();

				// if (isChrome() && typeof window.localStorage !== 'undefined') storageSVC.set(`encoded_regionalUnitsC-v${process.env.VUE_APP_VERSION}`, res);
				commit('setGeoC', res);
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		},
		async getGeoRegionalUnitsV({ commit }) {
			try {
				if (typeof window.localStorage !== 'undefined') {
					if (storageSVC.get('geo') !== null) {
						storageSVC.remove('geo');
					}
					if (storageSVC.get('geo-2.1.0') !== null) {
						storageSVC.remove('geo-2.1.0');
					}
					if (storageSVC.get('geo-2.2.0') !== null) {
						storageSVC.remove('geo-2.2.0');
					}
					if (storageSVC.get('encoded_regionalUnits-v3.0.0') !== null) {
						storageSVC.remove('encoded_regionalUnits-v3.0.0');
					}
				}
				const res = await internalSVC.getGeoRegionalUnitsV();

				// if (isChrome() && typeof window.localStorage !== 'undefined') storageSVC.set(`encoded_regionalUnitsV-v${process.env.VUE_APP_VERSION}`, res);
				commit('setGeoV', res);
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		},
		async getGeoMunicipalities({ commit }) {
			try {
				if (typeof window.localStorage !== 'undefined') {
					if (storageSVC.get('geo') !== null) {
						storageSVC.remove('geo');
					}
					if (storageSVC.get('geo-2.1.0') !== null) {
						storageSVC.remove('geo-2.1.0');
					}
					if (storageSVC.get('geo-2.2.0') !== null) {
						storageSVC.remove('geo-2.2.0');
					}
					if (storageSVC.get('geom-2.2.1') !== null) {
						storageSVC.remove('geom-2.2.1');
					}
					if (storageSVC.get('encoded_municipalities-v3.0.0') !== null) {
						storageSVC.remove('encoded_municipalities-v3.0.0');
					}
				}
				const res = await internalSVC.getGeoMunicipalities();

				// if (isChrome() && typeof window.localStorage !== 'undefined') storageSVC.set(`encoded_municipalities-v${process.env.VUE_APP_VERSION}`, res);
				commit('setGeoM', res);
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		},
		async getAnnotations({ commit }) {
			try {
				const res = await internalSVC.getAnnotations();
				commit('setAnnotations', res);
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		},
		async getPosts({ commit }) {
			try {
				const res = await internalSVC.getPosts();
				commit('setPosts', res);
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		},
		async getDescription({ commit }) {
			try {
				const res = await internalSVC.getDescription();
				commit('setDescription', res);
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		}
	}
};
