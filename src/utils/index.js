
const isSafari = () => {
	var is_safari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
	return is_safari;
};

const parseDate = (v) => {
	if (!v || v === '') return '';
	const dateString = v.split('/');
	return moment(`20${dateString[2]}-${dateString[0]}-${dateString[1]}`, 'YYYY-MM-DD').toDate();
};

export {
	isSafari,
	parseDate
};
