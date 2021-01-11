<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0" justify="space-between">
					<v-col class="pa-0" align-self="center">
						<v-autocomplete
							dense
							multiple
							outlined
							color="primary"
							hide-details
							class="caption fa-xs"
							prepend-icon="fa-globe-europe"
							:items="items"
							:label="$t('Country')"
							item-text="region" item-value="uid"
							v-model="search"
							@change="doSimilar">
							<template v-slot:selection="{ item, index }">
								<span v-if="index < 6" class="caption small-caption mr-1">
									<span class="">{{ item.region + (search.length - 1 > index ? ', ' : '')}}</span>
								</span>
								<span
									v-if="index === 6"
									class="grey--text caption small-caption ml-1"
								>
									<span class="">(+{{ search.length - 6 }})</span>
								</span>
							</template>
							<template v-slot:prepend>
								<v-icon small class="mt-1" color="primary">
									fa-globe-europe
								</v-icon>
							</template>
						</v-autocomplete>
					</v-col>
					<v-col class="pa-0 ml-3" align-self="center" cols="3">
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
					<v-col class="pa-0 text-end ml-2 shrink" align-self="center" v-if="!$route.meta.iframe" cols="2">
						<v-btn x-small fab color="grey" dark class="elevation-0" @click="update">
							<v-icon x-small>fa-redo</v-icon>
						</v-btn>
						<v-btn x-small fab color="primary" dark class="ml-1 elevation-0" @click="setEmbed">
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
					<d7d-lines
						:point="point" :uid="search"
						:key="'gnd7d-' + search.join('-') + '-' + period + '-' + random"
						:id="'gnd7d-' + search.join('-') + '-' + period + '-' + random"
						:data="similar"/>
				</v-col>
			</v-row>
		</v-container>
		<v-divider class="mx-4"/>
		<v-footer class="white caption small-caption pa-4 pt-2">
			<a href="https://lab.imedd.org/" v-if="$route.meta.iframe">
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
import { sum } from 'lodash';

export default {
	name: 'global-key-daily-similar',
	props: {
		delay: {
			default: 100
		},
		defaults: {
			type: Array,
			default: () => ['U300', 'U56', 'U380', 'U840']
		}
	},
	components: {
		'd7d-lines': require('@/components/charts/d7d-lines').default
	},
	computed: {
		...mapGetters(['locale']),
		...mapGetters('filters', ['periodInterval']),
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
				id: 'global-key-daily-similar'
			};
		}
	},
	data () {
		return {
			loading: true,
			point: 'new_deaths',
			items: [],
			similar: [],
			search: [],
			period: '2020-01-01',
			max: 15,
			random: 0,
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
			if (this.$route.query.period && this.$route.query.period !== '') {
				this.period = this.periodInterval[parseInt(this.$route.query.period)].value;
			}
			if (this.posts.global.length === 0) {
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
			this.$store.dispatch('external/getGlobalAGG', 'all/new_deaths/' + this.period + '/' + this.$moment().subtract(1, 'days').format('YYYY-MM-DD'))
				.then(res => {
					const items = res.map(m => {
						m.new_deaths = m.new_deaths.map(m => Math.max(0, m));
						m.new_deaths = m.new_deaths.map(n => m.population > 0 ? (n / m.population) * 100000 : 0);
						m.dates = getDates(m.from, m.to);
						// m.new_deaths.pop();
						// m.dates.pop();
						return {
							uid: 'U' + m.uid,
							region: this.$t(m.country),
							population: m.population,
							dates: m.dates,
							new_deaths: m.new_deaths,
							sources: m.sources.sort(),
							lastIndex: (sum(m.new_deaths.slice(m.new_deaths.length - 3, m.new_deaths.length - 1)) / m.population) * 100000
						};
					});
					this.items = items.sort((a, b) => a.region - b.region);
					this.search = this.search.length <= 0 ? this.defaults : this.search;
					this.random++;
					this.doSimilar();
					this.loading = false;
				});
		},
		doSimilar (uid) {
			this.search = this.search.slice(Math.max(this.search.length - this.max, 0));
			this.similar = this.items.filter(m => this.search.includes(m.uid));
		},
		update () {
			this.search = this.defaults;
			this.doSimilar();
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
