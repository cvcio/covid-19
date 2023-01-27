<template>
	<v-select hide-details hide-selected prepend-icon="" class="pt-0" :label="$tc(label, 1)" color="primary"
		:disabled="disabled"
		:items="[...periodInterval]"
		:item-text="'text.'+locale.code" item-value="value" v-model="vals"
		auto-select-first>
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
	props: ['label', 'disabled', 'model'],
	computed: {
		...mapGetters(['locale']),
		...mapGetters('filters', ['periodInterval', 'mapLevel', 'mapKey']),
		vals: {
			get () {
				return this.model === 'mapCasesPeriod' ? this.$store.state.filters.mapCasesPeriod : this.mapVaccinationsPeriod;
			},
			set (value) {
				if (this.model === 'mapCasesPeriod') {
					this.$store.commit('filters/setmapCasesPeriod', value);
				} else {
					this.$store.commit('filters/setMapVaccinationsPeriod', value);
				}
			}
		},
		mapCasesPeriod: {
			get () {
				return this.$store.state.filters.mapCasesPeriod;
			},
			set (value) {
				this.$store.commit('filters/setmapCasesPeriod', value);
			}
		},
		mapVaccinationsPeriod: {
			get () {
				return this.$store.state.filters.mapVaccinationsPeriod;
			},
			set (value) {
				this.$store.commit('filters/setMapVaccinationsPeriod', value);
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
