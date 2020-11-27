<template>
	<v-app-bar app class="elevation-0" color="rgba(255, 255, 255, 0.7)">
		<v-app-bar-nav-icon @click="$store.commit('setSidebar', !sidebar)" v-if="$vuetify.breakpoint.smAndDown">
			<v-icon small color="primary">fa-sliders-h</v-icon>
		</v-app-bar-nav-icon>
		<router-link to="/" style="width:100%;">
			<logo-imedd-lab/>
		</router-link>
		<v-spacer/>
	</v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'app-bar',
	components: {
		'logo-imedd-lab': require('@/components/shared/logo-imedd-lab').default
	},
	computed: {
		...mapGetters(['locale', 'sidebar'])
	}
};
</script>

<style lang="less" scoped>
</style>
