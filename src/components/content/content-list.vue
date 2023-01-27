<template>
	<div>

		<v-container class="max-width">
			<v-scroll-y-transition>
				<div class="follow-nav" v-if="showAltNav">
					<v-btn fab tile left class="text-inherit" color="primary" @click="$vuetify.goTo(0)">
						<v-icon small>fa-home</v-icon>
					</v-btn>
					<v-btn fab tile left class="text-inherit" color="accent" @click="$vuetify.goTo('#posts')">
						<v-icon small>fa-home</v-icon>
					</v-btn>
				</div>
			</v-scroll-y-transition>
			<div id="posts">
				<template v-if="view === 'greece'">
					<v-scroll-x-transition>
						<greece />
					</v-scroll-x-transition>
				</template>
			</div>
		</v-container>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'content-list',
	data() {
		return {
			postsMargin: 0,
		}
	},
	props: ['showAltNav'],
	computed: {
		...mapGetters(['locale', 'view']),
	},
	components: {
		greece: require('@/components/content/greece/posts').default
	},
	mounted() {
	}
}
</script>

<style lang="less" scoped>
.follow-nav {
	position: fixed;
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
	-webkit-box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.3);
	-moz-box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.3);
	box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.3);
}

#mapm-container {
	position: relative;
	width: 100%;
	height: 90vh;
	z-index: 0;

	&.mobile {
		height: calc(100vh - 56px);
	}

	.top-offset {
		margin-top: 76px;
	}

	.map .tooltip {
		z-index: 1002;
		position: fixed;
	}

	.bellow-map {
		z-index: 1;
		position: relative;
	}

	;
}

.container.max-width {
	max-width: 1264px;
}

.primary--opac {
	background: #f2f7f7;
}

.accent--opac {
	background: rgba(255, 0, 0, 0.1);
}

.secondary--opac {
	background: #f7f2f2;
}

.row.outlined {
	border: 1px solid #f2f7f7;
}

.no-events {
	pointer-events: none;
}

.events {
	pointer-events: all;
}
</style>
