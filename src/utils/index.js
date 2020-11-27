import moment from 'moment';

const normalizeNFD = (v) => {
	return v.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const getDates = (from, to) => {
	const dates = [];
	let startDate = moment(from);
	const endDate = moment(to);
	while (startDate <= endDate) {
		dates.push(moment(startDate));
		startDate = moment(startDate).add(1, 'days');
	}
	return dates;
};

export {
	normalizeNFD,
	getDates
};
