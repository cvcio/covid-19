<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0" justify="space-between">
					<v-col class="pa-0 shrink" align-self="center">
						<v-btn-toggle dense class="mr-2" rounded v-model="point" mandatory @change="doSort">
							<v-btn x-small class="primary--text" value="cases">
								{{($tc('cases', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="deaths">
								{{($tc('deaths', 1)) | normalizeNFD }}
							</v-btn>
						</v-btn-toggle>
					</v-col>
					<v-col class="pa-0 shrink" align-self="center">
						<v-btn-toggle dense class="mr-2" rounded v-model="calc" mandatory @change="doSort">
							<v-btn x-small class="primary--text" value="_new">
								{{($tc('Daily', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="_p100p">
								{{($tc('Per 100K', 1)) | normalizeNFD }}
							</v-btn>
						</v-btn-toggle>
					</v-col>
					<v-col class="grow pa-0 text-end ml-2" align-self="center" v-if="!$route.meta.iframe">
						<v-btn x-small :fab="!$vuetify.breakpoint.smAndDown" :icon="$vuetify.breakpoint.smAndDown" color="primary" dark class="mx-0 elevation-0" @click="setEmbed">
							<v-icon x-small>fa-code</v-icon>
						</v-btn>
					</v-col>
				</v-row>
			</v-container>
		</v-app-bar>
		<v-divider v-if="!$route.meta.iframe"/>
		<v-container class="px-4" fluid>
			<v-row v-if="loading" class="px-0">
				<v-col align="center">
					<v-progress-circular indeterminate color="grey"></v-progress-circular>
				</v-col>
			</v-row>
			<v-data-iterator
				v-else
				:items="items"
				:items-per-page.sync="itemsPerPage"
				:page="page"
				hide-default-footer
				class="d-inline"
				:key="point + '-' + calc"
				>
				<template v-slot:default="props">
					<v-row class="px-0">
						<v-col
							v-for="item in props.items"
							:key="'col-gcb7l-' + item.uid"
							cols="12" xs="12" md="4"
							class="px-4"
						>
							<v-card-subtitle class="caption font-weight-bold px-0">
								{{ $t(item.region) }}
							</v-card-subtitle>
							<d7-line-bar
								:key="'gcb7l-' + item.uid + '-' + point + '-' + calc" :id="'gcb7l-uid-' + item.uid + '-' + point + '-' + calc"
								:point="point" :values="item[point + calc]"
								:dates="item.dates"
								:sources="item.sources" :max="max"
								:pp100="calc === '_p100p' ? $t('Per 100K') : ''"
								/>
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
import { remove } from 'lodash';
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
			loading: true,
			point: 'cases',
			items: [],
			page: 1,
			numberOfPages: 0,
			itemsPerPage: 15,
			max: 0,
			calc: '_new',
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
			this.$store.dispatch('external/getGreeceAGG', 'all/new_cases,new_deaths/' + this.periodInterval[3].value)
				.then(res => {
					const items = res.map(m => {
						m.new_cases = m.new_cases.map(n => Math.max(0, n));
						m.new_deaths = m.new_deaths.map(n => Math.max(0, n));
						m.new_cases_p100p = m.new_cases.map(n => m.population > 0 ? (n / m.population) * 100000 : 0);
						m.new_deaths_p100p = m.new_deaths.map(n => m.population > 0 ? (n / m.population) * 100000 : 0);
						const max_cases_new = m.new_cases[m.new_cases.length - 1]; // sum(m.new_cases.slice(m.new_cases.length - 2, m.new_cases.length - 1));
						const max_deaths_new = m.new_deaths[m.new_deaths.length - 1]; // sum(m.new_deaths.slice(m.new_deaths.length - 2, m.new_deaths.length - 1));
						const max_cases_p100p = Math.max(...m.new_cases_p100p); // sum(m.new_cases.slice(m.new_cases.length - 2, m.new_cases.length - 1));
						const max_deaths_p100p = Math.max(...m.new_deaths_p100p); // sum(m.new_deaths.slice(m.new_deaths.length - 2, m.new_deaths.length - 1));
						return {
							uid: m.uid,
							del: m.population > 0,
							region: m.region,
							dates: getDates(m.from, m.to),
							// cases: m.new_cases,
							// deaths: m.new_deaths,

							cases_new: m.new_cases,
							deaths_new: m.new_deaths,
							cases_p100p: m.new_cases_p100p,
							deaths_p100p: m.new_deaths_p100p,

							sources: m.sources.sort(),

							max_cases: Math.max(...m.new_cases),
							max_deaths: Math.max(...m.new_deaths),
							max_cases_index: m.population > 0 ? (max_cases_new / m.population) * 100000 : 0,
							max_deaths_index: m.population > 0 ? (max_deaths_new / m.population) * 100000 : 0,
							max_cases_index_p100p: (max_cases_p100p),
							max_deaths_index_p100p: (max_deaths_p100p)
						};
					});

					// remove(items, m => ['EL000', 'EL001', 'EL002'].includes(m.uid));
					this.items = items;
					this.numberOfPages = Math.ceil(this.items.length / this.itemsPerPage);

					this.doSort();
					this.loading = false;
				});
		},
		nextPage () {
			if (this.page + 1 <= this.numberOfPages) this.page += 1;
		},
		formerPage () {
			if (this.page - 1 >= 1) this.page -= 1;
		},

		doSort () {
			this.max = this.calc === '_new' ? null : Math.max(...this.items.map(m => m['max_' + this.point + '_index' + this.calc]));
			this.items = this.items.sort((a, b) => b['max_' + this.point + '_index'] - a['max_' + this.point + '_index']);
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
