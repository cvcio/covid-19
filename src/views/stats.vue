<template>
	<v-container class="max-w" >
		<v-row no-gutters justify="center" align="center" class="loader" v-if="loading" >
			<span class="mb-12 mt-n12 grey--text text-center">Φορτώνεται ο παγκόσμιος χάρτης και η βάση δεδομένων κρουσμάτων με COVID-19. Η εφαρμογή ενημερώνεται διαρκώς – με force reload (ctrl ή cmd + shift + R) θα φορτώσετε την τελευταία έκδοση.</span>
			<v-progress-circular v-if="loading" class="loader mt-12" color="primary" indeterminate :size="24"/>
		</v-row>
		<v-row justify="center" align="center" v-if="!loading">
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="10_deaths" src="https://raw.githubusercontent.com/iMEdD-Lab/open-data/master/COVID-19/charts/10_deaths.json"/>
			</v-col>
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="100_cases" src="https://raw.githubusercontent.com/iMEdD-Lab/open-data/master/COVID-19/charts/100_cases.json"/>
			</v-col>
		</v-row>
		<v-row justify="center" align="center" v-if="!loading">
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="create_scatterplot_casesVStests_logx" src="https://raw.githubusercontent.com/iMEdD-Lab/open-data/master/COVID-19/charts/create_scatterplot_casesVStests_logx.json"/>
			</v-col>
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="linechart_deaths_intubated_gr" src="https://raw.githubusercontent.com/iMEdD-Lab/open-data/master/COVID-19/charts/linechart_deaths_intubated_gr.json"/>
			</v-col>
		</v-row>
		<v-row justify="center" align="center" v-if="!loading">
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="death_heat" src="https://raw.githubusercontent.com/iMEdD-Lab/open-data/master/COVID-19/charts/death_heat.json"/>
			</v-col>
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="cases_heat" src="https://raw.githubusercontent.com/iMEdD-Lab/open-data/master/COVID-19/charts/cases_heat.json"/>
			</v-col>
		</v-row>
		<v-row justify="center" align="center" v-if="!loading">
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="create_chrolopleth_casesrate" src="https://raw.githubusercontent.com/iMEdD-Lab/open-data/master/COVID-19/charts/create_chrolopleth_casesrate.json"/>
			</v-col>
			<v-col cols="12" xs="12" lg="6">
				<pt-chart id="create_chrolopleth_recoveredrate" src="https://raw.githubusercontent.com/iMEdD-Lab/open-data/master/COVID-19/charts/create_chrolopleth_recoveredrate.json"/>
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
