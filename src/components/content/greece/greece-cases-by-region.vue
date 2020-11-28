<template>
	<v-card color="white">
		<v-app-bar flat color="grey iframe-header lighten-5 px-4 mx-0">
			<v-container class="pa-0 ma-0">
				<v-row class="pa-0 ma-0" justify="space-between">
					<v-col cols="5" sm="5" class="pa-0" align-self="center">
						<v-btn-toggle dense class="mr-2" rounded v-model="key" mandatory>
							<v-btn x-small class="primary--text" value="cases">
								{{( $vuetify.breakpoint.smAndDown ? $tc('cases', 1).substr(1, 1) : $tc('cases', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="deaths">
								{{ $vuetify.breakpoint.smAndDown ? 'A' : 'deaths' }}
							</v-btn>
						</v-btn-toggle>
					</v-col>
					<v-spacer/>
					<v-col class="pa-0 text-end justify-end" align-self="center">
						<v-btn x-small fab color="grey" dark class="mx-2 elevation-0" @click="update">
							<v-icon x-small>fa-redo</v-icon>
						</v-btn>
						<v-btn x-small fab color="primary" dark class="mx-0 elevation-0">
							<v-icon x-small>fa-code</v-icon>
						</v-btn>
					</v-col>
				</v-row>
			</v-container>
		</v-app-bar>
		<v-divider/>
		<v-container class="px-0">
			<v-row class="px-3">
				<v-col class="px-0" align="center">
					<v-data-table
						dense
						:headers="headers"
						:items="items"
						:sort-by="['totalCases', 'p100pCases']"
   						:sort-desc="[true, true]"
						:items-per-page="10"
						class="elevation-0"
					>
						<template v-slot:item="props">
							<tr class="">
								<td class="caption">
									{{ $t(props.item.region) }}
								</td>
								<td class="caption" style="">
									{{ new Intl.NumberFormat('el-GR').format(props.item.totalCases.toFixed(2)) }}
								</td>
								<td class="caption">
									{{ typeof props.item.p100pCases !== 'string' ? new Intl.NumberFormat('el-GR').format(props.item.p100pCases.toFixed(2)) : '-'}}
								</td>
								<td class="caption" v-if="!$vuetify.breakpoint.smAndDown">
									<heatbar
										:key="'gcbr-' + props.item.uid + '-' + key"
										:id="'gcbr-uid-' + props.item.uid + '-' + key"
										:point="key"
										:values="props.item[key]"
										:dates="props.item.dates"
										:sources="props.item.sources"/>
								</td>
							</tr>
							<tr v-if="$vuetify.breakpoint.smAndDown" style="width:100%" class="">
								<td class="caption" style="width:100%">
									<heatbar
										:key="'gcbr-' + props.item.uid + '-' + key"
										:id="'gcbr-uid-' + props.item.uid + '-' + key"
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
			<span class="font-weight-bold">IMΕdD LAB</span>: Ελλαδά, θάνατοι, από την αρχή της πανδημίας
		</v-footer>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { sum } from 'lodash';
import { getDates } from '@/utils';

export default {
	name: 'greece-cases-by-region',
	components: {
		heatbar: require('@/components/charts/heatbar').default
	},
	computed: {
		...mapGetters(['locale']),
		...mapGetters('filters', ['periodInterval'])
	},
	data () {
		return {
			key: 'cases',
			headers: [
				{
					text: this.$t('Area'),
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
					value: 'totalCases',
					class: 'text-capitalize',
					width: '15%'
				},
				{
					text: this.$t('Per 100K'),
					align: 'start',
					sortable: true,
					value: 'p100pCases',
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
			items: []
		};
	},
	mounted () {
		this.load();
	},
	methods: {
		load () {
			this.$store.dispatch('external/getGreeceAGG', 'all/new_cases,new_deaths/' + this.periodInterval[3].value)
				.then(res => {
					this.items = res.map(m => {
						m.new_cases = m.new_cases.map(m => Math.max(0, m));
						m.new_deaths = m.new_deaths.map(m => Math.max(0, m));
						const totalCases = sum(m.new_cases);
						const totalDeaths = sum(m.new_deaths);
						const p100pCases = m.population > 0 ? ((sum(m.new_cases) / m.population) * 100000) : '-';
						const p100pDeaths = m.population > 0 ? ((sum(m.new_deaths) / m.population) * 100000) : '-';
						return {
							uid: m.uid,
							region: m.region,
							totalCases,
							totalDeaths,
							p100pCases,
							p100pDeaths,
							dates: getDates(m.from, m.to),
							cases: m.new_cases,
							deaths: m.new_deaths,
							sources: m.sources
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
