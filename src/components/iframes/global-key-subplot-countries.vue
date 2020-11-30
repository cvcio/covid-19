<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0" justify="space-between">
					<v-col class="pa-0" align-self="center">
						<v-btn-toggle dense class="mr-2" rounded v-model="point" mandatory>
							<v-btn x-small class="primary--text" value="cases">
								{{($tc('cases', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="deaths">
								{{($tc('deaths', 1)) | normalizeNFD }}
							</v-btn>
						</v-btn-toggle>
					</v-col>
					<v-col class="pa-0" align-self="center" cols="5">
					<v-autocomplete
						dense
						outlined
						color="primary"
						hide-details
						class="caption fa-xs"
						prepend-icon="fa-globe-europe"
						:items="items"
						item-text="region" item-value="uid"
						v-model="search"
						@change="doSimilar">
					</v-autocomplete>
					</v-col>
					<v-col class="pa-0 text-end ml-2" align-self="center" v-if="!$route.meta.iframe">
						<v-btn x-small :fab="!$vuetify.breakpoint.smAndDown" :icon="$vuetify.breakpoint.smAndDown" color="grey" dark class="mr-1 elevation-0" @click="update">
							<v-icon x-small>fa-redo</v-icon>
						</v-btn>
						<v-btn x-small :fab="!$vuetify.breakpoint.smAndDown" :icon="$vuetify.breakpoint.smAndDown" color="primary" dark class="mx-0 elevation-0" @click="setEmbed">
							<v-icon x-small>fa-code</v-icon>
						</v-btn>
					</v-col>
				</v-row>
			</v-container>
		</v-app-bar>
		<v-divider v-if="!$route.meta.iframe"/>
		<v-container class="px-4" fluid>
			<v-data-iterator
				:items="similar"
				:items-per-page.sync="itemsPerPage"
				:page="page"
				hide-default-footer
				class="d-inline"
				>
				<template v-slot:default="props">
					<v-row class="px-0">
						<v-col
							v-for="item in props.items"
							:key="'col-ggcb7l-' + item.uid"
							cols="12" xs="12" md="4"
							class="px-4" :class="search === item.uid ? 'yellow lighten-5' : ''"
						>
							<v-card-subtitle class="body-2 font-weight-bold px-0">
								{{ $t(item.region) }}
							</v-card-subtitle>
							<d7-line-bar
								:key="'ggcb7l-' + item.uid + '-' + point" :id="'ggcb7l-uid-' + item.uid + '-' + point"
								:point="point" :values="item[point]"
								:dates="item.dates"
								:sources="item.sources"/>
						</v-col>
					</v-row>
				</template>
			</v-data-iterator>
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

export default {
	name: 'global-key-subplot-countries',
	components: {
		'd7-line-bar': require('@/components/charts/d7-line-bar').default
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
				period: null,
				lang: this.locale.code,
				id: 'global-key-subplot-countries'
			};
		}
	},
	data () {
		return {
			totals: 0,
			point: 'cases',
			items: [],
			similar: [],
			page: 1,
			itemsPerPage: 15,
			search: 'U300',
			filter: {},
			title: { en: '', el: '' }
		};
	},
	mounted () {
		if (this.posts.global.length === 0) {
			this.$store.dispatch('internal/getPosts')
				.then(() => {
					this.load();
				});
		} else {
			this.load();
		}
	},
	methods: {
		setEmbed () {
			this.$store.commit('setEmbedDialog', true);
			this.$store.commit('setEmbed', this.embed);
		},
		load () {
			this.title = this.posts[this.embed.id.split('-')[0]].find(m => m.component.id === this.embed.id).title || '';
			this.$store.dispatch('external/getGlobalAGG', 'all/all/' + this.periodInterval[3].value)
				.then(res => {
					let items = res.map(m => {
						m.new_cases = m.new_cases.map(m => Math.max(0, m));
						m.new_deaths = m.new_deaths.map(m => Math.max(0, m));
						return {
							uid: 'U' + m.uid,
							region: this.$t(m.country),
							dates: getDates(m.from, m.to),
							cases: m.new_cases,
							deaths: m.new_deaths,
							sources: m.sources.sort(),
							population: m.population,
							max_cases: Math.max(...m.new_cases),
							max_deaths: Math.max(...m.new_deaths),
							min_cases: Math.min(...m.new_cases),
							min_deaths: Math.min(...m.new_deaths)
						};
					});

					const max_cases = Math.max(...items.map(m => m.max_cases));
					const max_deaths = Math.max(...items.map(m => m.max_deaths));
					const min_cases = Math.max(...items.map(m => m.min_cases));
					const min_deaths = Math.max(...items.map(m => m.min_deaths));
					items = items.map(m => {
						m.max_cases = max_cases;
						m.max_deaths = max_deaths;
						m.min_cases = min_cases;
						m.min_deaths = min_deaths;
						return m;
					});

					this.items = items.sort((a, b) => a.population - b.population);
					this.totals = this.items.length;
					this.doSimilar();
				});
		},
		doSimilar (uid) {
			const idx = this.items.findIndex(m => m.uid === this.search);
			const next7 = this.items.slice(idx + 1, idx + 8);
			const prev7 = this.items.slice(idx - 8, idx - 1);
			this.similar = [...prev7, this.items[idx], ...next7];
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
