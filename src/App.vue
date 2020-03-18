<template>
	<v-app id="app" toolbar footer>
		<v-alert v-if="!loading" :value="alert" dense tile class="ma-0 caption" type="error" color="accent" id="alert" transition="slide-y-transition">
			<v-row align="center" no-gutters>
				<v-col xs="11" class="grow white--text link" v-html="find(alerts, ['key', 'alertText']).value"></v-col>
				<v-col class="shrink">
					<v-btn icon small @click.stop="alert = false">
						<v-icon small>mdi-close</v-icon>
					</v-btn>
				</v-col>
			</v-row>
		</v-alert>

		<v-app-bar app fixed dark color="transparent" flat  v-if="!loading"
			class="main-bar"
			:class="[
				(alert && $vuetify.breakpoint.smAndDown ? 'alert-mobile-bar' : ''),
				(alert && $vuetify.breakpoint.mdAndUp ? 'alert-bar' : ''),
			]"
			>
			<v-row no-gutters :justify="$vuetify.breakpoint.mdAndDown ? 'end' : 'start'">
				<v-btn fab small @click.stop="navStats = !navStats" class="primary mx-3" style="pointer-events: auto;">
					<v-icon small>mdi-chart-timeline-variant</v-icon>
				</v-btn>
				<v-spacer v-if="$vuetify.breakpoint.smAndUp"></v-spacer>
				<v-btn fab small @click.stop="navNews = !navNews" class="primary mx-3"  style="pointer-events: auto;">
					<v-icon small>mdi-message-alert</v-icon>
				</v-btn>
			</v-row>
		</v-app-bar>

		<v-navigation-drawer v-if="!loading" app touchless width="330" class="main-nav" v-model="navStats"
			:class="[
				(alert && $vuetify.breakpoint.xsOnly ? 'alert-mobile-nav' : ''),
				(alert && $vuetify.breakpoint.smAndUp ? 'alert-nav' : ''),
				(!alert && $vuetify.breakpoint.mdAndDown ? 'mobile-nav' : ''),
				(!alert && $vuetify.breakpoint.mdAndUp ? 'normal-nav' : '')
			]"
			>
			<v-row no-gutters justify="end" v-if="$vuetify.breakpoint.smAndDown" :class="alert ? '' : ''" >
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

			<v-list>
				<v-subheader class="grey--text">Καταγεγραμμένα Κρούσματα</v-subheader>
				<v-list-item>
					<v-list-item-content class="py-0">
						<v-list-item-subtitle class="display-1 font-weight-black">{{ new Intl.NumberFormat('el-GR').format(activeMap === 'admin-0' ? countCases : countCasesGR) }}</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</v-list>
			<v-divider dark class=""></v-divider>
			<v-list class="">
				<v-subheader class="grey--text">Θάνατοι </v-subheader>
				<v-list-item>
					<v-list-item-content class="py-0">
						<v-list-item-subtitle class="display-1 red--text">{{ new Intl.NumberFormat('el-GR').format(activeMap === 'admin-0' ? countDeaths : countDeathsGR) }}</v-list-item-subtitle>
						<v-list-item-subtitle class="body-2">{{ ((100 * (activeMap === 'admin-0' ? countDeaths : countDeathsGR)) / (activeMap === 'admin-0' ? countCases : countCasesGR)).toFixed(2) }}% των κρουσμάτων</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</v-list>
			<v-divider dark class=""></v-divider>
			<v-list>
				<v-subheader class="grey--text">Η Εξέλιξη των Κρουσμάτων στον Χρόνο</v-subheader>
			</v-list>
			<chart-timeline :triggerUpdate="triggerUpdate" :level="activeMap" class="px-4 mb-12"></chart-timeline>
			<v-divider dark class="mb-2"></v-divider>

			<template v-if="activeMap === 'admin-0' && byCountry">
				<v-data-table dense v-if="byCountry" class="mt-4 mb-3" :headers="[
					{ text: 'Χώρα', value: 'country', width: '30%', class: 'px-0' },
					{ text: 'Κρούσματα', value: 'cases', width: '35%', class: 'pr-0' },
					{ text: 'Θάνατοι', value: 'deaths', width: '35%', class: 'pr-0' },
				]" :items="byCountry">
					<template v-slot:header.country="{ header }">
						<span class="caption">{{ header.text }}</span>
					</template>
					<template v-slot:header.cases="{ header }">
						<span class="caption">{{ header.text }}</span>
					</template>
					<template v-slot:header.deaths="{ header }">
						<span class="caption">{{ header.text }}</span>
					</template>
					<template v-slot:item="props">
						<tr>
							<td class="pr-0">{{ props.item.country }}</td>
							<td class="pr-0">{{ new Intl.NumberFormat('el-GR').format(props.item.cases) }}</td>
							<td class="red--text">{{ new Intl.NumberFormat('el-GR').format(props.item.deaths) }}</td>
						</tr>
					</template>
				</v-data-table>
			</template>
			<template v-else-if="activeMap === 'greece' && greece">
				<v-data-table dense v-if="greece" class="mt-4 mb-3" :headers="[
					{ text: 'Περιοχή', value: 'county', width: '30%', class: 'pr-0' },
					{ text: 'Κρούσματα', value: 'cases', width: '35%', class: 'pr-0' },
					{ text: 'Θάνατοι', value: 'dead', width: '35%', class: 'pr-0' },
				]" :items="greece">
					<template v-slot:header.county="{ header }">
						<span class="caption text-truncate">{{ header.text }}</span>
					</template>
					<template v-slot:header.cases="{ header }">
						<span class="caption text-truncate">{{ header.text }}</span>
					</template>
					<template v-slot:header.dead="{ header }">
						<span class="caption text-truncate">{{ header.text }}</span>
					</template>
					<template v-slot:item="props">
						<tr>
							<td class="pr-0">{{ props.item.county }}</td>
							<td class="pr-0">{{ new Intl.NumberFormat('el-GR').format(props.item.cases) }}</td>
							<td class="red--text">{{ new Intl.NumberFormat('el-GR').format(props.item.dead) }}</td>
						</tr>
					</template>
				</v-data-table>
			</template>
			<template v-if="$vuetify.breakpoint.smAndDown">
				<v-divider dark class=""></v-divider>
				<v-list dense>
					<v-list-item @click.stop="dialogAbout = true">
						<v-list-item-content>
							Η Εφαρμογή & Τα Data
						</v-list-item-content>
					</v-list-item>
					<v-divider dark class=""></v-divider>
					<v-list-item @click.stop="dialogTerms = true">
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
					<v-list-item @click.stop="dialogEmbed = true">
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
			<v-row no-gutters justify="start" v-if="$vuetify.breakpoint.smAndDown" :class="alert ? 'mt-12' : ''">
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

		<v-dialog  v-if="!loading" v-model="dialogAbout" width="600px" transition="slide-y-reverse-transition" :fullscreen="$vuetify.breakpoint.mdAndDown">
			<v-card tile>
				<v-card-title>
					<span class="title text-truncate">
						Η εφαρμογή και τα δεδομένα
					</span>
					<v-spacer></v-spacer>
					<v-btn icon @click="dialogAbout=false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>
				<text-about/>
			</v-card>
		</v-dialog>

		<v-dialog  v-if="!loading" v-model="dialogTerms" width="600px" transition="slide-y-reverse-transition" :fullscreen="$vuetify.breakpoint.mdAndDown">
			<v-card tile>
				<v-card-title>
					<span class="title text-truncate">
						Όροι Χρήσης
					</span>
					<v-spacer></v-spacer>
					<v-btn icon @click="dialogTerms = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>
				<text-terms/>
			</v-card>
		</v-dialog>

		<v-dialog v-if="!loading" v-model="dialogEmbed" class="embed-dialog" max-width="360" transition="slide-y-reverse-transition" fullscreen>
			<v-card tile>
				<v-card-title>
					<span class="title text-truncate">
						Ενσωμάτωση Κώδικα
					</span>
					<v-spacer></v-spacer>
					<v-btn icon @click="dialogEmbed = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					<v-container fill-height>
						<v-row align="center" justify="center">
							<v-col cols="12" xs="12" md="8">
								<div class="pa-6 mb-4 grey lighten-2 elevation-0 code" style="position: relative;">
									<h4 class="accent--text">&lt;iframe</h4>
									<h4 class="accent--text pl-6">src=&quot;{{'https://lab.imedd.org/covid19/'}}&quot;</h4>
									<h4 class="accent--text pl-6">style=&quot;border:0px #ffffff none;&quot;</h4>
									<h4 class="accent--text pl-6">name=&quot;imedd-covid&quot;</h4>
									<h4 class="accent--text pl-6">scrolling=&quot;no&quot;</h4>
									<h4 class="accent--text pl-6">frameborder=&quot;1&quot;</h4>
									<h4 class="accent--text pl-6">marginheight=&quot;0px&quot;</h4>
									<h4 class="accent--text pl-6">marginwidth=&quot;0px&quot;</h4>
									<h4 class="accent--text pl-6">height=&quot;640px&quot;</h4>
									<h4 class="accent--text pl-6">width=&quot;640px&quot;</h4>
									<h4 class="accent--text pl-6">allowfullscreen&gt;</h4>
									<h4 class="accent--text">&lt;/iframe&gt;</h4>
								</div>

								<p>Με τον παραπάνω κώδικα μπορείτε να ενσωματώσετε την εφαρμογή στην ιστοσελίδα σας. Εάν παρατηρήσετε προβλήματα στην ενσωμάτωση, επικοινωνήστε μαζί μας στο <a href="mailto:lab@imedd.org" target="_blank">lab@imedd.org</a> ή χρησιμοποιήστε τη <a href="https://www.imedd.org/el/contact/" target="_blank">φόρμα επικοινωνίας</a> με το iMEdD.</p>
							</v-col>
						</v-row>
					</v-container>
				</v-card-text>
			</v-card>
		</v-dialog>

		<div v-if="!loading" class="color-scale" :class="$vuetify.breakpoint.mdAndDown ? 'isMobile' : ''">
			<v-row no-gutters justify="space-between" align="center" class="mt-3">
				<v-col class="caption font-weight-bold">0</v-col>
				<v-col class="caption font-weight-bold text-center">1</v-col>
				<v-col class="caption font-weight-bold text-center">
					{{ new Intl.NumberFormat('el-GR').format(
						Math.floor(mean(byCountry.map(m => m.count)))
					) }}
				</v-col>
				<v-col class="caption font-weight-bold text-right">
					{{ new Intl.NumberFormat('el-GR').format(
						max(byCountry.map(m => m.count))
					) }}
				</v-col>
			</v-row>
		</div>

		<v-footer v-if="!loading && $vuetify.breakpoint.mdAndUp" app inset dark class="primary lighten-1" :class="$vuetify.breakpoint.mdAndUp ? '' : 'py-3 mb-8'">
			<v-btn x-small text @click.stop="dialogAbout = true" class="text-inherit">
				Η Εφαρμογή & Τα Data
			</v-btn>
			<v-btn x-small text @click.stop="dialogTerms = true" class="text-inherit">
				<v-icon left small>mdi-creative-commons</v-icon>Όροι Χρήσης
			</v-btn>
			<v-btn x-small text href="https://mediawatch.io/" target="_blank" class="text-inherit">
				Visualization by CVCIO
			</v-btn>
			<v-spacer v-if="$vuetify.breakpoint.smAndUp"></v-spacer>
			<v-btn x-small text @click.stop="dialogEmbed = true">
				Embed <v-icon right small>mdi-code-tags</v-icon>
			</v-btn>
			<v-btn x-small color="red" depressed class="ml-2 text-inherit">
				<span class="caption">BETA</span>
			</v-btn>
		</v-footer>
	</v-app>
