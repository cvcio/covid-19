<!--
	"el": "(5) - Εξέλιξη εμβολιασμών ανά δόση εμβολίου",
	"en": "(5) - Evolution of vaccinations by vaccine dose"
 -->

<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0" justify="space-between">
					<v-col class="pa-0" align-self="center">
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
					<v-col class="pa-0 grow text-end ml-2" align-self="center" v-if="!$route.meta.iframe">
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
					<stacked-mirror-area :key="'gbc-vds-' + item.uid + '-' + point + '-' + period"
						:id="'gbc-vds-' + item.uid + '-' + point + '-' + period" :values="item"
						:keys="['total_dose_1', 'total_dose_2', 'total_dose_3']" :min="item.min" :max="item.max" :mirrored="true"
						:dates="item.dates" :sources="item.sources" />
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
// import { getDates } from '@/utils';
// import { max, min } from 'd3';
import { sumBy } from 'lodash';
import { groupDatesByWeek } from '@/utils';

export default {
	name: 'greece-vac-doses-stacked',
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
				view: null,
				aggregation: null,
				period: this.periodIntervalIDX.length - 1,
				availablePeriods: [...this.periodIntervalIDX.slice(1)],
				lang: this.locale.code,
				id: 'greece-vac-doses-stacked'
			};
		}
	},
	data() {
		return {
			loading: true,
			point: 'critical',
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

			this.$store.dispatch('external/getVaccinationsDataGroupByDate', { from: this.period.from, to: this.period.to })
				.then(res => {

					const data = res.map((m, i) => {
						return {
							week: this.$moment(m.weekreferencedate).week(),
							year: this.$moment(m.weekreferencedate).year(),
							date: m.weekreferencedate,
							total_dose_1: m.totaldose1,
							total_dose_2: m.totaldose2,
							total_dose_3: m.totaldose3
						};
					});

					const entries = groupDatesByWeek(data).map((m) => {
						return {
							year: m[0].year,
							week: m[0].week,
							date: this.$moment(m[0].date).startOf('week').add(3, 'days'),
							total_dose_1: sumBy(m, 'total_dose_1'),
							total_dose_2: sumBy(m, 'total_dose_2'),
							total_dose_3: sumBy(m, 'total_dose_3')
						};
					});

					const total_dose_1 = [];
					const total_dose_2 = [];
					const total_dose_3 = [];
					const datesArray = [];
					entries.map(obj => {
						total_dose_1.push(obj.total_dose_1);
						total_dose_2.push(obj.total_dose_2);
						total_dose_3.push(obj.total_dose_3);
						datesArray.push(obj.date);
					});

					const dates = ([...new Set(datesArray)]);
					const population = 10747828;

					this.item = {
						dates,
						population,
						total_dose_1,
						total_dose_2,
						total_dose_3,
						max: population,
						min: 0,
						sources: ['https://emvolio.gov.gr/']
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
