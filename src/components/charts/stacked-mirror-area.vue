<template>
	<div v-resize="draw" style="position:relative;">
		<v-scroll-y-reverse-transition>
			<div class="area-tooltip elevation-4" :class="tooltip_pos" :style="'top:'+py+'px;left:'+px+'px;'" v-if="d" v-show="tooltip">
				<v-card class="elevation-0 white pa-0 arrow_box" min-width="180px" max-width="240px">
					<v-card-title class="pa-2 subtitle-2">
						<span class="text-uppercase">
							{{
								$moment(d.date).locale(locale.code).format("ll")
							}}
						</span>
					</v-card-title>
					<v-divider/>

					<template v-if="d.total_dose_1">
					<v-card-subtitle class="pa-2">
						<h4 class="subtitle-2 primary--text  primary--text">
							<span class="text-capitalize mr-1">{{$t('1 Dose')}}:</span>
							{{ new Intl.NumberFormat('el-GR').format(d.total_dose_1.toFixed(0)) }}
							({{ new Intl.NumberFormat('el-GR', { style: 'percent', maximumFractionDigits: 2, minimumFractionDigits: 2 }).format((d.total_dose_1 / values.population)) }})
						</h4>
					</v-card-subtitle>
					<v-divider/>
					</template>

					<template v-if="d.total_dose_2">
					<v-card-subtitle class="pa-2">
						<h4 class="subtitle-2 primary--text  primary--text">
							<span class="text-capitalize mr-1">{{$t('2 Doses')}}:</span>
							{{ new Intl.NumberFormat('el-GR').format(d.total_dose_2.toFixed(0)) }}
							({{ new Intl.NumberFormat('el-GR', { style: 'percent', maximumFractionDigits: 2, minimumFractionDigits: 2 }).format((d.total_dose_2 / values.population)) }})
						</h4>
					</v-card-subtitle>
					<v-divider/>
					</template>

					<template v-if="d.total_dose_3">
					<v-card-subtitle class="pa-2">
						<h4 class="subtitle-2 primary--text  primary--text">
							<span class="text-capitalize mr-1">{{$t('3 Doses')}}:</span>
							{{ new Intl.NumberFormat('el-GR').format(d.total_dose_3.toFixed(0)) }}
							({{ new Intl.NumberFormat('el-GR', { style: 'percent', maximumFractionDigits: 2, minimumFractionDigits: 2 }).format((d.total_dose_3 / values.population)) }})
						</h4>
					</v-card-subtitle>
					<v-divider/>
					</template>

					<template v-if="d.hospital_admissions">
					<v-card-subtitle class="pa-2">
						<h4 class="subtitle-2 primary--text  primary--text">
							<span class="text-capitalize mr-1">{{$t('Admissions')}}:</span>
							{{ new Intl.NumberFormat('el-GR').format(d.hospital_admissions.toFixed(0)) }}
						</h4>
					</v-card-subtitle>
					<v-divider/>
					</template>
					<template v-if="d.hospital_discharges">
					<v-card-subtitle class="pa-2">
						<h4 class="subtitle-2 primary--text  primary--text">
							<span class="text-capitalize mr-1">{{$t('Discharges')}}:</span>
							{{ new Intl.NumberFormat('el-GR').format(Math.abs(d.hospital_discharges).toFixed(0)) }}
						</h4>
					</v-card-subtitle>
					<v-divider/>
					</template>
					<template v-if="values['icu_occupancy']">
						<v-card-subtitle class="pa-2">
							<h4 class="subtitle-2 primary--text  primary--text">
								<span class="text-capitalize mr-1">{{$t('ICU Occupancy')}}:</span>
								{{ new Intl.NumberFormat('el-GR', {style: 'percent', maximumFractionDigits: 2, minimumFractionDigits: 2}).format(values['icu_occupancy'][index] / 100) }}
							</h4>
						</v-card-subtitle>
						<v-divider/>
					</template>
					<template v-if="values['beds_occupancy']">
						<v-card-subtitle class="pa-2">
							<h4 class="subtitle-2 primary--text  primary--text">
								<span class="text-capitalize mr-1">{{$t('Simple Beds Occupancy')}}:</span>
								{{ new Intl.NumberFormat('el-GR', {style: 'percent', maximumFractionDigits: 2, minimumFractionDigits: 2}).format(values['beds_occupancy'][index] / 100) }}
							</h4>
						</v-card-subtitle>
						<v-divider/>
					</template>
					<v-card-subtitle class="pa-2">
						<h4 class="caption grey--text">{{ $t("Source") }}: <span class="font-weight-bold">{{ sources.map(m => m.toUpperCase().replace('IMEDD', 'iMEdD LAB')).join(', ') }}</span></h4>
					</v-card-subtitle>
				</v-card>
			</div>
		</v-scroll-y-reverse-transition>
		<div :id="id" class="stacked-mirror-area"></div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

import { line, area, select, scaleLinear, scaleTime, axisBottom, axisRight, pointer, timeDay, bisector } from 'd3';
import * as colors from '@/helper/colors';

