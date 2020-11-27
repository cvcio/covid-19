<template>
	<div>
		<v-main app light class="pt-0">
			<v-scroll-y-transition mode="out-in">
				<router-view />
			</v-scroll-y-transition>
		</v-main>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'layout-iframe',
	computed: {
		...mapGetters([])
	},
	data () {
		return {};
	},
	mounted () {},
	methods: {}
};
</script>