</template>

<script>
import { scaleLinear } from 'd3';
import { max, find, findIndex, filter, map, mean, escape, unescape} from 'lodash';
import chroma from 'chroma-js';
import { mapGetters } from 'vuex';

export default {
	name: 'covid-19',
	components: {
		'chart-timeline': require('@/components/chart-timeline').default,
		'map-mapbox': require('@/components/map-mapbox').default,
		'vue-custom-scrollbar': require('vue-custom-scrollbar'),
		'text-about': require('@/components/text-about').default,
		'text-terms': require('@/components/text-terms').default
	},
	computed: {
		...mapGetters([
			'worldGeoJson', 'countriesMapping',
			'cases', 'deaths', 'recovered', 'greece',
			'countCases', 'countDeaths', 'countRecovered', 'countCritical',
			'countCasesGR', 'countDeathsGR', 'countRecoveredGR', 'countCriticalGR',
			'lastUpdatedAt',
			'byCountry',
			'alerts'
		])
	},
	data () {
		return {
			loading: true,
			dialogAbout: false,
			dialogTerms: false,
			navNews: false,
			navStats: this.$vuetify.breakpoint.mdAndDown ? false : true,
			alert: true,

			dialogEmbed: false,
			activeMap: 'greece',
			triggerUpdate: new Date()
		};
	},
	mounted () {
		let unix = this.$moment().unix();
		let jsonFiles = [
			{ file: `${this.$BASE_URL}shared/countries-simplified.geojson`, key: 'worldGeoJson' },
			{ file: `${this.$BASE_URL}shared/countries.json`, key: 'countries' }
		];

		let csvFiles = [
			{ file: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv', key: 'cases' },
			{ file: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv', key: 'deaths' },
			{ file: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv', key: 'recovered' },

			{ file: `https://raw.githubusercontent.com/iMEdD-Lab/open-data/master/COVID-19/countriesMapping.csv?${unix}`, key: 'countriesMapping' },
			{ file: `https://raw.githubusercontent.com/iMEdD-Lab/open-data/master/COVID-19/greece.csv?${unix}`, key: 'greece' },
			{ file: `https://raw.githubusercontent.com/iMEdD-Lab/open-data/master/COVID-19/greeceTimeline.csv?${unix}`, key: 'greeceTimeline' },
			{ file: `https://raw.githubusercontent.com/iMEdD-Lab/open-data/master/COVID-19/alerts.csv?${unix}`, key: 'alerts' }
		];

		Promise.all([
			...jsonFiles.map(m => this.$store.dispatch('fetchStaticData', m)),
			...csvFiles.map(m => this.$store.dispatch('fetchDynamicData', m))
		]).then(() => {
			this.triggerUpdate = new Date();
			this.worldGeoJson.features.forEach(m => {
				let idx_m = findIndex(this.countriesMapping, ['country', m.properties.ADMIN]);
				if (idx_m > -1) {
					m.properties.ADMIN_GR = this.countriesMapping[idx_m].name_x;
					m.properties.ADMIN_H = this.countriesMapping[idx_m].country_h;
				}
				m.properties.count = 0;
			});
			this.cases.forEach((m, i) => {
				let idx_m = findIndex(this.worldGeoJson.features, c => {
					return c.properties.ADMIN === m['Country/Region'] || c.properties.ADMIN_H === m['Country/Region'];
				});

				if (idx_m > -1) {
					this.cases[i]['Country/Region'] = this.worldGeoJson.features[idx_m].properties.ADMIN_GR;
				}
			});
			this.deaths.forEach(m => {
				let idx_m = findIndex(this.worldGeoJson.features, c => {
					return c.properties.ADMIN === m['Country/Region'] || c.properties.ADMIN_H === m['Country/Region'];
				});

				if (idx_m > -1) {
					m['Country/Region'] = this.worldGeoJson.features[idx_m].properties.ADMIN_GR;
				}
			});

			this.recovered.forEach(m => {
				let idx_m = findIndex(this.worldGeoJson.features, c => {
					return c.properties.ADMIN === m['Country/Region'] || c.properties.ADMIN_H === m['Country/Region'];
				});

				if (idx_m > -1) {
					m['Country/Region'] = this.worldGeoJson.features[idx_m].properties.ADMIN_GR;
				}
			});

			this.loading = false;

			// eslint-disable-next-line no-console
			this.$nextTick(() => {
				setTimeout(() => {
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
		mean
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
	width: 180px;
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

#alert {
	width: 100%;
	position: relative;
	left: 0;
	top: 0;
	z-index: 100;
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
</style>
