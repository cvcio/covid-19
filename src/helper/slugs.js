const areaIdToSlug = [
	{
		slug: 'rodou_ru',
		areaid: 1211,
		pop_11: 129151
	},
	{
		slug: 'kalumnou_ru',
		areaid: 1203,
		pop_11: 31382
	},
	{
		slug: 'ko_ru',
		areaid: 1206,
		pop_11: 38029
	},
	{
		slug: 'karpathou_ru',
		areaid: 1204,
		pop_11: 7640
	},
	{
		slug: 'androu_ru',
		areaid: 1201,
		pop_11: 8883
	},
	{
		slug: 'milou_ru',
		areaid: 1207,
		pop_11: 10023
	},
	{
		slug: 'mikonou_ru',
		areaid: 1208,
		pop_11: 9802
	},
	{
		slug: 'naxou_ru',
		areaid: 1209,
		pop_11: 21777
	},
	{
		slug: 'thiras_ru',
		areaid: 1202,
		pop_11: 19013
	},
	{
		slug: 'kea_ru',
		areaid: 1205,
		pop_11: 3886
	},
	{
		slug: 'syrou_ru',
		areaid: 1212,
		pop_11: 20791
	},
	{
		slug: 'tinou_ru',
		areaid: 1213,
		pop_11: 8611
	},
	{
		slug: 'parou_ru',
		areaid: 1210,
		pop_11: 15554
	},
	{
		slug: 'kabalas_ru',
		areaid: 104,
		pop_11: 115974
	},
	{
		slug: 'thasou_ru',
		areaid: 103,
		pop_11: 13055
	},
	{
		slug: 'magnesias_ru',
		areaid: 503,
		pop_11: 176588
	},
	{
		slug: 'sporades_ru',
		areaid: 504,
		pop_11: 13029
	},
	{
		slug: 'kephallonias',
		areaid: 604,
		pop_11: 34924
	},
	{
		slug: 'ithakis_pu',
		areaid: 602,
		pop_11: 2774
	},
	{
		slug: 'samou_ru',
		areaid: 1104,
		pop_11: 32633
	},
	{
		slug: 'ikarias_ru',
		areaid: 1101,
		pop_11: 9901
	},
	{
		slug: 'lemnou_ru',
		areaid: 1103,
		pop_11: 9901
	},
	{
		slug: 'lesbou_ru',
		areaid: 1102,
		pop_11: 83068
	},
	{
		slug: 'east_attika_ru',
		areaid: 901,
		pop_11: 516549
	},
	{
		slug: 'north_athens_ru',
		areaid: 902,
		pop_11: 598847
	},
	{
		slug: 'west_attika_ru',
		areaid: 903,
		pop_11: 475809
	},
	{
		slug: 'west_athens_ru',
		areaid: 904,
		pop_11: 475809
	},
	{
		slug: 'central_athens_ru',
		areaid: 905,
		pop_11: 996283
	}, {
		slug: 'islands_ru',
		areaid: 906,
		pop_11: 69925
	},
	{
		slug: 'south_athens_ru',
		areaid: 907,
		pop_11: 526996
	},
	{
		slug: 'piraeus_ru',
		areaid: 908,
		pop_11: 443196
	},
	{
		slug: 'aitoloakarnanias_ru',
		areaid: 701,
		pop_11: 191727
	},
	{
		slug: 'argolidas_ru',
		areaid: 1001,
		pop_11: 93282
	},
	{
		slug: 'arkadias_ru',
		areaid: 1002,
		pop_11: 77551
	},
	{
		slug: 'artas_ru',
		areaid: 401,
		pop_11: 63927
	},
	{
		slug: 'akhaias_ru',
		areaid: 702,
		pop_11: 302272
	},
	{
		slug: 'boiotias_ru',
		areaid: 801,
		pop_11: 106107
	},
	{
		slug: 'euboias_ru',
		areaid: 802,
		pop_11: 207735
	},
	{
		slug: 'eurutanias_ru',
		areaid: 803,
		pop_11: 17461
	},
	{
		slug: 'zakunthou_ru',
		areaid: 601,
		pop_11: 40508
	},
	{
		slug: 'eleias_ru',
		areaid: 703,
		pop_11: 149350
	},
	{
		slug: 'emathias_ru',
		areaid: 201,
		pop_11: 130026
	},
	{
		slug: 'erakleiou_ru',
		areaid: 1301,
		pop_11: 302450
	},
	{
		slug: 'thesprotias_ru',
		areaid: 402,
		pop_11: 40827
	},
	{
		slug: 'thessalonikes_ru',
		areaid: 202,
		pop_11: 1091424
	},
	{
		slug: 'karditsas_ru',
		areaid: 501,
		pop_11: 106698
	},
	{
		slug: 'kastorias_ru',
		areaid: 302,
		pop_11: 46048
	},
	{
		slug: 'kerkuras_ru',
		areaid: 603,
		pop_11: 99847
	},
	{
		slug: 'kilkis_ru',
		areaid: 203,
		pop_11: 70648
	},
	{
		slug: 'kozanes_ru',
		areaid: 303,
		pop_11: 150196
	},
	{
		slug: 'korinthou_ru',
		areaid: 1003,
		pop_11: 138144
	},
	{
		slug: 'leukadas_ru',
		areaid: 605,
		pop_11: 22673
	},
	{
		pop_11: 144920,
		slug: 'messenias_ru',
		areaid: 1005
	},
	{
		pop_11: 108177,
		slug: 'ksanthes_ru',
		areaid: 105
	},
	{
		pop_11: 83567,
		slug: 'rethumnou_ru',
		areaid: 1303
	},
	{
		pop_11: 104380,
		slug: 'rodopes_ru',
		areaid: 106
	},
	{
		pop_11: 151124,
		slug: 'serron_ru',
		areaid: 206
	},
	{
		pop_11: 122061,
		slug: 'trikalon_ru',
		areaid: 505
	},
	{
		pop_11: 137756,
		slug: 'phthiotidas_ru',
		areaid: 804
	},
	{
		pop_11: 26645,
		slug: 'grebenon_ru',
		areaid: 301
	},
	{
		pop_11: 86621,
		slug: 'dramas_ru',
		areaid: 101
	},
	{
		pop_11: 133862,
		slug: 'ebrou_ru',
		areaid: 102
	},
	{
		pop_11: 160054,
		slug: 'ioanninon_ru',
		areaid: 403
	},
	{
		pop_11: 84469,
		slug: 'lakonias_ru',
		areaid: 1004
	},
	{
		pop_11: 269151,
		slug: 'larisas_ru',
		areaid: 502
	},
	{
		pop_11: 75900,
		slug: 'lasithiou_ru',
		areaid: 1302
	},
	{
		pop_11: 126258,
		slug: 'pellas_ru',
		areaid: 204
	},
	{
		pop_11: 119486,
		slug: 'pierias_ru',
		areaid: 205
	},
	{
		pop_11: 54735,
		slug: 'prebezas_ru',
		areaid: 404
	},
	{
		pop_11: 45162,
		slug: 'phlorinas_ru',
		areaid: 304
	},
	{
		pop_11: 36210,
		slug: 'phokidas_ru',
		areaid: 805
	},
	{
		pop_11: 101324,
		slug: 'khalkidikes_ru',
		areaid: 207
	},
	{
		pop_11: 155443,
		slug: 'khanion_ru',
		areaid: 1304
	},
	{
		pop_11: 51819,
		slug: 'khiou_ru',
		areaid: 1105
	}
];

