import { api, APIError } from '@/api';
import { combinationsReplacement } from 'simple-statistics';
import * as slugs from '@/helper/slugs';

const externalSVC = {

	async getRegionalUnitsDataByYear(payload) {
		const url_1 = `${process.env.VUE_APP_BASE_API}/regional_units?
		page=1
		&per_page=1000`;
		const response_1 = await api.get(url_1, { crossdomain: true });

		const url_2 = `${process.env.VUE_APP_BASE_API}/cases?
		page=1
		&per_page=1000000
		&start_date=2020-01-01
		&end_date=2020-12-31`;
		const response_2 = await api.get(url_2, { crossdomain: true });

		const url_3 = `${process.env.VUE_APP_BASE_API}/cases?
		page=1
		&per_page=1000000
		&start_date=2021-01-01
		&end_date=2021-12-31`;
		const response_3 = await api.get(url_3, { crossdomain: true });

		const url_4 = `${process.env.VUE_APP_BASE_API}/cases?
		page=1
		&per_page=1000000
		&start_date=2022-01-01
		&end_date=2022-12-31`;
		const response_4 = await api.get(url_4, { crossdomain: true });

		var input = response_1.data;
		var output = [];
		input.forEach(function (item) {
			var array2020 = (response_2.data.filter(x => x.regional_unit_id == item.id && x.cases != 0));
			var cases2020 = array2020.length ? array2020.pop().cases : 0;
			
			var array2021 = (response_3.data.filter(x => x.regional_unit_id == item.id && x.cases != 0))
			var cases2021 = array2021.length ? array2021.pop().cases : 0;

			var array2022 = (response_4.data.filter(x => x.regional_unit_id == item.id && x.cases != 0))
			var cases2022 = array2022.length ? array2022.pop().cases : 0;

			output.push({
				...item,
				regional_unit_id: item.id,
				cases: [
					{ year: "all", number: cases2022 },
					{ year: "2022", number: (cases2022 - cases2021) | 0 },
					{ year: "2021", number: (cases2021 - cases2020) | 0 },
					{ year: "2020", number: cases2020 | 0 },
				]
			})
		});

		return output;
	},

	async getVaccinationsDataByYear(payload) {
		const url_1 = `${process.env.VUE_APP_GOV_API}?
		date_from=2020-01-01&
		date_to=2020-12-31`;
		const response_1 = await api.getExternal(url_1);

		const url_2 = `${process.env.VUE_APP_GOV_API}?
		date_from=2021-01-01&
		date_to=2021-12-31`;
		const response_2 = await api.getExternal(url_2);

		const url_3 = `${process.env.VUE_APP_GOV_API}?
		date_from=2022-01-01&
		date_to=2022-12-31`;
		const response_3 = await api.getExternal(url_3);

		const url_4 = `${process.env.VUE_APP_GOV_API}?
		date_from=2023-01-01&
		date_to=2023-12-31`;
		const response_4 = await api.getExternal(url_4);

		var input = [... new Set(response_1.data.map(x => x.areaid))];
		var output = [];
		input.forEach(function (item) {
			
			var array2020_1 = (response_1.data.filter(x => x.areaid == item && x.totaldistinctpersons != 0));
			var array2020_2 = (response_1.data.filter(x => x.areaid == item && x.totalvaccinations != 0));
			var distinct2020 = array2020_1.length ? array2020_1.pop().totaldistinctpersons : 0;
			var total2020 = array2020_2.length ? array2020_2.pop().totalvaccinations : 0;

			var array2021_1 = (response_2.data.filter(x => x.areaid == item && x.totaldistinctpersons != 0));
			var array2021_2 = (response_2.data.filter(x => x.areaid == item && x.totalvaccinations != 0));
			var distinct2021 = array2021_1.length ? array2021_1.pop().totaldistinctpersons : 0;
			var total2021 = array2021_2.length ? array2021_2.pop().totalvaccinations : 0;

			var array2022_1 = (response_3.data.filter(x => x.areaid == item && x.totaldistinctpersons != 0));
			var array2022_2 = (response_3.data.filter(x => x.areaid == item && x.totalvaccinations != 0));
			var distinct2022 = array2022_1.length ? array2022_1.pop().totaldistinctpersons : 0;
			var total2022 = array2022_2.length ? array2022_2.pop().totalvaccinations : 0;

			var array2023_1 = (response_4.data.filter(x => x.areaid == item && x.totaldistinctpersons != 0));
			var array2023_2 = (response_4.data.filter(x => x.areaid == item && x.totalvaccinations != 0));
			var distinct2023 = array2023_1.length ? array2023_1.pop().totaldistinctpersons : 0;
			var total2023 = array2023_2.length ? array2023_2.pop().totalvaccinations : 0;

			output.push({
				areaid: item,
				vaccinations: [
					{ year: "all", total: total2023, distinct: distinct2023 },
					{ year: "2023", total: (total2023 - total2022) | 0, distinct: (distinct2023 - distinct2022) | 0 },
					{ year: "2022", total: (total2022 - total2021) | 0, distinct: (distinct2022 - distinct2021) | 0 },
					{ year: "2021", total: (total2021 - total2020) | 0, distinct: (distinct2021 - distinct2020) | 0 },
					{ year: "2020", total: total2020 | 0, distinct: distinct2020 | 0 },
				]
			})
		});

		return output.map(t1 => ({ ...t1, ...slugs.areaIdToSlug.find(t2 => t2.areaid === t1.areaid) }));;

	},

	async getRegionalUnitsData(payload) {

		const url_1 = `${process.env.VUE_APP_BASE_API}/regional_units?
		page=1
		&per_page=1000`;
		const response_1 = await api.get(url_1, { crossdomain: true });

		const url_2 = `${process.env.VUE_APP_BASE_API}/cases?
		page=1
		&per_page=1000000
		&start_date=${payload.from}
		&end_date=${payload.to}`;
		const response_2 = await api.get(url_2, { crossdomain: true });

		if (response_2 && response_2.data) {
			var input = response_2.data;
			var output = [];
			input.forEach(function (item) {
				var existing = output.filter(function (v, i) {
					return v.regional_unit_id == item.regional_unit_id;
				});
				if (existing.length) {
					var existingIndex = output.indexOf(existing[0]);
					var lastItem = [...output[existingIndex].cases_cum].pop();
					output[existingIndex].cases = output[existingIndex].cases.concat(item.cases - lastItem);
					output[existingIndex].cases_cum = output[existingIndex].cases_cum.concat(item.cases);
					output[existingIndex].dates = output[existingIndex].dates.concat(item.date);
				} else {
					var new_item = {
						regional_unit_id: item.regional_unit_id,
						cases: [item.cases],
						cases_cum: [item.cases],
						dates: [item.date]
					};
					output.push(new_item);
				}
			});

			return output.map
				(
					t1 => ({
						...t1,
						...response_1.data.find
							(t2 => t2.id === t1.regional_unit_id)
					})
				);
		} else {
			return response_1.data.map((o) => { return { ...o, regional_unit_id: o.id, cases: [0], cases_cum: [0] }; });
		}
	},

	async getMunicipalitiesData() {
		const url_1 = `${process.env.VUE_APP_BASE_API}/municipalities?
		page=1
		&per_page=1000`;
		const response_1 = await api.get(url_1, { crossdomain: true });

		const url_2 = `${process.env.VUE_APP_BASE_API}/deaths_per_municipality?
		page=1
		&per_page=1000`;
		const response_2 = await api.get(url_2, { crossdomain: true });

		var input = response_2.data;
		var output = [];
		input.forEach(function (item) {
			var existing = output.filter(function (v, i) {
				return v.municipality_id == item.municipality_id;
			});
			if (existing.length) {
				var existingIndex = output.indexOf(existing[0]);
				output[existingIndex].deaths = output[existingIndex].deaths.concat({ year: item.year, number: item.deaths });
				output[existingIndex].deaths[output[existingIndex].deaths.findIndex(obj => obj.year == 'all')].number += item.deaths;
			} else {
				var new_item = {
					municipality_id: item.municipality_id,
					deaths: [{ year: 'all', number: item.deaths }, { year: item.year, number: item.deaths }]
				};
				output.push(new_item);
			}
		});

		return output.map
			(
				t1 => ({
					...t1,
					...response_1.data.find
						(t2 => t2.id === t1.municipality_id)
				})
			);
	},

	async getDemographicsData(payload) {
		const url = `${process.env.VUE_APP_BASE_API}/demographics?
		page=1
		&per_page=15000
		&start_date=${payload.from}
		&end_date=${payload.to}`;
		const response = await api.get(url, { crossdomain: true });

		return response.data;
	},

	async getVaccinationsDataGroupByDate(payload) {

		const url = `${process.env.VUE_APP_GOV_API}?
		date_from=${payload.from}&
		date_to=${payload.to}`;
		const response = await api.getExternal(url);

		/** Group By Date */
		var input = response.data;
		var output = [];

		input.forEach(function (item) {
			var existing = output.filter(function (v, i) {
				return v.weekreferencedate == item.weekreferencedate;
			});
			if (existing.length) {
				var existingIndex = output.indexOf(existing[0]);
				output[existingIndex].totaldose1 = output[existingIndex].totaldose1 + (item.totaldose1);
				output[existingIndex].totaldose2 = output[existingIndex].totaldose2 + (item.totaldose2);
				output[existingIndex].totaldose3 = output[existingIndex].totaldose3 + (item.totaldose3);
				output[existingIndex].weeklydose1 = output[existingIndex].weeklydose1 + (item.weeklydose1);
				output[existingIndex].weeklydose2 = output[existingIndex].weeklydose2 + (item.weeklydose2);
				output[existingIndex].weeklydose3 = output[existingIndex].weeklydose3 + (item.weeklydose3);
				output[existingIndex].weektotal = output[existingIndex].weektotal + (item.weektotal);
				output[existingIndex].totaldistinctpersons = output[existingIndex].totaldistinctpersons + (item.totaldistinctpersons);
				output[existingIndex].totalvaccinations = output[existingIndex].totalvaccinations + (item.totalvaccinations);
			} else {
				var new_item = {
					weekreferencedate: item.weekreferencedate,
					totaldose1: +item.totaldose1,
					totaldose2: +item.totaldose2,
					totaldose3: +item.totaldose3,
					weeklydose1: +item.weeklydose1,
					weeklydose2: +item.weeklydose2,
					weeklydose3: +item.weeklydose3,
					weektotal: +item.weektotal,
					totaldistinctpersons: +item.totaldistinctpersons,
					totalvaccinations: +item.totalvaccinations
				};
				output.push(new_item);
			}
		});

		return output.sort((a, b) => { return new Date(a.weekreferencedate) - new Date(b.weekreferencedate); });
	},

	async getVaccinationsDataGroupByRegionalUnit(payload) {

		const url = `${process.env.VUE_APP_GOV_API}?
		date_from=${payload.from}&
		date_to=${payload.to}`;
		const response = await api.getExternal(url);

		/** Group By RegionalUnit */
		var input = response.data.sort((a, b) => { return new Date(a.weekreferencedate) - new Date(b.weekreferencedate); });;
		var output = [];
		input.forEach(function (item) {
			var existing = output.filter(function (v, i) {
				return v.areaid == item.areaid;
			});
			if (existing.length) {
				var existingIndex = output.indexOf(existing[0]);
				output[existingIndex].weekreferencedate = output[existingIndex].weekreferencedate.concat(item.weekreferencedate);
				output[existingIndex].totaldose1 = output[existingIndex].totaldose1.concat(item.totaldose1);
				output[existingIndex].totaldose2 = output[existingIndex].totaldose2.concat(item.totaldose2);
				output[existingIndex].totaldose3 = output[existingIndex].totaldose3.concat(item.totaldose3);
				output[existingIndex].weektotal = output[existingIndex].weektotal.concat(item.weektotal);
				output[existingIndex].weeklydose1 = output[existingIndex].weeklydose1.concat(item.weeklydose1);
				output[existingIndex].weeklydose2 = output[existingIndex].weeklydose2.concat(item.weeklydose2);
				output[existingIndex].weeklydose3 = output[existingIndex].weeklydose3.concat(item.weeklydose3);
				output[existingIndex].totalvaccinations = output[existingIndex].totalvaccinations.concat(item.totalvaccinations);
				output[existingIndex].totaldistinctpersons = output[existingIndex].totaldistinctpersons.concat(item.totaldistinctpersons);
			} else {
				var new_item = {
					areaid: item.areaid,
					area: item.area,
					weekreferencedate: [item.weekreferencedate],
					totaldose1: [item.totaldose1],
					totaldose2: [item.totaldose2],
					totaldose3: [item.totaldose3],
					weektotal: [item.weektotal],
					weeklydose1: [item.weeklydose1],
					weeklydose2: [item.weeklydose2],
					weeklydose3: [item.weeklydose3],
					totalvaccinations: [item.totalvaccinations],
					totaldistinctpersons: [item.totaldistinctpersons]
				};
				output.push(new_item);
			}
		});

		const groupByRegionalUnit = output.map(x => {
			return {
				areaid: x.areaid,
				area: x.area,
				weekreferencedate: x.weekreferencedate,
				totaldose1: x.totaldose1,
				totaldose2: x.totaldose2,
				totaldose3: x.totaldose3,
				periodTotalDoses: x.weektotal.reduce((a, b) => { return a + b; }, 0),
				periodTotalDoses1: x.weeklydose1.reduce((a, b) => { return a + b; }, 0),
				periodTotalDoses2: x.weeklydose2.reduce((a, b) => { return a + b; }, 0),
				periodTotalDoses3: x.weeklydose3.reduce((a, b) => { return a + b; }, 0),
				totalvaccinations: Math.max(...x.totalvaccinations),
				totaldistinctpersons: Math.max(...x.totaldistinctpersons)
			};
		});

		return groupByRegionalUnit.map(t1 => ({ ...t1, ...slugs.areaIdToSlug.find(t2 => t2.areaid === t1.areaid) }));
	},

	async getTimelineData(payload) {
		const url = `${process.env.VUE_APP_BASE_API}/timeline?
			page=1&
			per_page=25000&
			fields=${payload.fields.join(',')}&
			start_date=${payload.from}&
			end_date=${payload.to}`;
		const response = await api.get(url, { crossdomain: true });

		return response.data;
	}
};
export {
	externalSVC
};
