<template>
	<v-card color="white" :class="$route.meta.iframe ? 'elevation-0' : ''" :tile="$route.meta.iframe">
		<v-app-bar flat color="iframe-header px-4 mx-0" :class="$route.meta.iframe ? 'white' : 'grey lighten-5'">
			<v-container class="pa-0 ma-0" fluid>
				<v-row class="pa-0 ma-0" justify="space-between">
					<v-col class="pa-0 grow text-end ml-2" align-self="center" v-if="!$route.meta.iframe">
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
				<d7-line-bar-events v-if="item"
					:key="'gidagb-' + item.uid + '-' + point" :id="'gidagb-uid-' + item.uid + '-' + point"
					:point="point" :values="item[point]"
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
	name: 'greece-intubated-daily-agg-bar',
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
				id: 'greece-intubated-daily-agg-bar'
			};
		}
	},
	data () {
		return {
			point: 'critical',
			item: null,
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
			this.$store.dispatch('external/getGlobalAGG', 'GRC/critical/' + this.periodInterval[3].value)
				.then(res => {
					this.item = res.map(m => {
						m.critical = m.critical.map(m => Math.max(0, m));
						m.critical.unshift(...Array(getDates(m.from, m.to).length - m.critical.length).fill(0));
						return {
							uid: m.uid,
							region: m.country,
							dates: getDates(m.from, m.to),
							critical: m.critical,
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
