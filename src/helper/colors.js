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
	'#d2fbe0',
	'#bcf8d1',
	'#a5f6c1',
	'#8ff4b2',
	'#78f2a2',
	'#62f093',
	'#4bed83',
	'#34eb74',
	'#1ee964',
	'#1bd25a',
	'#18ba50',
	'#15a346'
];

const pcrCS = testsCS;
const rapidCS = testsCS;

export {
	casesCS,
	deathsCS,
	activeCS,
	criticalCS,
	testsCS,
	pcrCS,
	rapidCS,
	vaccinesCS
};
