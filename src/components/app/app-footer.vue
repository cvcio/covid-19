<template>
	<v-footer absolute height="44" class="elevation-0 pa-0 px-4">
		<span class="caption mr-2">{{ new Date().getFullYear() }} <v-icon small color="">mdi-creative-commons</v-icon> iMEdD LAB</span>
		<a class="caption mr-2" href="https://github.com/iMEdD-Lab/open-data" target="_blank">{{ $t('Terms of Use') }}</a>
		<a class="caption mr-2" href="https://github.com/iMEdD-Lab/open-data" target="_blank">Github</a>
		<a class="caption mr-2" href="https://twitter.com/iMEdDLab" target="_blank">Twitter</a>
		<a class="caption mr-2" href="https://www.imedd.org/contact/" target="_blank">{{ $t('Contact') }}</a>
		<v-spacer/>
		<a class="caption"  href="https://cvcio.org/" target="_blank">
			<span class="">
				<span class="hidden-sm-and-down mr-2">a collaboration with</span>
				<span class="">CVCIO</span>
			</span>
		</a>
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
