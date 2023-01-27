<!--
	"el": "(13) - Τεστ ανά ημέρα στην Ελλάδα",
	"en": "(13) - Testing over time in Greece"
-->

<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'"
			:height="$route.meta.iframe ? 60 : ($vuetify.breakpoint.smAndDown ? 60 : 60)">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0">
					<v-col class="pa-0 shrink" align-self="center">
						<v-btn-toggle dense class="mr-1" rounded v-model="point" mandatory>
							<v-btn x-small class="primary--text" value="tests">
								{{ ($t('All')) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="pcr">
								{{ ($tc('RT-PCR', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="rapid">
								{{ ($tc('Rapid Ag', 1)) | normalizeNFD }}
							</v-btn>
						</v-btn-toggle>
					</v-col>
					<v-col class="pa-0 shrink" align-self="center">
						<v-btn-toggle dense class="" rounded v-model="calc" mandatory>
							<v-btn x-small class="primary--text" value="new">
								{{ ($tc('Weekly', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="sum">
								{{ ($tc('Cumulative', 1)) | normalizeNFD }}
							</v-btn>
						</v-btn-toggle>
					</v-col>
					<v-col class="pa-0 text-end align-end" align-self="center" v-if="!$route.meta.iframe">
						<v-btn x-small fab color="primary" dark class="mx-0 elevation-0" @click="setEmbed">
							<v-icon x-small>fa-code</v-icon>
						</v-btn>
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
					<d7-line-bar-events :key="'gcb7l-' + item.uid + '-' + calc + '-' + point"
						:id="'gcb7l-uid-' + item.uid + '-' + calc + '-' + point" :point="point"
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
	name: 'greece-tests-daily-agg-bar',
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
		...mapGetters('filters', ['periodInterval']),
		...mapGetters('internal', ['annotations']),
		...mapGetters('internal', ['posts']),
		embed () {
			return {
				title: '',
				subtitle: '',
				text: '',
				mapLevel: null,
				mapKey: null,
				mapYear: null,
				view: 'tests',
				availableViews: ['tests', 'pcr', 'rapid'],
				aggregation: 'weekly',
				availableAggregations: ['Weekly', 'Cumulative'],
				period: null,
				lang: this.locale.code,
				id: 'greece-tests-daily-agg-bar'
			};
		}
	},
	data () {
		return {
			loading: true,
			point: 'tests',
			item: null,
			calc: 'new',
			period: {
				from: '2020-01-01',
				to: this.$moment().format('YYYY-MM-DD')
			},
			title: { en: '', el: '' }
		};
	},
	mounted () {
		setTimeout(() => {
			this.preload();
		}, this.delay);
	},
	methods: {
		preload () {
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
		setEmbed () {
			this.$store.commit('setEmbedDialog', true);
			this.$store.commit('setEmbed', this.embed);
		},
		load () {
			this.loading = true;
			this.title = this.posts[this.embed.id.split('-')[0]].find(m => m.component.id === this.embed.id).title || '';
			this.$store.dispatch('external/getTimelineData', { from: this.period.from, to: this.period.to, fields: ['estimated_new_rtpcr_tests', 'estimated_new_rapid_tests', 'estimated_new_total_tests'] })
				.then(res => {
					const data = res.map((m, i) => {
						return {
							week: this.$moment(m.date).week(),
							year: this.$moment(m.date).year(),
							date: m.date,
							estimated_new_rtpcr_tests: m.estimated_new_rtpcr_tests,
							estimated_new_rapid_tests: m.estimated_new_rapid_tests,
							estimated_new_total_tests: m.estimated_new_total_tests
						};
					});

					const entries = groupDatesByWeek(data).map((m) => {
						return {
							year: m[0].year,
							week: m[0].week,
							date: this.$moment(m[0].date).startOf('week').add(3, 'days'),
							estimated_new_rtpcr_tests: sumBy(m, 'estimated_new_rtpcr_tests'),
							estimated_new_rapid_tests: sumBy(m, 'estimated_new_rapid_tests'),
							estimated_new_total_tests: sumBy(m, 'estimated_new_total_tests')
						};
					});

					const estimated_new_rtpcr_tests = [];
					const estimated_new_rapid_tests = [];
					const estimated_new_total_tests = [];
					const datesArray = [];
					entries.map(obj => {
						estimated_new_rtpcr_tests.push(obj.estimated_new_rtpcr_tests);
						estimated_new_rapid_tests.push(obj.estimated_new_rapid_tests);
						estimated_new_total_tests.push(obj.estimated_new_total_tests);
						datesArray.push(obj.date);
					});
					
					const dates = ([...new Set(datesArray)]).map(m => this.$moment(m));
					const datesAnnotations = ([...new Set(res.map(item => item.date))]).map(m => this.$moment(m));

					this.item = {
						dates: dates,
						datesAnnotations: datesAnnotations,
						tests: estimated_new_total_tests.map((elem, index) => estimated_new_total_tests.slice(0, index + 1).reduce((a, b) => a + b)),
						pcr: estimated_new_rtpcr_tests.map((elem, index) => estimated_new_rtpcr_tests.slice(0, index + 1).reduce((a, b) => a + b)),
						rapid: estimated_new_rapid_tests.map((elem, index) => estimated_new_rapid_tests.slice(0, index + 1).reduce((a, b) => a + b)),
						new_tests: estimated_new_total_tests,
						new_pcr: estimated_new_rtpcr_tests,
						new_rapid: estimated_new_rapid_tests,
						sources: ['imedd']
					};

					this.loading = false;
				});
		},
		update () {
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
