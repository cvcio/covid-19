<!--
	"el": "(12) - Εξέλιξη νέων κρουσμάτων ανά περιοχή στην Ελλάδα",
	"en": "(12) - Evolution of new cases by area in Greece"
-->
<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0" justify="space-between">
				
					<v-col class="pa-0 shrink" align-self="center">
						<v-btn-toggle dense class="mr-2" rounded v-model="calc" mandatory @change="doSort">
							<v-btn x-small class="primary--text" value="_cum">
								{{ ($tc('Cumulative Per 100K', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="_new">
								{{ ($tc('Weekly Per 100K', 1)) | normalizeNFD }}
							</v-btn>
						</v-btn-toggle>
					</v-col>
					<v-col class="grow pa-0 text-end ml-2" align-self="center" v-if="!$route.meta.iframe">
						<v-btn x-small fab color="primary" dark class="mx-0 elevation-0" @click="setEmbed">
							<v-icon x-small>fa-code</v-icon>
						</v-btn>
					</v-col>
				</v-row>
			</v-container>
		</v-app-bar>
		<v-divider v-if="!$route.meta.iframe" />
		<v-container class="px-4" fluid>
			<v-row v-if="loading" class="px-0">
				<v-col align="center">
					<v-progress-circular indeterminate color="grey"></v-progress-circular>
				</v-col>
			</v-row>
			<v-data-iterator v-else :items="items" :items-per-page.sync="itemsPerPage" :page="page" hide-default-footer
				class="d-inline" :key="point + '-' + calc">
				<template v-slot:default="props">
					<v-row class="px-0">
						<v-col v-for="item in props.items" :key="'col-gcb7l-' + item.uid" cols="12" xs="12" md="4" class="px-4">
							<v-card-subtitle class="caption font-weight-bold px-0 text-uppercase">
								{{ $t(item.region) | normalizeNFD }}
							</v-card-subtitle>
							<d7-line-bar :key="'gcb7l-' + item.uid + '-' + point + '-' + calc"
								:id="'gcb7l-uid-' + item.uid + '-' + point + '-' + calc" :point="point" :values="item[point + calc]"
								:dates="item.dates" :sources="item.sources" :max="max" :pp100="$t('Per 100K')" />
						</v-col>
					</v-row>
				</template>
				<template v-slot:footer>
					<v-row class="mt-2" align="center" justify="center">

						<v-spacer></v-spacer>
						<v-btn icon class="mx-2" @click="formerPage" :disabled="page === 1">
							<v-icon>mdi-chevron-left</v-icon>
						</v-btn>
						<v-btn icon class="mx-2" @click="nextPage" :disabled="page === numberOfPages">
							<v-icon>mdi-chevron-right</v-icon>
						</v-btn>
					</v-row>
				</template>
			</v-data-iterator>
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
// import { remove } from 'lodash';
import { groupDatesByWeek } from '@/utils';
import { sumBy } from 'lodash'; // Sociality

export default {
	name: 'greece-key-subplot-regions',
	props: {
		delay: {
			default: 100
		}
	},
	components: {
		'd7-line-bar': require('@/components/charts/d7-line-bar').default
	},
	computed: {
		...mapGetters(['locale']),
		...mapGetters('filters', ['periodInterval']),
		...mapGetters('internal', ['posts']),
		embed () {
			return {
				title: '',
				subtitle: '',
				text: '',
				mapLevel: null,
				mapKey: null,
				mapYear: null,
				view: null,
				aggregation: 'weekly',
				availableAggregations: ['Weekly', 'Cumulative'],
				period: null,
				lang: this.locale.code,
				id: 'greece-key-subplot-regions'
			};
		}
	},
	data () {
		return {
			loading: true,
			point: 'cases',
			items: [],
			period: {
				from: '2020-01-01',
				to: this.$moment().format('YYYY-MM-DD')
			},
			page: 1,
			numberOfPages: 0,
			itemsPerPage: 15,
			max: 0,
			calc: '_new',
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
			if (this.$route.query.aggregation && this.$route.query.aggregation !== '') {
				this.calc = this.$route.query.aggregation === 'weekly' ? '_new' : '_cum';
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
			this.$store.dispatch('external/getRegionalUnitsData', { from: this.period.form, to: this.period.to })
				.then(res => {
					this.items = res.map(m => {
						
						const data = m.dates.map((r, i) => {
							return {
								week: this.$moment(r).week(),
								year: this.$moment(r).year(),
								date: r,
								cases_cum: m.cases_cum[i],
								cases: m.cases[i]
							};
						});

						const entries = groupDatesByWeek(data).map((g) => {
							return {
								year: g[0].year,
								week: g[0].week,
								date: this.$moment(g[0].date).startOf('week').add(3,'days'),
		cases_new: sumBy(g, 'cases'),
								cases_cum: Math.max(...g.map(obj => obj.cases_cum))// sumBy(g, 'cases_cum'),
							};
						});

						const cases_cum = [];
						const cases_cum_per_100K = [];
						const cases_new = [];
						const cases_new_per_100K = [];
						const datesArray = [];
						entries.map(obj => {
							cases_cum.push(obj.cases_cum);
							cases_cum_per_100K.push(m.pop_11 > 0 ? (obj.cases_cum / m.pop_11) * 100000 : 0);
							cases_new.push(obj.cases_new);
							cases_new_per_100K.push(m.pop_11 > 0 ? (obj.cases_new / m.pop_11) * 100000 : 0);
							datesArray.push(this.$moment(obj.date).format('YYYY-MM-DD'));
						});

						const max_cases_new = cases_new_per_100K[cases_new_per_100K.length - 1];
						const max_cases_cum = cases_cum_per_100K[cases_cum_per_100K.length - 1];

						return {
							uid: m.regional_unit_id,
							del: m.pop_11 > 0,
							region: `${m.slug}_ru_e`, 
							dates: datesArray, 
							cases_new: cases_new_per_100K,
							cases_cum: cases_cum_per_100K,
							max_cases_cum: max_cases_cum,
							max_cases_new: max_cases_new,
							max_cases_index_new: max_cases_new,
							max_cases_index_cum: max_cases_cum,
							total_cases: m.cases_cum,
							sources: ['imedd']
						};
					});
					this.numberOfPages = Math.ceil(this.items.length / this.itemsPerPage);
					this.doSort();
					this.loading = false;
				});
		},
		nextPage () {
			if (this.page + 1 <= this.numberOfPages) this.page += 1;
		},
		formerPage () {
			if (this.page - 1 >= 1) this.page -= 1;
		},

		doSort () {
			this.max = this.calc === '_new' ? null : Math.max(...this.items.map(m => m['max_' + this.point + '_index' + this.calc]));
			this.items = this.items.sort((a, b) => b['max_' + this.point + '_index' + this.calc] - a['max_' + this.point + '_index' + this.calc]);
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
