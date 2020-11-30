<template>
	<v-container fluid class="pa-0" v-scroll="onScroll">
		<v-container fluid class="pa-0">
			<v-row no-gutters class="no-events">
				<div id="map-container" class="d-block blue-grey lighten-4" :class="$vuetify.breakpoint.smAndDown ? 'mobile' : 'desktop'">
					<map-view class="events"/>
					<app-header class="bellow-map no-events"/>
					<tabs class="bellow-map  no-events" v-if="!$vuetify.breakpoint.smAndDown"/>
				</div>
			</v-row>
		</v-container>
		<content-list :showAltNav="showAltNav" v-if="!$vuetify.breakpoint.smAndDown"/>
	</v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'home',
	components: {
		'app-header': require('@/components/app/app-header').default,
		tabs: require('@/components/content/tabs').default,
		'content-list': require('@/components/content/content-list').default,
		'map-view': require('@/components/iframes/map-view').default
	},
	computed: {
		...mapGetters(['locale'])
	},
	data () {
		return {
			tab: null,
			showAltNav: false
		};
	},
	methods: {
		onScroll (e) {
			this.showAltNav = e.target.scrollingElement.scrollTop > window.innerHeight * 0.85;
		}
	}
};
</script>

<style lang="less">
#map-container {
	position: relative;
	width: 100%;
	height: 90vh;
	z-index: 0;
	&.mobile {
		height: calc(100vh - 56px);
	}
	.top-offset {
		margin-top: 76px;
	}

	.map .tooltip {
		z-index: 1002;
		position: fixed;
	}

	.bellow-map  {
		z-index: 1;
		position: relative;
	};
}

.container.max-width {
	max-width: 1264px;
}

.primary--opac {
	background: #f2f7f7;
}
.accent--opac {
	background: rgba(255,0,0,0.1);
}
.secondary--opac {
	background: #f7f2f2;
}
.row.outlined {
	border: 1px solid #f2f7f7;
}

.no-events {
	pointer-events: none;
}

.events {
	pointer-events: all;
}

</style>
