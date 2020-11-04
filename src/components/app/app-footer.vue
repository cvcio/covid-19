<template>
	<v-footer app absolute height="44" class="elevation-0 black white--text pa-0 pl-4">
		<span class="caption">{{ new Date().getFullYear() }} <v-icon small color="white">mdi-creative-commons</v-icon> Copyright</span>

		<v-spacer/>

		<router-link to="about" class="white--text caption">About iMEdD LAB</router-link>
		<span class="caption mx-1">|</span>
		<router-link to="contact" class="white--text caption">Contact</router-link>
		<span class="caption mx-1">|</span>
		<router-link to="legal" class="white--text caption">Terms & Conditions</router-link>

		<v-divider vertical class="white ml-4" />
		<v-btn icon large text tile class="primary" dark>
			<v-icon>mdi-github</v-icon>
		</v-btn>
		<v-divider vertical class="white" />
		<v-btn icon large text tile class="primary" dark>
			<v-icon>mdi-facebook</v-icon>
		</v-btn>
		<v-divider vertical class="white" />
		<v-btn icon large text tile class="primary" dark>
			<v-icon>mdi-instagram</v-icon>
		</v-btn>
		<v-divider vertical class="white" />
		<v-btn icon large text tile class="primary" dark>
			<v-icon>mdi-linkedin</v-icon>
		</v-btn>
		<v-divider vertical class="white" />
		<v-btn icon large text tile class="secondary" dark>
			<v-icon>mdi-chevron-up</v-icon>
		</v-btn>
	</v-footer>
</template>

<script>
export default {
	name: 'app-footer'
};
</script>

<style lang="less" scoped>

</style>
