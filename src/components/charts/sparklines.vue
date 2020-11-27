<template>
	<div :id="id" class="sparklines"></div>
</template>

<script>
import { line, select, scaleLinear, max } from 'd3';
import { ma } from 'moving-averages';

export default {
	name: 'chart-sparklines',
	props: ['data', 'id'],
	data () {
		return {
			chart: null
		};
	},
	watch: {
		data (value, old) {
			if (value !== old) {
				this.draw();
			}
		}
	},
	mounted () {
		this.draw();
	},
	methods: {
		draw () {
			if (this.chart) {
				this.chart.selectAll('*').remove();
			}
			const data = this.data;
			const sma = ma(data.map(m => Math.max(0, m)), 7).filter(function (el) {
				return el != null;
			});

			const DATA = sma;

			var div = document.getElementById(this.id);
			while (div.firstChild) {
				div.removeChild(div.firstChild);
			}
			this.chart = null;

			const width = div.clientWidth;
			const height = 60;
			const margin = { top: 6, left: 6, bottom: 0, right: 24 };
			const innerWidth = width - margin.left - margin.right;
			const innerHeight = height - margin.top - margin.bottom;

			this.chart = select(div).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom);

			const x = scaleLinear().domain([0, DATA.length]).rangeRound([0, innerWidth]);
			const y = scaleLinear().domain([0, max(DATA)]).rangeRound([innerHeight, 0]);

			const l = line()
				.x((d, i) => x(i))
				.y(d => {
					return y(d);
				});

			this.chart = this.chart
				.append('g')
				.attr('class', 'sparkline')
				.attr('transform', `translate(${margin.left}, ${margin.top})`)
				.attr('width', innerWidth)
				.attr('height', innerHeight);

			this.chart.append('path').datum(DATA)
				.attr('fill', 'none')
				.attr('stroke', '#bbb')
				.attr('stroke-width', 2)
				.attr('d', l);

			this.chart.append('circle')
				.attr('r', 3)
				.attr('cx', x(0))
				.attr('cy', y(DATA[0]))
				.attr('fill', 'lightgrey');

			this.chart.append('circle')
				.attr('r', 3)
				.attr('cx', x(DATA.length - 1))
				.attr('cy', y(DATA[DATA.length - 1]))
				.attr('fill', () => {
					if (DATA[DATA.length - 1] < DATA[DATA.length - 2]) return 'green';
					if (DATA[DATA.length - 1] > DATA[DATA.length - 2]) return 'tomato';
					if (DATA[DATA.length - 1] === DATA[DATA.length - 2]) return 'grey';
				});

			const diff = ((DATA[DATA.length - 1] - DATA[DATA.length - 2])).toFixed(0);
			this.chart.append('text')
				.attr('r', 3)
				.attr('x', x(DATA.length - 1) + 6)
				.attr('y', y(DATA[DATA.length - 1]) + 3)
				.attr('fill', () => {
					if (DATA[DATA.length - 1] < DATA[DATA.length - 2]) return 'green';
					if (DATA[DATA.length - 1] > DATA[DATA.length - 2]) return 'tomato';
					if (DATA[DATA.length - 1] === DATA[DATA.length - 2]) return 'grey';
				})
				.text(() => {
					if (diff > 0) return `+${new Intl.NumberFormat('el-GR').format(Math.abs(diff))}`;
					if (diff < 0) return `-${new Intl.NumberFormat('el-GR').format(Math.abs(diff))}`;
					return `${new Intl.NumberFormat('el-GR').format(Math.abs(diff))}`;
				});
		}
	}
};
</script>

<style lang="less">
.sparklines {
	display: inline-block;
	// width: 140px;
	max-height: 60px;
	width: 100%;
	svg {
		// width: 140px;
		// height: 60px;
		text {
			text-anchor: start;
			font: normal 9px 'Roboto';
		}
		line {
			stroke-width: 3px;
			stroke: lightgrey;
			stroke-opacity: 0.6;
			shape-rendering: crispEdges
		}
		circle {
			// fill: black;
			stroke: white;
			stroke-width: 1px;
		}
	}
}
</style>
