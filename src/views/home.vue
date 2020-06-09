<template>
	<div id="map" class="">
		<v-row no-gutters justify="center" align="center" class="loader" v-if="loading" >
			<span class="mb-12 mt-n12 grey--text text-center">{{ $t('Φορτώνεται ο παγκόσμιος χάρτης και η βάση δεδομένων κρουσμάτων με COVID-19. Η εφαρμογή ενημερώνεται διαρκώς – με force reload (ctrl ή cmd + shift + R) θα φορτώσετε την τελευταία έκδοση.') }}</span>
			<v-progress-circular v-if="loading" class="loader mt-12" color="primary" indeterminate :size="24"/>
		</v-row>
		<map-mapbox v-if="!loading" :level="activeMap"/>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'home',
	components: {
		'map-mapbox': require('@/components/map-mapbox').default,
	},
	computed: {
		...mapGetters([
			'loading', 'activeMap'
		])
	}
};
</script>
