<template>
	<v-app id="app" :toolbar="!iframe" :footer="!iframe">
		<template v-if="!iframe">
			<app-header />
			<v-main app light class="pt-0">
				<v-scroll-y-transition mode="out-in">
					<router-view />
				</v-scroll-y-transition>
			</v-main>
			<app-footer />
		</template>
		<template v-else>
			<v-main light class="pt-0">
				<v-scroll-y-transition mode="out-in">
					<router-view />
				</v-scroll-y-transition>
			</v-main>
		</template>
	</v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'covid-19',
	components: {
		'app-header': require('@/components/app/app-header').default,
		'app-footer': require('@/components/app/app-footer').default
	},
	computed: {
		...mapGetters([]),
		iframe () {
			return !!this.$route.path.includes('iframe');
		}
	},
	data () {
		return {};
	},
	mounted () {},
	methods: {}
};
</script>

<style lang="less">
html, body, #app {
	overflow: auto;
	background: white;
	// background: #E6ECEC;
}

.mono {
    font-family: 'Roboto Mono' !important;
	font-weight: 400;
	strong {
		font-weight: 700;
	}
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
		&:hover, a:focus{
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
</style>
