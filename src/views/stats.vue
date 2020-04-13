<template>
	<v-container class="max-w" >
		<v-row no-gutters justify="center" align="center" class="loader" v-if="loading" >
			<span class="mb-12 mt-n12 grey--text text-center">Φορτώνεται ο παγκόσμιος χάρτης και η βάση δεδομένων κρουσμάτων με COVID-19. Η εφαρμογή ενημερώνεται διαρκώς – με force reload (ctrl ή cmd + shift + R) θα φορτώσετε την τελευταία έκδοση.</span>
			<v-progress-circular v-if="loading" class="loader mt-12" color="primary" indeterminate :size="24"/>
		</v-row>
		<v-row justify="center" align="center" v-if="!loading">
			<v-col cols="12" xs="12" md="6">
				<pt-chart id="100cases_on1" :src="$BASE_URL + 'shared/charts/100cases_on.json'"/>
			</v-col>
			<v-col cols="12" xs="12" md="6">
				<pt-chart id="100cases_on2" :src="$BASE_URL + 'shared/charts/100cases_on.json'"/>
			</v-col>
			<v-col cols="12" xs="12" md="6">
				<pt-chart id="100cases_on3" :src="$BASE_URL + 'shared/charts/100cases_on.json'"/>
			</v-col>
			<v-col cols="12" xs="12" md="6">
				<pt-chart id="100cases_on4" :src="$BASE_URL + 'shared/charts/100cases_on.json'"/>
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
