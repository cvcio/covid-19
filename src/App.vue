<template>
	<v-app id="app" toolbar footer>
		<top-alert v-if="!loading" :text="alertText"/>
		<top-app-bar v-if="!loading" />

		<v-navigation-drawer v-if="!loading" app touchless width="360" class="main-nav" v-model="navStats"
			:class="[
				(alert && $vuetify.breakpoint.xsOnly ? 'alert-mobile-nav' : ''),
				(alert && $vuetify.breakpoint.smAndUp ? 'alert-nav' : ''),
				(!alert && $vuetify.breakpoint.mdAndDown ? 'mobile-nav' : ''),
				(!alert && $vuetify.breakpoint.mdAndUp ? 'normal-nav' : '')
			]"
			>
			<v-row no-gutters justify="end" v-if="$vuetify.breakpoint.smAndDown" :class="alert ? '' : 'mt-1'" >
				<v-btn fixed fab small @click.stop="navStats = !navStats" class="mx-n3"  style="position: absolute; pointer-events: auto;">
					<v-icon small dark>mdi-arrow-left</v-icon>
				</v-btn>
			</v-row>
			<vue-custom-scrollbar class="scroll-area">
			<v-row no-gutters justify="center" align="center">
				<a href="https://imedd.org/" target="_blank" class="">
					<v-img :src="$BASE_URL + 'img/imedd.jpg'" max-height="56" max-width="180" />
				</a>
			</v-row>

			<v-divider dark class="mb-2"></v-divider>

			<v-list dense>
				<v-list-item>
					<v-list-item-content class="py-0">
						<v-list-item-title class="title mb-2">
							<span class="font-weight-black">
								<span class="">COVID</span>
								<span>&mdash;</span>
								<span class="">19</span>
							</span>
						</v-list-item-title>
						<p class="body-2 mb-0">Η εξάπλωση της νόσου <br/>στην Ελλάδα και στον κόσμο</p>
					</v-list-item-content>
				</v-list-item>
			</v-list>

			<v-divider dark class=""></v-divider>
			<v-list>
				<v-subheader class="grey--text mb-2">
					<span class="caption">Τελευταία Ενημέρωση: <span class="info--text">{{ find(alerts, ['key', 'lastUpdatedAt']).value || '' }}</span></span>
				</v-subheader>
				<v-list-item>
					<v-list-item-content class="py-0">
						<v-btn-toggle v-model="activeMap" small mandatory dark>
							<v-btn value="greece" :color="activeMap === 'greece' ? 'primary' : 'primary lighten-4'" small @click="triggerUpdate = new Date()">
								Ελλαδα
							</v-btn>
							<v-btn value="admin-0" :color="activeMap === 'admin-0' ? 'primary' : 'primary lighten-4'" small  @click="triggerUpdate = new Date()">
								ΚΟΣΜΟΣ
							</v-btn>
						</v-btn-toggle>
					</v-list-item-content>
				</v-list-item>
			</v-list>
			<v-divider dark class=""></v-divider>
			<v-row  no-gutters align="baseline">
				<v-col cols="6" class="py-0">
					<v-list>
						<v-subheader class="grey--text">Κρούσματα</v-subheader>
						<v-list-item>
							<v-list-item-content class="py-0">
								<v-list-item-subtitle class="headline font-weight-black">
									{{ new Intl.NumberFormat('el-GR').format(activeMap === 'admin-0' ? countCases : countCasesGR) }}
									<!-- <chart-sparklines :triggerUpdate="triggerUpdate" :level="activeMap" class=""/> -->
								</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-col>
				<v-col cols="6" class="py-0">
					<v-list class="">
						<v-subheader class="grey--text">Θάνατοι</v-subheader>
						<v-list-item>
							<v-list-item-content class="py-0">
								<v-list-item-subtitle class="headline red--text">
									{{ new Intl.NumberFormat('el-GR').format(activeMap === 'admin-0' ? countDeaths : countDeathsGR) }}
								</v-list-item-subtitle>
								<!-- <v-list-item-subtitle class="body-2">{{ ((100 * (activeMap === 'admin-0' ? countDeaths : countDeathsGR)) / (activeMap === 'admin-0' ? countCases : countCasesGR)).toFixed(2) }}% των κρουσμάτων</v-list-item-subtitle> -->
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-col>
			</v-row>
			<v-divider dark class=""></v-divider>

			<v-list>
				<v-subheader class="grey--text">Μέσος Όρος Κρουσμάτων 7 Ημερών</v-subheader>
				<v-list-item>
					<v-list-item-content class="py-0">
						<v-list-item-subtitle class="display-1 font-weight-black">
							<chart-sparklines :triggerUpdate="triggerUpdate" :level="activeMap" class=""/>
						</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</v-list>
			<v-divider dark class=""></v-divider>

			<template v-if="activeMap === 'greece'">
				<v-list class="">
					<v-subheader class="grey--text">Διασωληνωμένοι | Εξιτήρια</v-subheader>
					<v-list-item>
						<v-list-item-content class="py-0">
							<v-list-item-subtitle class="headline">
								{{ new Intl.NumberFormat('el-GR').format(countCriticalGR) }}<span class="mx-3">|</span>
								{{ new Intl.NumberFormat('el-GR').format(countRecoveredGR) }}
							</v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
				</v-list>
				<v-divider dark class=""></v-divider>
			</template>
			<v-list>
				<v-subheader class="grey--text">Η Εξέλιξη των Κρουσμάτων στον Χρόνο</v-subheader>
			</v-list>
			<chart-timeline :triggerUpdate="triggerUpdate" :level="activeMap" class="px-4"></chart-timeline>
			<v-divider dark class="mb-2"></v-divider>

			<template v-if="activeMap === 'admin-0' && wom_data">
				<v-data-table dense v-if="wom_data" class="mt-4 mb-3" :headers="[
					{ text: 'Χώρα', value: 'country', width: '40%', class: 'extra-small-text pr-1' },
					{ text: 'Κρούσματα', value: 'totalCases', width: '20%', class: 'extra-small-text pl-0 pr-1' },
					{ text: 'Ανάρρωσαν', value: 'totalRecovered', width: '20%', class: 'extra-small-text pl-0 pr-1' },
					{ text: 'Θάνατοι', value: 'totalDeaths', width: '20%', class: 'extra-small-text pl-0 pr-1' },

				]" :items="wom_data" :sort-by="['totalCases', 'totalRecovered', 'totalDeaths']" :sort-desc="[true, true, true]">
					<template v-slot:item="props">
						<tr>
							<td class="caption" style="font-size: 9px !important;">{{ props.item.country }}</td>
							<td class="caption pl-0" style="position:relative; font-size: 9px;">
								<h5 class="caption font-weight-bold primary--text" style="font-size: 9px !important;">
									{{ new Intl.NumberFormat('el-GR').format(props.item.totalCases) }}
									<div class="small-rect cases primary"
										:style="'width:' + (props.item.totalCases > 0 ? scale(props.item.totalCases, countCases) : 0) + '%;'"
									></div>
									<div class="small-rect grey lighten-2 bg"></div>
								</h5>
							</td>
							<td class="caption pl-0" style="position:relative; font-size: 9px;">
								<h5 class="caption font-weight-bold green--text " style="font-size: 9px !important;">
									{{ new Intl.NumberFormat('el-GR').format(props.item.totalRecovered) }}
									<div class="small-rect recovered green"
										:style="'width:' + (props.item.totalRecovered > 0 ? scale(props.item.totalRecovered, countRecovered) : 0) + '%;'"
									></div>
									<div class="small-rect grey lighten-2 bg"></div>
								</h5>
							</td>
							<td class="caption pl-0" style="position:relative; font-size: 9px;">
								<h5 class="caption font-weight-bold red--text " style="font-size: 9px !important;">
									{{ new Intl.NumberFormat('el-GR').format(props.item.totalDeaths) }}
									<div class="small-rect deaths red"
										:style="'width:' + (props.item.totalDeaths > 0 ? scale(props.item.totalDeaths, countDeaths) : 0) + '%;'"
									></div>
									<div class="small-rect grey lighten-2 bg"></div>
								</h5>
							</td>
						</tr>
					</template>
				</v-data-table>
			</template>
			<template v-else-if="activeMap === 'greece' && greece">
				<v-data-table dense v-if="greece" class="mt-4 mb-3" :headers="[
					{ text: 'Νομός', value: 'name', width: '40%', class: 'extra-small-text pr-1' },
					{ text: 'Κρούσματα', value: 'cases', width: '20%', class: 'extra-small-text pl-0 pr-1' },
					{ text: 'Εξιτήρια', value: 'recovered', width: '20%', class: 'extra-small-text pl-0 pr-1' },
					{ text: 'Θάνατοι', value: 'dead', width: '20%', class: 'extra-small-text pl-0 pr-1' },
				]" :items="greece" :sort-by="['cases', 'recovered', 'dead']" :sort-desc="[true, true, true]">
					<template v-slot:item="props">
						<tr>
							<td class="caption" style="font-size: 9px !important;">{{ props.item.name }}</td>
							<td class="caption pl-0" style="position:relative; font-size: 9px;">
								<h5 class="caption font-weight-bold primary--text" style="font-size: 9px !important;">
									{{ new Intl.NumberFormat('el-GR').format(props.item.cases) }}
									<div
										class="small-rect cases primary"
										:style="'width:' + (props.item.cases > 0 ? scale(props.item.cases, countCasesGR) : 0) + '%;'"></div>
									<div class="small-rect grey lighten-2 bg"></div>
								</h5>
							</td>
							<td class="caption pl-0" style="position:relative; font-size: 9px !important;">
								<h5 class="caption font-weight-bold green--text " style="font-size: 9px !important;">
									{{ new Intl.NumberFormat('el-GR').format(props.item.recovered) }}
									<div
										class="small-rect recovered green"
										:style="'width:' + (props.item.recovered > 0 ? scale(props.item.recovered, countRecoveredGR) : 0) + '%;'"></div>
									<div class="small-rect grey lighten-2 bg"></div>
								</h5>
							</td>
							<td class="caption pl-0" style="position:relative;">
								<h5 class="caption font-weight-bold red--text " style="font-size: 9px !important;">
									{{ new Intl.NumberFormat('el-GR').format(props.item.dead) }}
									<div
										class="small-rect deaths red"
										:style="'width:' + (props.item.dead > 0 ? scale(props.item.dead, countDeathsGR) : 0) + '%;'"></div>
									<div class="small-rect grey lighten-2 bg"></div>
								</h5>
							</td>
						</tr>
					</template>
					<template v-slot:footer>
					<!-- <p class="pa-4 pb-0 grey--text extra-small-text">*Στην Αττική περιλαμβάνεται το σύνολων των κρουσμάτων στις περιφερειακές ενότητες Αθηνών, Πειραιώς, Αν. Αττικής, Δ. Αττικής</p> -->
					</template>
				</v-data-table>
			</template>
			<template v-if="$vuetify.breakpoint.smAndDown">
				<v-divider dark class=""></v-divider>
				<v-list dense>
					<v-list-item @click.stop="$store.commit('set_dialogAbout', true)">
						<v-list-item-content>
							Η Εφαρμογή & Τα Data
						</v-list-item-content>
					</v-list-item>
					<v-divider dark class=""></v-divider>
					<v-list-item @click.stop="$store.commit('set_dialogTerms', true)">
						<v-list-item-content>
							<span><v-icon left small>mdi-creative-commons</v-icon>Όροι Χρήσης</span>
						</v-list-item-content>
					</v-list-item>
					<v-divider dark class=""></v-divider>
					<v-list-item href="https://mediawatch.io/" target="_blank" >
						<v-list-item-content>
							Visualization by CVCIO
						</v-list-item-content>
					</v-list-item>
					<v-divider dark class=""></v-divider>
					<v-list-item @click.stop="$store.commit('set_dialogEmbed', true)">
						<v-list-item-content>
							<span>Embed <v-icon right small>mdi-code-tags</v-icon></span>
						</v-list-item-content>
					</v-list-item>
					<v-divider dark class=""></v-divider>
				</v-list>
				<v-chip x-small color="red" dark label depressed class="ml-4 text-inherit">
					<span class="caption">BETA</span>
				</v-chip>
			</template>
			</vue-custom-scrollbar>
		</v-navigation-drawer>

		<v-navigation-drawer app touchless light right width="280" class="news-nav" v-model="navNews"
			:class="[
				(alert && $vuetify.breakpoint.xsOnly ? 'alert-mobile-nav' : ''),
				(alert && $vuetify.breakpoint.smAndUp ? 'alert-nav' : ''),
				(!alert && $vuetify.breakpoint.mdAndDown ? 'mobile-nav' : ''),
				(!alert && $vuetify.breakpoint.mdAndUp ? 'normal-nav' : '')
			]"
			>
			<v-row no-gutters justify="start" v-if="$vuetify.breakpoint.smAndDown" :class="alert ? 'mb-12' : 'mt-2 mb-12'">
				<v-btn fixed fab small @click.stop="navNews = !navNews" class="mx-3" style="pointer-events: auto;">
					<v-icon small dark>mdi-arrow-right</v-icon>
				</v-btn>
			</v-row>
			<v-row no-gutters class="" :class="$vuetify.breakpoint.smAndDown ? 'mt-6' : 'mt-3'">
				<a class="twitter-timeline" target="_blank" href="https://twitter.com/iMEdDLab/lists/imedd-lab-covid-19?ref_src=twsrc%5Etfw">A Twitter List by iMEdDLab</a>
			</v-row>
		</v-navigation-drawer>

		<div id="map" class="">
			<v-row no-gutters justify="center" align="center" class="loader" v-if="loading" >
				<span class="mb-12 mt-n12 grey--text text-center">Φορτώνεται ο παγκόσμιος χάρτης και η βάση δεδομένων κρουσμάτων με COVID-19</span>
				<v-progress-circular v-if="loading" class="loader mt-12" color="primary" indeterminate :size="24"/>
			</v-row>
			<map-mapbox v-if="!loading" :level="activeMap"/>
		</div>

		<dialog-about v-if="!loading" />
		<dialog-terms v-if="!loading" />
		<dialog-embed v-if="!loading" />

		<bottom-footer v-if="!loading && $vuetify.breakpoint.mdAndUp"/>
	</v-app>
