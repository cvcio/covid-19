<template>
	<v-container class="pa-4">
		<v-row class="pt-12 my-12" align="stretch">
			<v-col cols="12" md="4">
				<h4 class="text-h4 primary--text mb-8">
					<span class="font-weight-thin slab">Greece</span>
				</h4>
				<p class="primary--text body-1">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at nisi a odio mollis pulvinar. Nam suscipit est est, quis porttitor massa ornare vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus risus mauris, semper et quam quis, congue suscipit enim. Cras eget enim nec tortor fringilla suscipit rutrum sed augue. Nullam at ante id risus mattis dapibus.
				</p>
			</v-col>
			<v-col cols="12" md="8">
				<greece-cases-by-region/>
			</v-col>
		</v-row>
		<v-divider />
		<v-row class="my-12" align="center">
			<v-col cols="12" md="4">
				<h4 class="text-h4 primary--text mb-8">
					<span class="font-weight-thin slab">Lorem ipsum dolor sit amet, consectetur adipiscing elit</span>
				</h4>
				<p class="primary--text body-1">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at nisi a odio mollis pulvinar. Nam suscipit est est, quis porttitor massa ornare vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus risus mauris, semper et quam quis, congue suscipit enim. Cras eget enim nec tortor fringilla suscipit rutrum sed augue. Nullam at ante id risus mattis dapibus.
				</p>
				<p class="primary--text body-1">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at nisi a odio mollis pulvinar. Nam suscipit est est, quis porttitor massa ornare vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus risus mauris, semper et quam quis, congue suscipit enim. Cras eget enim nec tortor fringilla suscipit rutrum sed augue. Nullam at ante id risus mattis dapibus.
				</p>
			</v-col>
			<v-col cols="12" md="8">
				<global-cases-by-country/>
			</v-col>
		</v-row>
		<v-row class="my-12" align="center">
			<v-col cols="12" md="4">
				<h4 class="text-h4 primary--text mb-8">
					<span class="font-weight-thin slab">Lorem ipsum dolor sit amet, consectetur adipiscing elit</span>
				</h4>
				<p class="primary--text body-1">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at nisi a odio mollis pulvinar. Nam suscipit est est, quis porttitor massa ornare vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus risus mauris, semper et quam quis, congue suscipit enim. Cras eget enim nec tortor fringilla suscipit rutrum sed augue. Nullam at ante id risus mattis dapibus.
				</p>
				<p class="primary--text body-1">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at nisi a odio mollis pulvinar. Nam suscipit est est, quis porttitor massa ornare vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus risus mauris, semper et quam quis, congue suscipit enim. Cras eget enim nec tortor fringilla suscipit rutrum sed augue. Nullam at ante id risus mattis dapibus.
				</p>
			</v-col>
			<v-col cols="12" md="8">
				<greece-cases-by-7d-line/>
			</v-col>
		</v-row>
		<v-row class="my-12" align="center">
			<v-col cols="12" md="4">
				<h4 class="text-h4 primary--text mb-8">
					<span class="font-weight-thin slab">Lorem ipsum dolor sit amet, consectetur adipiscing elit</span>
				</h4>
				<p class="primary--text body-1">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at nisi a odio mollis pulvinar. Nam suscipit est est, quis porttitor massa ornare vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus risus mauris, semper et quam quis, congue suscipit enim. Cras eget enim nec tortor fringilla suscipit rutrum sed augue. Nullam at ante id risus mattis dapibus.
				</p>
				<p class="primary--text body-1">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at nisi a odio mollis pulvinar. Nam suscipit est est, quis porttitor massa ornare vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus risus mauris, semper et quam quis, congue suscipit enim. Cras eget enim nec tortor fringilla suscipit rutrum sed augue. Nullam at ante id risus mattis dapibus.
				</p>
			</v-col>
			<v-col cols="12" md="8">
				<greece-cases-by-7d-line-events/>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: 'posts-greece',
	components: {
		'greece-cases-by-region': require('@/components/charts/greece-cases-by-region').default,
		'greece-cases-by-7d-line': require('@/components/charts/greece-cases-by-7d-line').default,
		'greece-cases-by-7d-line-events': require('@/components/charts/greece-cases-by-7d-line-events').default,
		'global-cases-by-country': require('@/components/charts/global-cases-by-country').default
	}
};
</script>
