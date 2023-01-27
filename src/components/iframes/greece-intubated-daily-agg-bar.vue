<!--
	"el": "(11) - Διασωληνωμένοι ασθενείς",
	"en": "(11) - Intubated patients"
-->

<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0" justify="space-between">
					<v-col class="pa-0" align-self="center">
						<v-select dense outlined color="primary" hide-details prepend-icon="" class="caption"
							:label="$t('Time Period')" :items="[...periodInterval.slice(1)]"
							:item-text="'text.' + locale.code" item-value="value" v-model="period" auto-select-first
							@change="load">
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
					<d7-line-bar-events :key="'gidagb-' + item.uid + '-' + point + '-' + period"
						:id="'gidagb-uid-' + item.uid + '-' + point + '-' + period" :point="point" :values="item[point]"
						:dates="item.dates" :sources="item.sources" />
				</v-col>
			</v-row>
		</v-container>
		<v-divider class="mx-4" />
		<v-footer class="white caption small-caption pa-4 pt-2">
			<a href="https://lab.imedd.org/covid19/" target="_blank" v-if="$route.meta.iframe">
				<v-icon x-small class="mr-2" color="primary">fa-link</v-icon><span class="font-weight-bold">iMΕdD
					LAB</span>: {{
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
	name: 'greece-intubated-daily-agg-bar',
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
				id: 'greece-intubated-daily-agg-bar'
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
			this.$store.dispatch('external/getTimelineData', { from: this.period.from, to: this.period.to, fields: ['intubated'] })
				.then(res => {

					const data = res.map((m, i) => {
						return {
							week: this.$moment(m.date).week(),
							year: this.$moment(m.date).year(),
							date: m.date,
							value: m.intubated ? Math.max(0, m.intubated) : 0
						};
					});

					const entries = groupDatesByWeek(data).map((m) => {
						return {
							year: m[0].year,
							week: m[0].week,
							date: this.$moment(m[0].date).startOf('week').add(3, 'days'),
							value: m[0].value // sumBy(m, 'value')
						};
					});
					const dates = ([...new Set(entries.map(item => item.date))]);
					const intubated = entries.map(obj => obj.value);

					this.item = {
						dates: dates,
						critical: intubated,
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
