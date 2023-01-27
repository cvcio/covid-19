<template>
	<div>
		<app-bar />
		<v-navigation-drawer app floating :value="sidebar" color="" width="95%" temporary
			v-if="$vuetify.breakpoint.smAndDown">
			<v-container fluid class="pa-0 mt-0">
				<v-row no-gutters class="no-events">
					<tabs class="no-events" />
				</v-row>
			</v-container>
		</v-navigation-drawer>
		<v-main app light class="pt-0">
			<v-scroll-y-transition mode="out-in">
				<router-view />
			</v-scroll-y-transition>
		</v-main>
		<!-- <eody-disclaimer /> -->
		<app-footer />
		<v-bottom-navigation v-model="m" v-if="$vuetify.breakpoint.smAndDown" app class="bottom-navigation">
			<v-btn value="recent" class="primary--text" to="/">
				<span>{{ $t('Home') }}</span>
				<v-icon color="primary" small class="mb-1">fa-home</v-icon>
			</v-btn>

			<v-btn value="favorites" class="primary--text" to="/greece/">
				<span>{{ $t('Charts') }}</span>
				<v-icon color="primary" small class="mb-1">fa-chart-bar</v-icon>
			</v-btn>
		</v-bottom-navigation>
		<embed-dialog />
		<app-social />
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'layout-app',
	components: {
		'app-bar': require('@/components/app/app-bar').default,
		'app-footer': require('@/components/app/app-footer').default,
		tabs: require('@/components/content/tabs').default,
		// 'eody-disclaimer': require('@/components/shared/eody-disclaimer').default,
		'app-social': require('@/components/app/app-social').default,
		'embed-dialog': require('@/components/content/embeds/dialog').default
	},
	computed: {
		...mapGetters(['sidebar'])
	},
	data () {
		return {
			m: true
		};
	},
	mounted () {
		// const addthis = document.createElement('script');
		// addthis.setAttribute('src', '//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5e6e40408bf2d5f7');
		// document.head.appendChild(addthis);
	},
	methods: {}
};
</script>

<style lang="less" scoped>
.bottom-navigation {
	// margin-bottom: 0 !important;
}
</style>
