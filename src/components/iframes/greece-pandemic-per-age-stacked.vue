<!--
	"el": "N3 (4) - Εξέλιξη πανδημίας ανά ηλικιακή ομάδα",
	"en": "N3 (4) - Evolution by age group"
-->

<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'"
			:height="$vuetify.breakpoint.smAndDown ? 120 : 120">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0" justify="space-between">
					<v-col class="pa-0 shrink" align-self="center">
						<v-btn-toggle dense class="mr-1" rounded v-model="point" mandatory>
							<v-btn x-small class="primary--text" value="cases">
								{{ ($tc('cases', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="deaths">
								{{ ($tc('deaths', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="hospitalized_in_icu">
								{{ ($t('ICU')) | normalizeNFD }}
							</v-btn>
						</v-btn-toggle>
					</v-col>
					<v-col class="pa-0 grow text-end ml-2" align-self="center" v-if="!$route.meta.iframe">
						<v-btn x-small fab color="primary" dark class="mx-0 elevation-0" @click="setEmbed">
							<v-icon x-small>fa-code</v-icon>
						</v-btn>
					</v-col>
				</v-row>
				<v-row class="pa-0 ma-0 mt-4" justify="space-between">
					<v-col class="pa-0" cols="12" md="6" align-self="center">
						<v-select dense outlined color="primary" hide-details prepend-icon="" class="caption"
							:label="$t('Time Period')" :items="[...periodInterval.slice(1)]" :item-text="'text.' + locale.code"
							item-value="value" v-model="period" auto-select-first @change="load">
							<template v-slot:prepend>
								<v-icon small class="mt-1" color="primary">
									fa-clock
								</v-icon>
							</template>
						</v-select>
					</v-col>
				</v-row>
			</v-container>
		</v-app-bar>
		<v-divider v-if="!$route.meta.iframe" />
		<v-container class="px-4" fluid>
			<v-row class="px-0" v-if="loading">
				<v-col align="center">
					<v-progress-circular indeterminate color="grey"></v-progress-circular>
				</v-col>
			</v-row>
			<v-row class="px-0" v-else>
				<v-col cols="12" class="px-4">
					<stacked-mirror-area :key="'gbc-vds-' + item.uid + '-' + point + '-' + period"
						:id="'gbc-vds-' + item.uid + '-' + point + '-' + period" :values="item"
						:keys="[`per_age_${point}_1`, `per_age_${point}_2`, `per_age_${point}_3`, `per_age_${point}_4`]"
						:min="item.min" :max="item[`population_${point}`]" :mirrored="false" :dates="item.dates"
						:sources="item.sources" />
				</v-col>
			</v-row>
		</v-container>
		<v-divider class="mx-4" />
		<v-footer class="white caption small-caption pa-4 pt-2">
			<a href="https://lab.imedd.org/covid19/" target="_blank" v-if="$route.meta.iframe">
				<v-icon x-small class="mr-2" color="primary">fa-link</v-icon><span class="font-weight-bold">iMΕdD LAB</span>: {{
						title[locale.code]
				}}
			</a>
			<span v-else>
				<span class="font-weight-bold">iMΕdD LAB</span>: {{ title[locale.code] }}
			</span>
		</v-footer>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { groupDatesByWeek } from '@/utils';
import { sumBy, mean } from 'lodash';

export default {
	name: 'greece-pandemic-per-age-stacked',
	props: {
		delay: {
			default: 100
		}
	},
	components: {
		'stacked-mirror-area': require('@/components/charts/stacked-mirror-area').default
	},
	computed: {
		...mapGetters(['locale']),
		...mapGetters('filters', ['periodInterval', 'periodIntervalIDX']),
		...mapGetters('internal', ['annotations']),
		...mapGetters('internal', ['posts']),
		embed() {
			return {
				title: '',
				subtitle: '',
				text: '',
				mapLevel: null,
				mapKey: null,
				mapYear: null,
				view: 'cases',
				availableViews: ['cases', 'deaths', 'ICU'],
				aggregation: null,
				period: this.periodIntervalIDX.length - 1,
				availablePeriods: [...this.periodIntervalIDX.slice(1)],
				lang: this.locale.code,
				id: 'greece-pandemic-per-age-stacked'
			};
		}
	},
	data() {
		return {
			loading: true,
			point: 'cases',
			item: null,
			period: {
				from: '2020-01-01',
				to: this.$moment().format('YYYY-MM-DD')
			},
			title: { en: '', el: '' }
		};
	},
	mounted() {
		setTimeout(() => {
			this.preload();
		}, this.delay);
	},
	methods: {
		preload() {
			if (this.annotations.length === 0) {
				this.$store.dispatch('internal/getAnnotations');
			}
			if (this.$route.query.view && this.$route.query.view !== '') {
				this.point = this.$route.query.view;

				if (this.$route.query.view === 'icu') this.point = 'hospitalized_in_icu';
			}
			if (this.$route.query.period && this.$route.query.period !== '') {
				this.period = this.periodInterval[parseInt(this.$route.query.period)].value;
			}
			if (this.posts.greece.length === 0) {
				this.$store.dispatch('internal/getPosts')
					.then(() => {
						this.load();
					});
			} else {
				this.load();
			}
		},
		setEmbed() {
			this.$store.commit('setEmbedDialog', true);
			this.$store.commit('setEmbed', this.embed);
		},
		load() {
			this.loading = true;
			this.title = this.posts[this.embed.id.split('-')[0]].find(m => m.component.id === this.embed.id).title || '';
			this.$store.dispatch('external/getDemographicsData', { from: this.period.from, to: this.period.to })
				.then(res => {

					const per_age_1 = (res.filter((o) => { return o.category == '0-17'; }));
					const per_age_2 = (res.filter((o) => { return o.category == '18-39'; }));
					const per_age_3 = (res.filter((o) => { return o.category == '40-64'; }));
					const per_age_4 = (res.filter((o) => { return o.category == '65+'; }));

					const data_per_age_1 = per_age_1.map((m, i) => {
						return {
							week: this.$moment(m.date).week(),
							year: this.$moment(m.date).year(),
							date: m.date,
							cases: m.cases,
							deaths: m.deaths,
							intensive: m.intensive,
							// hospitalized_in_icu: m.hospitalized_in_icu
						};
					});

					const data_per_age_2 = per_age_2.map((m, i) => {
						return {
							week: this.$moment(m.date).week(),
							year: this.$moment(m.date).year(),
							date: m.date,
							cases: m.cases,
							deaths: m.deaths,
							intensive: m.intensive,
							// hospitalized_in_icu: m.hospitalized_in_icu
						};
					});

					const data_per_age_3 = per_age_3.map((m, i) => {
						return {
							week: this.$moment(m.date).week(),
							year: this.$moment(m.date).year(),
							date: m.date,
							cases: m.cases,
							deaths: m.deaths,
							intensive: m.intensive,
							// hospitalized_in_icu: m.hospitalized_in_icu
						};
					});

					const data_per_age_4 = per_age_4.map((m, i) => {
						return {
							week: this.$moment(m.date).week(),
							year: this.$moment(m.date).year(),
							date: m.date,
							cases: m.cases,
							deaths: m.deaths,
							intensive: m.intensive,
							// hospitalized_in_icu: m.hospitalized_in_icu
						};
					});

					const dates = groupDatesByWeek(data_per_age_1).map((m) => {
						return this.$moment(m[0].date).startOf('week').add(3, 'days')
					});

					const per_age_1_all = groupDatesByWeek(data_per_age_1).map((m) => {
						return {
							cases: Math.max(...m.map(o => o['cases'])),
							deaths: Math.max(...m.map(o => o['deaths'])),
							hospitalized_in_icu: mean([...m.map(o => o['intensive']), 1])
						}
					});

					const per_age_2_all = groupDatesByWeek(data_per_age_2).map((m) => {
						return {
							cases: Math.max(...m.map(o => o['cases'])),
							deaths: Math.max(...m.map(o => o['deaths'])),
							hospitalized_in_icu: mean([...m.map(o => o['intensive']), 1])
						}
					});

					const per_age_3_all = groupDatesByWeek(data_per_age_3).map((m) => {
						return {
							cases: Math.max(...m.map(o => o['cases'])),
							deaths: Math.max(...m.map(o => o['deaths'])),
							hospitalized_in_icu: mean([...m.map(o => o['intensive']), 1])
						}
					});

					const per_age_4_all = groupDatesByWeek(data_per_age_4).map((m) => {
						return {
							cases: Math.max(...m.map(o => o['cases'])),
							deaths: Math.max(...m.map(o => o['deaths'])),
							hospitalized_in_icu: mean([...m.map(o => o['intensive']), 1])
						}
					});

					const per_age_cases_1 = per_age_1_all.map(o => o['cases']);
					const per_age_cases_2 = per_age_2_all.map(o => o['cases']);
					const per_age_cases_3 = per_age_3_all.map(o => o['cases']);
					const per_age_cases_4 = per_age_4_all.map(o => o['cases']);
					const population_cases = Math.max(...[...per_age_cases_1, ...per_age_cases_2, ...per_age_cases_3, ...per_age_cases_4])

					const per_age_deaths_1 = per_age_1_all.map(o => o['deaths']);
					const per_age_deaths_2 = per_age_2_all.map(o => o['deaths']);
					const per_age_deaths_3 = per_age_3_all.map(o => o['deaths']);
					const per_age_deaths_4 = per_age_4_all.map(o => o['deaths']);
					const population_deaths = Math.max(...[...per_age_deaths_1, ...per_age_deaths_2, ...per_age_deaths_3, ...per_age_deaths_4])

					const per_age_hospitalized_in_icu_1 = per_age_1_all.map(o => o['hospitalized_in_icu']);
					const per_age_hospitalized_in_icu_2 = per_age_2_all.map(o => o['hospitalized_in_icu']);
					const per_age_hospitalized_in_icu_3 = per_age_3_all.map(o => o['hospitalized_in_icu']);
					const per_age_hospitalized_in_icu_4 = per_age_4_all.map(o => o['hospitalized_in_icu']);
					const population_hospitalized_in_icu = Math.max(...[...per_age_hospitalized_in_icu_1, ...per_age_hospitalized_in_icu_2, ...per_age_hospitalized_in_icu_3, ...per_age_hospitalized_in_icu_4])

					this.item = {
						dates,
						population_cases,
						population_deaths,
						population_hospitalized_in_icu,
						per_age_cases_1,
						per_age_cases_2,
						per_age_cases_3,
						per_age_cases_4,
						per_age_deaths_1,
						per_age_deaths_2,
						per_age_deaths_3,
						per_age_deaths_4,
						per_age_hospitalized_in_icu_1,
						per_age_hospitalized_in_icu_2,
						per_age_hospitalized_in_icu_3,
						per_age_hospitalized_in_icu_4,
						max: population_cases,
						min: 0,
						sources: ['imedd']
					};

					this.loading = false;
				});
		},
		update() {
			this.load();
		}
	}
};
</script>

<style lang="less" scoped>
.extra-small-text {
	font-size: 8px !important;
}

.v-data-iterator {
	width: 100%;
}
</style>
