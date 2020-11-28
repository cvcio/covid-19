<template>
	<v-tab-item>
		<v-card flat>
			<v-container fluid class="px-0">
				<v-row class="px-4" align="center">
					<v-col cols="6">
						<switch-map-source :label="'COVID—19'" :val="'covid'" disabled/>
					</v-col>
					<v-col cols="6">
						<autocomplete-map-period :label="$t('label.period')"/>
					</v-col>
				</v-row>
				<v-row class="px-4" align="center" no-gutters>
					<v-col cols="12" class="primary--opac pa-2 mb-1">
						<h4 class="text-h5 font-weight-bold grey--text">
							<span class="primary--text" v-if="mapPeriodIDX < 3">{{ new Intl.NumberFormat('el-GR').format(cases.toFixed(2)) }}</span>
							<span class="primary--text" v-if="mapPeriodIDX === 3">{{ new Intl.NumberFormat('el-GR').format(totalCases.toFixed(2)) }}</span>
							<span class="" v-if="mapPeriodIDX < 3"> / {{ new Intl.NumberFormat('el-GR').format(totalCases.toFixed(2)) }}</span>
						</h4>
						<p class="caption small-caption text-uppercase primary--text mb-0">
							<span v-if="mapPeriodIDX < 3">{{ $tc('cases', 1) | normalizeNFD }} / </span>{{ $t('total cases') | normalizeNFD }}
						</p>
					</v-col>
					<v-col cols="12" class="secondary--opac pa-2">
						<h4 class="text-h5 font-weight-bold grey--text">
							<span class="secondary--text" v-if="mapPeriodIDX < 3">{{ new Intl.NumberFormat('el-GR').format(deaths.toFixed(2)) }}</span>
							<span class="secondary--text" v-if="mapPeriodIDX === 3">{{ new Intl.NumberFormat('el-GR').format(totalDeaths.toFixed(2)) }}</span>
							<span class="" v-if="mapPeriodIDX < 3"> / {{ new Intl.NumberFormat('el-GR').format(totalDeaths.toFixed(2)) }}</span>
						</h4>
						<p class="caption small-caption text-uppercase secondary--text mb-0">
							<span v-if="mapPeriodIDX < 3">{{ $tc('deaths', 1) | normalizeNFD }} / </span>{{ $t('total deaths') | normalizeNFD }}
						</p>
					</v-col>
				</v-row>
				<v-row class="mt-1 mb-4 px-7 py-0" align="center">
					<v-col cols="12" class="py-0 px-3">
						<v-row class="outlined">
							<v-col class="pa-2 primary--text" v-if="mapPeriodIDX === 0">
								<h4 class="subtitle-2 font-weight-bold">
									{{ new Intl.NumberFormat('el-GR').format(active.toFixed(2)) }}
								</h4>
								<p class="caption small-caption text-uppercase blue-grey--text mb-0">
									{{ $t('Active Cases') | normalizeNFD }}
								</p>
							</v-col>
							<v-col class="pa-2 orange--text" v-if="mapPeriodIDX === 0">
								<h4 class="subtitle-2 font-weight-bold">
									{{ new Intl.NumberFormat('el-GR').format(critical.toFixed(2)) }}
								</h4>
								<p class="caption small-caption text-uppercase blue-grey--text mb-0">
									{{ $t('Intubated') | normalizeNFD }}
								</p>
							</v-col>
							<v-col class="pa-2 success--text">
								<h4 class="subtitle-2 font-weight-bold">
									{{ new Intl.NumberFormat('el-GR').format(recovered.toFixed(2)) }}
								</h4>
								<p class="caption small-caption text-uppercase blue-grey--text mb-0">
									{{ $t('Recovered') | normalizeNFD }}
								</p>
							</v-col>
							<v-col class="pa-2 grey--text">
								<h4 class="subtitle-2 font-weight-bold">
									{{ new Intl.NumberFormat('el-GR').format(tests.toFixed(2)) }}
								</h4>
								<p class="caption small-caption text-uppercase blue-grey--text mb-0">
									{{ $t('Tests') | normalizeNFD }}
								</p>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
			</v-container>
		</v-card>
	</v-tab-item>
</template>

<script>
import { mapGetters } from 'vuex';
import { sumBy } from 'lodash';

export default {
	name: 'tab-item-global',
	props: ['tab'],
	components: {
		'switch-map-source': require('@/components/content/switch-map-source').default,
		'autocomplete-map-period': require('@/components/content/autocomplete-map-period').default
	},
	computed: {
		...mapGetters(['locale']),
		...mapGetters('filters', ['mapPeriod', 'mapPeriodIDX'])
	},
	watch: {
		mapPeriod (value, old) {
			if (value !== old) {
				this.load();
			}
		}
	},
	data () {
		return {
			totalCases: 0,
			totalDeaths: 0,
			cases: 0,
			deaths: 0,
			active: 0,
			critical: 0,
			recovered: 0,
			tests: 0
		};
	},
	mounted () {
		this.load();
	},
	methods: {
		load () {
			this.$store.dispatch('external/getGlobalTotal', { from: this.mapPeriodIDX > 0 ? this.mapPeriod : null })
				.then(res => {
					this.totalCases = sumBy(res, 'total_cases') || 0;
					this.cases = sumBy(res, 'cases') || 0;
					this.totalDeaths = sumBy(res, 'total_deaths') || 0;
					this.deaths = sumBy(res, 'deaths') || 0;
					this.active = sumBy(res, 'total_active') || 0;
					this.critical = sumBy(res, 'total_critical') || 0;
					this.recovered = sumBy(res, 'total_recovered') || 0;
					this.tests = sumBy(res, 'total_tests') || 0;
				});
		}
	}
};
</script>

<style lang="less" scoped>
.events {
	pointer-events: all;
}
.primary--opac {
	background: #f2f7f7;
}
.accent--opac {
	background: rgba(255,0,0,0.1);
}
.secondary--opac {
	background: #f7f2f2;
}
.row.outlined {
	border: 1px solid #f2f7f7;
}
</style>
