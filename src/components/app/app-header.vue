<template>
	<v-app-bar app class="elevation-0" color="rgba(255, 255, 255, 0.9)">
		iMEdD Lab Logo
		<v-spacer/>
		<v-menu
			transition="slide-y-transition"
      		bottom
			close-on-click
		>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				color="white"
				light
				v-bind="attrs"
				v-on="on"
				class="text-inherit"
			>
			<v-icon small left>
				fa-language
			</v-icon>
			{{ locale.name }}
			</v-btn>
		</template>

		<v-list dense>
			<v-list-item @click="$i18n.locale = 'el'">
				<v-list-item-title>Ελληνικά</v-list-item-title>
			</v-list-item>
			<v-list-item @click="$i18n.locale = 'en'">
				<v-list-item-title>English</v-list-item-title>
			</v-list-item>
		</v-list>
		</v-menu>
	</v-app-bar>
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
	}
};
</script>

<style lang="less" scoped>

</style>