export default {
	name: 'chart-stacked-mirror-area',
	props: ['id', 'dates', 'values', 'point', 'keys', 'sources', 'min', 'max', 'mirrored'],
	computed: {
		...mapGetters(['locale'])
	},
	data () {
		return {
			chart: null,
			px: 100,
			py: 100,
			tooltip: false,
			tooltip_pos: 'left',
			d: null,
			index: 0
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
				const d = { date: m };
				for (let j = 0; j < this.keys.length; j++) {
					d[this.keys[j]] = this.values[this.keys[j]][i];
				}
				return d;
			});

			const div = document.getElementById(this.id);
			while (div.firstChild) {
				div.removeChild(div.firstChild);
			}

			this.chart = null;

			const width = div.clientWidth;
			const height = 360;
			const margin = { top: 0, left: 0, bottom: 24, right: 0 };
			const innerWidth = width - margin.left - margin.right;
			const innerHeight = height - margin.top - margin.bottom;

			this.chart = select(div).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom);

			this.chart.selectAll('*').remove();

			const x = scaleTime().range([0, innerWidth]).domain([data[0].date, data[data.length - 1].date]);
			const y = scaleLinear().range([innerHeight, 0]).domain([this.min, this.max * 1.05]).nice(10);

			this.chart
				.append('g')
				.attr('class', 'y axis')
				.attr('transform', `translate(${margin.left},0)`)
				.call(axisRight(y)
					.ticks(2)
					.tickSize(width - margin.left - margin.right)
					.tickFormat(d => new Intl.NumberFormat('el-GR').format(Math.abs(d).toFixed(0)))
				)
				.call(g => g.select('.domain')
					.remove())
				.call(g => g.selectAll('.tick line')
					.attr('stroke-opacity', 0.5)
					.attr('stroke-dasharray', '2,2'))
				.call(g => g.selectAll('.tick text')
					.attr('x', 4)
					.attr('dy', -4));

			for (let i = 0; i < this.keys.length; i++) {
				this.chart.select('g').append('path').datum(data)
					.attr('fill', colors.getFill(this.keys[i]))
					.attr('stroke-linejoin', 'round')
					.attr('stroke-width', 2)
					.attr('d',
						area()
							.x((d, i) => x(d.date))
							.y0(y(0))
							.y1(d => y(d[this.keys[i]]))
					)
					.on('mouseover', (e, d, i) => {
						e.preventDefault();
						this.tooltip = true;
					})
					.on('mouseout', (e, d, i) => {
						e.preventDefault();
						this.chart.selectAll('.point').attr('opacity', 0);
						this.tooltip = false;
					})
					.on('mousemove', (e) => {
						e.preventDefault();

						const [x0] = pointer(e);
						const mousePosition = x.invert(x0 + margin.left);
						const mousePositionSnap = timeDay.floor(mousePosition);

						if (x(mousePositionSnap) < margin.left ||
							x(mousePositionSnap) > width + margin.right + margin.left) {
							return;
						}

						const b = bisector(d => this.$moment(d.date)).right;
						const xIndex = b(data, mousePositionSnap, 1);
						this.index = xIndex;

						this.chart
							.selectAll('.point')
							.attr('opacity', 0);

						this.chart
							.selectAll('.point-index-' + this.index)
							.attr('opacity', 1);

						const isLessThanHalf = xIndex < data.length / 2;
						const hoverTextAnchor = isLessThanHalf ? 40 : -240;
						this.tooltip_pos = isLessThanHalf ? 'left' : 'right';

						this.d = data[xIndex];
						this.px = x0 + hoverTextAnchor;
						this.py = this.mirrored ? y(0) : y(this.d[this.keys[0]]);
					});

				this.chart.select('g').append('path').datum(data)
					.attr('fill', 'none')
					.attr('pointer-events', 'none')
					.attr('stroke', colors.getStroke(this.keys[i]))
					.attr('stroke-width', 1)
					.attr('d',
						line()
							.x((d, i) => x(d.date))
							.y(d => y(d[this.keys[i]]))
					);

				this.chart.selectAll('.points').data(data).enter()
					.append('circle')
					.attr('class', (d, i) => 'point point-' + this.keys[i] + ' point-index-' + i)
					.attr('pointer-events', 'none')
					.attr('opacity', 0)
					.attr('fill', 'white')
					.attr('stroke', colors.getStroke(this.keys[i]))
					.attr('stroke-width', 2)
					.attr('cx', d => x(d.date))
					.attr('cy', d => y(d[this.keys[i]]))
					.attr('r', 4);
			}

			this.chart
				.append('g')
				.attr('class', 'x axis')
				.attr('transform', `translate(0, ${this.mirrored ? y(0) : height - margin.bottom})`)
				.call(
					axisBottom(x)
						.ticks(7)
						.tickFormat(d => {
							return this.$moment(d).format('MM/Y');
						})
				)
				.call(g => g.select('.domain').remove());
		}
	}
};
</script>

<style lang="less">
.stacked-mirror-area {
	display: inline-block;
	// width: 140px;
	max-height: 360px;
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

.area-tooltip {
	z-index: 100;
	position: absolute;
	// top: 0;
	// left: 0;
	max-width: 240px;
	transform: translate(0%, -50%);

	&.left .arrow_box:after {
		top: 50%;
		left: 0%;
		border: solid transparent;
		content: "";
		height: 0;
		width: 0;
		position: absolute;
		pointer-events: none;
		// border-color: rgba(255, 255, 255, 0);
		border-right-color: white;
		border-width: 8px;
		margin-left: -16px;
		margin-top: -8px;
	}
	&.right .arrow_box:after {
		top: 50%;
		left: 100%;
		border: solid transparent;
		content: "";
		height: 0;
		width: 0;
		position: absolute;
		pointer-events: none;
		// border-color: rgba(255, 255, 255, 0);
		border-left-color: white;
		border-width: 8px;
		margin-left: 0px;
		margin-top: -8px;
	}
}
</style>
