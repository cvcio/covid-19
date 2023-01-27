<template>
	<v-container fluid class="pa-0" v-scroll="onScroll">
		<v-container fluid class="pa-0">
			<v-row no-gutters class="no-events">
				<div id="map-container" class="d-block blue-grey lighten-4"
					:class="$vuetify.breakpoint.smAndDown ? 'mobile' : 'desktop'">
					<!-- <map-view class="events"/> -->
					<app-header class="bellow-map no-events" v-if="$vuetify.breakpoint.smAndDown" />
					<div class="main_text events">
						<h2 v-if="description.title">
							{{ description.title[locale.code] }}
						</h2>
						<!-- <h3 v-if="description.title">
							{{ description.title[locale.code] }}
						</h3> -->
						<p v-if="description.subtitle">
							{{ description.subtitle[locale.code] }}
						</p>
					</div>
					<!-- <tabs class="events" /> -->
					<!-- <tabs class="bellow-map no-events" v-if="!$vuetify.breakpoint.smAndDown"/> -->
				</div>
			</v-row>
		</v-container>
		<content-list :showAltNav="showAltNav" v-if="!$vuetify.breakpoint.smAndDown" />
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
		// 'map-view': require('@/components/iframes/map-view').default
	},
	computed: {
		...mapGetters(['locale']),
		...mapGetters('internal', ['description'])
	},
	data() {
		return {
			tab: null,
			showAltNav: false
		};
	},
	mounted() {
		if (!this.description || (this.description && !this.description.title)) {
			this.$store.dispatch('internal/getDescription');
		}
	},
	methods: {
		onScroll(e) {
			this.showAltNav = e.target.scrollingElement.scrollTop > window.innerHeight * 0.85;
		}
	}
};
</script>

<style lang="less">

@media only screen and (max-width: 600px) {
	.main_text {
		margin-top: 0px !important;
		max-width: 90%;
	}
}

#map-container {
	background-color: #f6f6f4 !important;
	padding-top: 90px;
	padding-bottom: 90px;

	.main_text {
		box-shadow: 1px 1px 5px 0px #b5b5b5;
		background: #fff;
		padding: 20px;
		color: #114b5f;
		width: 40%; //Needs fixing for mobile though with min-width

		margin-left: auto;
	margin-right: auto;
		h2,
		h3 {
			font-family: roboto slab, serif;
		}

		h2 {
			font-size: 2rem;
			font-weight: 600;
			margin: .625em 0 1.25em;
		}

		h3 {
			font-size: 1.5rem;
			font-weight: 300;
		}

		p {
			//As body-1
			font-size: 1rem !important;
			letter-spacing: .03125em !important;
			line-height: 1.5rem;
		}
	}
}

// /////

@media only screen and (max-width: 600px) {
	#map-container {
		padding-top: 0px;
		padding-bottom: 0px;
	}

	.main_text {
		width: 95% !important;//Needs fixing for mobile though with min-width
		margin-top: 10px !important;
		margin-bottom: 10px !important;
	}
}

#map-container {
	// position: relative;
	width: 100%;
	// height: 90vh;
	z-index: 0;

	// &.mobile {
	// 	height: calc(100vh - 56px);
	// }
	.top-offset {
		margin-top: 76px;
	}

	.map .tooltip {
		z-index: 1002;
		position: fixed;
	}

	.bellow-map {
		z-index: 1;
		position: relative;
	}

	;
}

.container.max-width {
	max-width: 1264px;
}

.primary--opac {
	background: #f2f7f7;
}

.accent--opac {
	background: rgba(255, 0, 0, 0.1);
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
