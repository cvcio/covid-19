<!--
	"el": "N2 (3b) - Πίνακας Θανάτων άνα Δήμο και Έτος",
	"en": "N2 (3b) - Death Table per Municipality and Year"
-->

<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0" justify="space-between">
					<v-col cols="8" sm="8" class="pa-0 pt-4" align-self="center">
						<!-- <v-btn-toggle dense class="mr-2" rounded v-model="key" mandatory> -->
						<!-- <v-btn x-small class="primary--text" value="cases">
								{{($tc('cases', 1)) | normalizeNFD }}
							</v-btn> -->
						<!-- <v-btn x-small class="primary--text" value="deaths">
								{{($tc('deaths', 1)) | normalizeNFD }}
							</v-btn> -->
						<!-- </v-btn-toggle> -->
						<v-text-field v-model="search" append-icon="mdi-magnify" :label="$t('Search')" single-line align-self="center">
						</v-text-field>
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
					<v-data-table dense :headers="headers(key)" must-sort :sort-by="['deaths_per_100']" :sort-desc="[true]"
						:items="items" :items-per-page="itemsPerPage" :search="search" class="elevation-0">
						<template v-slot:item="props">
							<tr class="">
								<td class="caption">
									{{ $t(props.item.region) }}
								</td>
								<td class="caption" style="">
									{{
											props.item['deaths_per_100'].toFixed(2)
									}}
								</td>
								<td class="caption" style="">
									{{ props.item['deaths_total'] >= 0 ?
											props.item['deaths_total'].toFixed(0) : '-'
									}}
								</td>
								<td class="caption" style="">
									{{ props.item['deaths_per_100_2020'].toFixed(2) }}
								</td>
								<td class="caption">
									{{ props.item['deaths_total_2020'] >= 0 ?
											(props.item['deaths_total_2020'].toFixed(0)) : '-'
									}}
								</td>
								<td class="caption" style="">
									{{ props.item['deaths_per_100_2021'].toFixed(2) }}
								</td>
								<td class="caption" style="">
									{{ props.item['deaths_total_2021'] >= 0 ?
											props.item['deaths_total_2021'].toFixed(0) : '-'
									}}
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
				<v-icon x-small class="mr-2" color="primary">fa-link</v-icon><span class="font-weight-bold">iMΕdD LAB</span>:
				{{ title[locale.code] }}
			</a>
			<span v-else>
				<span class="font-weight-bold">iMΕdD LAB</span>: {{ title[locale.code] }}
			</span>
		</v-footer>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { normalizeNFD } from '@/utils';

export default {
	name: 'greece-key-by-municipality-table',
	props: {
		delay: {
			default: 100
		}
	},
	components: {},
	computed: {
		...mapGetters(['locale']),
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
				id: 'greece-key-by-municipality-table'
			};
		}
	},
	data() {
		return {
			loading: true,
			key: 'cases',
			items: [],
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
		customSearch(value, search, item) {
			return Object.values(item).some(v => v && v.toString().toLowerCase().includes(search));
		},
		getHeaders() { },
		load() {
			this.loading = true;
			this.title = this.posts[this.embed.id.split('-')[0]].find(m => m.component.id === this.embed.id).title || '';
			this.$store.dispatch('external/getMunicipalitiesData')
				.then(res => {
					this.items = res.map(m => {
						return {
							uid: m.municipality_id,
							region: m.slug,
							slug: m.slug,
							region_gr: m.name,
							deaths_per_100: (m.deaths[0].number + m.deaths[1].number) * 100000 / m.pop_11,
							deaths_total: m.deaths[0].number + m.deaths[1].number,
							deaths_per_100_2020: (m.deaths[0].number) * 100000 / m.pop_11,
							deaths_total_2020: m.deaths[0].number,
							deaths_per_100_2021: (m.deaths[1].number) * 100000 / m.pop_11,
							deaths_total_2021: m.deaths[1].number
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
					value: 'region',
					class: 'text-capitalize',
					width: '20%'
				},
				{
					// text: normalizeNFD(this.$t('Area').toUpperCase()),
					text: '',
					// align: 'start',
					sortable: false,
					value: 'region_gr',
					class: 'text-capitalize',
					width: '10%',
					align: ' d-none'
				},
				{
					text: `${normalizeNFD(this.$t('Per 100K').toUpperCase())}`,
					align: 'start',
					sortable: true,
					filterable: false,
					value: 'deaths_per_100',
					class: 'text-capitalize',
					width: '10%'
				},
				{
					text: `${normalizeNFD(this.$t('Total').toUpperCase())}`,
					align: 'start',
					sortable: true,
					filterable: false,
					value: 'deaths_total',
					class: 'text-capitalize',
					width: '15%'
				},
				{
					text: `${normalizeNFD(this.$t('Per 100K').toUpperCase())} 2020`,
					align: 'start',
					sortable: true,
					filterable: false,
					value: 'deaths_per_100_2020',
					class: 'text-capitalize',
					width: '15%'
				},
				{
					text: `${normalizeNFD(this.$t('Total').toUpperCase())} 2020`,
					align: 'start',
					sortable: true,
					filterable: false,
					value: 'deaths_total_2020',
					class: 'text-capitalize',
					width: '15%'
				},
				{
					text: `${normalizeNFD(this.$t('Per 100K').toUpperCase())} 2021`,
					align: 'start',
					sortable: true,
					filterable: false,
					value: 'deaths_per_100_2021',
					class: 'text-capitalize',
					width: '15%'
				},
				{
					text: `${normalizeNFD(this.$t('Total').toUpperCase())} 2021`,
					align: 'start',
					sortable: true,
					filterable: false,
					value: 'deaths_total_2021',
					class: 'text-capitalize',
					width: '15%'
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
	// background-color: #F7CEC3;
	background-color: rgba(247, 206, 195, 0.65)
}
</style>
