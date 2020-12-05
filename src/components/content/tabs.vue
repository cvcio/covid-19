<template>
	<v-row class="tabs" no-gutters :class="$vuetify.breakpoint.smAndDown ? 'elevation-0' : 'px-3 mt-8'">
		<v-col cols="12" sm="6" md="5" lg="4" xl="3" class="events">
			<h6 class="caption text-end" v-if="!$vuetify.breakpoint.smAndDown">{{ $t('lastupdate') }} {{ $moment.utc(lastUpdatedAt).format('LLL') }}</h6>
			<v-card class="transparent" :class="$vuetify.breakpoint.smAndDown ? 'elevation-0' : ''" light>
				<v-tabs
						v-model="tab"
						background-color="transparent"
						grow
						slider-color="transparent"
					>
					<v-btn icon tile rounded class="primary " :width="$vuetify.breakpoint.smAndDown ? 48 : 44" :height="$vuetify.breakpoint.smAndDown ? 48 : 44"
						:class="$vuetify.breakpoint.smAndDown ? '' : 'mb-1 mr-1 elevation-2'"
						v-if="$vuetify.breakpoint.smAndDown"
						@click="$store.commit('setSidebar', !sidebar)">
						<v-icon class="" small color="white">
							fa-sliders-h
						</v-icon>
					</v-btn>
					<v-tab :ripple="false" class="tab-item" active-class="font-weight-bold" :value="0"
						:class="
							[
								($vuetify.breakpoint.smAndDown ? '' : 'mr-1 rounded-t elevation-2'),
								(active === 0 ? 'white' : 'grey lighten-4 grey--text'),
							].join(' ')
						"
						@click="$store.commit('filters/setMapLevel', 'greece')">{{ $t('view.greece') | normalizeNFD }}</v-tab>
					<v-tab :ripple="false" class="tab-item" active-class="font-weight-bold" :value="1"
						:class="
							[
								($vuetify.breakpoint.smAndDown ? '' : 'ml-1 rounded-t elevation-2'),
								(active === 1 ? 'white' : 'grey lighten-4 grey--text'),
							].join(' ')
						"
						@click="$store.commit('filters/setMapLevel', 'global')">{{ $t('view.global') | normalizeNFD }}</v-tab>
				</v-tabs>
				<v-tabs-items v-model="tab">
					<tab-item-greece :tab="0"/>
					<tab-item-global :tab="1"/>
				</v-tabs-items>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'tabs',
	components: {
		'tab-item-greece': require('@/components/content/tab-item-greece').default,
		'tab-item-global': require('@/components/content/tab-item-global').default
	},
	computed: {
		...mapGetters(['locale', 'sidebar', 'lastUpdatedAt'])
	},
	watch: {
		tab (newValue, old) {
			if (newValue !== old) {
				this.active = newValue;
			}
		}
	},
	data () {
		return {
			tab: 0,
			active: 0
		};
	}
};
</script>

<style lang="less" scoped>
.events {
	pointer-events: all;
}
.tabs {
	z-index: 0;
}

</style>
