<template>
	<v-switch dense hide-details class="pt-0" v-model="mapSource" :value="val" :disabled="disabled || mapSource === val">
		<template v-slot:label>
			<span class="subtitle-2 font-weight-bold text-uppercase">{{ $tc(label, 1) | normalizeNFD }}</span>
		</template>
	</v-switch>
</template>

<script>
export default {
	name: 'switch-map-source',
	props: ['label', 'val', 'disabled'],
	computed: {
		mapSource: {
			get () {
				return this.$store.state.filters.mapSource;
			},
			set (value) {
				this.$store.commit('filters/setMapSource', value);
			}
		}
	},
	data () {
		return {

		};
	}
};
</script>

<style lang="less" scoped>
</style>
