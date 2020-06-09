<template>
	<v-footer app inset dark class="primary lighten-1" :class="$vuetify.breakpoint.mdAndUp ? '' : 'py-3 mb-8'">
		<v-btn x-small text @click.stop="$store.commit('set_dialogAbout', true)" class="text-inherit">
			{{ $t('Η Εφαρμογή & Τα Data') }}
		</v-btn>
		<v-btn x-small text @click.stop="$store.commit('set_dialogTerms', true)" class="text-inherit">
			<v-icon left small>mdi-creative-commons</v-icon>
			{{ $t('Όροι Χρήσης') }}
		</v-btn>
		<v-btn x-small text href="https://mediawatch.io/" target="_blank" class="text-inherit">
			Visualization by CVCIO
		</v-btn>
		<v-spacer v-if="$vuetify.breakpoint.smAndUp"></v-spacer>
		<v-btn x-small text @click.stop="$store.commit('set_dialogEmbed', true)">
			Embed <v-icon right small>mdi-code-tags</v-icon>
		</v-btn>
		<!-- <v-btn x-small color="red" depressed class="ml-2 text-inherit">
			<span class="caption">BETA</span>
		</v-btn> -->
	</v-footer>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'bottom-footer',
	computed: {
		...mapGetters(['dialogAbout', 'dialogTerms', 'dialogEmbed'])
	}
};
</script>
