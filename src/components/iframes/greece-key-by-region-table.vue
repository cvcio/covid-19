<!--
	"el": "(8) - Κρούσματα ανά περιοχή στην Ελλάδα",
	"en": "(8) - Cases by area in Greece"
-->

<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0" justify="space-between">
					<v-col cols="5" sm="5" class="pa-0" align-self="center">
						<v-btn-toggle dense class="mr-2" rounded v-model="key" mandatory>
							<!-- <v-btn x-small class="primary--text" value="cases">
								{{($tc('cases', 1)) | normalizeNFD }}
							</v-btn> -->
							<!-- <v-btn x-small class="primary--text" value="deaths">
								{{($tc('deaths', 1)) | normalizeNFD }}
							</v-btn> -->
						</v-btn-toggle>
					</v-col>
					<v-spacer />
					<v-col class="pa-0 text-end justify-end ml-2" align-self="center" v-if="!$route.meta.iframe">
						<!-- <v-btn x-small :fab="!$vuetify.breakpoint.smAndDown" color="grey" dark class="mx-2 elevation-0" @click="update">
							<v-icon x-small>fa-redo</v-icon>
						</v-btn> -->
						<v-btn x-small fab color="primary" dark class="mx-0 elevation-0" @click="setEmbed">
							<v-icon x-small>fa-code</v-icon>
						</v-btn>
					</v-col>
				</v-row>
				<!-- <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line></v-text-field> -->
			</v-container>
		</v-app-bar>
		<v-divider v-if="!$route.meta.iframe" />
		<v-container class="px-0" fluid :class="$route.meta.iframe ? 'px-4' : ''">
			<v-row class="px-0" v-if="loading">
				<v-col align="center">
					<v-progress-circular indeterminate color="grey"></v-progress-circular>
				</v-col>
			</v-row>
			<v-row class="px-3" v-else>
				<v-col class="px-0">
					<v-data-table dense :headers="headers(key)" must-sort :sort-by="['cases_per100k']" :sort-desc="[true]"
						:items="items" :items-per-page="itemsPerPage" class="elevation-0">
						<template v-slot:item="props">
							<tr class="">
								<td class="caption">
									{{ $t(props.item.regional_unit) }}
								</td>
								<td class="caption" style="">
									{{ new Intl.NumberFormat('el-GR').format(props.item.total_cases.toFixed(2)) }}
								</td>
								<td class="caption">
									{{ props.item.cases_per100k >= 0 ?
											new Intl.NumberFormat('el-GR').format(props.item.cases_per100k.toFixed(0)) : '-'
									}}
								</td>
								<td class="caption">
									{{
											props.item.avg_7d_cases >= 0 ? new Intl.NumberFormat('el-GR').format(
												Math.abs(props.item.avg_7d_cases.toFixed(2))
											) : '-'
									}}
								</td>
								<td class="caption" v-if="!$vuetify.breakpoint.smAndDown">
									<heatbar :key="'gcbr-' + props.item.uid + '-' + key" :id="'gcbr-uid-' + props.item.uid + '-' + key"
										:point="key" :values="props.item[key]" :dates="props.item.dates" :sources="props.item.sources" />
								</td>
							</tr>
							<tr v-if="$vuetify.breakpoint.smAndDown" style="width:100%" class="">
								<td class="caption" style="width:100%">
									<heatbar :key="'gcbr-' + props.item.uid + '-' + key" :id="'gcbr-uid-' + props.item.uid + '-' + key"
										:point="key" :values="props.item.cases" :dates="props.item.dates" :sources="props.item.sources" />
								</td>
							</tr>
						</template>
					</v-data-table>
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
import { sum } from 'lodash';
import { getDates, normalizeNFD } from '@/utils';
import { ma } from 'moving-averages';

