<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0" justify="space-between">
					<v-col  class="pa-0 shrink" align-self="center">
						<v-btn-toggle dense class="mr-2" rounded v-model="point" mandatory>
							<v-btn x-small class="primary--text" value="cases">
								{{($tc('cases', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="deaths">
								{{($tc('deaths', 1)) | normalizeNFD }}
							</v-btn>
						</v-btn-toggle>
					</v-col>
					<v-col  class="pa-0 shrink" align-self="center">
						<v-btn-toggle dense class="mr-2" rounded v-model="calc" mandatory>
							<v-btn x-small class="primary--text" value="new">
								{{($tc('Daily', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="sum">
								{{($tc('Cumulative', 1)) | normalizeNFD }}
							</v-btn>
						</v-btn-toggle>
					</v-col>
					<v-col class="pa-0 grow text-end ml-2" align-self="center" v-if="!$route.meta.iframe">
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
			<v-row class="px-0">
				<v-col
					cols="12"
					class="px-4"
					align="center"
				>
					<v-progress-circular indeterminate v-if="loading" color="grey"></v-progress-circular>
					<d7-line-bar-events v-else
						:key="'gacb7ln-' + '-' + calc + '-' + point" :id="'gacb7ln-uid-' + '-' + calc + '-' + point"
						:point="point" :values="item[calc === 'new' ? 'new_' + point : point]"
						:dates="item.dates" :sources="item.sources"/>
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

export default {
	name: 'global-key-daily-agg-bar',
	props: {
		delay: {
			default: 100
		}
	},
	components: {
		'd7-line-bar-events': require('@/components/charts/d7-line-bar-events').default
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
				id: 'global-key-daily-agg-bar'
			};
		}
	},
	data () {
		return {
			loading: true,
			point: 'cases',
			item: null,
			items: null,
			calc: 'new',
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
			this.title = this.posts[this.embed.id.split('-')[0]].find(m => m.component.id === this.embed.id).title || '';
			this.$store.dispatch('external/getGlobalAGG', 'all/new_cases,new_deaths,cases,deaths/' + this.periodInterval[3].value)
				.then(res => {
					this.items = res.map(m => {
						m.new_cases = m.new_cases.map(m => Math.max(0, m));
						m.new_deaths = m.new_deaths.map(m => Math.max(0, m));
						m.cases = m.cases.map(m => Math.max(0, m));
						m.deaths = m.deaths.map(m => Math.max(0, m));
						return {
							uid: m.uid,
							region: m.country,
							dates: getDates(m.from, m.to),
							cases: m.cases,
							deaths: m.deaths,
							new_cases: m.new_cases,
							new_deaths: m.new_deaths,
							sources: m.sources.sort()
						};
					});
					const obj = {
						cases: this.items.map(m => m.cases),
						deaths: this.items.map(m => m.deaths),
						new_cases: this.items.map(m => m.new_cases),
						new_deaths: this.items.map(m => m.new_deaths),
						dates: getDates(res[0].from, res[0].to),
						sources: [...new Set(this.items.map(m => m.sources).flat())]
					};

					// eslint-disable-next-line
					const sum = (r, a) => r.map((b, i) => (a[i] ? a[i] : 0) + (b ? b : 0));

					obj.cases = obj.cases.reduce(sum);
					obj.deaths = obj.deaths.reduce(sum);
					obj.new_cases = obj.new_cases.reduce(sum);
					obj.new_deaths = obj.new_deaths.reduce(sum);

					this.item = obj;
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
