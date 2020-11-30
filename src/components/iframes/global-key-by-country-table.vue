<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0" justify="space-between">
					<v-col class="pa-0" align-self="center">
						<v-btn-toggle dense class="mr-2" rounded v-model="key" mandatory>
							<v-btn x-small class="primary--text" value="cases">
								{{( $vuetify.breakpoint.smAndDown ? $tc('cases', 1).substr(1, 1) : $tc('cases', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="deaths">
								{{( $vuetify.breakpoint.smAndDown ? $tc('deaths', 1).substr(1, 1) : $tc('deaths', 1)) | normalizeNFD }}
							</v-btn>
							<!-- <v-btn x-small class="primary--text" value="recovered">
								{{( $vuetify.breakpoint.smAndDown ? $tc('deaths', 1).substr(1, 1) : $tc('deaths', 1)) | normalizeNFD }}
							</v-btn> -->
						</v-btn-toggle>
					</v-col>
					<v-col class="pa-0 grow text-end ml-1" align-self="center" v-if="!$route.meta.iframe">
						<!-- <v-btn x-small fab color="grey" dark class="mx-2 elevation-0" @click="update">
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
			<v-row class="px-3">
				<v-col class="px-0" align="center">
					<v-data-table
						dense
						:headers="headers"
						:items="items"
						:sort-by="['p100p_' + key]"
   						:sort-desc="[true, true]"
						:items-per-page="20"
						class="elevation-0"
					>
						<template v-slot:item="props">
							<tr class="">
								<td class="caption">
									{{ $t(props.item.region) }}
								</td>
								<td class="caption" style="">
									{{ new Intl.NumberFormat('el-GR').format(props.item['total_' + key].toFixed(2)) }}
								</td>
								<td class="caption">
									{{ typeof props.item['p100p_' + key] !== 'string' ? new Intl.NumberFormat('el-GR').format(props.item['p100p_' + key].toFixed(2)) : '-'}}
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
import { getDates } from '@/utils';

export default {
	name: 'global-key-by-country-table',
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
				period: null,
				lang: this.locale.code,
				id: 'global-key-by-country-table'
			};
		}
	},
	data () {
		return {
			key: 'cases',
			headers: [
				{
					text: this.$t('Country'),
					align: 'start',
					sortable: true,
					value: 'region',
					class: 'text-capitalize',
					width: '30%'
				},
				{
					text: this.$t('Total'),
					align: 'start',
					sortable: true,
					// value: 'total_' + this.key,
					class: 'text-capitalize',
					width: '15%'
				},
				{
					text: this.$t('Per 100K'),
					align: 'start',
					sortable: true,
					// value: 'p100p_' + this.key,
					class: 'text-capitalize',
					width: '15%'
				},
				{
					text: this.$t('Weekly'),
					align: 'start',
					sortable: false,
					value: 'region',
					width: '40%',
					class: 'text-capitalize'
				}
			],
			items: [],
			title: { en: '', el: '' }
		};
	},
	mounted () {
		if (this.posts.global.length === 0) {
			this.$store.dispatch('internal/getPosts')
				.then(() => {
					this.load();
				});
		} else {
			this.load();
		}
	},
	methods: {
		setEmbed () {
			this.$store.commit('setEmbedDialog', true);
			this.$store.commit('setEmbed', this.embed);
		},
		load () {
			this.title = this.posts[this.embed.id.split('-')[0]].find(m => m.component.id === this.embed.id).title || '';
			this.$store.dispatch('external/getGlobalAGG', 'all/new_cases,new_deaths,new_recovered/' + this.periodInterval[3].value)
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
						return {
							uid: m.uid,
							region: m.country,
							total_cases,
							total_deaths,
							total_recovered,
							p100p_cases,
							p100p_deaths,
							p100p_recovered,
							dates: getDates(m.from, m.to),
							cases: m.new_cases,
							deaths: m.new_deaths,
							recovered: m.new_recovered,
							sources: m.sources.sort()
						};
					});
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
</style>
