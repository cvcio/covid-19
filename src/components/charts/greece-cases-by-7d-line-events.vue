<template>
	<v-card color="white">
		<v-app-bar flat color="grey iframe-header lighten-5 px-4 mx-0">
			<v-container class="pa-0 ma-0">
				<v-row class="pa-0 ma-0" justify="space-between">
					<v-col cols="5" sm="5" class="pa-0" align-self="center">
						<v-btn-toggle dense class="mr-2" rounded v-model="point" mandatory>
							<v-btn x-small class="primary--text" value="cases">
								{{( $vuetify.breakpoint.smAndDown ? $tc('cases', 1).substr(1, 1) : $tc('cases', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="deaths">
								{{ $vuetify.breakpoint.smAndDown ? 'A' : 'deaths' }}
							</v-btn>
							<v-btn x-small class="primary--text" value="critical">
								{{ $vuetify.breakpoint.smAndDown ? 'A' : 'ιντθβατεδ' }}
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
		<v-container class="px-4" fluid>
			<v-row class="px-0">
				<v-col
					cols="12"
					class="px-4"
				>
				<d7-line-bar-events v-if="item"
					:key="'gcb7l-' + item.uid + '-' + point" :id="'gcb7l-uid-' + item.uid + '-' + point"
					:point="point" :values="item[point]"
					:dates="item.dates"/>
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
	name: 'greece-cases-by-7d-line-events',
	components: {
		'd7-line-bar-events': require('@/components/charts/d7-line-bar-events').default
	},
	computed: {
		...mapGetters(['locale']),
		...mapGetters('filters', ['periodInterval'])
	},
	data () {
		return {
			point: 'cases',
			item: null
		};
	},
	mounted () {
		this.load();
	},
	methods: {
		load () {
			this.$store.dispatch('external/getGlobalAGG', 'GRC/all/' + this.periodInterval[3].value)
				.then(res => {
					console.log(res);

					this.item = res.map(m => {
						m.cases = m.new_cases.map(m => Math.max(0, m));
						m.deaths = m.new_deaths.map(m => Math.max(0, m));
						m.critical = m.critical.map(m => Math.max(0, m));
						const totalCases = sum(m.cases);
						const totalDeaths = sum(m.deaths);
						const p100pCases = m.population > 0 ? ((sum(m.cases) / m.population) * 100000) : 0;
						const p100pDeaths = m.population > 0 ? ((sum(m.deaths) / m.population) * 100000) : 0;
						return {
							uid: m.uid,
							region: m.country,
							totalCases,
							totalDeaths,
							p100pCases,
							p100pDeaths,
							dates: getDates(m.from, m.to),
							cases: m.cases,
							deaths: m.deaths,
							critical: m.critical
						};
					});

					this.item = this.item[0];
					console.log(this.item);
				});
		},
		update () {
			console.debug('Update Data', this.name);
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
