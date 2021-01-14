import moment from 'moment';

export default {
	namespaced: true,
	state: {
		mapLevel: 'greece',
		mapSource: 'covid',
		mapKey: 'cases',
		mapPeriodIDX: 0,
		mapVaccinationsPeriodIDX: 3,
		mapPeriod: moment().subtract(1, 'days').format('YYYY-MM-DD'),
		mapVaccinationsPeriod: '2020-01-01',
		periodInterval: [
			{
				text: { en: 'Last day', el: 'Τελευταία ημέρα' },
				value: moment().subtract(1, 'days').format('YYYY-MM-DD')
			},
			{
				text: { en: 'Last 14 days', el: 'Τελευταίες 14 ημέρες' },
				value: moment().subtract(14, 'days').format('YYYY-MM-DD')
			},
			{
				text: { en: 'Last 3 months', el: 'Τελευταίο τρίμηνο' },
				value: moment().subtract(3, 'months').format('YYYY-MM-DD')
			},
			{
				text: { en: 'Historical data', el: 'Από την αρχή' },
				value: '2020-01-01'
			}
		],
		timeInterval: []
	},
	getters: {
		mapLevel: state => state.mapLevel,
		mapSource: state => state.mapSource,
		mapKey: state => state.mapKey,
		mapPeriod: state => state.mapPeriod,
		mapVaccinationsPeriod: state => state.mapVaccinationsPeriod,
		mapPeriodIDX: state => state.mapPeriodIDX,
		mapVaccinationsPeriodIDX: state => state.mapVaccinationsPeriodIDX,
		periodInterval: state => state.periodInterval,
		timeInterval: state => state.timeInterval
	},
	mutations: {
		setMapLevel (state, data) {
			state.mapLevel = data;
		},
		setMapKey (state, data) {
			state.mapKey = data;
		},
		setMapSource (state, data) {
			state.mapSource = data;
		},
		setMapPeriod (state, data) {
			state.mapPeriod = data;
			state.mapPeriodIDX = state.periodInterval.findIndex(m => m.value === data);
		},
		setMapVaccinationsPeriod (state, data) {
			state.mapVaccinationsPeriod = data;
			state.mapVaccinationsPeriodIDX = state.periodInterval.findIndex(m => m.value === data);
		},
		setMapPeriodFromIDX (state, data) {
			state.mapPeriodIDX = data;
			state.mapPeriod = state.periodInterval[data].value;
		},
		setMapVaccinationsPeriodFromIDX (state, data) {
			state.mapVaccinationsPeriodIDX = data;
			state.mapVaccinationsPeriod = state.periodInterval[data].value;
		}
	},
	actions: {}
};
