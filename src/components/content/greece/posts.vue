<template>
	<v-container class="pa-4">
		<template v-for="(post, idx) in posts.greece">
			<v-row class="pt-12 my-12" align="stretch" :key="idx">
				<v-col cols="12" md="4" class="px-4">
					<v-row>
						<v-col cols="12">
							<h4 class="text-h4 primary--text mb-8">
								<span class="font-weight-thin slab">{{ post.title[locale.code] }}</span>
							</h4>
						</v-col>
						<v-col cols="12" sm="12" md="8">
							<template v-for="(p, i) in post.body[locale.code]">
								<span class="primary--text body-1" :key="'p-' + i" v-html="p"></span>
							</template>
						</v-col>
					</v-row>
				</v-col>
				<v-col cols="12" md="8" class="px-4">
					<post :component="post.component.id" :once="true" :threshold="50" v-slot="{inView}">
						<component v-if="inView" :delay="50" v-bind:is="post.component.id" :defaults="post.component.defaults" />
					</post>
				</v-col>
			</v-row>
			<v-divider v-if="idx < posts.greece.length - 1" :key="'divider-'+idx" />
		</template>
	</v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'posts-greece',
	components: {
		post: require('@/components/content/post').default,
		'dashboard': require('@/components/iframes/dashboard').default,
		'greece-map-cases': require('@/components/iframes/map-view-cases').default,
		'greece-map-municipalities': require('@/components/iframes/map-view-municipalities').default,
		'greece-map-vaccinations': require('@/components/iframes/map-view-vaccinations').default,
		'greece-key-by-municipality-table': require('@/components/iframes/greece-key-by-municipality-table').default,
		'greece-pandemic-per-age-stacked': require('@/components/iframes/greece-pandemic-per-age-stacked').default,
		'greece-key-by-region-table': require('@/components/iframes/greece-key-by-region-table').default,
		'greece-vaccines-by-region-table': require('@/components/iframes/greece-vaccines-by-region-table').default,
		'greece-key-daily-agg-bar': require('@/components/iframes/greece-key-daily-agg-bar').default,
		'greece-intubated-daily-agg-bar': require('@/components/iframes/greece-intubated-daily-agg-bar').default,
		'greece-add-dis-bar': require('@/components/iframes/greece-add-dis-bar').default,
		'greece-vac-doses-stacked': require('@/components/iframes/greece-vac-doses-stacked').default,
		'greece-key-subplot-regions': require('@/components/iframes/greece-key-subplot-regions').default,
		'greece-tests-daily-agg-bar': require('@/components/iframes/greece-tests-daily-agg-bar').default
	},
	computed: {
		...mapGetters(['locale']),
		...mapGetters('internal', ['posts'])
	},
	mounted () {
		if (this.posts.greece.length === 0) {
			this.$store.dispatch('internal/getPosts');
		}
	},
	methods: {
		visibilityChanged (isVisible, entry) {
			console.log(isVisible, entry);
		}
	}
};
</script>

<style lang="less">
.v-data-table__wrapper {
	tr {
		th {
			// border-left: 1px solid red;
			padding-left: 14px !important;
			padding-right: 0 !important;
		}

		td {
			padding-left: 14px !important;
			padding-right: 14px !important;
		}
	}
}
</style>
