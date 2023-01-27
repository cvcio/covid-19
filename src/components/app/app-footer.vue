<template>
	<v-footer app absolute height="64" class="elevation-0 pa-0 px-4" :class="$vuetify.breakpoint.smAndDown ? '' : ''">
		<span class="caption mr-2">{{ new Date().getFullYear() }} <v-icon small color="">mdi-creative-commons</v-icon> iMEdD
			LAB</span>
		<a class="caption mr-2"
			:href="locale.code === 'en' ? 'https://lab.imedd.org/en/terms-of-use-covid19-web-app/' : 'https://lab.imedd.org/oroi-chrisis-tis-efarmogis-gia-tin-covid-19/'"
			target="_blank">{{ $t('Terms of Use') }}</a>
		<a class="caption mr-2" href="https://github.com/iMEdD-Lab/open-data" target="_blank">Github</a>
		<a class="caption mr-2" href="https://twitter.com/iMEdDLab" target="_blank">Twitter</a>
		<a class="caption mr-2" href="https://www.imedd.org/contact/" target="_blank">{{ $t('Contact') }}</a>
		<v-spacer />
		<!-- <a class="caption"  href="https://cvcio.org/" target="_blank">
			<span class="">
				<span class="hidden-sm-and-down mr-2">a collaboration with</span>
				<span class="">CVCIO</span>
			</span>
		</a> -->
		<span class="caption mr-2">
			Developed initially in collaboratin with
			<a class="caption" href="https://cvcio.org/" target="_blank">CVCIO</a>.
			Re-manufactured & maintained by
			<a class="caption" href="https://sociality.gr/" target="_blank">Sociality</a>.
		</span>
	</v-footer>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'app-footer',
	computed: {
		...mapGetters(['locale'])
	}
};
</script>

<style lang="less" scoped>
.v-footer {
	background-color: #E6ECEC;
}
</style>
