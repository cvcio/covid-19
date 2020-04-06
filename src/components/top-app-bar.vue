<template>
	<v-app-bar app fixed dark color="transparent" flat class=""
		:class="[
			(alert && $vuetify.breakpoint.smAndDown ? 'mt-12 pt-2' : ''),
			(alert && $vuetify.breakpoint.mdAndUp ? 'mt-9' : ''),
		]"
		>
		<v-row no-gutters :justify="$vuetify.breakpoint.mdAndDown ? 'end' : 'start'">
			<v-btn fab small @click.stop="$store.commit('set_navStats', !navStats)" class="primary mx-3" style="pointer-events: auto;">
				<v-icon small>mdi-chart-timeline-variant</v-icon>
			</v-btn>
			<v-spacer v-if="$vuetify.breakpoint.smAndUp"></v-spacer>
			<v-btn fab small @click.stop="$store.commit('set_navNews', !navNews)" class="primary mx-3"  style="pointer-events: auto;">
				<v-icon small>mdi-message-alert</v-icon>
			</v-btn>
		</v-row>
	</v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'top-app-bar',
	computed: {
		...mapGetters(['alert', 'navStats', 'navNews'])
	}
};
</script>


