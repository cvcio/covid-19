<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0" justify="space-between">
					<v-col class="pa-0" align-self="center">
						<v-btn-toggle dense class="mr-2" rounded v-model="key" mandatory>
							<v-btn x-small class="primary--text" value="cases">
								{{($tc('cases', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="deaths">
								{{($tc('deaths', 1)) | normalizeNFD }}
							</v-btn>
							<!-- <v-btn x-small class="primary--text" value="recovered">
								{{( $vuetify.breakpoint.smAndDown ? $tc('deaths', 1).substr(1, 1) : $tc('deaths', 1)) | normalizeNFD }}
							</v-btn> -->
						</v-btn-toggle>
					</v-col>
					<v-col class="pa-0 grow text-end ml-2" align-self="center" v-if="!$route.meta.iframe">
						<!-- <v-btn x-small :fab="!$vuetify.breakpoint.smAndDown" color="grey" dark class="mx-2 elevation-0" @click="update">
							<v-icon x-small>fa-redo</v-icon>
						</v-btn> -->
						<v-btn x-small fab color="primary" dark class="mx-0 elevation-0" @click="setEmbed">
							<v-icon x-small>fa-code</v-icon>
						</v-btn>
					</v-col>
				</v-row>
			</v-container>
		</v-app-bar>
		<v-divider v-if="!$route.meta.iframe"/>
		<v-container class="px-0" fluid :class="$route.meta.iframe ? 'px-4' : ''">
			<v-row class="px-0" v-if="loading">
				<v-col align="center">
					<v-progress-circular indeterminate color="grey"></v-progress-circular>
				</v-col>
			</v-row>
			<v-row class="px-3" v-else>
				<v-col class="px-0" align="center">
					<v-data-table
						dense
						:headers="headers(key)"
						:items="items"
						:sort-by="['p100p_' + key]"
   						:sort-desc="[true]"
						:items-per-page="20"
						class="elevation-0"
					>
						<template v-slot:header="{ header }">
							{{ header }}
						</template>
						<template v-slot:item="props">
							<tr class="">
								<td class="caption">
									{{ $t(props.item.region) }}
								</td>
								<td class="caption" style="">
									{{ new Intl.NumberFormat('el-GR').format(props.item['total_' + key].toFixed(2)) }}
								</td>
								<td class="caption">
									{{ typeof props.item['p100p_' + key] !== 'string' ? new Intl.NumberFormat('el-GR').format(props.item['p100p_' + key].toFixed(0)) : '-'}}
								</td>
								<td class="caption">
									{{
										!isNaN(props.item['mo_7d_' + key]) ? new Intl.NumberFormat('el-GR').format(
											Math.abs(props.item['mo_7d_' + key].toFixed(2))
										) : '-'
									}}
								</td>
								<td class="caption" v-if="!$vuetify.breakpoint.smAndDown">
									<heatbar
									:key="'gcbc-' + props.item.uid + '-' + key"
									:id="'gcbc-uid-' + props.item.uid + '-' + key"
									:point="key"
									:values="props.item[key]"
									:dates="props.item.dates"
									:sources="props.item.sources"/>
								</td>
							</tr>
							<tr v-if="$vuetify.breakpoint.smAndDown" style="width:100%" class="">
								<td class="caption" style="width:100%">
									<heatbar
										:key="'gcbc-' + props.item.uid + '-' + key"
										:id="'gcbc-uid-' + props.item.uid + '-' + key"
										:point="key"
										:values="props.item[key]"
										:dates="props.item.dates"
										:sources="props.item.sources"/>
								</td>
							</tr>
						</template>
					</v-data-table>
				</v-col>
			</v-row>
		</v-container>
		<v-divider class="mx-4"/>
		<v-footer class="white caption small-caption pa-4 pt-2">
			<a href="https://lab.imedd.org/" v-if="$route.meta.iframe">
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
import { sum } from 'lodash';
import { getDates, normalizeNFD } from '@/utils';
import { ma } from 'moving-averages';

export default {
	name: 'global-key-by-country-table',
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
		embed () {
			return {
				title: '',
				subtitle: '',
				text: '',
				mapLevel: null,
				mapKey: null,
				view: null,
				aggregation: null,
				period: null,
				lang: this.locale.code,
				id: 'global-key-by-country-table'
			};
		}
	},
	data () {
		return {
			loading: true,
			key: 'cases',
			items: [],
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
			this.$store.dispatch('external/getGlobalAGG', 'all/new_cases,new_deaths,new_recovered/' + this.periodInterval[3].value + '/' + this.$moment().subtract(1, 'days').format('YYYY-MM-DD'))
				.then(res => {
					this.items = res.map(m => {
						m.new_cases = m.new_cases.map(m => Math.max(0, m));
						m.new_deaths = m.new_deaths.map(m => Math.max(0, m));
						m.new_recovered = m.new_recovered.map(m => Math.max(0, m));
						const total_cases = sum(m.new_cases);
						const total_deaths = sum(m.new_deaths);
						const total_recovered = sum(m.new_recovered);
						const p100p_cases = m.population > 0 ? ((sum(m.new_cases) / m.population) * 100000) : '-';
						const p100p_deaths = m.population > 0 ? ((sum(m.new_deaths) / m.population) * 100000) : '-';
						const p100p_recovered = m.population > 0 ? ((sum(m.new_recovered) / m.population) * 100000) : '-';
						let mo_7d_cases = ma(m.new_cases.map(n => (n / m.population) * 100000), 7).filter((el) => {
							return el != null;
						});
						mo_7d_cases = mo_7d_cases[mo_7d_cases.length - 1];
						let mo_7d_deaths = ma(m.new_deaths.map(n => (n / m.population) * 100000), 7).filter((el) => {
							return el != null;
						});
						mo_7d_deaths = mo_7d_deaths[mo_7d_deaths.length - 1];
						return {
							uid: m.uid,
							region: m.country,
							total_cases,
							total_deaths,
							total_recovered,
							p100p_cases,
							p100p_deaths,
							p100p_recovered,
							mo_7d_cases,
							mo_7d_deaths,
							dates: getDates(m.from, m.to),
							cases: m.new_cases,
							deaths: m.new_deaths,
							recovered: m.new_recovered,
							sources: m.sources.sort()
						};
					});

					this.loading = false;
				});
		},
		update () {
			this.load();
		},

		headers (key) {
			return [
				{
					text: normalizeNFD(this.$t('Country').toUpperCase()),
					align: 'start',
					sortable: true,
					value: 'region',
					class: 'text-capitalize',
					width: '20%'
				},
				{
					text: normalizeNFD(this.$t('Total').toUpperCase()),
					align: 'start',
					sortable: true,
					value: 'total_' + key,
					class: 'text-capitalize',
					width: '15%'
				},
				{
					text: normalizeNFD(this.$t('Per 100K').toUpperCase()),
					align: 'start',
					sortable: true,
					value: 'p100p_' + key,
					class: 'text-capitalize',
					width: '20%'
				},
				{
					text: normalizeNFD(this.$t('7 Day Mov. Avg.').toUpperCase()),
					align: 'start',
					sortable: true,
					value: 'mo_7d_' + key,
					class: 'text-capitalize',
					width: '15%'
				},
				{
					text: normalizeNFD(this.$t('Weekly').toUpperCase()),
					align: 'start',
					sortable: false,
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
</style>
