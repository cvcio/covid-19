import Vue from 'vue';
import Vuex from 'vuex';
import { json, csv } from 'd3';
import { sumBy, maxBy, map, groupBy, orderBy, find, filter } from 'lodash';

import { storage } from '@/services/storage';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		worldGeoJson: storage.get('worldGeoJson') || null,
		greeceGeoJson: null,
		countries: null,
		countriesMapping: null,

		cases: null,
		deaths: null,
		recovered: null,
		greece: null,
		greeceTimeline: null,

		countCases: 0,
		countDeaths: 0,
		countRecovered: 0,
		countCritical: 0,

		countCasesGR: 0,
		countDeathsGR: 0,
		countRecoveredGR: 0,
		countCriticalGR: 0,

		byCountry: null,
		byCountryCases: null,
		byCountryDeaths: null,
		byCountryRecovered: null,
		byCountryCritical: null,

		lastUpdatedAt: null,
	},
	getters: {
		worldGeoJson: state => state.worldGeoJson,
		greeceGeoJson: state => state.greeceGeoJson,
		countries: state => state.countries,
		countriesMapping: state => state.countriesMapping,

		cases: state => state.cases,
		deaths: state => state.deaths,
		recovered: state => state.recovered,
		greece: state => state.greece,
		greeceTimeline: state => state.greeceTimeline,

		countCases: (state) => {
			return sumBy(state.cases, (m) => {
				return parseInt(m[Object.keys(m)[Object.keys(m).length - 1]]);
			});
		},
		countDeaths: (state) => {
			return sumBy(state.deaths, (m) => {
				return parseInt(m[Object.keys(m)[Object.keys(m).length - 1]]);
			});
		},
		countRecovered: (state) => {
			return sumBy(state.recovered, (m) => {
				return parseInt(m[Object.keys(m)[Object.keys(m).length - 1]]);
			});
		},
		countCritical: () => {
			return 0;
		},

		countCasesGR: (state) => {
			return sumBy(filter(state.greeceTimeline, ['Status', 'total cases']), (m) => {
				return parseInt(m[Object.keys(m)[Object.keys(m).length - 1]]);
			});
		},
		countDeathsGR: (state) => {
			return sumBy(filter(state.greeceTimeline, ['Status', 'deaths']), (m) => {
				return parseInt(m[Object.keys(m)[Object.keys(m).length - 1]]);
			});
		},
		countRecoveredGR: (state) => {
			return sumBy(filter(state.greeceTimeline, ['Status', 'revovered']), (m) => {
				return parseInt(m[Object.keys(m)[Object.keys(m).length - 1]]);
			});
		},
		countCriticalGR: () => {
			return 0;
		},

		byCountry: (state) => {
			return orderBy(map(groupBy(state.cases, m => m['Country/Region']), (v, k) => {
				const key = Object.keys(v[0])[Object.keys(v[0]).length - 1];
				return {
					country: k,
					count: sumBy(v, m => parseInt(m[key])),
					cases: sumBy(v, m => parseInt(m[key])),
					deaths: sumBy(filter(state.deaths, ['Country/Region', k]), m => parseInt(m[key])),
					recovered: sumBy(filter(state.recovered, ['Country/Region', k]), m => parseInt(m[key])),
				};
			}), ['count'], ['desc']);
		},
		byCountryCases: (state) => {
			return orderBy(map(groupBy(state.cases, m => m['Country/Region']), (v, k) => {
				const key = Object.keys(v[0])[Object.keys(v[0]).length - 1];
				return {
					country: k,
					count: sumBy(v, m => parseInt(m[key]))
				};
			}), ['count'], ['desc']);
		},
		byCountryDeaths: (state) => {
			return orderBy(map(groupBy(state.deaths, m => m['Country/Region']), (v, k) => {
				const key = Object.keys(v[0])[Object.keys(v[0]).length - 1];
				return {
					country: k,
					count: sumBy(v, m => parseInt(m[key]))
				};
			}), ['count'], ['desc']);
		},
		byCountryRecovered: (state) => {
			return orderBy(map(groupBy(state.recovered, m => m['Country/Region']), (v, k) => {
				const key = Object.keys(v[0])[Object.keys(v[0]).length - 1];
				return {
					country: k,
					count: sumBy(v, m => parseInt(m[key]))
				};
			}), ['count'], ['desc']);
		},

		lastUpdatedAt: (state) => {
			if (!state.cases) return null;
			let lastEntry = Object.keys(state.cases[0])[Object.keys(state.cases[0]).length - 1].split('/');

			let date = new Date();
			date.setYear(`20${lastEntry[2]}`);
			date.setMonth(lastEntry[0] - 1);
			date.setDate(lastEntry[1]);

			return date;
		}
	},
	mutations: {
		set_worldGeoJson (state, data) {
			storage.set('worldGeoJson', data);
			state.worldGeoJson = data;
		},
		set_greeceGeoJson (state, data) {
			state.greeceGeoJson = data;
		},
		set_countries (state, data) {
			state.countries = data;
		},
		set_countriesMapping (state, data) {
			state.countriesMapping = data;
		},
		set_cases (state, data) {
			state.cases = data;
		},
		set_deaths (state, data) {
			state.deaths = data;
		},
		set_recovered (state, data) {
			state.recovered = data;
		},
		set_greece (state, data) {
			state.greece = data;
		},
		set_greeceTimeline (state, data) {
			state.greeceTimeline = data;
		}
	},
	actions: {
		async fetchStaticData ({ commit, state }, data) {
			if (state[data.key] !== null) return;
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
	}
});
