<template>
	<v-dialog :value="dialogAbout" @click:outside="$store.commit('set_dialogAbout', false)" width="600px" transition="slide-y-reverse-transition" :fullscreen="$vuetify.breakpoint.mdAndDown">
		<v-card tile>
			<v-card-title>
				<span class="title text-truncate">
					{{ $t('Η εφαρμογή και τα δεδομένα') }}
				</span>
				<v-spacer></v-spacer>
				<v-btn icon @click.stop="$store.commit('set_dialogAbout', false)">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-card-title>
			<text-about/>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'dialog-about',
	computed: {
		...mapGetters(['dialogAbout'])
	},
	components: {
		'text-about': require('@/components/text-about').default
	}
};
</script>
