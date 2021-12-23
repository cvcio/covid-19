<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'"
			:height="$vuetify.breakpoint.smAndDown ? 120 : 120">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0" justify="space-between">
					<v-col  class="pa-0 shrink" align-self="center">
						<v-btn-toggle dense class="mr-2" rounded v-model="point" mandatory>
							<v-btn x-small class="primary--text" value="v1">
								{{($t('% INTUBATED')) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="v2">
								{{($t('% (UN)VACCINATED')) | normalizeNFD }}
							</v-btn>
						</v-btn-toggle>
					</v-col>
					<v-col class="pa-0 grow text-end ml-2" align-self="center" v-if="!$route.meta.iframe">
						<v-btn x-small fab color="primary" dark class="mx-0 elevation-0" @click="setEmbed">
							<v-icon x-small>fa-code</v-icon>
						</v-btn>
					</v-col>
				</v-row>
				<v-row class="pa-0 ma-0 mt-4" justify="center">
					<v-col class="pa-0" cols="12" md="6">
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
					<stacked-area
						:key="'gbc-vac-unvac-stacked-' + item.uid + '-' + point + '-' + period" :id="'gbc-vac-unvac-stacked-' + item.uid + '-' + point + '-' + period"
						:keys="point === 'v1' ? ['unvac_p', 'vac_p'] : ['unvac_pp', 'vac_pp']" :values="item" :max="1" :min="0" :mirrored="false"
						:sources="['imedd', 'GOVGR']"/>
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
import { sumBy } from 'lodash';

export default {
	name: 'greece-vac-unvac-stacked',
	props: {
		delay: {
			default: 100
		}
	},
	components: {
		'stacked-area': require('@/components/charts/stacked-area').default
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
				view: 'v1',
				aggregation: null,
				period: 3,
				availableViews: ['v1', 'v2'],
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
				id: 'greece-vac-unvac-stacked'
			};
		}
	},
	data () {
		return {
			loading: true,
			point: 'v1',
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
			if (this.$route.query.view && this.$route.query.view !== '') {
				this.point = this.$route.query.view;
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
			this.$store.dispatch('external/getGlobalAGG', 'GRC/intubated_unvac,intubated_vac/' + (this.$moment(this.period).isSameOrAfter(this.$moment('2021-08-30')) ? this.period : '2021-08-30'))
				.then(s1_res => {
					const r1 = s1_res[0];
					r1.dates = getDates(r1.from, r1.to);
					this.$store.dispatch('external/getGRVaccinesAGG', { from: (this.$moment(this.period).isSameOrAfter(this.$moment('2021-08-30')) ? this.period : '2021-08-30'), keys: 'date,total_dose_2' })
						.then(s2_res => {
							const r2 = {
								dates: s2_res[0].date.map(m => this.$moment(m)),
								total_dose_2: s2_res.map(m => m.total_dose_2).reduce((a, b) => a.map((v, i) => v + b[i]))
							};

							if (r1.intubated_unvac.length > r1.dates.length) {
								r1.intubated_unvac.pop();
							}
							if (r1.intubated_vac.length > r1.dates.length) {
								r1.intubated_vac.pop();
							}

							if (r1.dates.length > r2.total_dose_2.length) {
								r1.dates.pop();
							}
							if (r1.intubated_unvac.length > r2.total_dose_2.length) {
								r1.intubated_unvac.pop();
							}
							if (r1.intubated_vac.length > r2.total_dose_2.length) {
								r1.intubated_vac.pop();
							}

							const population = sumBy(s2_res, 'population');
							const item = r1.dates.map((m, i) => {
								const vac_individuals = r2.total_dose_2[i];
								const unvac_individuals = population - vac_individuals;
								return {
									date: m,
									vac_individuals: vac_individuals,
									unvac_individuals: unvac_individuals,
									intubated_unvac: r1.intubated_unvac[i],
									intubated_vac: r1.intubated_vac[i],
									unvac_p: r1.intubated_unvac[i] / (r1.intubated_unvac[i] + r1.intubated_vac[i]),
									vac_p: r1.intubated_vac[i] / (r1.intubated_unvac[i] + r1.intubated_vac[i]),
									total_dose_2: r2.total_dose_2[i],
									vac_pp: (r1.intubated_vac[i] / vac_individuals),
									unvac_pp: (r1.intubated_unvac[i] / unvac_individuals),
									population: population
								};
							});
							this.item = item;
							this.loading = false;
						});
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
