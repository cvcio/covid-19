<template>
	<div id="timeline" class="chart" v-resize="resize"></div>
</template>

<script>
import { select, scaleTime, scaleBand, axisBottom, axisLeft, scaleLinear, max, timeWeek, format } from 'd3';
import { filter, keys, values, flatten, map, groupBy, sumBy, cloneDeep } from 'lodash';

export default {
	name: 'chart-timeline',
	props: ['data', 'level', 'triggerUpdate'],
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
		resize () {
			setTimeout(() => this.draw(), 100);
		},
		parseDate (v) {
			if (!v || v === '') return '';
			const dateString = v.split('/');
			return this.$moment(`20${dateString[2]}-${dateString[0]}-${dateString[1]}`).toDate();
		},
		draw () {
			if (!this.$store.state.cases || this.$store.state.cases.length === 0) return;
			let data = [];

			if (this.level === 'greece') {
				data = cloneDeep(filter(this.$store.state.greeceTimeline, ['Status', 'total cases']));
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
			data = map(data, (v, k) => {
				return {
					date: k,
					value: sumBy(v, 'value')
				};
			});

			if (!this.chart) {
				this.chart = select(document.getElementById('timeline')).append('svg');
			}

			this.chart.selectAll('*').remove();

			let domEl = document.getElementById('timeline');
			let margin = { top: 0, left: 0, bottom: 0, right: 0 };
			let width = domEl.offsetWidth - margin.left - margin.right - 24;
			let height = 180 - margin.top - margin.bottom;

			let formatK = format('.2s');

			let x = scaleTime()
				.domain([new Date(data[0].date), new Date()])
				.rangeRound([0, width - margin.left - margin.right]);

			let xBand = scaleBand()
				.domain(data.map(m => new Date(m.date)))
				.range([0, width - margin.left - margin.right])
				.paddingInner(0.5);

			let xAxis = axisBottom(x)
				.tickSizeInner(6)
				.tickSizeOuter(0)
				.ticks(timeWeek.every(2));

			let y = scaleLinear()
				.domain([0, max(data, (m) => m.value) * 1.3])
				.rangeRound([height - margin.top - margin.bottom, 0]);

			let yAxis = axisLeft(y)
				.tickSizeInner(6)
				.tickSizeOuter(0)
				.tickPadding(3)
				.ticks(5)
				.tickFormat(d => d ? formatK(d) : null);

			// the chart
			this.chart
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom + 24);

			const make_x_gridlines = () => {
				return axisLeft(y)
					.ticks(10);
			};

			// x-grid
			this.chart
				.append('g')
				.attr('class', 'x axis grid')
				.attr('transform', `translate(36, ${0})`)
				.call(
					make_x_gridlines()
						.tickSize(-width)
						.tickFormat('')
				);

			// x-axis
			this.chart
				.append('g')
				.attr('class', 'x axis ticks')
				.attr('transform', `translate(0, ${
					height - margin.top - margin.bottom + xAxis.tickSize() - 6
				})`)
				.call(xAxis)
				.selectAll('text')
				.text((d) => {
					return this.$moment(d).format('DD/MM');
				})
				.attr('x', 0)
				.attr('y', 12);


			// y-axis
			this.chart
				.append('g')
				.attr('class', 'y axis')
				.attr('transform', `translate(${9}, 0)`)
				.call(
					yAxis
				);

			// bars
			this.chart.append('g').selectAll('.type').data(data).enter()
				.append('g')
				.attr('transform', `translate(${margin.left}, 0)`)
				.attr('class', 'type')
				.style('fill', (d, i) => {
					return '#ED2038';
				})
				.append('rect')
				.attr('class', 'bar')
				.attr('x', (d) => {
					if (!d) return;
					return x(this.$moment(d.date));
				})
				.attr('y', (d) => {
					if (!d) return;
					return y(d.value);
				})
				.attr('width', xBand.bandwidth())
				.attr('height', (d) => {
					if (!d) return;
					return height - y(d.value);
				});
		}
	}
};
</script>

<style lang="less">
.chart {
	height: 180px;
	padding-right: 24px;
	z-index: 0;
	svg {
		text {
			text-anchor: start;
			font: normal 9px 'Roboto Mono', 'Courier New';
		}
		z-index: 1;
		.grid {
			line {
				stroke: lightgrey;
				stroke-opacity: 0.6;
				shape-rendering: crispEdges
			}
			path {
				visibility: hidden;
			}
		}
		.axis {
			path {
				stroke: #000;
				stroke-width: 1px;
				shape-rendering: crispEdges;
				// stroke-dasharray: 4;
			}
			&.x {
				text {
					text-anchor: middle;
					font-size: 10px;
				}
			}
			&.y {
				path {
					visibility: hidden;
				}
				line {
					visibility: hidden;
				}
				text {
					text-anchor: start;
					font-size: 10px;
				}
			}
		}

		circle {
			fill: black;
			stroke: white;
			stroke-width: 2px;
		}
		rect {
			stroke: none;
			stroke-width: 1px;
			shape-rendering: crispEdges;
		}
	}
}
</style>
