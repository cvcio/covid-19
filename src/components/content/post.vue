<template>
	<component
		v-bind:is="'section'"
		class="inView"
		v-observe-visibility="{
			callback: (isVisible) => {
				inView = isVisible
			},
			once: once
		}">
			<slot :inView="inView" />
	</component>
</template>

<script>
export default {
	name: 'post',
	props: {
		tag: {
			type: String,
			default: 'div'
		},
		once: {
			type: Boolean,
			default: false
		},
		threshold: {
			type: Number,
			default: 0
		},
		rootMargin: {
			type: String,
			default: '0px 0px 0px 0px'
		}
	},
	data () {
		return {
			inView: undefined
		};
	}
};
</script>
