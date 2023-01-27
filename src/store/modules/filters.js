import moment from 'moment';

export default {
	namespaced: true,
	state: {
		mapLevel: 'greece',
		mapSource: 'covid',
		mapKey: 'cases',

		mapCasesPeriodIDX: 0,
		mapCasesPeriod: {
			from: moment().subtract(7, 'days').format('YYYY-MM-DD'),
			to: moment().format('YYYY-MM-DD')
		},

		mapVaccinationsPeriodIDX: 6,
		mapVaccinationsPeriod: {
			from: '2020-01-01',
			to: moment().format('YYYY-MM-DD')
		},

		periodInterval: [
			{
				text: { en: 'Last Week', el: 'Τελευταία εβδομάδα' },
				value: {
					from: moment().subtract(7, 'days').format('YYYY-MM-DD'),
					to: moment().format('YYYY-MM-DD')
				}
			},
			{
				text: { en: 'Last 3 months', el: 'Τελευταίο τρίμηνο' },
				value: {
					from: moment().subtract(3, 'months').format('YYYY-MM-DD'),
					to: moment().format('YYYY-MM-DD')
				}
			},
			{
				text: { en: 'Last year (2023)', el: 'Τελευταίο έτος (2023)' },
				value: {
					from: '2023-01-01',
					to: '2023-12-31'
				}
			},
			{
				text: { en: '2022', el: '2022' },
				value: {
					from: '2022-01-01',
					to: '2022-12-31'
				}
			},
			{
				text: { en: '2021', el: '2021' },
				value: {
					from: '2021-01-01',
					to: '2021-12-31'
				}
			},
			{
				text: { en: '2020', el: '2020' },
				value: {
					from: '2020-01-01',
					to: '2020-12-31'
				}
			},
			{
				text: { en: 'Historical data', el: 'Από την αρχή' },
				value: {
					from: '2020-01-01',
					to: moment().format('YYYY-MM-DD')
				}
			}
		],
		periodIntervalIDX: [
			{ text: { en: 'Last Week', el: 'Τελευταία εβδομάδα' }, value: 0 },
			{ text: { en: 'Last 3 months', el: 'Τελευταίο τρίμηνο' }, value: 1 },
			{ text: { en: 'Last year (2023)', el: 'Τελευταίο έτος (20232)' }, value: 2 },
			{ text: { en: '2022', el: '2022' }, value: 3 },
			{ text: { en: '2021', el: '2021' }, value: 4 },
			{ text: { en: '2020', el: '2020' }, value: 5 },
			{ text: { en: 'Historical data', el: 'Από την αρχή' }, value: 6 }
		],
		timeInterval: []
	},
	getters: {
		mapLevel: state => state.mapLevel,
		mapSource: state => state.mapSource,
		mapKey: state => state.mapKey,
		mapCasesPeriod: state => state.mapCasesPeriod,
		mapVaccinationsPeriod: state => state.mapVaccinationsPeriod,
		mapCasesPeriodIDX: state => state.mapCasesPeriodIDX,
		mapVaccinationsPeriodIDX: state => state.mapVaccinationsPeriodIDX,
		periodInterval: state => state.periodInterval,
		periodIntervalIDX: state => state.periodIntervalIDX,
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
		setmapCasesPeriod (state, data) {
			state.mapCasesPeriod = data;
			state.mapCasesPeriodIDX = state.periodInterval.findIndex(m => m.value === data);
		},
		setMapVaccinationsPeriod (state, data) {
			state.mapVaccinationsPeriod = data;
			state.mapVaccinationsPeriodIDX = state.periodInterval.findIndex(m => m.value === data);
		},
		setMapCasesPeriodFromIDX (state, data) {
			state.mapCasesPeriodIDX = data;
			state.mapCasesPeriod = state.periodInterval[data].value;
		},
		setMapVaccinationsPeriodFromIDX (state, data) {
			state.mapVaccinationsPeriodIDX = data;
			state.mapVaccinationsPeriod = state.periodInterval[data].value;
		}
	},
	actions: {}
};
