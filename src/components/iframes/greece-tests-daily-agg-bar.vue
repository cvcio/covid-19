<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0" justify="space-between">
					<v-col  class="pa-0 shrink" align-self="center">
						<v-btn-toggle dense class="mr-2" rounded v-model="point" mandatory>
							<v-btn x-small class="primary--text" value="tests">
								{{( $t('All')) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="pcr">
								{{( $tc('RT-PCR', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="rapid">
								{{( $tc('Rapid Ag', 1)) | normalizeNFD }}
							</v-btn>
						</v-btn-toggle>
					</v-col>
					<v-col  class="pa-0 shrink" align-self="center">
						<v-btn-toggle dense class="mr-2" rounded v-model="calc" mandatory>
							<v-btn x-small class="primary--text" value="new">
								{{( $vuetify.breakpoint.smAndDown ? $tc('D', 1).substr(1, 1) : $tc('Daily', 1)) | normalizeNFD }}
							</v-btn>
							<v-btn x-small class="primary--text" value="sum">
								{{( $vuetify.breakpoint.smAndDown ? $tc('C', 1).substr(1, 1) : $tc('Cumulative', 1)) | normalizeNFD }}
							</v-btn>
						</v-btn-toggle>
					</v-col>
					<v-col class="pa-0 grow text-end" align-self="center" v-if="!$route.meta.iframe">
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
			<v-row class="px-0">
				<v-col
					cols="12"
					class="px-4"
				>
				<d7-line-bar-events v-if="item"
					:key="'gcb7l-' + item.uid + '-' + calc + '-' + point" :id="'gcb7l-uid-' + item.uid + '-' + calc + '-' + point"
					:point="point" :values="item[calc === 'new' ? 'new_' + point : point]"
					:dates="item.dates" :annotations="annotations" :sources="item.sources"/>
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
	name: 'greece-tests-daily-agg-bar',
	components: {
		'd7-line-bar-events': require('@/components/charts/d7-line-bar-events').default
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
				period: null,
				lang: this.locale.code,
				id: 'greece-tests-daily-agg-bar'
			};
		}
	},
	data () {
		return {
			point: 'tests',
			item: null,
			calc: 'new',
			title: { en: '', el: '' }
		};
	},
	mounted () {
		if (this.annotations.length === 0) {
			this.$store.dispatch('internal/getAnnotations');
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
	methods: {
		setEmbed () {
			this.$store.commit('setEmbedDialog', true);
			this.$store.commit('setEmbed', this.embed);
		},
		load () {
			this.title = this.posts[this.embed.id.split('-')[0]].find(m => m.component.id === this.embed.id).title || '';
			this.$store.dispatch('external/getGlobalAGG', 'GRC/cumulative_rtpcr_tests_raw,estimated_new_rtpcr_tests,cumulative_rapid_tests_raw,esitmated_new_rapid_tests,estimated_new_total_tests/' + this.periodInterval[3].value)
				.then(res => {
					this.item = res.map(m => {
						m.dates = getDates(m.from, m.to);
						m.new_pcr = m.estimated_new_rtpcr_tests.map(m => Math.max(0, m));
						m.new_rapid = m.esitmated_new_rapid_tests.map(m => Math.max(0, m));
						m.new_tests = m.estimated_new_total_tests.map(m => Math.max(0, m));

						m.new_pcr.unshift(...Array(m.dates.length - m.new_pcr.length).fill(0));
						m.new_rapid.unshift(...Array(m.dates.length - m.new_rapid.length).fill(0));
						m.new_tests.unshift(...Array(m.dates.length - m.new_tests.length).fill(0));

						m.tests = m.new_tests.reduce((a, b, i) => [...a, a.length > 0 ? b + a[i - 1] : b], []);
						m.pcr = m.new_pcr.reduce((a, b, i) => [...a, a.length > 0 ? b + a[i - 1] : b], []);
						m.rapid = m.new_rapid.reduce((a, b, i) => [...a, a.length > 0 ? b + a[i - 1] : b], []);

						return {
							uid: m.uid,
							region: m.country,
							dates: getDates(m.from, m.to),
							new_pcr: m.new_pcr,
							new_rapid: m.new_rapid,
							new_tests: m.new_tests,
							tests: m.tests,
							pcr: m.pcr,
							rapid: m.rapid,
							sources: ['imedd'] // m.sources.sort()
						};
					});
					this.item = this.item[0];
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
