<template>
	<v-row class="mb-0 app-header" :class="$vuetify.breakpoint.smAndDown ? 'elevation-0 mt-14' : 'top-offset px-3'" no-gutters>
		<v-col cols="12" sm="6" md="5" lg="4" xl="3" class="events">
			<v-card class="elevation-0" dark :tile="$vuetify.breakpoint.smAndDown" style="background-color:rgba(237, 32, 56,0.85);">
				<v-card-title class="text-h5 py-2">
					<span class="slab font-weight-thin">COVID&mdash;</span>
					<span class="slab font-weight-black">19</span>
					<v-spacer/>
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
				</v-card-title>
				<v-divider class="white ml-4" />
				<v-card-title class=" white--text py-2" :class="$vuetify.breakpoint.smAndDown ? 'caption' : 'body-1'">
					<span class="text-start shrink">{{ $t("app.subtitle") }}</span>
					<v-spacer/>
					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon
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
				</v-card-title>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'app-header',
	data () {
		return {

		};
	},
	computed: {
		...mapGetters(['locale'])
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

<style lang="less" scoped>
.events {
	pointer-events: all;
}
.app-header {
	z-index: 0;
}
</style>
