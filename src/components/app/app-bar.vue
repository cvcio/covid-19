<template>
	<v-app-bar app class="elevation-0 top-app-bar" height="50" :color="$vuetify.breakpoint.smAndDown ? 'white' : 'rgba(237, 32, 56,0.85)'">
		<template v-if="$vuetify.breakpoint.smAndDown">
			<!-- <v-app-bar-nav-icon @click="$store.commit('setSidebar', !sidebar)" v-if="$vuetify.breakpoint.smAndDown" class="mx-0">
				<v-icon small color="primary">fa-sliders-h</v-icon>
			</v-app-bar-nav-icon>-->
			<a href="https://lab.imedd.org/" target="_blank" style="width: 178px;" class="px-2">
				<logo-imedd-lab/>
			</a> 
		</template>
		<template v-else>
			<v-col align-self="center" class="ma-0 py-0 white shrink d-flex">
			<!-- 	<v-app-bar-nav-icon @click="$store.commit('setSidebar', !sidebar)" v-if="$vuetify.breakpoint.smAndDown" class="mt-0">
					<v-icon small color="primary">fa-sliders-h</v-icon>
				</v-app-bar-nav-icon>-->
				<a href="https://lab.imedd.org/" target="_blank" style="width: 178px;" class="px-2">
					<logo-imedd-lab/>
				</a>
			</v-col> 
			<v-col align-self="center" class="ma-0 py-0 white--text" sm="auto">
				<v-row align="center">
					<v-col class="" align-self="center" sm="auto">
						<h4 class="text-h4">
							<span class="slab font-weight-thin">COVID&mdash;</span>
							<span class="slab font-weight-black">19</span>
						</h4>
					</v-col>
					<v-col class="mt-1">
						<span class="text-start shrink white--text py-2" :class="$vuetify.breakpoint.smAndDown ? 'caption' : 'body-1'">{{ $t("app.subtitle") }}</span>
						<v-tooltip bottom>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon
									small
									color="white"
									dark
									class=""
									v-bind="attrs"
									v-on="on" :href="locale.code === 'en' ? 'https://lab.imedd.org/en/how-application-monitoring-spread-covid19/' : 'https://lab.imedd.org/pos-ftiaxame-tin-efarmogi-gia-tin-exaplosi-tis-covid19/'" target="_blank">
									<v-icon x-small>fa-info-circle</v-icon>
								</v-btn>
							</template>
							<span>
								{{ $t('link.about') }}
							</span>
						</v-tooltip>
					</v-col>
				</v-row>
			</v-col>
			<v-spacer></v-spacer>
			<v-col class="text-end">
				<v-menu
					transition="slide-y-transition"
					bottom
					close-on-click
				>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							color="transparent elevation-0"
							dark
							v-bind="attrs"
							v-on="on"
							class="text-inherit"
						>
							<v-icon x-small left>fa-language</v-icon>
							{{ locale.name }}
							<v-icon x-small right>fa-chevron-down</v-icon>
						</v-btn>
					</template>

					<v-list dense>
						<v-list-item @click="changeLang('el')">
							<v-list-item-title>Ελληνικά</v-list-item-title>
						</v-list-item>
						<v-list-item @click="changeLang('en')">
							<v-list-item-title>English</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</v-col>
			</template>
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
	},
	methods: {
		changeLang (lang) {
			this.$store.dispatch('setLocale', lang)
				.then(() => {
					this.$router.replace({ query: { lang } });
				});
		}
	}
};
</script>

<style lang="less">
.top-app-bar {
	max-height: 50px;
	.v-toolbar__content {
		padding: 0 !important;
		margin: 0 !important;
		.container {
			max-height: 50px;
		}
	}
}
</style>
