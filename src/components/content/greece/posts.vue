<template>
	<v-container class="pa-4">
		<template v-for="(post, idx) in posts.greece">
			<v-row class="pt-12 my-12" align="stretch" :key="idx">
				<v-col cols="12" md="4">
					<h4 class="text-h4 primary--text mb-8">
						<span class="font-weight-thin slab">{{ post.title[locale.code] }}</span>
					</h4>
					<template v-for="(p, i) in post.body[locale.code]">
						<p class="primary--text body-1" :key="'p-' + i">
							{{ p }}
						</p>
					</template>
				</v-col>
				<v-col cols="12" md="8">
					<post :component="post.component.id" :once="true" :threshold="50" v-slot="{inView}">
						<component
							v-if="inView"
							:delay="50"
							v-bind:is="post.component.id"
						/>
					</post>
					<!-- <component :delay="250 * idx" v-bind:is="post.component.id" /> -->
				</v-col>
			</v-row>
			<v-divider v-if="idx < posts.greece.length - 1" :key="'divider-'+idx"/>
		</template>
	</v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'posts-greece',
	components: {
		'post': require('@/components/content/post').default,
		'greece-key-by-region-table': require('@/components/iframes/greece-key-by-region-table').default,
		'greece-key-daily-agg-bar': require('@/components/iframes/greece-key-daily-agg-bar').default,
		'greece-intubated-daily-agg-bar': require('@/components/iframes/greece-intubated-daily-agg-bar').default,
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
