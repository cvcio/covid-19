<template>
	<v-dialog v-model="embedDialog" max-width="720" persistent>
		<v-card>
			<v-card-title class="headline white pt-6 mb-0">
				{{ $t('Embed Code')}}
			</v-card-title>
			<v-card-text class="mt-4 body-1" v-html="$t('embed.body')">
			</v-card-text>
			<v-card-subtitle class="white mb-0 py-0">
				{{ $t('Customize View')}}
			</v-card-subtitle>
			<v-container class="px-6 py-0">
				<v-row>
					<v-col v-if="embed.mapLevel !== null">
						<h5>{{ $t('Geographical Coverage') }}</h5>
						<v-radio-group
							v-model="embed.mapLevel"
							mandatory
						>
							<v-radio
								:label="$t('Greece')"
								value="greece"
							></v-radio>
							<v-radio
								:label="$t('World')"
								value="global"
							></v-radio>
						</v-radio-group>
					</v-col>
					<v-col v-if="embed.period !== null">
						<h5>{{ $t('Time Period') }}</h5>
						<v-radio-group
							v-model="embed.period"
							mandatory
						>
							<v-radio
								:label="$t('Last day')"
								value="0"
							></v-radio>
							<v-radio
								:label="$t('Last 14 days')"
								value="1"
							></v-radio>
							<v-radio
								:label="$t('Last 3 months')"
								value="2"
							></v-radio>
							<v-radio
								:label="$t('Historical data')"
								value="3"
							></v-radio>
						</v-radio-group>
					</v-col>
					<v-col v-if="embed.lang !== null">
						<h5>{{ $t('Language') }}</h5>
						<v-radio-group
							v-model="embed.lang"
							mandatory
						>
							<v-radio
								label="Ελληνικά"
								value="el"
							></v-radio>
							<v-radio
								label="English"
								value="en"
							></v-radio>
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
					{{getIframe()}}
				</ssh-pre>
			</v-card-text>
			<v-divider></v-divider>

			<v-card-actions class="pa-6">
				<v-spacer></v-spacer>
				<v-btn
					color="primary"
					text
					@click="$store.commit('setEmbedDialog', false)"
				>
					{{ $t('Close')}}
				</v-btn>
				<v-btn
					color="primary"
					text
					@click.native="copy"
				>
					{{ $t('Copy')}}
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
		queryString () {
			let str = 'lang=' + this.embed.lang;
			if (this.embed.mapLevel) {
				str += '&mapLevel=' + this.embed.mapLevel;
			}
			if (this.embed.period) {
				str += '&period=' + this.embed.period;
			}
			return str;
		}
	},
	data () {
		return {
			dialog: true,
			color: 'grey',
			icon: 'fa-copy'
		};
	},
	methods: {
		escapeHtml (str) {
			return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		},
		getIframe () {
			return (`<iframe
	src="${this.$BASE_URL}iframe/${this.embed.id}?${this.queryString}"
	width="100%" height="640"
	style="border:0px #ffffff none;"
	name="covid"
	allowfullscreen>
</iframe>`);
		},
		onCopied () {
			this.color = 'success';
			this.icon = 'fa-check';
			setTimeout(() => {
				this.color = 'grey';
				this.icon = 'fa-copy';
			}, 2500);
		},
		copy () {
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
