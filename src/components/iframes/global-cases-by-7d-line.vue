<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0" justify="space-between">
					<v-col class="pa-0" align-self="center">
						<v-btn-toggle dense class="mr-2" rounded v-model="point" mandatory>
							<v-btn x-small class="primary--text" value="cases">
								{{( $vuetify.breakpoint.smAndDown ? $tc('cases', 1).substr(1, 1) : $tc('cases', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="deaths">
								{{( $vuetify.breakpoint.smAndDown ? $tc('deaths', 1).substr(1, 1) : $tc('deaths', 1)) | normalizeNFD }}
							</v-btn>
						</v-btn-toggle>
					</v-col>
					<v-spacer/>
					<v-autocomplete
						color="primary"
						hide-details
						:items="items"
						item-text="region" item-value="uid"
						v-model="search"
						prepend-icon="fa-globe-europe" @change="doSimilar">

					</v-autocomplete>
					<v-col class="grow pa-0 text-end justify-end" align-self="center" v-if="!$route.meta.iframe">
						<!-- <v-btn x-small fab color="grey" dark class="mx-2 elevation-0" @click="update">
							<v-icon x-small>fa-redo</v-icon>
						</v-btn> -->
						<v-btn x-small fab color="primary" dark class="mx-0 elevation-0" @click="setEmbed">
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
				<v-icon x-small class="mr-2" color="primary">fa-link</v-icon><span class="font-weight-bold">iMΕdD LAB</span>: Ελλαδά, θάνατοι, από την αρχή της πανδημίας
			</a>
			<span v-else>
				<span class="font-weight-bold">iMΕdD LAB</span>: Ελλαδά, θάνατοι, από την αρχή της πανδημίας
			</span>
		</v-footer>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { getDates } from '@/utils';

export default {
	name: 'global-cases-by-7d-line',
	components: {
		'd7-line-bar': require('@/components/charts/d7-line-bar').default
	},
	computed: {
		...mapGetters(['locale']),
		...mapGetters('filters', ['periodInterval']),
		embed () {
			return {
				title: '',
				subtitle: '',
				text: '',
				mapLevel: null,
				period: null,
				lang: this.locale.code,
				id: 'global-cases-by-7d-line'
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
        	filter: {}
		};
	},
	mounted () {
		this.load();
	},
	methods: {
		setEmbed () {
			this.$store.commit('setEmbedDialog', true);
			this.$store.commit('setEmbed', this.embed);
		},
		load () {
			this.$store.dispatch('external/getGlobalAGG', 'all/all/' + this.periodInterval[3].value)
				.then(res => {
					const items = res.map(m => {
						m.new_cases = m.new_cases.map(m => Math.max(0, m));
						m.new_deaths = m.new_deaths.map(m => Math.max(0, m));
						return {
							uid: 'U' + m.uid,
							region: this.$t(m.country),
							dates: getDates(m.from, m.to),
							cases: m.new_cases,
							deaths: m.new_deaths,
							sources: m.sources,
							population: m.population
						};
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
