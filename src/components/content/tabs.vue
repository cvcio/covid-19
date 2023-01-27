<template>
	<v-row id="panel" class="tabs" no-gutters :class="$vuetify.breakpoint.smAndDown ? 'elevation-0' : 'px-3 mt-14'">
		<v-col cols="12" sm="12" md="5" lg="4" xl="3" class="events"
			:class="$vuetify.breakpoint.smAndDown ? 'mt-0' : 'mt-6'">
			<h6 class="caption text-end" v-if="!$vuetify.breakpoint.smAndDown">{{ $t('lastupdate') }} {{
				$moment.utc(lastUpdatedAt).format('LLL')
			}}</h6>
			<v-card class="transparent" :class="$vuetify.breakpoint.smAndDown ? 'elevation-0' : ''" light>
				<v-tabs v-model="tab" background-color="transparent" grow slider-color="transparent" height="0px">
					<v-tab :ripple="false" class="tab-item tab-title" active-class="font-weight-bold"
						:style="`cursor: default !important`" :value="0" :class="
							[
								($vuetify.breakpoint.smAndDown ? '' : 'rounded-t elevation-2'),
								(active === 0 ? 'white' : 'grey lighten-4 grey--text'),
							].join(' ')
						" @click="$store.commit('filters/setMapLevel', 'greece')">
					</v-tab>
				</v-tabs>
				<v-tabs-items v-model="tab">
					<tab-item-greece :tab="0" />
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
		'tab-item-greece': require('@/components/content/tab-item-greece').default
	},
	computed: {
		...mapGetters(['locale', 'sidebar', 'lastUpdatedAt'])
	},
	watch: {
		tab(newValue, old) {
			if (newValue !== old) {
				this.active = newValue;
			}
		}
	},
	data() {
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
