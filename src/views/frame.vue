<template>
	<router-view v-bind:key="$route.params.id" />
</template>

<script>

export default {
	name: 'frame'
};
</script>

<style lang="less" scoped>
.iframe-header .v-toolbar__content {
	padding-left: 0 !important;
	padding-right: 0 !important;
	padding: 0;
}
</style>
