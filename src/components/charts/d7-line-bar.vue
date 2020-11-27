<template>
	<div :id="id" class="d7-line-bar"></div>
</template>

<script>
import { line, select, scaleLinear, axisBottom, axisRight, max } from 'd3';
import { ma } from 'moving-averages';
import * as colors from '@/helper/colors';

export default {
	name: 'chart-d7-line-bar',
	props: ['id', 'dates', 'values', 'point'],
	data () {
		return {
			chart: null
		};
	},
	watch: {
		point (value, old) {
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
			const data = this.dates.map((m, i) => {
				return {
					date: m,
					value: Math.max(0, this.values[i])
				};
			});

			const div = document.getElementById(this.id);
			while (div.firstChild) {
				div.removeChild(div.firstChild);
			}
			this.chart = null;

			const width = div.clientWidth;
			const height = 96;
			const margin = { top: 0, left: 0, bottom: 24, right: 0 };
			const innerWidth = width - margin.left - margin.right;
			const innerHeight = height - margin.top - margin.bottom;

			this.chart = select(div).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom);

			this.chart.selectAll('*').remove();

			const barW = Math.floor(width / data.length) - 0.5;

			const x = scaleLinear().range([0, innerWidth]).domain([0, data.length]);
			const y = scaleLinear().range([innerHeight, 0]).domain([0, max(this.values)]).nice(10);

			const l = line()
				.x((d, i) => x(i))
				.y(d => {
					return y(d);
				});

			const sma = ma(this.values, 7).filter((el) => {
				return el != null;
			});
			sma.unshift(...Array(data.length - sma.length).fill(0));

			this.chart
				.append('g')
				.selectAll('.bar')
				.data(data).enter()
				.append('rect')
				.attr('class', 'bar')
				.attr('x', (d, i) => x(i))
				.attr('width', barW > 0 ? barW : 1)
				.attr('y', (d) => {
					return y(d.value);
				})
				.attr('height', (d) => {
					return innerHeight - y(d.value);
				})
				.attr('fill', colors[this.point + 'CS'][4])
				.attr('opacity', 0.8);

			this.chart.append('path').datum(sma)
				.attr('fill', 'none')
				.attr('stroke', colors[this.point + 'CS'][10])
				.attr('stroke-width', 2)
				.attr('d', l);

			this.chart
				.append('g')
				.attr('class', 'x axis')
				.attr('transform', `translate(0, ${height - margin.bottom})`)
				.call(
					axisBottom(x)
						.ticks(1)
						.tickFormat(d => this.$moment(this.dates[d]).format('MMM,Y'))
				)
				.call(g => g.select('.domain').remove());

			this.chart
				.append('g')
				.attr('class', 'y axis')
				.attr('transform', `translate(${margin.left},0)`)
				.call(axisRight(y)
					.ticks(2)
					.tickSize(width - margin.left - margin.right))
				.call(g => g.select('.domain')
					.remove())
				.call(g => g.selectAll('.tick:not(:first-of-type) line')
					.attr('stroke-opacity', 0.5)
					.attr('stroke-dasharray', '2,2'))
				.call(g => g.selectAll('.tick text')
					.attr('x', 4)
					.attr('dy', -4));
		}
	}
};
</script>

<style lang="less">
.d7-line-bar {
	display: inline-block;
	// width: 140px;
	max-height: 96px;
	width: 100%;
	svg {
		.axis {
			&.x {
				line {
					stroke: rgba(200, 200, 200, 1);
					stroke-width: 1px;
				}
				.tick {
					&:first-of-type {
						line {
							display: none;
						}
					}

				}
			}

			&.y {
				line {
					stroke: rgba(200, 200, 200, 1);
					stroke-width: 1px;
				}
				.tick {
					line {

					}
				}
			}
		}

		text {
			fill: rgba(180, 180, 180, 1);;
			text-anchor: start;
			font: normal 9px 'Roboto';
		}
	}
}
</style>
