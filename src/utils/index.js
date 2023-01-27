import moment from 'moment';

const normalizeNFD = (v) => {
	return v.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const groupDatesByWeek = (array) => {
	var groups = {};
	let current = array[0];
	array.forEach((o, i) => {
		var group = [o.year, o.week];
		if ((i > 1) && (o.year !== current.year) && (o.week === current.week)) {
			group = [current.year, current.week];
			// current = current;
		} else {
			current = o;
		}
		// if((o.year == 2021) && (o.week ==53)) {
		// 	group = [2020,53];
		// }
		// if(o.year == 2022 && o.week == 52) {
		// 	group = [2021,52];
		// }
		groups[group] = groups[group] || [];
		groups[group].push(o);
	});

	return Object.keys(groups).map((group) => {
		return groups[group];
	});
};

const getDates = (from, to) => {
	const dates = [];
	let startDate = moment(from);
	const endDate = moment(to);
	while (startDate.isSameOrBefore(endDate)) {
		dates.push(moment(startDate.format()));
		startDate = moment(startDate).add(1, 'days');
	}
	return dates;
};

const IsSafari = () => {
	var is_safari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
	return is_safari;
};

const isChrome = () => {
	return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
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
	groupDatesByWeek,
	getDates,
	IsSafari,
	isChrome,
	arrDiff
};