export default {
	name: 'greece-key-by-region-table',
	props: {
		delay: {
			default: 100
		}
	},
	components: {
		heatbar: require('@/components/charts/heatbar').default
	},
	computed: {
		...mapGetters(['locale']),
		...mapGetters('filters', ['periodInterval']),
		...mapGetters('internal', ['posts']),
		embed() {
			return {
				title: '',
				subtitle: '',
				text: '',
				mapLevel: null,
				mapKey: null,
				mapYear: null,
				period: null,
				view: null,
				aggregation: null,
				lang: this.locale.code,
				id: 'greece-key-by-region-table'
			};
		}
	},
	data() {
		return {
			loading: true,
			key: 'cases',
			items: [],
			period: {
				from: '2020-01-01',
				to: this.$moment().format('YYYY-MM-DD')
			},
			itemsPerPage: 15,
			title: { en: '', el: '' },
			search: ''
		};
	},
	mounted() {
		setTimeout(() => {
			this.preload();
		}, this.delay);
	},
	methods: {
		preload() {
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
		getHeaders() { },
		load() {
			this.loading = true;
			this.title = this.posts[this.embed.id.split('-')[0]].find(m => m.component.id === this.embed.id).title || '';
			this.$store.dispatch('external/getRegionalUnitsData', { from: this.period.from, to: this.period.to })
				.then(res => {
					this.items = res.map(m => {
						const total_cases = Math.max(...m.cases_cum);
						const cases_per100k = m.pop_11 > 0 ? ((Math.max(...m.cases_cum)) * 100000) / m.pop_11 : -1;
						const mo_7d_cases = m.pop_11 > 0 ? ((((m.cases.slice(-7)).reduce((a, b) => { return a + b; })) / 7) * 100000) / m.pop_11 : -1;

						return {
							uid: m.regional_unit_id,
							regional_unit: `${m.slug}_ru_e`,
							total_cases: total_cases,
							cases_per100k: cases_per100k,
							avg_7d_cases: mo_7d_cases,
							cases: m.cases,
							dates: m.dates.map(d => this.$moment(d).format('YYYY-MM-DD')),
							sources: ['imedd']
						};
					});
					this.loading = false;
				});
		},

		update() {
			this.load();
		},

		headers(key) {
			return [
				{
					text: normalizeNFD(this.$t('Area').toUpperCase()),
					align: 'start',
					sortable: true,
					value: 'regional_unit',
					class: 'text-capitalize',
					width: '20%'
				},
				// {
				// 	//text: normalizeNFD(this.$t('Area').toUpperCase()),
				// 	text: '',
				// 	align: 'start',
				// 	sortable: false,
				// 	value: 'region_gr',
				// 	class: 'text-capitalize',
				// 	width: '10%',
				// 	align: ' d-none'
				// },
				{
					text: normalizeNFD(this.$t('Total').toUpperCase()),
					align: 'start',
					sortable: true,
					filterable: false,
					value: 'total_cases',
					class: 'text-capitalize',
					width: '15%'
				},
				{
					text: normalizeNFD(this.$t('Per 100K').toUpperCase()),
					align: 'start',
					sortable: true,
					filterable: false,
					value: 'cases_per100k',
					class: 'text-capitalize',
					width: '20%'
				},
				{
					text: normalizeNFD(this.$t('7D Mov Avg').toUpperCase()),
					align: 'start',
					sortable: true,
					filterable: false,
					value: 'avg_7d_cases',
					class: 'text-capitalize',
					width: '15%'
				},
				{
					text: normalizeNFD(this.$t('Per Week').toUpperCase()),
					align: 'start',
					sortable: false,
					filterable: false,
					value: 'region',
					width: '30%',
					class: 'text-capitalize'
				}
			];
		}
	}
};
</script>

<style lang="less" scoped>
.extra-small-text {
	font-size: 8px !important;
}

tbody tr:nth-of-type(odd) {
	// background-color: #DAE4EA;
	background-color: rgba(218, 228, 234, 0.65)
}
</style>
