<template>
	<v-dialog :value="dialogWarnEODY" @click:outside="$store.commit('set_dialogWarnEODY', false)" width="380px"  transition="slide-y-reverse-transition" :fullscreen="$vuetify.breakpoint.mdAndDown">
		<v-card tile color="accent" dark>
			<v-card-title>
				<v-icon class="mr-3">mdi-alert</v-icon>
				<span class="title text-truncate">
					Title
				</span>
				<v-spacer></v-spacer>
				<v-btn icon @click.stop="$store.commit('set_dialogWarnEODY', false)">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-card-title>
			<v-card-text>
				<p class="body-1">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
				</p>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'dialog-warn-eody',
	computed: {
		...mapGetters(['dialogWarnEODY'])
	}
};
</script>


