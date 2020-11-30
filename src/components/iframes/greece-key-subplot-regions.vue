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
					<v-spacer/>
					<v-col class="grow pa-0 text-end ml-2" align-self="center" v-if="!$route.meta.iframe">
						<!-- <v-btn x-small :fab="!$vuetify.breakpoint.smAndDown" color="grey" dark class="mx-2 elevation-0" @click="update">
							<v-icon x-small>fa-redo</v-icon>
						</v-btn> -->
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
				:items="items"
				:items-per-page.sync="itemsPerPage"
				:page="page"
				hide-default-footer
				class="d-inline"
				>
				<template v-slot:default="props">
					<v-row class="px-0">
						<v-col
							v-for="item in props.items"
							:key="'col-gcb7l-' + item.uid"
							cols="12" xs="12" md="4"
							class="px-4"
						>
							<v-card-subtitle class="body-2 font-weight-bold px-0">
								{{ $t(item.region) }}
							</v-card-subtitle>
							<d7-line-bar
								:key="'gcb7l-' + item.uid + '-' + point" :id="'gcb7l-uid-' + item.uid + '-' + point"
								:point="point" :values="item[point]"
								:dates="item.dates"
								:sources="item.sources"/>
						</v-col>
					</v-row>
				</template>
				<template v-slot:footer>
					<v-row
						class="mt-2"
						align="center"
						justify="center"
					>

						<v-spacer></v-spacer>
						<v-btn
							icon
							class="mx-2"
							@click="formerPage"
							:disabled="page === 1"
						>
							<v-icon>mdi-chevron-left</v-icon>
						</v-btn>
						<v-btn
							icon
							class="mx-2"
							@click="nextPage"
							:disabled="page === numberOfPages"
						>
							<v-icon>mdi-chevron-right</v-icon>
						</v-btn>
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
import { sum } from 'lodash';
import { getDates } from '@/utils';

export default {
	name: 'greece-key-subplot-regions',
	props: {
		delay: {
			default: 100
		}
	},
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
				id: 'greece-key-subplot-regions'
			};
		}
	},
	data () {
		return {
			point: 'cases',
			items: [],
			page: 1,
			numberOfPages: 0,
			itemsPerPage: 15,
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
			this.title = this.posts[this.embed.id.split('-')[0]].find(m => m.component.id === this.embed.id).title || '';
			this.$store.dispatch('external/getGreeceAGG', 'all/all/' + this.periodInterval[3].value)
				.then(res => {
					let items = res.map(m => {
						m.new_cases = m.new_cases.map(m => Math.max(0, m));
						m.new_deaths = m.new_deaths.map(m => Math.max(0, m));
						const totalCases = sum(m.new_cases);
						const totalDeaths = sum(m.new_deaths);
						const p100pCases = m.population > 0 ? ((sum(m.new_cases) / m.population) * 100000) : 0;
						const p100pDeaths = m.population > 0 ? ((sum(m.new_deaths) / m.population) * 100000) : 0;
						return {
							uid: m.uid,
							region: m.region,
							totalCases,
							totalDeaths,
							p100pCases,
							p100pDeaths,
							dates: getDates(m.from, m.to),
							cases: m.new_cases,
							deaths: m.new_deaths,
							sources: m.sources.sort(),

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

					this.items = items; // items.filter(m => m.totalDeaths > 0).sort((a, b) => b.totalCases - a.totalCases);
					this.numberOfPages = Math.ceil(this.items.length / this.itemsPerPage);
				});
		},
		nextPage () {
			if (this.page + 1 <= this.numberOfPages) this.page += 1;
		},
		formerPage () {
			if (this.page - 1 >= 1) this.page -= 1;
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
