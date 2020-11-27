<template>
	<v-select hide-details hide-selected prepend-icon="" class="pt-0" :label="$tc(label, 1)" color="primary" :disabled="disabled"
		:items="periodInterval" item-text="text" item-value="value" v-model="mapPeriod" auto-select-first>
		<template v-slot:prepend>
			<v-icon small class="mt-1" color="primary">
				fa-clock
			</v-icon>
		</template>
	</v-select>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'autocomplete-map-period',
	props: ['label', 'disabled'],
	computed: {
		...mapGetters('filters', ['periodInterval']),
		mapPeriod: {
			get () {
				return this.$store.state.filters.mapPeriod;
			},
			set (value) {
				this.$store.commit('filters/setMapPeriod', value);
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
