<template>
	<v-tab-item>
		<v-card flat>
			<v-container fluid class="px-0">
				<v-row class="px-4" align="center">
					<v-col cols="6">
						<switch-map-source :label="'COVID—19'" :val="'covid'" @change="switchMapSource('covid')"/>
					</v-col>
					<v-col cols="6">
						<autocomplete-map-period model="mapPeriod" :label="$t('label.period')" :disabled="mapSource !== 'covid'"/>
					</v-col>
				</v-row>
				<v-row class="px-4" align="center" no-gutters>
					<v-col cols="12" class="primary--opac pa-2 mb-1" style="position:relative;">
						<h4 class="text-2rem text-xs-h5 font-weight-bold grey--text"  style="z-index:1;">
							<span class="primary--text" v-if="mapPeriodIDX < 3">{{ new Intl.NumberFormat('el-GR').format(cases.toFixed(2)) }}</span>
							<span class="primary--text" v-if="mapPeriodIDX === 3">{{ new Intl.NumberFormat('el-GR').format(totalCases.toFixed(2)) }}</span>
							<span class="" v-if="mapPeriodIDX < 3"> / {{ new Intl.NumberFormat('el-GR').format(totalCases.toFixed(2)) }}</span>
						</h4>
						<p class="caption small-caption text-uppercase primary--text mb-0" style="z-index:1;">
							<span v-if="mapPeriodIDX < 3">{{ $tc('cases', 1) | normalizeNFD }} / </span>{{ $t('total cases') | normalizeNFD }}
						</p>
						<sparklines
							:key="'gr-sparks-new_cases-'+mapPeriodIDX"
							v-if="sparks.new_cases.length > 7"
							class="d-block mt-3 totals-sparklines"
							:data="sparks.new_cases"
							id="totals-g-cases-sparklines" style="height: 60px;z-index:1;"/>
					</v-col>
					<v-col cols="12" class="secondary--opac pa-2" style="position:relative">
						<h4 class="text-2rem text-xs-h5 font-weight-bold grey--text" style="z-index:1;">
							<span class="secondary--text" v-if="mapPeriodIDX < 3">{{ new Intl.NumberFormat('el-GR').format(deaths.toFixed(2)) }}</span>
							<span class="secondary--text" v-if="mapPeriodIDX === 3">{{ new Intl.NumberFormat('el-GR').format(totalDeaths.toFixed(2)) }}</span>
							<span class="" v-if="mapPeriodIDX < 3"> / {{ new Intl.NumberFormat('el-GR').format(totalDeaths.toFixed(2)) }}</span>
						</h4>
						<p class="caption small-caption text-uppercase secondary--text mb-0" style="z-index:1;">
							<span v-if="mapPeriodIDX < 3">{{ $tc('deaths', 1) | normalizeNFD }} / </span>{{ $t('total deaths') | normalizeNFD }}
						</p>
						<sparklines
							:key="'gr-sparks-new_deaths-'+mapPeriodIDX"
							v-if="sparks.new_deaths.length > 7"
							class="d-block mt-3 totals-sparklines"
							:data="sparks.new_deaths"
							id="totals-g-deaths-sparklines" style="height: 60px;z-index:1;"/>
					</v-col>
				</v-row>
				<v-row class="mt-1 mb-4 px-7 py-0" align="center">
					<v-col cols="12" class="py-0 px-3">
						<v-row class="outlined">
							<!-- <v-col class="pa-2 primary--text" v-if="mapPeriodIDX === 0" align-self="center">
								<h4 class="text-1-2rem text-xs-subtitle-2 font-weight-bold">
									{{ new Intl.NumberFormat('el-GR').format(active.toFixed(2)) }}
									<v-tooltip bottom transition="slide-y-reverse-transition">
										<template v-slot:activator="{ on, attrs }">
											<v-btn
												class="ma-0 pa-0"
												x-small
												icon
												color=""
												dark
												v-bind="attrs"
												v-on="on"
											>
												<v-icon x-small color="grey lighten-1">mdi-information</v-icon>
											</v-btn>
										</template>
										<span class="caption">{{ $t('aggregated cases, excluding recovered patients and deaths') }}</span>
									</v-tooltip>
								</h4>
								<p class="caption small-caption text-uppercase blue-grey--text mb-0">
									{{ $t('Active Cases') | normalizeNFD }}
								</p>
							</v-col> -->
							<v-col class="pa-2 orange--text" v-if="mapPeriodIDX === 0">
								<h4 class="text-1-2rem text-xs-subtitle-2 font-weight-bold">
									{{ new Intl.NumberFormat('el-GR').format(critical.toFixed(2)) || '-' }}
								</h4>
								<p class="caption small-caption text-uppercase blue-grey--text mb-0">
									{{ $t('Intubated') | normalizeNFD }}
								</p>
							</v-col>
							<!-- <v-col class="pa-2 success--text" v-if="mapPeriodIDX > 0">
								<h4 class="text-1-2rem text-xs-subtitle-2 font-weight-bold">
									{{ new Intl.NumberFormat('el-GR').format(recovered.toFixed(2)) }}
								</h4>
								<p class="caption small-caption text-uppercase blue-grey--text mb-0">
									{{ $t('Recovered') | normalizeNFD }}
								</p>
							</v-col> -->
							<v-col class="pa-2 grey--text" align-self="center">
								<h4 class="text-1-2rem text-xs-subtitle-2 font-weight-bold">
									{{ new Intl.NumberFormat('el-GR').format(tests.toFixed(2)) || '-' }}
									<v-tooltip bottom transition="slide-y-reverse-transition">
										<template v-slot:activator="{ on, attrs }">
											<v-btn
												class="ma-0 pa-0"
												x-small
												icon
												color=""
												dark
												v-bind="attrs"
												v-on="on"
											>
												<v-icon x-small color="grey lighten-1">mdi-information</v-icon>
											</v-btn>
										</template>
										<span class="caption">{{ $t('total samples analyzed (RT-PCR & Ragid Ag)') }}</span>
									</v-tooltip>
								</h4>
								<p class="caption small-caption text-uppercase blue-grey--text mb-0">
									{{ $t('Tests') | normalizeNFD }}
								</p>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
				<v-row class="px-4" align="center">
					<v-col cols="6">
						<switch-map-source :label="$tc('Vaccination', 1)" :val="'vaccines'" @change="switchMapSource"/>
					</v-col>
					<v-col cols="6">
						<autocomplete-map-period model="mapVaccinationsPeriod" :label="$t('label.period')" :disabled="mapSource !== 'vaccines'"/>
					</v-col>
				</v-row>
				<v-row class="px-4" align="center">
					<v-col cols="12">
						<v-progress-linear
							:value="vaccines.perent"
							background-color="blue-grey lighten-5"
							color="green accent-4"
							height="24"
							class="vaccines-progress"
							>
							<template v-slot:default="{ value }">
								<span class="caption font-weight-bold text-end px-2">{{ new Intl.NumberFormat('el-GR').format(value.toFixed(2)) }}%</span>
							</template>
							</v-progress-linear>
					</v-col>
				</v-row>
				<v-row class="mt-1 mb-4 px-7 py-0" align="center">
					<v-col cols="12" class="py-0 px-3">
						<v-row class="outlined">
							<v-col class="pa-2 grey--text">
								<h4 class="text-1-2rem text-xs-subtitle-2 font-weight-bold">
									{{ new Intl.NumberFormat('el-GR').format(vaccines.totalDistinctPersons.toFixed(2)) || '-' }}
									<v-tooltip bottom transition="slide-y-reverse-transition">
										<template v-slot:activator="{ on, attrs }">
											<v-btn
												class="ma-0 pa-0"
												x-small
												icon
												color=""
												dark
												v-bind="attrs"
												v-on="on"
											>
												<v-icon x-small color="grey lighten-1">mdi-information</v-icon>
											</v-btn>
										</template>
										<span class="caption">{{ $t('Vaccinated People') }}</span>
									</v-tooltip>
								</h4>
								<p class="caption small-caption text-uppercase blue-grey--text mb-0">
									{{ $t('Vaccinated People') | normalizeNFD }}
								</p>
							</v-col>
							<v-col class="pa-2 grey--text" align-self="center">
								<h4 class="text-1-2rem text-xs-subtitle-2 font-weight-bold">
									{{ new Intl.NumberFormat('el-GR').format(vaccines.totalVaccinations.toFixed(2)) || '-' }}
									<v-tooltip bottom transition="slide-y-reverse-transition">
										<template v-slot:activator="{ on, attrs }">
											<v-btn
												class="ma-0 pa-0"
												x-small
												icon
												color=""
												dark
												v-bind="attrs"
												v-on="on"
											>
												<v-icon x-small color="grey lighten-1">mdi-information</v-icon>
											</v-btn>
										</template>
										<span class="caption">{{ $t('Cumulative vaccination doses') }}</span>
									</v-tooltip>
								</h4>
								<p class="caption small-caption text-uppercase blue-grey--text mb-0">
									{{ $t('Vaccinations') | normalizeNFD }}
								</p>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
			</v-container>
		</v-card>
	</v-tab-item>
