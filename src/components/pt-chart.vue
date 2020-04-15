<template>
	<div :id="id"></div>
</template>
<script>
import Plotly from 'plotly.js';
export default {
	name: 'pt-chart',
	props: ['src', 'id'],
	mounted () {
		if (this.src) {
			fetch(this.src)
				.then(res => {
					return res.json();
				})
				.then(data => {
					this.fig = data;
					this.draw();
				})
				.catch(e => console.log(e));
		}
	},
	methods: {
		draw () {
			Plotly.newPlot(this.id, this.fig.data, this.fig.layout, {
				displaylogo: false,
				staticPlot: false
			});
		}
	}
};
</script>
