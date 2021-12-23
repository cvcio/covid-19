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
						:key="'gbc-vds-' + item.uid + '-' + point + '-' + period" :id="'gbc-vds-' + item.uid + '-' + point + '-' + period"
						:values="item" :keys="['total_dose_1', 'total_dose_2', 'total_dose_3']" :min="item.min" :max="item.max" :mirrored="false"
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
// import { getDates } from '@/utils';
// import { max, min } from 'd3';
import { sumBy } from 'lodash';

export default {
	name: 'greece-vac-doses-stacked',
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
				id: 'greece-vac-doses-stacked'
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
			this.$store.dispatch('external/getGRVaccinesAGG', { from: this.period, keys: 'date,total_dose_1,total_dose_2,total_dose_3' })
				.then(res => {
					const population = sumBy(res, 'population');
					const total_dose_1 = res.map(m => m.total_dose_1).reduce((a, b) => a.map((v, i) => v + b[i]));
					const total_dose_2 = res.map(m => m.total_dose_2).reduce((a, b) => a.map((v, i) => v + b[i]));
					const total_dose_3 = res.map(m => m.total_dose_3).reduce((a, b) => a.map((v, i) => v + b[i]));
					const dates = res[0].date.map(m => this.$moment(m));
					this.item = {
						dates,
						population,
						total_dose_1,
						total_dose_2,
						total_dose_3,
						max: population,
						min: 0,
						sources: ['imedd']
					};
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
