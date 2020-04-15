<template>
	<v-alert :value="alert" dense tile class="ma-0 caption" type="error" color="accent" id="alert" transition="slide-y-transition">
		<v-row align="center" no-gutters>
			<v-col xs="11" class="grow white--text link" v-html="text"></v-col>
			<v-col class="shrink">
				<v-btn icon small @click.stop="$store.commit('set_alert', false)">
					<v-icon small>mdi-close</v-icon>
				</v-btn>
			</v-col>
		</v-row>
	</v-alert>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'top-alert',
	props: ['text'],
	computed: {
		...mapGetters(['alert'])
	}
};
</script>

<style lang="less" scoped>
#alert {
	width: 100%;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 100;
}
</style>
