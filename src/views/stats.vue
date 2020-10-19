<template>
	<v-container class="max-w" >
		<v-row no-gutters justify="center" align="center" class="loader" v-if="loading" >
			<span class="mb-12 mt-n12 grey--text text-center">{{ $t('Φορτώνεται ο παγκόσμιος χάρτης και η βάση δεδομένων κρουσμάτων με COVID-19. Η εφαρμογή ενημερώνεται διαρκώς – με force reload (ctrl ή cmd + shift + R) θα φορτώσετε την τελευταία έκδοση.') }}</span>
			<v-progress-circular v-if="loading" class="loader mt-12" color="primary" indeterminate :size="24"/>
		</v-row>

		<v-row justify="center" align="center" v-if="!loading">
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="schools_map_greece" :key="'schools_map_greece_' + $i18n.locale"
					:src="$CHARTS_URL + 'schools_map_greece_' + $i18n.locale.toUpperCase() + '.json'"
				/>
			</v-col>
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="schools_map_athens" :key="'schools_map_athens_' + $i18n.locale"
					:src="$CHARTS_URL + 'schools_map_athens_' + $i18n.locale.toUpperCase() + '.json'"
				/>
			</v-col>
		</v-row>

		<v-row justify="center" align="center" v-if="!loading">
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="linechart_deaths_intubated_gr" :key="'linechart_deaths_intubated_gr_' + $i18n.locale"
					:src="$CHARTS_URL + 'linechart_deaths_intubated_gr_' + $i18n.locale.toUpperCase() + '.json'"
				/>
			</v-col>
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="create_regions_facets" :key="'create_regions_facets_' + $i18n.locale"
					:src="$CHARTS_URL + 'create_regions_facets_' + $i18n.locale.toUpperCase() + '.json'"
				/>
			</v-col>
		</v-row>

		<v-row justify="center" align="center" v-if="!loading">
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="create_non_residents_line_" :key="'create_non_residents_line_' + $i18n.locale"
					:src="$CHARTS_URL + 'create_non_residents_line_' + $i18n.locale.toUpperCase() + '.json'"
				/>
			</v-col>
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="cases_growth_" :key="'cases_growth_' + $i18n.locale"
					:src="$CHARTS_URL + 'cases_growth_' + $i18n.locale.toUpperCase() + '.json'"
				/>
			</v-col>
		</v-row>

		<v-row justify="center" align="center" v-if="!loading">
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="create_scatterplot_casesVStests_logx" :key="'create_scatterplot_casesVStests_logx_' + $i18n.locale"
					:src="$CHARTS_URL + 'create_scatterplot_casesVStests_logx_' + $i18n.locale.toUpperCase() + '.json'"
					/>
			</v-col>
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="deaths_growth_" :key="'deaths_growth_' + $i18n.locale"
					:src="$CHARTS_URL + 'deaths_growth_' + $i18n.locale.toUpperCase() + '.json'"
					/>
			</v-col>
		</v-row>

		<v-row justify="center" align="center" v-if="!loading">
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="10_deaths" :key="'10_deaths_' + $i18n.locale"
					:src="$CHARTS_URL + '10_deaths_' + $i18n.locale.toUpperCase() + '.json'"
				/>
			</v-col>
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="100_cases" :key="'100_cases_' + $i18n.locale"
					:src="$CHARTS_URL + '100_cases_' + $i18n.locale.toUpperCase() + '.json'"
				/>
			</v-col>
		</v-row>

		<v-row justify="center" align="center" v-if="!loading">
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="death_heat" :key="'death_heat_' + $i18n.locale"
					:src="$CHARTS_URL + 'death_heat_' + $i18n.locale.toUpperCase() + '.json'"
				/>
			</v-col>
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="cases_heat" :key="'cases_heat_' + $i18n.locale"
					:src="$CHARTS_URL + 'cases_heat_' + $i18n.locale.toUpperCase() + '.json'"
				/>
			</v-col>
		</v-row>

		<v-row justify="center" align="center" v-if="!loading">
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="create_chrolopleth_casesrate" :key="'create_chrolopleth_casesrate_' + $i18n.locale"
					:src="$CHARTS_URL + 'create_chrolopleth_casesrate_' + $i18n.locale.toUpperCase() + '.json'"
				/>
			</v-col>
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="create_chrolopleth_recoveredrate" :key="'create_chrolopleth_recoveredrate_' + $i18n.locale"
					:src="$CHARTS_URL + 'create_chrolopleth_recoveredrate_' + $i18n.locale.toUpperCase() + '.json'"
				/>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'stats',
	computed: {
		...mapGetters([
			'loading'
		])
	},
	components: {
		'pt-chart': require('@/components/pt-chart').default
	}
};
</script>

<style lang="less" scoped>
.max-w {
	// max-width: 1204px;
}
</style>
