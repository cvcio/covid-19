<template>
	<v-snackbar
		class="eody-disclaimer"
		:class="$vuetify.breakpoint.smAndDown ? '' : 'r'"
		v-model="disclaimer"
		light
		vertical
		multi-line
		app
		:timeout="60*1000"
		transition="slide-y-reverse-transition"
	>
		<v-row class="pa-0 ma-0">
			<v-col align="start" class="pa-0 ma-0">
				<p class="body-2 serif" v-if="locale.code === 'el'">
					Η γεωγραφική κατανομή των θανάτων από κορονοϊό ανά την Ελλάδα δεν ανακοινώνεται από τους αρμόδιους φορείς και, για τον λόγο αυτό, είναι αδύνατη η χαρτογράφησή τους ανά Περιφερειακή Ενότητα στη χώρα.
				</p>
				<p class="body-2 serif" v-else>
					The geographical distribution of COVID-19 deaths across Greece has not been announced by the competent authorities and, for this reason, the visualization of fatalities by Regional Unit in the country is impossible.
				</p>
			</v-col>
		</v-row>
		<v-row class="pa-0 ma-0">
			<v-col align="end" class="pa-0 ma-0">
				<v-btn class="text-inherit caption" small color="secondary" @click="disclaimer = false">
					{{ $t('Close' )}}
				</v-btn>
			</v-col>
		</v-row>
	</v-snackbar>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'eody-disclaimer',
	computed: {
		...mapGetters(['locale', 'view'])
	},
	data () {
		return {
			disclaimer: true
		};
	}
};
</script>

<style lang="less" scoped>
.eody-disclaimer.r {
	right: 0;
}
</style>
