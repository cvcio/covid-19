<template>
	<v-dialog v-model="embedDialog" max-width="720" persistent>
		<v-card>
			<v-card-title class="headline white pt-6 mb-0">
				{{ $t('Embed Code') }}
			</v-card-title>
			<v-card-text class="mt-4 body-1" v-html="$t('embed.body')">
			</v-card-text>
			<v-card-subtitle class="white mb-0 py-0">
				{{ $t('Customize View') }}
			</v-card-subtitle>
			<v-container class="px-6 py-0">
				<v-row>
					<v-col v-if="embed.mapKey !== null">
						<h5>{{ $t('View') }}</h5>
						<v-radio-group v-model="embed.mapKey" mandatory class="text-capitalize">
							<v-radio :label="$tc('cases', 1)" value="cases"></v-radio>
							<v-radio :label="$t('Vaccinations')" value="vaccines"></v-radio>
						</v-radio-group>
					</v-col>
					<v-col v-if="embed.mapYear !== null">
						<h5>{{ $t('View') }}</h5>
						<v-radio-group v-model="embed.mapYear" mandatory class="text-capitalize">
							<v-radio :label="$t('Total')" value="all"></v-radio>
							<v-radio :label="$tc('2020', 1)" value="2020"></v-radio>
							<v-radio :label="$tc('2021', 1)" value="2021"></v-radio>
							<v-radio v-if="embed.mapType !== 'deaths'" :label="$tc('2022', 1)" value="2022"></v-radio>
							<v-radio v-if="embed.mapType === 'vaccinations'" :label="$tc('2023', 1)" value="2023"></v-radio>
						</v-radio-group>
					</v-col>
					<v-col v-if="embed.view !== null">
						<h5>{{ $t('View') }}</h5>
						<v-radio-group v-model="embed.view" mandatory class="text-capitalize">
							<template v-for="view in embed.availableViews">
								<v-radio :key="'view-' + view" :label="$tc(view, 1)" :value="view"></v-radio>
							</template>
						</v-radio-group>
					</v-col>
					<v-col v-if="embed.aggregation !== null">
						<h5>{{ $t('Aggregation') }}</h5>
						<v-radio-group v-model="embed.aggregation" mandatory class="text-capitalize">
							<template v-for="aggregation in embed.availableAggregations">
								<v-radio :key="'aggregation-' + aggregation" :label="$tc(aggregation, 1)" :value="aggregation">
								</v-radio>
							</template>
						</v-radio-group>
					</v-col>
					<v-col v-if="embed.period !== null">
						<h5>{{ $t('Time Period') }}</h5>
						<v-select dense prepend-icon="" class="pt-3" :label="$t('Time Period')" color="primary"
							:items="embed.availablePeriods" :item-text="'text.' + locale.code" item-value="value"
							v-model="embed.period" auto-select-first>
							<template v-slot:prepend>
								<v-icon small class="mt-1" color="primary">
									fa-clock
								</v-icon>
							</template>
						</v-select>
					</v-col>
					<v-col v-if="embed.lang !== null">
						<h5>{{ $t('Language') }}</h5>
						<v-radio-group v-model="embed.lang" mandatory>
							<v-radio label="Ελληνικά" value="el"></v-radio>
							<v-radio label="English" value="en"></v-radio>
						</v-radio-group>
					</v-col>
				</v-row>
			</v-container>
			<v-divider></v-divider>
			<v-card-text class="mt-0 px-6 pt-2 pb-1 my-4">
				<ssh-pre language="html-vue" reactive label="HTML" copy-button @copied="onCopied">
					<template v-slot:copy-button>
						<v-icon small class="ma-2" :color="color">{{ icon }}</v-icon>
					</template>
					{{ getIframe() }}
				</ssh-pre>
			</v-card-text>
			<v-divider></v-divider>

			<v-card-text class="mt-4 caption" v-html="$t('embed.incognito')">
			</v-card-text>

			<v-card-actions class="pa-6">
				<v-spacer></v-spacer>
				<v-btn color="primary" text @click="$store.commit('setEmbedDialog', false)">
					{{ $t('Close') }}
				</v-btn>
				<v-btn color="primary" text @click.native="copy">
					{{ $t('Copy') }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import SshPre from 'simple-syntax-highlighter';

export default {
	name: 'embed-dialog',
	components: {
		SshPre
	},
	computed: {
		...mapGetters(['locale', 'embedDialog']),
		...mapState(['embed']),
		queryString() {
			let str = 'lang=' + this.embed.lang;
			if (this.embed.mapLevel) {
				str += '&mapLevel=' + this.embed.mapLevel;
			}
			if (this.embed.period !== null) {
				str += '&period=' + this.embed.period;
			}
			if (this.embed.mapKey) {
				str += '&mapKey=' + this.embed.mapKey;
			}
			if (this.embed.mapYear) {
				str += '&mapYear=' + this.embed.mapYear;
			}
			if (this.embed.view) {
				str += '&view=' + this.embed.view.toLowerCase();
			}
			if (this.embed.aggregation) {
				str += '&aggregation=' + this.embed.aggregation.toLowerCase();
			}
			return str;
		}
	},
	data() {
		return {
			dialog: true,
			color: 'grey',
			icon: 'fa-copy'
		};
	},
	methods: {
		// getPeriod(arr) {
		// 	return this.periodInterval.filter(m => {
		// 		return arr.indexOf(m.value) > -1;
		// 	});
		// },
		escapeHtml(str) {
			return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		},
		getIframe() {
			return (`<iframe
				src="${this.$DISPLAY_URL}iframe/${this.embed.id}?${this.queryString}"
				width="100%" height="640"
				style="border:0px #ffffff none;"
				name="covid"
				allowfullscreen>
				</iframe>`);
		},
		onCopied() {
			this.color = 'success';
			this.icon = 'fa-check';
			setTimeout(() => {
				this.color = 'grey';
				this.icon = 'fa-copy';
			}, 2500);
		},
		copy() {
			navigator.clipboard.writeText(this.getIframe())
				.then(() => {
					this.onCopied();
				});
		}
	}
};
</script>

<style lang="less" scoped>
@import "~simple-syntax-highlighter/dist/sshpre.css";
</style>
