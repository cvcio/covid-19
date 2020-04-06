<template>
	<div id="sparklines" class=""></div>
</template>

<script>
import { line, select, scaleLinear, max } from 'd3';
import { filter, keys, values, groupBy, flatten, sumBy, map, cloneDeep } from 'lodash';
import { ma } from 'moving-averages';

export default {
	name: 'chart-sparklines',
	props: ['level', 'triggerUpdate'],
	data () {
		return {
			chart: null
		};
	},
	watch: {
		triggerUpdate (n, o) {
			if (n !== o) {
				this.draw();
			}
		}
	},
	mounted () {
		this.draw();
	},
	methods: {
		parseDate (v) {
			if (!v || v === '') return '';
			const dateString = v.split('/');
			return this.$moment(`20${dateString[2]}-${dateString[0]}-${dateString[1]}`, 'YYYY-MM-DD').toDate();
		},
		draw () {
			let data = [];

			if (this.level === 'greece') {
				data = cloneDeep(filter(this.$store.state.greeceTimeline, ['Status', 'cases']));
			} else {
				data = cloneDeep(this.$store.state.cases);
			}

			data = data.map(m => {
				delete m['Province/State'];
				delete m['Country/Region'];
				delete m['Lat'];
				delete m['Long'];
				delete m['Status'];
				delete m['sum'];

				const ks = keys(m);
				const vs = values(m);
				return ks.map((k, i) => { return {
					date: this.parseDate(k),
					value: parseInt(vs[i])
				}; });
			});
			data = groupBy(flatten(data), 'date');
			data = map(data, (v, k) => sumBy(v, 'value'));
			let sma =  ma(data, 7).filter(function (el) {
				return el != null;
			});

			const DATA = sma;

			var div = document.getElementById('sparklines');
			while(div.firstChild){
				div.removeChild(div.firstChild);
			}
			this.chart = null;

			if (!this.chart) {
				this.chart = select(document.getElementById('sparklines')).append('svg');
			}

			this.chart.selectAll('*').remove();

			const width = 140;
			const height = 48;
			const margin = { top: 6, left: 6, bottom: 6, right: 6 };
			const innerWidth = width - margin.left - margin.right;
			const innerHeight = height - margin.top - margin.bottom;

			const x = scaleLinear().domain([0, DATA.length]).rangeRound([0, innerWidth]);
			const y = scaleLinear().domain([0, max(DATA)]).rangeRound([innerHeight, 0]);

			const l = line()
				.x((d, i) => x(i))
				.y(d => {
					// console.log(d);
					return y(d);
				});

			this.chart = this.chart
				.attr('width', width)
				.attr('height', height)
				.append('g')
				.attr('class', 'sparkline')
				.attr('transform', 'translate(6 6)');

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

			const diff = ((DATA[DATA.length - 1] - DATA[DATA.length - 2])).toFixed(2);
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
					if (diff > 0) return `+${ new Intl.NumberFormat('el-GR').format(Math.abs(diff)) }`;
					if (diff < 0) return `-${ new Intl.NumberFormat('el-GR').format(Math.abs(diff)) }`;
					return `${ new Intl.NumberFormat('el-GR').format(Math.abs(diff)) }`;
				});
		}
	}
};
</script>

<style lang="less">
#sparklines {
	// display: inline-block;
	width: 180px;
	height: 48px;
	svg {
		width: 180px;
		height: 48px;
		text {
			text-anchor: start;
			font: normal 9px 'Roboto Mono', 'Courier New';
		}
		z-index: 1;
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
