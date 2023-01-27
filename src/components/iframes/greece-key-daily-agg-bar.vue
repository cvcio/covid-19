<!--
	"el": "(10) - Η πορεία της πανδημίας στην Ελλάδα",
	"en": "(10) - The pandemic over time in Greece"
-->

<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'"
			:height="$route.meta.iframe ? 120 : ($vuetify.breakpoint.smAndDown ? 120 : 120)">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0" justify="space-between">
					<v-col class="pa-0 shrink" align-self="center">
						<v-btn-toggle dense class="mr-2" rounded v-model="point" mandatory>
							<v-btn x-small class="primary--text" value="cases">
								{{ ($tc('cases', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="deaths">
								{{ ($tc('deaths', 1)) | normalizeNFD }}
							</v-btn>
						</v-btn-toggle>
					</v-col>
					<v-col class="pa-0 shrink" align-self="center">
						<v-btn-toggle dense class="mr-2" rounded v-model="calc" mandatory>
							<v-btn x-small class="primary--text" value="new">
								{{ ($tc('Weekly', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="sum">
								{{ ($tc('Cumulative', 1)) | normalizeNFD }}
							</v-btn>
						</v-btn-toggle>
					</v-col>
					<v-col class="pa-0 grow text-end" align-self="center" v-if="!$route.meta.iframe">
						<!-- <v-btn x-small :fab="!$vuetify.breakpoint.smAndDown" color="grey" dark class="mx-2 elevation-0" @click="update">
							<v-icon x-small>fa-redo</v-icon>
						</v-btn> -->
						<v-btn x-small fab color="primary" dark class="mx-0 elevation-0" @click="setEmbed">
							<v-icon x-small>fa-code</v-icon>
						</v-btn>
					</v-col>
				</v-row>
				<v-row class="pa-0 ma-0 mt-4" justify="space-between">
					<v-col class="pa-0" cols="12" md="6" align-self="center">
				<!-- <v-row class="pa-0 ma-0 mt-4" justify="center">
					<v-col class="pa-0" cols="12" md="6"> -->
						<v-select dense outlined color="primary" hide-details prepend-icon="" class="caption"
							:label="$t('Time Period')"
							:items="[...periodInterval.slice(1)]"
							:item-text="'text.' + locale.code" item-value="value" v-model="period" auto-select-first @change="load">
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
					<d7-line-bar-events v-if="item" :key="'gcb7l-' + item.uid + '-' + calc + '-' + point + '-' + period"
						:id="'gcb7l-uid-' + item.uid + '-' + calc + '-' + point + '-' + period" :point="point"
						:values="item[calc === 'new' ? 'new_' + point : point]" :dates="item.dates"
						:datesAnn="item.datesAnnotations" :annotations="annotations" :sources="item.sources" />
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
import { sumBy } from 'lodash';

export default {
	name: 'greece-key-daily-agg-bar',
	props: {
		delay: {
			default: 100
		}
	},
	components: {
		'd7-line-bar-events': require('@/components/charts/d7-line-bar-events').default
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
				availableViews: ['cases', 'deaths'],
				aggregation: 'weekly',
				availableAggregations: ['Weekly', 'Cumulative'],
				period: this.periodIntervalIDX.length - 1,
				availablePeriods: [...this.periodIntervalIDX.slice(1)],
				lang: this.locale.code,
				id: 'greece-key-daily-agg-bar'
			};
		}
	},
	data() {
		return {
			loading: true,
			point: 'cases',
			item: null,
			calc: 'new',
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
			}
			if (this.$route.query.aggregation && this.$route.query.aggregation !== '') {
				this.calc = this.$route.query.aggregation === 'weekly' ? 'new' : 'sum';
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
			this.$store.dispatch('external/getTimelineData', { from: this.period.from, to: this.period.to, fields: ['daily_cases', 'cases_cum', 'deaths', 'deaths_cum'] })
				.then(res => {
					const data = res.map((m, i) => {
						return {
							week: this.$moment(m.date).week(),
							year: this.$moment(m.date).year(),
							date: m.date,
							cases: m.daily_cases ? m.daily_cases : 0,
							cases_cum: m.cases_cum,
							deaths: m.deaths ? m.deaths : 0,
							deaths_cum: m.deaths_cum
						};
					});

					const entries = groupDatesByWeek(data).map((m) => {
						return {
							year: m[0].year,
							week: m[0].week,
							date: this.$moment(m[0].date).startOf('week').add(3,'days'),
							cases: sumBy(m, 'cases'),
							cases_cum: Math.max(...m.map(o => o.cases_cum)),
							deaths: sumBy(m, 'deaths'),
							deaths_cum: Math.max(...m.map(o => o.deaths_cum))
						};
					});

					const cases = [];
					const cases_cum = [];
					const datesArray = [];
					const deaths = [];
					const deaths_cum = [];
					entries.map(obj => {
						cases.push(obj.cases);
						cases_cum.push(obj.cases_cum);
						deaths.push(obj.deaths);
						deaths_cum.push(obj.deaths_cum);
						datesArray.push(obj.date);
					});
					const dates = ([...new Set(datesArray)]).map(m => this.$moment(m));
					const datesAnnotations = ([...new Set(res.map(item => item.date))]).map(m => this.$moment(m));

					this.item = {
						dates: dates,
						datesAnnotations: datesAnnotations,
						cases: cases_cum,
						deaths: deaths_cum,
						new_cases: cases,
						new_deaths: deaths,
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
