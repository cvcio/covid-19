<template>
	<div v-resize="draw">
		<v-scroll-y-reverse-transition>
			<div class="tooltip elevation-4" :style="'top:'+py+'px;left:'+px+'px;'" v-if="d" v-show="tooltip">
				<v-card class="elevation-0 white pa-0 arrow_box" min-width="180px">
					<v-card-title class="pa-2 subtitle-2">
						<span class="text-uppercase">
							{{
									$moment(d.date).isoWeekday(1).format("ll")
							}}
							-
							{{
									($moment(d.date).isoWeekday(7) > $moment(to))
										? $moment(to).format("ll") : ($moment(d.date).isoWeekday(7)).format("ll")
							}}
						</span>
					</v-card-title>
					<v-divider/>
					<v-card-subtitle class="pa-2">
						<h4 class="subtitle-2 primary--text  primary--text">
							<span class="text-capitalize mr-1">{{ $tc(point, 1) }}</span>
							<span class="text-lowercase">{{pp100}}</span>: {{ new Intl.NumberFormat('el-GR').format(d.value.toFixed(0)) }}
						</h4>
					</v-card-subtitle>
					<v-divider/>
					<v-card-subtitle class="pa-2">
						<h4 class="caption grey--text">{{ $t("Source") }}: <span class="font-weight-bold">{{ sources.map(m => m.toUpperCase().replace('IMEDD', 'iMEdD LAB')).join(', ') }}</span></h4>
					</v-card-subtitle>
				</v-card>
			</div>
		</v-scroll-y-reverse-transition>
		<div :id="id" class="d7-line-bar"></div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

import { line, select, scaleLinear, axisBottom, axisRight, max } from 'd3';
import * as colors from '@/helper/colors';

export default {
	name: 'chart-d7-line-bar',
	props: ['id', 'dates', 'values', 'point', 'sources', 'min', 'max', 'pp100'],
	computed: {
		...mapGetters(['locale'])
	},
	data () {
		return {
			chart: null,
			px: 100,
			py: 100,
			tooltip: false,
			d: null,
			from: null,
			to: null
		};
	},
	watch: {
		point (value, old) {
			if (value !== old) {
				this.draw();
			}
		},
		'locale.code' (value, old) {
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

			this.from = data[0].date;
			this.to = data[data.length - 1].date;

			const div = document.getElementById(this.id);
			while (div.firstChild) {
				div.removeChild(div.firstChild);
			}
			this.chart = null;

			const width = div.clientWidth;
			const height = 96;
			const margin = { top: 0, left: 0, bottom: 0, right: 0 };
			const innerWidth = width - margin.left - margin.right;
			const innerHeight = height - margin.top - margin.bottom;

			this.chart = select(div).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom);

			this.chart.selectAll('*').remove();

			const barW = Math.floor(width / data.length) - 0.5;

			const x = scaleLinear().range([0, innerWidth]).domain([0, data.length]);
			const y = scaleLinear().range([innerHeight, 0]).domain([0, this.max ? Math.ceil(this.max) : Math.max(max(this.values), 1)]).nice(10);

			const l = line()
				.x((d, i) => x(i))
				.y((d, i, a) => {
					return y(d) || y((data[i].value + a.find(s => ![undefined, null].includes(s))) / 2);
				});

			const sma = this.values;
			const self = this;
			this.chart
				.append('g')
				.attr('class', 'x axis')
				.attr('transform', `translate(0, ${height - margin.bottom})`)
				.call(
					axisBottom(x)
						.ticks(1)
						.tickFormat(d => this.$moment(this.dates[d]).format('MM/Y'))
				)
				.call(g => g.select('.domain').remove());

			this.chart
				.append('g')
				.attr('class', 'y axis')
				.attr('transform', `translate(${margin.left},0)`)
				.call(axisRight(y)
					.ticks(2)
					.tickSize(width - margin.left - margin.right)
				)
				.call(g => g.select('.domain')
					.remove())
				.call(g => g.selectAll('.tick:not(:first-of-type) line')
					.attr('stroke-opacity', 0.5)
					.attr('stroke-dasharray', '2,2'))
				.call(g => g.selectAll('.tick text')
					.attr('x', 4)
					.attr('dy', -4));

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
				.attr('opacity', 0.8)
				.on('mouseover', function (e, d) {
					self.tooltip = true;
					self.px = e.clientX;
					self.py = e.clientY;
					self.d = d;
					select(this)
						.attr('fill', colors[self.point + 'CS'][10]);
				})
				.on('mouseout', function () {
					self.tooltip = false;
					select(this)
						.attr('fill', colors[self.point + 'CS'][4]);
				});

			this.chart.append('path').datum(sma)
				.attr('fill', 'none')
				.attr('stroke', colors[this.point + 'CS'][10])
				.attr('stroke-width', 2)
				.attr('d', l);
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

.tooltip {
	z-index: 100;
	position: fixed;
	// top: 0;
	// left: 0;
	transform: translate(-50%, -120%);

	.arrow_box:after {
		top: 100%;
		left: 50%;
		border: solid transparent;
		content: "";
		height: 0;
		width: 0;
		position: absolute;
		pointer-events: none;
		border-color: rgba(255, 255, 255, 0);
		border-top-color: white;
		border-width: 8px;
		margin-left: -8px;
	}
}
</style>
