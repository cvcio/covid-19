import Vue from 'vue';
import Vuex from 'vuex';
import { json, csv } from 'd3';
import { sumBy, maxBy, map, groupBy, orderBy, find, findIndex, filter, keys, values, mergeWith, merge } from 'lodash';
import * as _ from 'lodash';
import moment from 'moment';
import { storage } from '@/services/storage';
import { reduce } from 'highcharts';

Vue.use(Vuex);

function IsSafari () {
	var is_safari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
	return is_safari;
}

function parseDate (v) {
	if (!v || v === '') return '';
	const dateString = v.split('/');
	return moment(`20${dateString[2]}-${dateString[0]}-${dateString[1]}`, 'YYYY-MM-DD').toDate();
}

export default new Vuex.Store({
	state: {
		loading: true,
		alert: true,
		navStats: true,
		navNews: false,

		dialogAbout: false,
		dialogTerms: false,
		dialogEmbed: false,

		worldGeoJson: storage.get('worldGeoJson') || null,
		greeceGeoJson: storage.get('greeceGeoJson') || null,
		countries: null,
		countriesMapping: null,

		worldPopulation: null,

		globalData: [],
		greeceData: [],

		cases: null,
		deaths: null,
		recovered: null,
		greece: null,
		greeceTimeline: null,

		wom_data: null,

		countCases: 0,
		countDeaths: 0,
		countRecovered: 0,
		countCritical: 0,

		countCasesGR: 0,
		countDeathsGR: 0,
		countHospitalizedGR: 0,
		countRecoveredGR: 0,
		countCriticalGR: 0,

		byCountry: null,
		byCountryCases: null,
		byCountryDeaths: null,
		byCountryRecovered: null,
		byCountryCritical: null,

		lastUpdatedAt: null,
		alerts: null
	},
	getters: {
		loading: state => state.loading,
		alert: state => state.alert,
		navStats: state => state.navStats,
		navNews: state => state.navNews,

		dialogAbout: state => state.dialogAbout,
		dialogTerms: state => state.dialogTerms,
		dialogEmbed: state => state.dialogEmbed,

		worldGeoJson: state => state.worldGeoJson,
		greeceGeoJson: state => state.greeceGeoJson,
		countries: state => state.countries,
		countriesMapping: state => state.countriesMapping,

		worldPopulation: state => state.worldPopulation,

		globalData: state => state.globalData,
		greeceData: state => state.greeceData,

		cases: state => state.cases,
		deaths: state => state.deaths,
		recovered: state => state.recovered,
		greece: state => state.greece,
		greeceTimeline: state => state.greeceTimeline,

		wom_data: state => state.wom_data,

		alerts: state => state.alerts,

		countCases: (state) => {
			return sumBy(state.wom_data, 'totalCases');
		},
		countDeaths: (state) => {
			return sumBy(state.wom_data, 'totalDeaths');
		},
		countRecovered: (state) => {
			return sumBy(state.wom_data, 'totalRecovered');
		},

		countCritical: () => {
			return 0;
		},

		countCasesGR: (state) => {
			return sumBy(state.greece, 'cases');
		},
		countDeathsGR: (state) => {
			return sumBy(state.greece, 'dead');
		},
		countHospitalizedGR: (state) => {
			return sumBy(state.greece, 'hospitalized');
		},
		countRecoveredGR: (state) => {
			return sumBy(state.greece, 'recovered');
		},
		countCriticalGR: (state) => {
			return sumBy(state.greece, 'critical');
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
		set_loading (state, data) {
			state.loading = data;
		},
		set_alert (state, data) {
			state.alert = data;
		},
		set_navStats (state, data) {
			state.navStats = data;
		},
		set_navNews (state, data) {
			state.navNews = data;
		},

		set_dialogAbout (state, data) {
			state.dialogAbout = data;
		},
		set_dialogTerms (state, data) {
			state.dialogTerms = data;
		},
		set_dialogEmbed (state, data) {
			state.dialogEmbed = data;
		},

		set_worldGeoJson (state, data) {
			try {
				storage.set('worldGeoJson', data);
			} catch (err) {
				console.log('Error while saving worldGeoJson on localstorage');
			}
			state.worldGeoJson = data;
		},
		set_greeceGeoJson (state, data) {
			try {
				storage.set('greeceGeoJson', data);
			} catch (err) {
				console.log('Error while saving greeceGeoJson on localstorage');
			}
			state.greeceGeoJson = data;
		},
		set_countries (state, data) {
			state.countries = data;
		},
		set_countriesMapping (state, data) {
			state.countriesMapping = data;
		},

		set_worldPopulation (state, data) {
			data = data.map(m => {
				let idx_m = findIndex(state.countriesMapping, p => {
					return m['Country (or dependency)'] === p.country ||
						m['Country (or dependency)'] === p.country_p ||
						m['Country (or dependency)'] === p.country_w ||
						m['Country (or dependency)'] === p.country_h;
				});
				return {
					country: idx_m > -1 ? state.countriesMapping[idx_m].name_x : m['Country (or dependency)'],
					population: parseInt(m['Population (2020)'])
				};
			});
			state.worldPopulation = data;
		},

		set_globalData (state, data) {
			let cases = map(_.cloneDeep(data.cases), (m, i) => {
				let o = {
					country: m['Country/Region'],
					state: m['Province/State'],
					dates: [],
					cases: []
				};

				delete m['Province/State'];
				delete m['Country/Region'];
				delete m['Lat'];
				delete m['Long'];
				delete m['Status'];

				let kk = keys(m);
				o.dates = map(kk, (n) => {
					return parseDate(n);
				});

				o.cases = map(kk, (n) => {
					return parseInt(m[n]) || 0;
				});

				return o;
			});

			let red_cases = map(groupBy(cases, m => m.country), (v, k) => {
				return {
					country: k,
					dates: v[0].dates,
					cases: v.reduce((r, a) => a.cases.map((b, i) => (r[i] || 0) + b), [])
				};
			});

			let deaths = map(_.cloneDeep(data.deaths), (m, i) => {
				let o = {
					country: m['Country/Region'],
					state: m['Province/State'],
					dates: [],
					deaths: []
				};

				delete m['Province/State'];
				delete m['Country/Region'];
				delete m['Lat'];
				delete m['Long'];
				delete m['Status'];

				let kk = keys(m);
				o.dates = map(kk, (n) => {
					return parseDate(n);
				});

				o.deaths = map(kk, (n) => {
					return parseInt(m[n]) || 0;
				});

				return o;
			});

			let red_deaths = map(groupBy(deaths, m => m.country), (v, k) => {
				return {
					country: k,
					dates: v[0].dates,
					deaths: v.reduce((r, a) => a.deaths.map((b, i) => (r[i] || 0) + b), [])
				};
			});

			let recovered = map(_.cloneDeep(data.recovered), (m, i) => {
				let o = {
					country: m['Country/Region'],
					state: m['Province/State'],
					dates: [],
					recovered: []
				};

				delete m['Province/State'];
				delete m['Country/Region'];
				delete m['Lat'];
				delete m['Long'];
				delete m['Status'];

				let kk = keys(m);
				o.dates = map(kk, (n) => {
					return parseDate(n);
				});

				o.recovered = map(kk, (n) => {
					return parseInt(m[n]) || 0;
				});

				return o;
			});

			let red_recovered = map(groupBy(recovered, m => m.country), (v, k) => {
				return {
					country: k,
					dates: v[0].dates,
					recovered: v.reduce((r, a) => a.recovered.map((b, i) => (r[i] || 0) + b), [])
				};
			});

			let globalData = red_cases.map((v, i) => {
				v.deaths = filter(red_deaths, ['country', v.country])[0].deaths;
				v.recovered = filter(red_recovered, ['country', v.country])[0].recovered;

				let idx_m = findIndex(state.countriesMapping, p => {
					return v.country === p.country ||
						v.country === p.country_p ||
						v.country === p.country_w ||
						v.country === p.country_h;
				});

				v.country = idx_m > -1 ? state.countriesMapping[idx_m].name_x : v.country;
				let idx_p = findIndex(state.worldPopulation, ['country', v.country]);
				v.population = idx_p > -1 ? state.worldPopulation[idx_p].population : 1000000;
				v.totalIndex = v.cases ? v.cases.map(x => {
					return parseFloat(((x / v.population) * 1000000).toFixed(2));
				}) : [];
				return v;
			});

			state.globalData = globalData;
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
			state.greece = map(data, m => {
				m.cases = parseInt(m.cases) || 0;
				m.dead = parseInt(m.dead) || 0;
				m.recovered = parseInt(m.recovered) || 0;
				m.hospitalized = parseInt(m.hospitalized) || 0;
				m.name = m.county_normalized === 'ΕΛΛΑΔΑ' ? m.county : `${m.county}`;
				m.population = parseInt(m.pop_11) || 0;
				m.totalIndex = m.population ? (100000 * m.cases) / (m.population) : 0;
				m.cases_normalized = parseFloat(m.cases_normalized) ||  0;
				return m;
			});
			state.greece = orderBy(state.greece, ['cases', 'asc']);
		},
		set_greeceTimeline (state, data) {
			state.greeceTimeline = data;
		},
		set_wom_data (state, data) {
			data = data.map(m => {
				let idx_m = findIndex(state.countriesMapping, p => {
					return m['Country,Other'] === p.country ||
						m['Country,Other'] === p.country_p ||
						m['Country,Other'] === p.country_w ||
						m['Country,Other'] === p.country_h;
				});
				return {
					country: idx_m > -1 ? state.countriesMapping[idx_m].name_x : m['Country,Other'],
					totalCases: parseInt(m['TotalCases'].replace(',', '')) || 0,
					newCases: parseInt(m['NewCases'].replace(',', '')) || 0,
					totalDeaths: parseInt(m['TotalDeaths'].replace(',', '')) || 0,
					newDeaths: parseInt(m['NewDeaths'].replace(',', '')) || 0,
					totalRecovered: parseInt(m['TotalRecovered'].replace(',', '')) || 0,
					activeCases: parseInt(m['ActiveCases'].replace(',', '')) || 0,
					critical: parseInt(m['Serious,Critical'].replace(',', '')) || 0,
					totalIndex: parseFloat(m['Tot Cases/1M pop'].replace(',', '')) || 0,
					deathsIndex: parseFloat(m['Deaths/1M pop'].replace(',', '')) || 0,
				};
			});
			data.pop();
			state.wom_data = data;
		},
		set_alerts (state, data) {
			state.alerts = data;
		}
	},
	actions: {
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
	}
});
