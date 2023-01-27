<template>
	<v-tab-item>
		<v-card flat>
			<v-container fluid class="px-0">

				<v-row class="px-4" align="center">
					<!-- <v-col cols="6">
						<switch-map-source :label="'COVID—19'" :val="'covid'" />
					</v-col> -->
					<v-col cols="12">
						<autocomplete-map-period model="mapCasesPeriod" :label="$t('label.period')"
							:disabled="mapSource !== 'covid'" />
					</v-col>
				</v-row>

				<v-row class="px-4" align="center" no-gutters>
					<v-col cols="12" class="primary--opac pa-2 mb-1" style="position:relative;">
						<h4 class="text-2rem text-xs-h5 font-weight-bold grey--text" style="z-index:1;">
							<span class="primary--text" v-if="mapCasesPeriodIDX < 6">{{
								new
															Intl.NumberFormat('el-GR').format(cases.toFixed(2))
							}}</span>
							<span class="primary--text" v-if="mapCasesPeriodIDX === 6">
								{{ new Intl.NumberFormat('el-GR').format(totalCases.toFixed(2)) }}
							</span>
							<span class="" v-if="mapCasesPeriodIDX < 6"> / {{
								new
															Intl.NumberFormat('el-GR').format(totalCases.toFixed(2))
							}}</span>
						</h4>
						<p class="caption small-caption text-uppercase primary--text mb-0" style="z-index:1;">
							<span v-if="mapCasesPeriodIDX < 6">{{ $tc('cases', 1) | normalizeNFD }} / </span>
							{{ $t('total cases') | normalizeNFD }}
						</p>
						<sparklines :key="'gr-sparks-new_cases-' + mapCasesPeriodIDX" v-if="sparks.new_cases.length > 8"
							class="d-block mt-3 totals-sparklines" :data="sparks.new_cases"
							id="totals-g-cases-sparklines" style="height: 60px;z-index:1;" />
					</v-col>

					<v-col cols="12" class="secondary--opac pa-2 mb-1" style="position:relative">
						<h4 class="text-2rem text-xs-h5 font-weight-bold grey--text" style="z-index:1;">
							<span class="secondary--text" v-if="mapCasesPeriodIDX < 6">{{
								new
															Intl.NumberFormat('el-GR').format(deaths.toFixed(2))
							}}</span>
							<span class="secondary--text" v-if="mapCasesPeriodIDX === 6">{{
								new
															Intl.NumberFormat('el-GR').format(totalDeaths.toFixed(2))
							}}</span>
							<span class="" v-if="mapCasesPeriodIDX < 6"> / {{
								new
															Intl.NumberFormat('el-GR').format(totalDeaths.toFixed(2))
							}}</span>
						</h4>
						<p class="caption small-caption text-uppercase secondary--text mb-0" style="z-index:1;">
							<span v-if="mapCasesPeriodIDX < 6">{{ $tc('deaths', 1) | normalizeNFD }} / </span>
							{{ $t('total deaths') | normalizeNFD }}
						</p>
						<sparklines :key="'gr-sparks-new_deaths-' + mapCasesPeriodIDX"
							v-if="sparks.new_deaths.length > 8" class="d-block mt-3 totals-sparklines"
							:data="sparks.new_deaths" id="totals-g-deaths-sparklines" style="height: 60px;z-index:1;" />
					</v-col>

				</v-row>

				<br>
				<v-divider />
				<v-divider />

				<br>
				<v-row class="px-4" align="center">
					<v-col cols="12">
						<h5 class="grey--text s-subtitle-2 subtitle-2">{{ $t('week') }}
							{{ $moment(waste.date).subtract(7, 'days').format('ll') }} - {{
								$moment(waste.date).format('ll')
							}}
						</h5>
						<p class="s-caption caption blue-grey--text mb-0">
							<strong>{{ waste[`place_${locale.code}`] }}</strong>:
							{{ $t('increase') }} <span class="red--text"> {{ waste.percent }}% </span> {{
								$t('in_the_average')
							}}
						</p>
					</v-col>
				</v-row>

				<v-row class="px-4" align="center">
					<v-col cols="12">
						<h5 class="grey--text s-subtitle-2 subtitle-2">{{ $t('week') }}
							{{ $moment(hospital.date).subtract(7, 'days').format('ll') }} - {{
								$moment(hospital.date).format('ll')
							}}
						</h5>
						<p class="s-caption caption blue-grey--text mb-0">
							<strong>{{ $t('Admissions') }}</strong>:
							{{ hospital.hospital_admissions }}
						</p>
						<p class="s-caption caption blue-grey--text mb-0">
							<strong>{{ $t('Intubated') }}</strong>:
							{{ hospital.intubated }}
						</p>
					</v-col>
				</v-row>
			</v-container>
		</v-card>
	</v-tab-item>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'tab-item-greece',
	props: ['tab'],
	components: {
		'switch-map-source': require('@/components/content/switch-map-source').default,
		'autocomplete-map-period': require('@/components/content/autocomplete-map-period').default,
		sparklines: require('@/components/charts/sparklines').default
	},
	computed: {
		...mapGetters(['locale']),
		...mapGetters('filters', ['mapSource', 'mapCasesPeriod', 'mapCasesPeriodIDX', 'mapVaccinationsPeriod', 'mapVaccinationsPeriodIDX', 'periodInterval'])
	},
	watch: {
		mapCasesPeriod(value, old) {
			if (value !== old) {
				this.load();
			}
		},
		mapVaccinationsPeriod(value, old) {
			if (value !== old) {
				this.load();
			}
		}
	},
	data() {
		return {
			totalCases: 0,
			totalDeaths: 0,
			cases: 0,
			deaths: 0,
			tests: 0,
			sparks: {
				new_cases: [],
				new_deaths: []
			},
			vaccines: {
				totalDistinctPersons: 0,
				totalVaccinations: 0,
				percent: 0
			},
			waste: {
				date: null,
				place: null,
				percent: 0
			},
			hospital: {
				date: null,
				intubated: null,
				hospital_admissions: 0
			},
			population: 10747828
		};
	},
	mounted() {
		this.load();
	},
	methods: {
		load() {
			var from;
			const isTotal_covid = (this.mapCasesPeriodIDX == 6);
			const isLastWeek_covid = (this.mapCasesPeriodIDX == 0);

			if (isLastWeek_covid || isTotal_covid) from = this.$moment().subtract(100, 'days').format('YYYY-MM-DD');
			else from = this.mapCasesPeriod.from;

			this.$store.dispatch('external/getTimelineData', { from: from, to: this.mapCasesPeriod.to, fields: ['daily_cases', 'cases_cum', 'deaths', 'deaths_cum'] })
				.then(res => {

					const cases = res.map(obj => obj['daily_cases']);
					const cases_cum = res.map(obj => obj.cases_cum);
					const deaths = res.map(obj => obj['deaths']);
					const deaths_cum = res.map(obj => obj.deaths_cum);

					if (isTotal_covid) {
						this.cases = Math.max(...cases_cum);
						this.deaths = Math.max(...deaths_cum);
					} else if (isLastWeek_covid) {
						for (let i = cases.length - 1; i >= 0; i--) {
							if (cases[i] > 0) {
								this.cases = cases[i];
								break;
							}
						}
						for (let i = deaths.length - 1; i >= 0; i--) {
							if (deaths[i] > 0) {
								this.deaths = deaths[i];
								break;
							}
						}
						// this.cases = Math.max(...cases);   // cases.reduce((a, b) => { return a + b; }, 0);
						// this.deaths = Math.max(...deaths); // deaths.reduce((a, b) => { return a + b; }, 0);
					}
					else {
						const max_c = Math.max(...cases_cum);
						const min_c = cases_cum.filter(i => i > 0).length > 0 ? Math.min(...cases_cum.filter(i => i > 0)) : Math.min(...cases_cum);
						this.cases = max_c - min_c;

						const max_d = Math.max(...deaths_cum);
						const min_d = deaths_cum.filter(i => i > 0).length > 0 ? Math.min(...deaths_cum.filter(i => i > 0)) : Math.min(...deaths_cum);
						this.deaths = max_d - min_d;
					}
				});

			this.$store.dispatch('external/getTimelineData', { from: this.mapCasesPeriod.from, to: this.mapCasesPeriod.to, fields: ['daily_cases', 'deaths', 'estimated_new_total_tests'] })
				.then(res => {
					this.sparks.new_cases = res.map(obj => obj.daily_cases);
					this.sparks.new_deaths = res.map(obj => obj.deaths);

					const estimated_new_total_tests = res.map(obj => obj.estimated_new_total_tests);

					this.tests = estimated_new_total_tests.reduce((a, b) => { return a + b; }, 0);
				});

			const isTotal_sum = true;
			this.$store.dispatch('external/getTimelineData', { from: (isTotal_sum) ? this.$moment().subtract(100, 'days').format('YYYY-MM-DD') : this.mapCasesPeriod.from, to: this.$moment().format('YYYY-MM-DD'), fields: ['cases_cum', 'deaths_cum'] })
				.then(res => {
					const cases_cum = res.map(obj => obj.cases_cum);
					const deaths_cum = res.map(obj => obj.deaths_cum);

					this.totalCases = Math.max(...cases_cum);
					this.totalDeaths = Math.max(...deaths_cum);
				});

			const isTotal_vaccinations = (this.mapCasesPeriodIDX == 6);
			this.$store.dispatch('external/getVaccinationsDataGroupByDate', { from: (isTotal_vaccinations) ? this.$moment().subtract(100, 'days').format('YYYY-MM-DD') : this.mapCasesPeriod.from, to: this.mapCasesPeriod.to })
				.then(res => {
					this.population = 10747828;

					if (isTotal_vaccinations) {
						const totaldistinctpersons = res.map(obj => obj.totaldistinctpersons);
						const totalVaccinations = res.map(obj => obj.totalvaccinations);

						this.vaccines.totalVaccinations = Math.max(...totalVaccinations);
						this.vaccines.totalDistinctPersons = Math.max(...totaldistinctpersons);
						this.vaccines.percent = (this.vaccines.totalDistinctPersons / this.population) * 100;
					} else {
						const weeklydose1 = res.map(obj => obj.weeklydose1);
						const weektotal = res.map(obj => obj.weektotal);
						const totalweeklydose1 = weeklydose1.reduce((a, b) => { return a + b; }, 0);
						const totalweektotal = weektotal.reduce((a, b) => { return a + b; }, 0);

						this.vaccines.totalVaccinations = totalweektotal;
						this.vaccines.totalDistinctPersons = totalweeklydose1;
						this.vaccines.percent = (this.vaccines.totalDistinctPersons / this.population) * 100;
					}
				});

			const isTotal_waste = true;
			this.$store.dispatch('external/getTimelineData', { from: (isTotal_waste) ? this.$moment().subtract(365, 'days').format('YYYY-MM-DD') : this.mapCasesPeriod.from, to: this.$moment().format('YYYY-MM-DD'), fields: ['waste_highest_percent', 'waste_highest_place', 'waste_highest_place_en'] })
				.then(res => {
					const waste_highest_percent = res.map(o => o.waste_highest_percent);
					for (let i = waste_highest_percent.length - 1; i >= 0; i--) {
						if (waste_highest_percent[i] > 0) {
							this.waste = {
								place_el: res[i].waste_highest_place,
								place_en: res[i].waste_highest_place_en,
								percent: res[i].waste_highest_percent,
								date: res[i].date
							};
							break;
						}
					}
				});

			const isTotal_hospital = true;
			this.$store.dispatch('external/getTimelineData', { from: (isTotal_hospital) ? this.$moment().subtract(365, 'days').format('YYYY-MM-DD') : this.mapCasesPeriod.from, to: this.$moment().format('YYYY-MM-DD'), fields: ['recovered', 'beds_occupancy', 'icu_occupancy', 'intubated', 'hospital_admissions', 'hospital_discharges'] })
				.then(res => {
					// var array2020 = (response_2.data.filter(x => x.regional_unit_id == item.id && x.cases != 0));

					for (let i = res.length - 1; i >= 0; i--) {
						if (res[i].intubated > 0 && res[i].hospital_admissions > 0) {
							this.hospital = res[i]
							break;
						}
					}
					// const d = res[0];
					// const b_non_0_idx = d.beds_occupancy.reduce((a, e, i) => e > 0 ? a.concat(i) : a, []);
					// const i_non_0_idx = d.icu_occupancy.reduce((a, e, i) => e > 0 ? a.concat(i) : a, []);
					// this.beds_occupancy = d.beds_occupancy[b_non_0_idx[b_non_0_idx.length - 1]];
					// this.icu_occupancy = d.icu_occupancy[i_non_0_idx[i_non_0_idx.length - 1]];
					// this.ref_day = this.$moment(d.date[i_non_0_idx[i_non_0_idx.length - 1]]).format('YYYY-MM-DD');
				});

		},
		getIterpolation(value) {
			return interpolateRgb('rgb(108,99,255)', 'red')(value);
		}
	}
};
</script>

<style lang="less" scoped>
h5.s-subtitle-2 {
	font-size: 0.95rem !important;
}

p.s-caption {
	font-size: 0.90rem !important;
}

.events {
	pointer-events: all;
}

.primary--opac {
	background: #f2f7f7;
}

.accent--opac {
	background: rgba(255, 0, 0, 0.1);
}

.secondary--opac {
	background: #f7f2f2;
}

.row.outlined {
	border: 1px solid #f2f7f7;
}

.totals-sparklines {
	position: absolute;
	width: 180px;
	height: 60px;
	top: 0;
	right: 0;
	z-index: 0;

	@media only screen and (max-width: 1530px) {
		position: relative;
	}
}

.vaccines-progress {
	.v-progress-linear__content {
		width: 100%;

		span {
			width: 100%;
		}
	}
}
</style>
