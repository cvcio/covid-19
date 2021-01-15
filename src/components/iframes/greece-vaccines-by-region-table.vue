<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0" justify="space-between">
					<v-spacer/>
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
		<v-divider v-if="!$route.meta.iframe"/>
		<v-container class="px-0" fluid :class="$route.meta.iframe ? 'px-4' : ''">
			<v-row class="px-0" v-if="loading">
				<v-col align="center">
					<v-progress-circular indeterminate color="grey"></v-progress-circular>
				</v-col>
			</v-row>
			<v-row class="px-3" v-else>
				<v-col class="px-0">
					<v-data-table
						dense
						:headers="headers()"
						:sort-by="['percent']"
						:sort-desc="[true]"
						:items="items"
						:items-per-page="itemsPerPage"
						class="elevation-0"
					>
						<template v-slot:item="props">
							<tr class="">
								<td class="caption">
									{{ $t(props.item.region).replace('Ν.', 'Π.Ε.') }}
								</td>
								<td class="caption" style="">
									{{ new Intl.NumberFormat('el-GR').format(props.item.total_vaccinations.toFixed(2)) }}
								</td>
								<td class="caption">
									{{ new Intl.NumberFormat('el-GR').format(props.item.p100p_total.toFixed(2)) }}
								</td>
								<td class="caption">
									{{ new Intl.NumberFormat('el-GR').format(props.item.percent.toFixed(2)) }}%
								</td>
								<td class="caption">
									<v-progress-linear
										:value="props.item.percent"
										background-color="grey lighten-4"
										color="#81B15F"
										height="12"
										class="vaccines-progress"
										>

										</v-progress-linear>
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
import { normalizeNFD } from '@/utils';

export default {
	name: 'greece-vaccines-by-region-table',
	props: {
		delay: {
			default: 100
		}
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
				period: null,
				view: null,
				aggregation: null,
				lang: this.locale.code,
				id: 'greece-vaccines-by-region-table'
			};
		}
	},
	data () {
		return {
			loading: true,
			items: [],
			itemsPerPage: 15,
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
		getHeaders () {},
		load () {
			this.loading = true;
			this.title = this.posts[this.embed.id.split('-')[0]].find(m => m.component.id === this.embed.id).title || '';
			this.$store.dispatch('external/getGRVaccinesTotal', { from: '2020-12-27' })
				.then(res => {
					this.items = res.map(m => {
						m.p100p_total = (m.total_distinct_persons / m.population) * 100000;
						m.percent = (m.total_distinct_persons / m.population) * 100;
						return m;
					});

					this.loading = false;
				});
		},

		update () {
			this.load();
		},

		headers () {
			return [
				{
					text: normalizeNFD(this.$t('Area').toUpperCase()),
					align: 'start',
					sortable: true,
					value: 'region',
					class: ' text-capitalize',
					width: '25%'
				},
				{
					text: normalizeNFD(this.$t('Vaccinations').toUpperCase()),
					align: 'start',
					sortable: true,
					value: 'total_distinct_persons',
					class: ' text-capitalize'
					// width: '15%'
				},
				{
					text: normalizeNFD(this.$t('Vaccinated Per 100K').toUpperCase()),
					align: 'start',
					sortable: true,
					value: 'p100p_total',
					class: ' text-capitalize'
					// width: '15%'
				},
				{
					text: normalizeNFD(this.$t('% Population').toUpperCase()),
					align: 'start',
					sortable: true,
					value: 'percent',
					class: ' text-capitalize'
					// width: '15%'
				},
				{
					text: '',
					align: 'start',
					sortable: false,
					value: 'region',
					width: '20%',
					class: ' text-capitalize'
				}
			];
		}
	}
};
</script>

<style lang="less">
.extra-small-text {
	font-size: 8px !important;
}
.vaccines-progress {
	.v-progress-linear__content {
		width: 100%;
		span {
			width: 100%;
		}
	}
}
</style>
