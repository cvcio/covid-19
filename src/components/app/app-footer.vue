<template>
	<v-footer absolute height="44" class="elevation-0 pa-0 px-4">
		<span class="caption mr-2">{{ new Date().getFullYear() }} <v-icon small color="">mdi-creative-commons</v-icon> Copyright</span>
		<!-- <span class="caption mx-1">|</span> -->
		<a class="caption mr-2">Terms & Conditions</a>
		<!-- <span class="caption mx-1">|</span> -->
		<a class="caption mr-2">Github</a>
		<!-- <span class="caption mx-1">|</span> -->
		<a class="caption mr-2">Contact</a>
		<v-spacer/>
		<!-- <v-divider vertical class="ml-4" /> -->
		<a class="caption">
			<span class="">
				<span class="hidden-sm-and-down mr-2">a collaboration with</span>
				<span class="">CVCIO</span>
			</span>
		</a>
		<!-- <v-btn icon large text tile class="primary" dark>
			<v-icon>mdi-github</v-icon>
		</v-btn>
		<v-divider vertical class="" />
		<v-btn icon large text tile class="primary" dark>
			<v-icon>mdi-facebook</v-icon>
		</v-btn>
		<v-divider vertical class="" />
		<v-btn icon large text tile class="primary" dark>
			<v-icon>mdi-instagram</v-icon>
		</v-btn>
		<v-divider vertical class="" />
		<v-btn icon large text tile class="primary" dark>
			<v-icon>mdi-linkedin</v-icon>
		</v-btn>
		<v-divider vertical class="" />
		<v-btn icon large text tile class="secondary" dark>
			<v-icon>mdi-chevron-up</v-icon>
		</v-btn> -->
	</v-footer>
</template>

<script>
export default {
	name: 'app-footer'
};
</script>

<style lang="less" scoped>
.v-footer {
	background-color: #E6ECEC;
}
</style>
