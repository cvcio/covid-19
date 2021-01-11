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

const IsSafari = () => {
	var is_safari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
	return is_safari;
};

const nonIn = (arr) => {
	return function arrNotContains (element) {
		return arr.indexOf(element) === -1;
	};
};

const arrDiff = (a, b) => {
	return a.filter(nonIn(b)).concat(b.filter(nonIn(a)));
};

export {
	normalizeNFD,
	getDates,
	IsSafari,
	arrDiff
};
