<template>
	<div>
		<v-scroll-y-reverse-transition>
			<div class="tooltip elevation-4" :style="'top:'+py+'px;left:'+px+'px;'" v-show="tooltip">
				<v-card class="elevation-0 white pa-0 arrow_box" min-width="180px">
					<v-card-title class="pa-2 subtitle-2">
						<span class="">
							{{
								$moment().week(week).isoWeekday(1).format("ll")
							}}
							-
							{{
								$moment().week(week).isoWeekday(7).format("ll")
							}}
						</span>
					</v-card-title>
					<v-divider/>
					<v-card-subtitle class="pa-2">
						<h4 class="subtitle-2 primary--text text-capitalize primary--text">
							{{ $tc("cases", 1) }}: {{ value }}
						</h4>
					</v-card-subtitle>
				</v-card>
			</div>
		</v-scroll-y-reverse-transition>
		<div :id="id" class="heatbar px-0" v-resize="draw"></div>
	</div>
</template>

<script>
import { select, scaleBand, scaleThreshold, groups } from 'd3';
import { sumBy } from 'lodash';

import * as colors from '@/helper/colors';

export default {
	name: 'heatbar',
	props: ['id', 'values', 'point', 'dates'],
	data () {
		return {
			chart: null,
			px: 100,
			py: 100,
			tooltip: false,
			week: 0,
			value: 0
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
		palette (min, max, colors) {
			const d = (max - min) / 12;
			return scaleThreshold()
				.range(colors)
				.domain([min + d * 1, min + d * 2, min + d * 3, min + d * 4, min + d * 5, min + d * 6, min + d * 7, min + d * 8, min + d * 9, min + d * 10, min + d * 11]);
		},
		draw () {
			if (this.chart) {
				this.chart.selectAll('*').remove();
			}
			const div = document.getElementById(this.id);
			while (div.firstChild) {
				div.removeChild(div.firstChild);
			}
			this.chart = null;

			const data = this.dates.map((m, i) => {
				return {
					week: this.$moment(m).week(),
					date: m,
					value: this.values[i]
				};
			});

			const entries = groups(data, (d) => d.week).map(m => {
				return {
					week: m[0],
					value: sumBy(m[1], 'value')
				};
			});

			const values = entries.map(m => m.value);
			const width = div.clientWidth;
			const height = 12;
			const margin = { top: 4, left: 0, bottom: 0, right: 0 };
			const innerWidth = width - margin.left - margin.right;
			const innerHeight = height - margin.top - margin.bottom;

			const min = Math.min(...values);
			const max = Math.max(...values, 1);

			const palette = this.palette(min, max, colors[this.point + 'CS']);

			this.chart = select(div).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom);

			const x = scaleBand()
				.range([0, innerWidth])
				.domain(entries.map((m, i) => i))
				.padding(0);

			this.chart = this.chart
				.append('g')
				.attr('class', 'heatbar')
				.attr('transform', `translate(${margin.left}, ${margin.top})`)
				.attr('width', innerWidth)
				.attr('height', innerHeight);

			this.chart.selectAll()
				.data(entries)
				.enter()
				.append('rect')
				.attr('x', (d, i) => x(i))
				.attr('y', '0')
				.attr('width', x.bandwidth())
				.attr('height', '12px')
				.style('fill', (d) => palette(d.value))
				.on('mouseover', (e, d) => {
					this.tooltip = true;
					this.px = e.clientX;
					this.py = e.clientY;
					this.week = d.week;
					this.value = d.value;
				})
				.on('mouseout', (e, d) => {
					this.tooltip = false;
				});
		}
	}
};
</script>

<style lang="less" scoped>
.heatbar {
	display: block;
	// width: 140px;
	max-height: 48px;
	width: 100%;
	svg {
		rect {
			cursor: pointer;
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
