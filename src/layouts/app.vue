<template>
	<div>
		<app-bar />
		<v-navigation-drawer app floating :value="sidebar" color="" width="95%" temporary v-if="$vuetify.breakpoint.smAndDown">
			<v-container fluid class="pa-0 mt-0">
				<v-row no-gutters class="no-events">
					<tabs class="no-events"/>
				</v-row>
			</v-container>
		</v-navigation-drawer>
		<v-main app light class="pt-0">
			<v-scroll-y-transition mode="out-in">
				<router-view />
			</v-scroll-y-transition>
		</v-main>
		<app-footer />
		<v-bottom-navigation app v-model="m" v-if="$vuetify.breakpoint.smAndDown">
			<v-btn value="recent" class="primary--text" to="/">
				<span>Map</span>
				<v-icon color="primary" small class="mb-1">fa-map</v-icon>
			</v-btn>

			<v-btn value="favorites" class="primary--text" to="/greece/">
				<span>Greece</span>
				<v-icon color="primary" small class="mb-1">fa-search</v-icon>
			</v-btn>
			<v-btn value="nearby" class="primary--text" to="/global/">
				<span>World</span>
				<v-icon color="primary" small class="mb-1">fa-globe</v-icon>
			</v-btn>
		</v-bottom-navigation>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'layout-app',
	components: {
		'app-bar': require('@/components/app/app-bar').default,
		'app-footer': require('@/components/app/app-footer').default,
		tabs: require('@/components/content/tabs').default
	},
	computed: {
		...mapGetters(['sidebar'])
	},
	data () {
		return {
			m: true
		};
	},
	mounted () {},
	methods: {}
};
</script>
