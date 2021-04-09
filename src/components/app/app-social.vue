<template>
	<div class="social-share">
		<ShareNetwork
			network="facebook"
			:url="$DISPLAY_URL"
			:title="'COVID—19 ' + $t('app.subtitle')"
		>
			<v-icon small color="white">fab fa-facebook</v-icon>
		</ShareNetwork>
		<ShareNetwork
			network="twitter"
			:url="$DISPLAY_URL"
			:title="'COVID—19 ' + $t('app.subtitle')"
		>
			<v-icon small color="white">fab fa-twitter</v-icon>
		</ShareNetwork>
		<ShareNetwork
			network="linkedin"
			:url="$DISPLAY_URL"
			:title="'COVID—19 ' + $t('app.subtitle')"
		>
			<v-icon small color="white">fab fa-linkedin</v-icon>
		</ShareNetwork>
		<ShareNetwork
			network="email"
			:url="$DISPLAY_URL"
			:title="'COVID—19 ' + $t('app.subtitle')"
		>
			<v-icon small color="white">far fa-envelope</v-icon>
		</ShareNetwork>
	</div>
</template>

<script>
export default {
	name: 'app-social'
};
</script>

<style scoped lang="less">
.social-share {
	position: fixed;
	top: 50%;
	right: 0;
	z-index: 999999999;
	width: 32px;
	background: white;

	display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 1000px;
    margin: auto;
	transform: translate(0, -66%);

	a[class^="share-network-"] {
		padding: 8px;
		flex: none;
		color: #FFFFFF;
		background-color: #114B5F;
		border-radius: 0;
		overflow: hidden;
		display: flex;
		flex-direction: row;
		align-content: center;
		align-items: center;
		cursor: pointer;
		margin: 0 0 1px 0;
		min-width: 32px;

		.v-icon {
			margin: auto;
		}

		&:last-child {
			margin-bottom: 0;
		}

		transition: all 100ms ease-in-out;

		&:hover {
			background-color: #BA3A0A;
		}
	}

}
</style>
