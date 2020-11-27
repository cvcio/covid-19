import moment from 'moment';

export default {
	namespaced: true,
	state: {
		periodInterval: [
			{
				label: 'Now',
				value: ''
			},
			{
				label: 'Last 15 Days',
				value: moment().subtract(15, 'days').format('YYYY-MM-DD')
			},
			{
				label: 'Last 3 Months',
				value: moment().subtract(3, 'months').format('YYYY-MM-DD')
			},
			{
				label: 'Historical',
				value: '2020-01-22'
			}
		],
		timeInterval: []
	},
	getters: {
		periodInterval: state => state.periodInterval
	},
	mutations: {

	}
};