</template>

<script>
import { scaleLinear } from 'd3';
import { max, find, findIndex, filter, map, mean, escape, unescape, fill } from 'lodash';
import chroma from 'chroma-js';
import { mapGetters } from 'vuex';

export default {
	name: 'covid-19',
	components: {
		'chart-timeline': require('@/components/chart-timeline').default,
		'chart-sparklines': require('@/components/chart-sparklines').default,
		'map-mapbox': require('@/components/map-mapbox').default,

		'top-alert': require('@/components/top-alert').default,
		'top-app-bar': require('@/components/top-app-bar').default,

		'bottom-footer': require('@/components/bottom-footer').default,

		'dialog-about': require('@/components/dialog-about').default,
		'dialog-terms': require('@/components/dialog-terms').default,
		'dialog-embed': require('@/components/dialog-embed').default,

		'vue-custom-scrollbar': require('vue-custom-scrollbar')
	},
	computed: {
		...mapGetters([
			'loading', 'alert',
			'worldGeoJson', 'countriesMapping', 'worldPopulation', 'globalData',
			'cases', 'deaths', 'recovered', 'greece', 'wom_data',
			'countCases', 'countDeaths', 'countRecovered', 'countCritical',
			'countCasesGR', 'countDeathsGR', 'countRecoveredGR', 'countCriticalGR', 'countHospitalizedGR',
			'lastUpdatedAt',
			'alerts'
		]),

		alertText () {
			return this.alerts ? find(this.alerts, ['key', 'alertText']).value : '';
		},

		navStats: {
			get () {
				return this.$store.state.navStats;
			},
			set (state) {
				if (state !== this.$store.state.navStats) {
					this.$store.commit('set_navStats', state);
				}
			}
		},
		navNews: {
			get () {
				return this.$store.state.navNews;
			},
			set (state) {
				if (state !== this.$store.state.navNews) {
					this.$store.commit('set_navNews', state);
				}
			}
		}
	},
	data () {
		return {
			activeMap: 'greece',
			triggerUpdate: new Date()
		};
	},
	mounted () {
		let unix = this.$moment().unix();
		let jsonFiles = [
			{ file: `${this.$BASE_URL}shared/custom.geojson`, key: 'worldGeoJson' },
			{ file: `${this.$BASE_URL}shared/greece-simplified.geojson`, key: 'greeceGeoJson' }
		];

		let csvFiles = [
			{ file: `https://raw.githubusercontent.com/iMEdD-Lab/open-data/master/COVID-19/countriesMapping.csv?${unix}`, key: 'countriesMapping' },
			// { file: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRpR8AOJaRsB5by7H3R_GijtaY06J8srELipebO5B0jYEg9pKugT3C6Rk2RSQ5eyerQl7LolshamK27/pub?gid=527109001&single=true&output=csv', key: 'countriesMapping' },
			{ file: `${this.$BASE_URL}shared/world-population.csv`, key: 'worldPopulation' },

			{ file: `https://raw.githubusercontent.com/iMEdD-Lab/open-data/master/COVID-19/alerts.csv?${unix}`, key: 'alerts' },

			{ file: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv', key: 'cases' },
			{ file: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv', key: 'deaths' },
			{ file: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv', key: 'recovered' },

			{ file: 'https://raw.githubusercontent.com/iMEdD-Lab/open-data/master/COVID-19/wom_data.csv', key: 'wom_data' },
			{ file: `https://raw.githubusercontent.com/iMEdD-Lab/open-data/master/COVID-19/greece.csv?${unix}`, key: 'greece' },
			{ file: `https://raw.githubusercontent.com/iMEdD-Lab/open-data/master/COVID-19/greeceTimeline.csv?${unix}`, key: 'greeceTimeline' }
		];

		Promise.all([
			...csvFiles.map(m => this.$store.dispatch('fetchDynamicData', m)),
			...jsonFiles.map(m => this.$store.dispatch('fetchStaticData', m)),
		]).then(() => {
			this.triggerUpdate = new Date();

			this.$store.commit('set_globalData', {
				cases: this.cases,
				deaths: this.deaths,
				recovered: this.recovered
			});
			let empty = Array.apply(null, new Array(this.globalData[0].dates.length)).map(Number.prototype.valueOf, 0);
			this.worldGeoJson.features.forEach(m => {
				let idx_m = findIndex(this.countriesMapping, ['country', m.properties.admin]);
				m.properties.ADMIN_GR = idx_m > -1 ? this.countriesMapping[idx_m].name_x : m.properties.admin;

				m.properties.count = 0;
				m.properties.opacity = 0;
				m.properties.totalIndex = 0;
				m.properties.color = '#fafafa';

				let idx_p = findIndex(this.worldPopulation, ['country', m.properties.ADMIN_GR]);
				m.properties.population = idx_p > -1 ? this.worldPopulation[idx_p].population : m.properties.pop_est;

				let data = find(this.globalData, ['country', m.properties.ADMIN_GR]) || null;

				m.properties.cases = data ? data.cases : [];
				m.properties.deaths = data ? data.deaths : [];
				m.properties.recovered = data ? data.recovered : [];
				m.properties.totalIndex = data ? data.cases.map(x => {
					return parseFloat(((x / m.properties.population) * 1000000).toFixed(2));
				}) : [];

				let idx_w = findIndex(this.wom_data, ['country', m.properties.ADMIN_GR]);
				if (idx_w > -1 && m.properties.cases.length > 0) {
					m.properties.cases.push(this.wom_data[idx_w].totalCases);
					m.properties.deaths.push(this.wom_data[idx_w].totalDeaths);
					m.properties.recovered.push(this.wom_data[idx_w].totalRecovered);
					m.properties.totalIndex.push(this.wom_data[idx_w].totalIndex);
				}
			});

			// console.log(this.globalData);
			// console.log(this.wom_data);

			this.wom_data.forEach(m => {
				let idx_m = findIndex(this.globalData, ['country', m.country]);
				if (idx_m < 0) {
					// console.log(m.country);
				}
			});

			// eslint-disable-next-line no-console
			this.$nextTick(() => {
				setTimeout(() => {
					this.$store.commit('set_loading', false);
					if (window.twttr) {
						window.twttr.widgets.load();
					}
				}, 2500);
			});

		}).catch((err) => console.error('Error while fetching data. Please try later.', err));
	},
	methods: {
		find,
		findIndex,
		max,
		mean,
		scale (v, m) {
			return scaleLinear()
				.domain([1, m])
				.rangeRound([2, 80])(v);
		}
	}
};
</script>

<style lang="less">
html, body, #app {
	overflow: hidden;
}

.v-toolbar__content {
	margin: 0;
	padding: 0;
}
.mono {
    font-family: 'Roboto Mono' !important;
	font-weight: 400;
	strong {
		font-weight: 700;
	}
}

a {
	text-decoration: none;
	border: none;
	outline: none;
	&.link {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		background-image: linear-gradient(currentColor, currentColor);
		background-position: 0% 100%;
		background-repeat: no-repeat;
		background-size: 0% 1px;
		font-weight: inherit;
		&:hover, a:focus{
			background-size: 100% 1px;
		}
	}
}

.extra-m-96 {
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	margin-top: 8px !important;
}
.extra-p-96 {
	padding-top: 48px !important;
}
.extra-p-120 {
	padding-top: 72px !important;
}
.extra-p-192 {
	padding-top: 96px !important;
}

.metrics {
	// pointer-events: none;
	width: 100%;
	height: 388px;
	// position: fixed;
	// bottom: 32px;
	// z-index: 1;
	position: absolute;
	bottom: 0;
	&.isMobile {
		position: relative;
	}

	.block {
		position: absolute;
		top: 0;
	}
}
.scroll-area {
	margin: 0 0 48px 0;
	height: calc(~'100% - 48px');
	overflow: hidden !important;
}

.loader {
	position: fixed;
	z-index: 100;
	padding: 0 !important;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.v-list-item {
	min-height: 0;
}
.v-subheader {
	height: 24px;
}
.main-nav {
	.v-navigation-drawer__content {
		overflow-y: hidden !important;
	}
}

.code {
	font-family: 'Roboto Mono', monospace;
	text-indent: none !important;
}

.color-scale {
	position: absolute;
	width: 300px;
	height: 12px;
	display: block;
	content: ' ';
	bottom: 72px;
	left: 50%;
	transform: translate(-50%, 0);
	z-index: 0;
	background: red;
	background-image: linear-gradient(
	  to right,
	  #fff,
      #fafa6e,
      red,
      #8b0000
	);
	&.isMobile {
		bottom: 120px;
	}
}



.main-bar {
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	&.alert-mobile-bar {
		margin-top: 56px !important;
	}
	&.mobile-bar {
		margin-top: 38px !important;
	}
	&.alert-bar {
		margin-top: 38px !important;
	}
}
.main-nav, .news-nav {
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	&.alert-mobile-nav {
		padding-top: 64px;
	}
	&.mobile-nav {
		padding-top: 0;
	}
	&.alert-nav {
		margin-top: 38px !important;
	}
	&.normal-nav {}
}
.text-inherit {
	text-transform: none !important;
}
.v-data-footer {
	button {
		margin-left: 0 !important;
		margin-right: 0 !important;
	}
}
.v-data-footer__pagination {
	margin-left: 0 !important;
	margin-right: 0 !important;
}
.v-data-footer__select {
	margin-right: 8px !important;
	.v-input {
		margin-left: 8px !important;
	}
}

.extra-small-text {
	font-size: 9px !important;
}
.small-rect {
	position: absolute;
	display: block;
	content: ' ';

	width: calc(~'80%');
	height: 4px;
	bottom: 0;
	z-index: 1;
	&.bg {
		z-index: 0;
	}
}
</style>
