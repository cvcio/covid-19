import moment from 'moment';

export default {
	namespaced: true,
	state: {
		mapLevel: 'greece',
		mapSource: 'covid',
		mapKey: 'cases',
		mapPeriodIDX: 0,
		mapPeriod: moment().subtract(14, 'days').format('YYYY-MM-DD'),
		periodInterval: [
			{
				text: 'Now',
				value: moment().subtract(14, 'days').format('YYYY-MM-DD')
			},
			{
				text: 'Last 15 Days',
				value: moment().subtract(15, 'days').format('YYYY-MM-DD')
			},
			{
				text: 'Last 3 Months',
				value: moment().subtract(3, 'months').format('YYYY-MM-DD')
			},
			{
				text: 'Historical',
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
		mapPeriodIDX: state => state.mapPeriodIDX,
		periodInterval: state => state.periodInterval,
		timeInterval: state => state.timeInterval
	},
	mutations: {
		setMapKey (state, data) {
			state.mapKey = data;
		},
		setMapSource (state, data) {
			state.mapSource = data;
		},
		setMapPeriod (state, data) {
			state.mapPeriod = data;
			state.mapPeriodIDX = state.periodInterval.findIndex(m => m.value === data);
		}
	},
	actions: {}
};
