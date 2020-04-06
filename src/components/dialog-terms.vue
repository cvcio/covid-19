<template>
	<v-dialog :value="dialogTerms" @click:outside="$store.commit('set_dialogTerms', false)" width="600px" transition="slide-y-reverse-transition" :fullscreen="$vuetify.breakpoint.mdAndDown">
		<v-card tile>
			<v-card-title>
				<span class="title text-truncate">
					Όροι Χρήσης
				</span>
				<v-spacer></v-spacer>
				<v-btn icon @click.stop="$store.commit('set_dialogTerms', false)">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-card-title>
			<text-terms/>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'dialog-terms',
	computed: {
		...mapGetters(['dialogTerms'])
	},
	components: {
		'text-terms': require('@/components/text-terms').default
	}
};
</script>


