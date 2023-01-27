<template>
	<v-app id="app" :toolbar="!iframe" :footer="!iframe" :class="iframe ? 'iframe-view' : 'app-view'">
		<component :is="this.$route.meta.layout || 'div'">
			<router-view />
		</component>
	</v-app>
</template>

<script>
export default {
	name: 'covid-19',
	computed: {
		iframe () {
			return !!this.$route.path.includes('iframe');
		}
	},
	mounted () {
		if (this.iframe) {
			const d = document.getElementById('at-share-dock');
			if (d) {
				d.parentNode.removeChild(d);
			};
		} else {
			this.$cookiebot.consentBanner();
		}
	},
	methods: {}
};
</script>

<style lang="less">
html,
body,
#app {
	overflow: auto;
	background: white;
	font-size: 14px;
}

.mono {
	font-family: 'Roboto Mono' !important;
	font-weight: 400;

	strong {
		font-weight: 700;
	}
}

.tab-title::before {
	background-color: white !important;
	cursor: pointer !important;
}

.mapboxgl-ctrl-logo {
	display: none !important;
}


.slab {
	font-family: 'Roboto Slab' !important;
	font-weight: 400;

	strong {
		font-weight: 700;
	}
}

a {
	text-decoration: none;
	border: none;
	outline: none;

	&.link {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		background-image: linear-gradient(currentColor, currentColor);
		background-position: 0% 100%;
		background-repeat: no-repeat;
		background-size: 0% 1px;
		font-weight: inherit;

		&:hover,
		a:focus {
			background-size: 100% 1px;
		}
	}
}

.text-inherit {
	text-transform: none !important;
}

.small-caption {
	font-size: 0.625;
}

.iframe-header .v-toolbar__content {
	padding-left: 0 !important;
	padding-right: 0 !important;
	padding: 0;
}

canvas {
	border: none !important;
	outline: none !important;
}

.tooltip {
	z-index: 9999 !important;
}

.v-btn--active {
	font-weight: bold;
}

.at-share-dock.atss.atss-bottom.at-shfs-small.addthis-animated.slideInUp {
	background-color: white !important;
}

.text-2rem {
	font-size: 2rem;
}

.text-1-2rem {
	font-size: 1.2rem;
}
</style>
