<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'"
			:height="$vuetify.breakpoint.smAndDown ? 140 : 120">
			<v-container class="pa-0 ma-0 mb-2" fluid>
				<v-row class="pa-0 ma-0" justify="start">
					<v-col class="pa-0 shrink" align-self="center" cols="12" md="">
						<v-btn-toggle dense class="mr-2" rounded v-model="point" mandatory @change="doSimilar">
							<v-btn x-small class="primary--text" value="cases">
								{{($tc('cases', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="deaths">
								{{($tc('deaths', 1)) | normalizeNFD }}
							</v-btn>
						</v-btn-toggle>
					</v-col>
					<v-col class="pa-0 shrink" align-self="center" cols="12" md="">
						<v-btn-toggle dense class="mr-2" rounded v-model="calc" mandatory @change="doSimilar">
							<v-btn x-small class="primary--text" value="_cum">
								{{($tc('Cumulative Per 100K', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="_new">
								{{($tc('Daily Per 100K', 1)) | normalizeNFD }}
							</v-btn>
						</v-btn-toggle>
					</v-col>
					<v-col class="pa-0 text-end align-end" align-self="center" v-if="!$route.meta.iframe && !$vuetify.breakpoint.smAndDown" cols="12" md="">
						<v-btn x-small
							fab color="grey" dark class="mb-1 elevation-0"
							@click="update">
							<v-icon x-small>fa-redo</v-icon>
						</v-btn>
						<v-btn x-small
							fab color="primary" dark class="ml-1 mb-1 elevation-0"
							@click="setEmbed">
							<v-icon x-small>fa-code</v-icon>
						</v-btn>
					</v-col>
				</v-row>
				<v-row class="pa-0 ma-0 mt-2" justify="center">
					<v-col class="pa-0 pr-2" align-self="center" cols="5" xs="5" md="5">
						<v-autocomplete
							dense
							outlined
							color="primary"
							hide-details
							class="caption fa-xs"
							prepend-icon="fa-globe-europe"
							:items="items"
							:label="$t('Country')"
							item-text="region" item-value="uid"
							v-model="search"
							@change="doSimilar">
							<template v-slot:prepend>
								<v-icon small class="mt-1" color="primary">
									fa-globe-europe
								</v-icon>
							</template>
						</v-autocomplete>
					</v-col>
					<v-col class="pa-0 pl-2" align-self="center" cols="5" xs="5" md="5">
						<v-select
							dense
							outlined
							color="primary"
							hide-details prepend-icon="" class="caption" :label="$t('Time Period')"
							:items="[periodInterval[2], periodInterval[3]]"
							:item-text="'text.'+locale.code" item-value="value" v-model="period" auto-select-first
							@change="load">
							<template v-slot:prepend>
								<v-icon small class="mt-1" color="primary">
									fa-clock
								</v-icon>
							</template>
						</v-select>
					</v-col>
					<v-col class="pa-0 text-end align-end" align-self="center" v-if="!$route.meta.iframe && $vuetify.breakpoint.smAndDown" cols="2">
						<v-btn x-small
							fab color="grey" dark class="mb-1 elevation-0"
							@click="update">
							<v-icon x-small>fa-redo</v-icon>
						</v-btn>
						<v-btn x-small
							fab color="primary" dark class="ml-1 mb-1 elevation-0"
							@click="setEmbed">
							<v-icon x-small>fa-code</v-icon>
						</v-btn>
					</v-col>
				</v-row>
			</v-container>
		</v-app-bar>
		<v-divider v-if="!$route.meta.iframe"/>
		<v-container class="px-4" fluid>
			<v-row class="px-0" v-if="loading">
				<v-col align="center">
					<v-progress-circular indeterminate color="grey"></v-progress-circular>
				</v-col>
			</v-row>
			<v-data-iterator
				v-else
				:items="items"
				:items-per-page.sync="itemsPerPage"
				:page="page"
				hide-default-footer
				class="d-inline"
				:key="point + '-' + calc"
				>
				<template v-slot:default="props">
					<v-row class="px-0">
						<v-col
							v-for="item in props.items"
							:key="'col-ggcb7l-' + item.uid"
							cols="12" xs="12" md="4"
							class="px-4" :class="search === item.uid ? 'yellow lighten-5' : ''"
						>
							<v-card-subtitle class="body-2 font-weight-bold px-0 text-uppercase">
								{{ $t(item.region) | normalizeNFD }}
							</v-card-subtitle>
							<d7-line-bar
								:key="'ggcb7l-' + item.uid + '-' + point + '-' + calc + '-' + period" :id="'ggcb7l-uid-' + item.uid + '-' + point + '-' + calc + '-' + period"
								:point="point" :values="item[point + calc]"
								:dates="item.dates"
								:sources="item.sources"
								:max="max"
								:pp100="$t('Per 100K')"
								/>
						</v-col>
					</v-row>
				</template>
				<template v-slot:footer>
					<v-row
						class="mt-2"
						align="center"
						justify="center"
					>

						<v-spacer></v-spacer>
						<v-btn
							icon
							class="mx-2"
							@click="formerPage"
							:disabled="page === 1"
						>
							<v-icon>mdi-chevron-left</v-icon>
						</v-btn>
						<v-btn
							icon
							class="mx-2"
							@click="nextPage"
							:disabled="page === numberOfPages"
						>
							<v-icon>mdi-chevron-right</v-icon>
						</v-btn>
					</v-row>
				</template>
			</v-data-iterator>
		</v-container>
		<v-divider class="mx-4"/>
		<v-footer class="white caption small-caption pa-4 pt-2">
			<a href="https://lab.imedd.org/covid19/" target="_blank" v-if="$route.meta.iframe">
				<v-icon x-small class="mr-2" color="primary">fa-link</v-icon><span class="font-weight-bold">iMΕdD LAB</span>: {{ title[locale.code] }}
			</a>
			<span v-else>
				<span class="font-weight-bold">iMΕdD LAB</span>: {{ title[locale.code] }}
			</span>
		</v-footer>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { getDates } from '@/utils';

export default {
	name: 'global-key-subplot-countries',
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
				view: 'cases',
				availableViews: ['cases', 'deaths'],
				aggregation: 'daily',
				availableAggregations: ['Daily', 'Cumulative'],
				period: 3,
				availablePeriods: [
					{
						text: { en: 'Last 3 months', el: 'Τελευταίο τρίμηνο' },
						value: 2
					},
					{
						text: { en: 'Historical data', el: 'Από την αρχή' },
						value: 3
					}
				],
				lang: this.locale.code,
				id: 'global-key-subplot-countries'
			};
		}
	},
	data () {
		return {
			loading: true,
			totals: 0,
			point: 'cases',
			items: [],
			similar: [],
			period: '2020-01-01',
			page: 1,
			itemsPerPage: 15,
			search: '', //  'U300',
			filter: {},
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
			if (this.$route.query.view && this.$route.query.view !== '') {
				this.point = this.$route.query.view;
			}
			if (this.$route.query.aggregation && this.$route.query.aggregation !== '') {
				this.calc = this.$route.query.aggregation === 'daily' ? '_new' : '_cum';
			}
			if (this.$route.query.period && this.$route.query.period !== '') {
				this.period = this.periodInterval[parseInt(this.$route.query.period)].value;
			}
			if (this.posts.global.length === 0) {
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
			this.$store.dispatch('external/getGlobalAGG', 'all/cases,deaths,new_cases,new_deaths/' + this.period + '/' + this.$moment().subtract(1, 'days').format('YYYY-MM-DD'))
				.then(res => {
					const items = res.map(m => {
						m.cases = m.cases.map(n => Math.max(0, n));
						m.new_cases = m.new_cases.map(n => Math.max(0, n));
						m.deaths = m.deaths.map(n => Math.max(0, n));
						m.new_deaths = m.new_deaths.map(n => Math.max(0, n));

						m.cases = m.cases.map(n => m.population > 0 ? (n / m.population) * 100000 : 0);
						m.new_cases = m.new_cases.map(n => m.population > 0 ? (n / m.population) * 100000 : 0);
						m.deaths = m.deaths.map(n => m.population > 0 ? (n / m.population) * 100000 : 0);
						m.new_deaths = m.new_deaths.map(n => m.population > 0 ? (n / m.population) * 100000 : 0);

						const max_cases_new = m.new_cases[m.new_cases.length - 1];
						const max_deaths_new = m.new_deaths[m.new_deaths.length - 1];
						const max_cases_cum = m.cases[m.cases.length - 1];
						const max_deaths_cum = m.deaths[m.deaths.length - 1];
						return {
							uid: 'U' + m.uid,
							del: m.population > 100000,
							region: this.$t(m.country),
							dates: getDates(m.from, m.to),
							sources: m.sources.sort(),
							population: m.population,

							cases_cum: m.cases,
							deaths_cum: m.deaths,
							cases_new: m.new_cases,
							deaths_new: m.new_deaths,

							max_cases: max_cases_cum,
							max_deaths: max_deaths_cum,
							max_cases_new: max_cases_new,
							max_deaths_new: max_deaths_new,

							max_cases_index_cum: max_cases_cum,
							max_deaths_index_cum: max_deaths_cum,
							max_cases_index_new: max_cases_new,
							max_deaths_index_new: max_deaths_new

						};
					});
					// change similar
					this.max = null;
					this.items = items.filter(m => !!m.del);
					this.numberOfPages = Math.ceil(this.items.length / this.itemsPerPage);
					this.doSort();
					this.loading = false;
				});
		},
		doSimilar () {
			this.doSort();
			// this.items = this.items.sort((b, a) => a['max_' + this.point + '_index'] - b['max_' + this.point + '_index']);
			if (this.search !== '') {
				const idx = this.items.findIndex(m => m.uid === this.search);
				if (idx < 0) return;
				this.page = Math.ceil((idx + 1) / this.itemsPerPage);
			} else {
				this.page = 1;
			}
			// 	const next7 = this.items.slice(idx + 1, idx + 8);
			// 	const prev7 = this.items.slice(idx - 8, idx - 1);

			// 	const similar = [...prev7, this.items[idx], ...next7];
			// 	this.max = null; // Math.max(...similar.map(m => m['max_' + this.point + '_index']));
			// 	this.similar = similar;
			// } else {
			// 	this.similar = this.items.slice(0, 15);
			// }
		},
		update () {
			this.search = '';
			this.page = 1;
		},

		nextPage () {
			if (this.page + 1 <= this.numberOfPages) this.page += 1;
		},
		formerPage () {
			if (this.page - 1 >= 1) this.page -= 1;
		},
		doSort () {
			// this.max = this.calc === '_new' ? null : Math.max(...this.items.map(m => m['max_' + this.point + '_index' + this.calc]));;
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
