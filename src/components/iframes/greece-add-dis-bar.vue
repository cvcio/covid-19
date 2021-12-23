<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0" justify="space-between">
					<v-col class="pa-0" align-self="center">
						<v-select
							dense
							outlined
							color="primary"
							hide-details prepend-icon="" class="caption" :label="$t('Time Period')"
							:items="[periodInterval[2], periodInterval[3]]"
							:item-text="'text.'+locale.code" item-value="value" v-model="period" auto-select-first
							@change="load">
							<template v-slot:prepend>
								<v-icon small class="mt-1" color="primary">
									fa-clock
								</v-icon>
							</template>
						</v-select>
					</v-col>
					<v-col class="pa-0 grow text-end ml-2" align-self="center" v-if="!$route.meta.iframe">
						<v-btn x-small fab color="primary" dark class="mx-0 elevation-0" @click="setEmbed">
							<v-icon x-small>fa-code</v-icon>
						</v-btn>
					</v-col>
				</v-row>
			</v-container>
		</v-app-bar>
		<v-divider v-if="!$route.meta.iframe"/>
		<v-container class="px-4" fluid>
			<v-row class="px-0" v-if="loading">
				<v-col align="center">
					<v-progress-circular indeterminate color="grey"></v-progress-circular>
				</v-col>
			</v-row>
			<v-row class="px-0" v-else>
				<v-col
					cols="12"
					class="px-4"
				>
					<stacked-mirror-area
						:key="'gbc-adb-' + item.uid + '-' + point + '-' + period" :id="'gbc-adb-' + item.uid + '-' + point + '-' + period"
						:keys="['hospital_admissions', 'hospital_discharges']" :values="item" :max="item.max" :min="item.min" :mirrored="true"
						:dates="item.dates" :sources="item.sources"/>
				</v-col>
			</v-row>
		</v-container>
		<v-divider class="mx-4"/>
		<v-footer class="white caption small-caption pa-4 pt-2">
			<a href="https://lab.imedd.org/covid19/" target="_blank" v-if="$route.meta.iframe">
				<v-icon x-small class="mr-2" color="primary">fa-link</v-icon><span class="font-weight-bold">iMΕdD LAB</span>: {{ title[locale.code] }}
			</a>
			<span v-else>
				<span class="font-weight-bold">iMΕdD LAB</span>: {{ title[locale.code] }}
			</span>
		</v-footer>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { getDates } from '@/utils';
import { max, min } from 'd3';

export default {
	name: 'greece-add-dis-bar',
	props: {
		delay: {
			default: 100
		}
	},
	components: {
		'stacked-mirror-area': require('@/components/charts/stacked-mirror-area').default
	},
	computed: {
		...mapGetters(['locale']),
		...mapGetters('filters', ['periodInterval']),
		...mapGetters('internal', ['annotations']),
		...mapGetters('internal', ['posts']),
		embed () {
			return {
				title: '',
				subtitle: '',
				text: '',
				mapLevel: null,
				mapKey: null,
				view: null,
				aggregation: null,
				period: 3,
				availablePeriods: [
					// {
					// 	text: { en: 'Last 14 days', el: 'Τελευταίες 14 ημέρες' },
					// 	value: 1
					// },
					{
						text: { en: 'Last 3 months', el: 'Τελευταίο τρίμηνο' },
						value: 2
					},
					{
						text: { en: 'Historical data', el: 'Από την αρχή' },
						value: 3
					}
				],
				lang: this.locale.code,
				id: 'greece-add-dis-bar'
			};
		}
	},
	data () {
		return {
			loading: true,
			point: 'critical',
			item: null,
			period: '2020-01-01',
			title: { en: '', el: '' }
		};
	},
	mounted () {
		setTimeout(() => {
			this.preload();
		}, this.delay);
	},
	methods: {
		preload () {
			if (this.annotations.length === 0) {
				this.$store.dispatch('internal/getAnnotations');
			}
			if (this.$route.query.period && this.$route.query.period !== '') {
				this.period = this.periodInterval[parseInt(this.$route.query.period)].value;
			}
			if (this.posts.greece.length === 0) {
				this.$store.dispatch('internal/getPosts')
					.then(() => {
						this.load();
					});
			} else {
				this.load();
			}
		},
		setEmbed () {
			this.$store.commit('setEmbedDialog', true);
			this.$store.commit('setEmbed', this.embed);
		},
		load () {
			this.loading = true;
			this.title = this.posts[this.embed.id.split('-')[0]].find(m => m.component.id === this.embed.id).title || '';
			// this.period = this.$moment(this.period).isSameOrAfter(this.$moment('2021-01-21')) ? this.period : '2021-01-21';
			this.$store.dispatch('external/getGlobalAGG', 'GRC/new_hospital_admissions,new_hospital_discharges,icu_occupancy,beds_occupancy/' + (this.$moment(this.period).isSameOrAfter(this.$moment('2021-01-21')) ? this.period : '2021-01-21'))
				.then(res => {
					this.item = res.map(m => {
						m.dates = getDates(m.from, m.to);
						m.new_hospital_admissions = m.new_hospital_admissions.map(m => Math.max(0, m));
						m.new_hospital_discharges = m.new_hospital_discharges.map(m => (-1) * Math.max(0, m));
						m.icu_occupancy = m.icu_occupancy.map(m => Math.max(0, m));
						m.beds_occupancy = m.beds_occupancy.map(m => Math.max(0, m));
						if (getDates(m.from, m.to).length - m.new_hospital_admissions.length > 0) {
							m.new_hospital_admissions.unshift(...Array(getDates(m.from, m.to).length - m.new_hospital_admissions.length).fill(0));
							m.new_hospital_discharges.unshift(...Array(getDates(m.from, m.to).length - m.new_hospital_discharges.length).fill(0));
							m.icu_occupancy.unshift(...Array(getDates(m.from, m.to).length - m.icu_occupancy.length).fill(0));
							m.beds_occupancy.unshift(...Array(getDates(m.from, m.to).length - m.beds_occupancy.length).fill(0));
						}

						return {
							uid: m.uid,
							region: m.country,
							dates: m.dates,
							hospital_admissions: m.new_hospital_admissions,
							hospital_discharges: m.new_hospital_discharges,
							icu_occupancy: m.icu_occupancy,
							beds_occupancy: m.beds_occupancy,
							max: max(m.new_hospital_admissions),
							min: min(m.new_hospital_discharges),
							sources: ['imedd']
						};
					});

					this.item = this.item[0];
					this.loading = false;
				});
		},
		update () {
			this.load();
		}
	}
};
</script>

<style lang="less" scoped>
.extra-small-text {
	font-size: 8px !important;
}
.v-data-iterator {
	width: 100%;
}
</style>
