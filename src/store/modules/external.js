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
		async getRegionalUnitsDataByYear ({ commit }, payload) {
			try {
				const res = await externalSVC.getRegionalUnitsDataByYear(payload);
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		},

		async getVaccinationsDataByYear ({ commit }, payload) {
			try {
				const res = await externalSVC.getVaccinationsDataByYear(payload);
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		},

		async getRegionalUnitsData ({ commit }, payload) {
			try {
				const res = await externalSVC.getRegionalUnitsData(payload);
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		},

		async getMunicipalitiesData () {
			try {
				const res = await externalSVC.getMunicipalitiesData();
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		},

		async getDemographicsData ({ commit }, payload) {
			try {
				const res = await externalSVC.getDemographicsData(payload);
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		},

		async getTimelineData ({ state, commit }, payload) {
			try {
				const res = await externalSVC.getTimelineData(payload);

				if (res[res.length - 1].date && !state.lastUpdateAt) {
					commit('setLastUpdatedAt', res[res.length - 1].date, { root: true });
				}
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		},

		async getVaccinationsDataGroupByRegionalUnit ({ commit }, payload) {
			try {
				const res = await externalSVC.getVaccinationsDataGroupByRegionalUnit(payload);
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		},

		async getVaccinationsDataGroupByDate ({ commit }, payload) {
			try {
				const res = await externalSVC.getVaccinationsDataGroupByDate(payload);
				return res;
			} catch (error) {
				commit('errors/REQUEST_ERROR', error, { root: true });
				return false;
			}
		}
	}
};