</template>

<script>
import { mapGetters } from 'vuex';
import { sumBy } from 'lodash';

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
		...mapGetters('filters', ['mapSource', 'mapPeriod', 'mapPeriodIDX', 'mapVaccinationsPeriod', 'mapVaccinationsPeriodIDX', 'periodInterval'])
	},
	watch: {
		mapPeriod (value, old) {
			if (value !== old) {
				this.load();
			}
		},
		mapVaccinationsPeriod (value, old) {
			if (value !== old) {
				this.load();
			}
		}
	},
	data () {
		return {
			totalCases: 0,
			totalDeaths: 0,
			cases: 0,
			deaths: 0,
			active: 0,
			critical: 0,
			recovered: 0,
			tests: 0,
			new_cases: [],
			new_deaths: [],
			sparks: {
				new_cases: [],
				new_deaths: []
			},
			vaccines: {
				totalDistinctPersons: 0,
				totalVaccinations: 0,
				dayDiff: 0,
				dayTotal: 0,
				perent: 0
			},
			population: 0
		};
	},
	mounted () {
		this.load();
	},
	methods: {
		switchMapSource (v) {
			console.log(v);
		},
		load () {
			this.$store.dispatch('external/getGreeceTotal', { from: this.mapPeriodIDX > 0 ? this.mapPeriod : null })
				.then(res => {
					this.cases = sumBy(res, 'cases') || 0;
					this.deaths = sumBy(res, 'deaths') || 0;
				});

			// this.$store.dispatch('external/getGreeceTotal', { from: this.periodInterval[3].value })
			// 	.then(res => {
			// 		this.totalCases = sumBy(res, 'cases') - this.cases || 0;
			// 		this.totalDeaths = sumBy(res, 'deaths') - this.deaths || 0;
			// 	});

			this.$store.dispatch('external/getGlobal', 'GRC' + (this.mapPeriodIDX > 0 ? `/${this.mapPeriod}` : ''))
				.then(res => {
					this.totalCases = sumBy(res, 'total_cases') || 0;
					this.totalDeaths = sumBy(res, 'total_deaths') || 0;
					this.active = sumBy(res, 'total_active') || 0;
					this.critical = sumBy(res, 'total_critical') || 0;
					this.recovered = sumBy(res, 'recovered') || 0;
					this.tests = sumBy(res, 'tests') || 0;
				});

			this.$store.dispatch('external/getGlobalAGG', 'GRC/new_cases,new_deaths' + (this.mapPeriodIDX > 0 ? '/' + this.mapPeriod : ''))
				.then(res => {
					this.sparks.new_cases = res[0].new_cases.length > 1 ? res[0].new_cases : [];
					this.sparks.new_deaths = res[0].new_deaths.length > 1 ? res[0].new_deaths : [];
				});

			this.$store.dispatch('external/getGRVaccinesTotal', { from: this.mapVaccinationsPeriodIDX > 0 ? this.mapVaccinationsPeriod : this.$moment().subtract(1, 'days').format('YYYY-MM-DD') })
				.then(res => {
					this.population = sumBy(res, 'population') || 0;
					console.log(res);

					this.vaccines.totalDistinctPersons = this.mapVaccinationsPeriodIDX === 3 ? sumBy(res, 'total_distinct_persons') : sumBy(res, 'new_total_distinct_persons') || 0;
					this.vaccines.totalVaccinations = this.mapVaccinationsPeriodIDX === 3 ? sumBy(res, 'total_vaccinations') : sumBy(res, 'new_total_vaccinations') || 0;

					this.vaccines.dayTotal = sumBy(res, 'day_total') || 0;
					this.vaccines.dayDiff = sumBy(res, 'day_diff') || 0;

					this.vaccines.perent = (this.vaccines.totalDistinctPersons / this.population) * 100;
				});
		}
	}
};
</script>

<style lang="less" scoped>
.events {
	pointer-events: all;
}
.primary--opac {
	background: #f2f7f7;
}
.accent--opac {
	background: rgba(255,0,0,0.1);
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
