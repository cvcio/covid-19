<template>
	<v-container class="max-width">
		<v-scroll-y-transition>
			<div class="follow-nav" v-if="showAltNav">
				<v-btn fab tile left class="text-inherit" color="primary" @click="$vuetify.goTo(0)">
					<v-icon small>fa-map</v-icon>
				</v-btn>
				<v-btn fab tile left class="text-inherit" color="accent" @click="$vuetify.goTo('#posts')">
					<v-icon small>fa-home</v-icon>
				</v-btn>
			</div>
		</v-scroll-y-transition>
		<v-row justify="center" class="pa-0 ma-0 my-n12" v-if="!$vuetify.breakpoint.smAndDown">
			<v-btn tile
				class="mx-1 rounded-t top-shadow"
				:class="view === 'greece' ? 'white font-weight-bold' : 'grey lighten-4 grey--text'"
				@click="$vuetify.goTo('#posts');$store.commit('setView', 'greece');">
				{{ $t('button.in.greece') | normalizeNFD}}
				<v-icon right small>mdi-chevron-down</v-icon>
			</v-btn>
			<v-btn  tile
				class="mx-1 rounded-t top-shadow"
				:class="view === 'global' ? 'white font-weight-bold' : 'grey lighten-4 grey--text'"
				@click="$vuetify.goTo('#posts');$store.commit('setView', 'global');">
				{{ $t('button.in.world') | normalizeNFD }}
				<v-icon right small>mdi-chevron-down</v-icon>
			</v-btn>
		</v-row>
		<div id="posts">
			<template v-if="view === 'greece'">
				<v-scroll-x-transition>
					<greece/>
				</v-scroll-x-transition>
			</template>
			<template v-else>
				<v-scroll-x-transition>
					<global/>
				</v-scroll-x-transition>
			</template>
		</div>
	</v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'content-list',
	props: ['showAltNav'],
	computed: {
		...mapGetters(['locale', 'view'])
	},
	components: {
		greece: require('@/components/content/greece/posts').default,
		global: require('@/components/content/global/posts').default
	}
};
</script>

<style lang="less" scoped>
.follow-nav {
	position: fixed;
	// top: 0;
	bottom: 48px;
	left: 12px;
	transform: translate(0, 0);
	z-index: 1;
	width: 40px;
	button {
		float: left;
		margin: 0 12px 12px 0;
	}
}
.top-shadow {
	-webkit-box-shadow: 0px -2px 4px 0px rgba(0,0,0,0.3);
	-moz-box-shadow: 0px -2px 4px 0px rgba(0,0,0,0.3);
	box-shadow: 0px -1px 2px 0px rgba(0,0,0,0.3);
}
</style>