const areaIdToRegionalUnitId = [{
	id: 7,
	areaids: [901, 902, 903, 904, 905, 906, 907, 908]
}, {
	id: 33,
	areaids: [1201, 1207, 1208, 1209, 1202, 1205, 1212, 1213, 1210]
}, {
	id: 24,
	areaids: [103, 104]
},
{
	id: 39,
	areaids: [503, 504]
}, {
	id: 13,
	areaids: [1211, 1203, 1206, 1204]
}, {
	id: 28,
	areaids: [602, 604]
}, {
	id: 48,
	areaids: [1104, 1101]
}, {
	id: 37,
	areaids: [1102, 1103]
},
{
	id: 3,
	area: 'ΑΙΤΩΛΟΑΚΑΡΝΑΝΙΑΣ',
	areaids: [701]
}, {
	id: 4,
	area: 'ΑΡΓΟΛΙΔΑΣ',
	areaids: [1001]
}, {
	id: 5,
	area: 'ΑΡΚΑΔΙΑΣ',
	areaids: [1002]
}, {
	id: 6,
	area: 'ΑΡΤΑΣ',
	areaids: [401]
}, {
	id: 9,
	area: 'ΑΧΑΪΑΣ',
	areaids: [702]
}, {
	id: 10,
	area: 'ΒΟΙΩΤΙΑΣ',
	areaids: [801]
}, {
	id: 15,
	area: 'ΕΥΒΟΙΑΣ',
	areaids: [802]
}, {
	id: 16,
	area: 'ΕΥΡΥΤΑΝΙΑΣ',
	areaids: [803]
}, {
	id: 17,
	area: 'ΖΑΚΥΝΘΟΥ',
	areaids: [601]
}, {
	id: 18,
	area: 'ΗΛΕΙΑΣ',
	areaids: [703]
}, {
	id: 19,
	area: 'ΗΜΑΘΙΑΣ',
	areaids: [201]
}, {
	id: 20,
	area: 'ΗΡΑΚΛΕΙΟΥ',
	areaids: [1301]
}, {
	id: 21,
	area: 'ΘΕΣΠΡΩΤΙΑΣ',
	areaids: [402]
}, {
	id: 22,
	area: 'ΘΕΣΣΑΛΟΝΙΚΗΣ',
	areaids: [202]
}, {
	id: 25,
	area: 'ΚΑΡΔΙΤΣΑΣ',
	areaids: [501]
}, {
	id: 26,
	area: 'ΚΑΣΤΟΡΙΑΣ',
	areaids: [302]
}, {
	id: 27,
	area: 'ΚΕΡΚΥΡΑΣ',
	areaids: [603]
}, {
	id: 29,
	area: 'ΚΙΛΚΙΣ',
	areaids: [203]
}, {
	id: 30,
	area: 'ΚΟΖΑΝΗΣ',
	areaids: [303]
}, {
	id: 31,
	area: 'ΚΟΡΙΝΘΙΑΣ',
	areaids: [1003]
}, {
	id: 38,
	area: 'ΛΕΥΚΑΔΑΣ',
	areaids: [605]
}, {
	id: 40,
	area: 'ΜΕΣΣΗΝΙΑΣ',
	areaids: [1005]
}, {
	id: 41,
	area: 'ΞΑΝΘΗΣ',
	areaids: [105]
}, {
	id: 46,
	area: 'ΡΕΘΥΜΝΟΥ',
	areaids: [1303]
}, {
	id: 47,
	area: 'ΡΟΔΟΠΗΣ',
	areaids: [106]
}, {
	id: 49,
	area: 'ΣΕΡΡΩΝ',
	areaids: [206]
}, {
	id: 50,
	area: 'ΤΡΙΚΑΛΩΝ',
	areaids: [505]
}, {
	id: 51,
	area: 'ΦΘΙΩΤΙΔΑΣ',
	areaids: [804]
}, {
	id: 11,
	area: 'ΓΡΕΒΕΝΩΝ',
	areaids: [301]
}, {
	id: 12,
	area: 'ΔΡΑΜΑΣ',
	areaids: [101]
}, {
	id: 14,
	area: 'ΕΒΡΟΥ',
	areaids: [102]
}, {
	id: 23,
	area: 'ΙΩΑΝΝΙΝΩΝ',
	areaids: [403]
}, {
	id: 34,
	area: 'ΛΑΚΩΝΙΑΣ',
	areaids: [1004]
}, {
	id: 35,
	area: 'ΛΑΡΙΣΑΣ',
	areaids: [502]
}, {
	id: 36,
	area: 'ΛΑΣΙΘΙΟΥ',
	areaids: [1302]
}, {
	id: 42,
	area: 'ΠΕΛΛΑΣ',
	areaids: [204]
}, {
	id: 43,
	area: 'ΠΙΕΡΙΑΣ',
	areaids: [205]
}, {
	id: 44,
	area: 'ΠΡΕΒΕΖΑΣ',
	areaids: [404]
}, {
	id: 52,
	area: 'ΦΛΩΡΙΝΑΣ',
	areaids: [304]
}, {
	id: 53,
	area: 'ΦΩΚΙΔΑΣ',
	areaids: [805]
}, {
	id: 54,
	area: 'ΧΑΛΚΙΔΙΚΗΣ',
	areaids: [207]
}, {
	id: 55,
	area: 'ΧΑΝΙΩΝ',
	areaids: [1304]
}, {
	id: 56,
	area: 'ΧΙΟΥ',
	areaids: [1105]
}
];

// fixTitle(input, name) {
// 	const indexes = [];

// 	for (let index = 0; index < input.length; index++) {
// 		if (input[index] == '-' && (input[index - 1] != ' ' && input[index + 1] != ' ')) {
// 			indexes.push(index);
// 		}
// 	}
// 	var string = input.charAt(0).toUpperCase() + input.slice(1);
// 	for (let i = 0; i < indexes.length; i++) {
// 		string = string.slice(0, indexes[i] + 1) + string.charAt(indexes[i] + 1).toUpperCase() + string.slice(indexes[i] + 2)
// 		string = this.setCharAt(string, indexes[i], ' ');
// 	}
// 	return string;
// },
// setCharAt(str, index, chr) {
// 	if (index > str.length - 1) return str;
// 	return str.substring(0, index) + chr + str.substring(index + 1);
// },
//

var population = () => {
	var pop_11 = areaIdToSlug.map(o => o.pop_11);
	return pop_11.reduce((a, b) => a + b, 0);
};

export {
	areaIdToSlug,
	areaIdToRegionalUnitId,
	population
};
