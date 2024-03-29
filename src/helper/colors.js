const casesCS = [
	'#23333C',
	'#163441',
	'#164457',
	'#14556D',
	'#0B5C77',
	'#0C6684',
	'#207591',
	'#467E98',
	'#6D96AC',
	'#92B0C0',
	'#B6C9D5',
	'#DAE4EA'
].reverse();

const deathsCS = [
	'#6D1A0D',
	'#97271A',
	'#BB2418',
	'#CE251E',
	'#E11C14',
	'#DE2F16',
	'#E64426',
	'#EE583E',
	'#F87E63',
	'#FF9F87',
	'#FFBFAD',
	'#F7CEC3'
].reverse();

const activeCS = [
	'#D38E01',
	'#D5950E',
	'#D89D1F',
	'#DBA531',
	'#DEAD41',
	'#E1B552',
	'#E6C26D',
	'#EACD84',
	'#EDD798',
	'#F1E0AC',
	'#F3E6B9',
	'#F6F0CC'
].reverse();

const criticalCS = activeCS;

const testsCS = [
	'#111313',
	'#2B2F2F',
	'#484E4E',
	'#666F6F',
	'#8F9797',
	'#B9C0C0',
	'#E6ECEC',
	'#ECF1F1',
	'#F2F5F5',
	'#F8FAFA'
].reverse();

const vaccinesCS = [
	'#CEFA93',
	'#BBE886',
	'#A8D679',
	'#95C46C',
	'#81B15F',
	'#6E9F52',
	'#5B8C45',
	'#52833F',
	'#487A38',
	'#417433',
	'#3B6D2F',
	'#34672A'
];

const pcrCS = testsCS;
const rapidCS = testsCS;
const hospital_admissions = deathsCS;
const hospital_discharges = casesCS;

const getFill = (key) => {
	switch (key) {
	case 'new_hospital_admissions':
	case 'hospital_admissions':
		return hospital_admissions[2];
	case 'new_hospital_discharges':
	case 'hospital_discharges':
		return hospital_discharges[4];
	case 'icu_occupancy':
		return '';
	case 'beds_occupancy':
		return '';
	case 'total_dose_1':
		return vaccinesCS[2];
	case 'total_dose_2':
	case 'vac_p':
	case 'vac_pp':
		return vaccinesCS[4];
	case 'total_dose_3':
		return vaccinesCS[6];
	case 'unvac_p':
	case 'unvac_pp':
		return criticalCS[4];
	default:
		return '#ddd';
	}
};

const getStroke = (key) => {
	switch (key) {
	case 'new_hospital_admissions':
	case 'hospital_admissions':
		return hospital_admissions[9];
	case 'new_hospital_discharges':
	case 'hospital_discharges':
		return hospital_discharges[9];
	case 'icu_occupancy':
		return '';
	case 'beds_occupancy':
		return '';
	case 'total_dose_1':
		return vaccinesCS[5];
	case 'total_dose_2':
	case 'vac_p':
	case 'vac_pp':
		return vaccinesCS[7];
	case 'total_dose_3':
		return vaccinesCS[9];
	case 'unvac_p':
	case 'unvac_pp':
		return criticalCS[7];
	default:
		return '#aaa';
	}
};

export {
	casesCS,
	deathsCS,
	activeCS,
	criticalCS,
	testsCS,
	pcrCS,
	rapidCS,
	vaccinesCS,
	hospital_admissions,
	hospital_discharges,
	getFill,
	getStroke
};
