<template>
	<v-app-bar app class="elevation-0" color="rgba(255, 255, 255, 1)">
		<v-app-bar-nav-icon @click="$store.commit('setSidebar', !sidebar)" v-if="$vuetify.breakpoint.smAndDown">
			<v-icon small color="primary">fa-sliders-h</v-icon>
		</v-app-bar-nav-icon>
		<a href="https://lab.imedd.org/" target="_blank" style="width: 178px;">
			<logo-imedd-lab/>
		</a>
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
