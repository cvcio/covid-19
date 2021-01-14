<template>
	<v-container class="pa-4">
		<template v-for="(post, idx) in posts.global">
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
								<p class="primary--text body-1" :key="'p-' + i">
									{{ p }}
								</p>
							</template>
						</v-col>
					</v-row>
				</v-col>
				<v-col cols="12" md="8" class="px-4">
					<post :component="post.component.id" :once="true" :threshold="50" v-slot="{inView}">
						<component
							v-if="inView"
							:delay="50"
							v-bind:is="post.component.id"
							:defaults="post.component.defaults"
						/>
					</post>
					<!-- <component :delay="250 * idx" v-bind:is="post.component.id" /> -->
				</v-col>
			</v-row>
			<v-divider v-if="idx < posts.global.length - 1" :key="'divider-'+idx"/>
		</template>
	</v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'posts-global',
	components: {
		post: require('@/components/content/post').default,
		'global-key-by-country-table': require('@/components/iframes/global-key-by-country-table').default,
		'global-key-daily-agg-bar': require('@/components/iframes/global-key-daily-agg-bar').default,
		'global-key-subplot-countries': require('@/components/iframes/global-key-subplot-countries').default,
		'global-key-daily-similar': require('@/components/iframes/global-key-daily-similar').default
	},
	computed: {
		...mapGetters(['locale']),
		...mapGetters('internal', ['posts'])
	},
	mounted () {
		if (this.posts.global.length === 0) {
			this.$store.dispatch('internal/getPosts');
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
