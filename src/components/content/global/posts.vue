<template>
	<v-container class="pa-4">
		<template v-for="(post, idx) in posts.global">
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
					<component v-bind:is="post.component.id" />
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
		'global-cases-by-country': require('@/components/iframes/global-cases-by-country').default,
		'global-cases-by-7d-line-no-events': require('@/components/iframes/global-cases-by-7d-line-no-events').default,
		'global-cases-by-7d-line': require('@/components/iframes/global-cases-by-7d-line').default,
		'global-new-d7d': require('@/components/iframes/global-new-d7d').default
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
