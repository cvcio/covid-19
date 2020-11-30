<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0" justify="space-between">
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
					<v-col class="pa-0 grow text-end ml-2" align-self="center" v-if="!$route.meta.iframe">
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
			<v-row class="px-0">
				<v-col
					cols="12"
					class="px-4"
				>
				<d7d-lines v-if="similar.length > 0"
					:point="point" :uid="search"
					:key="'gnd7d-'+search" :id="'gnd7d-'+search" :data="similar"/>
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
				period: null,
				lang: this.locale.code,
				id: 'global-key-daily-similar'
			};
		}
	},
	data () {
		return {
			point: 'new_deaths',
			items: [],
			similar: [],
			search: 'U300',
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
			this.$store.dispatch('external/getGlobalAGG', 'all/new_deaths,cases/' + this.periodInterval[3].value)
				.then(res => {
					const items = res.map(m => {
						m.new_deaths = m.new_deaths.map(m => Math.max(0, m));
						m.new_deaths = m.new_deaths.map(n => m.population > 0 ? (n / m.population) * 100000 : 0);
						m.dates = getDates(m.from, m.to);
						m.new_deaths.pop();
						m.dates.pop();
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
					this.items = items.sort((a, b) => a.lastIndex - b.lastIndex);
					this.doSimilar();
				});
		},
		doSimilar (uid) {
			const idx = this.items.findIndex(m => m.uid === this.search);
			const next7 = this.items.slice(idx + 1, idx + 4);
			const prev7 = this.items.slice(idx - 4, idx - 1);
			this.similar = [...prev7, ...next7, this.items[idx]];
		},
		update () {
			if (this.search === 'U300') return;
			this.search = 'U300';
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
