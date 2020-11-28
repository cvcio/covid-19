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
import { sum } from 'lodash';
import { getDates } from '@/utils';

export default {
	name: 'greece-cases-by-7d-line',
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
				id: 'greece-cases-by-7d-line'
			};
		}
	},
	data () {
		return {
			point: 'cases',
			items: [],
			page: 1,
			numberOfPages: 0,
			itemsPerPage: 15
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
			this.$store.dispatch('external/getGreeceAGG', 'all/all/' + this.periodInterval[3].value)
				.then(res => {
					const items = res.map(m => {
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
							sources: m.sources
						};
					});

					this.items = items.filter(m => m.totalDeaths > 0).sort((a, b) => b.totalCases - a.totalCases);
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
