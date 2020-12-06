<template>
	<div v-resize="draw">
		<v-scroll-y-reverse-transition>
			<div class="tooltip elevation-4" :style="'top:'+py+'px;left:'+px+'px;'" v-if="d" v-show="tooltip">
				<v-card class="elevation-0 white pa-0 arrow_box" min-width="180px">
					<v-card-title class="pa-2 subtitle-2">
						<!-- <span class="">
							{{
								$moment(d.date).locale(locale.code).format("ll")
							}}
						</span> -->
						<span>{{ d.region }}</span>
					</v-card-title>
					<v-divider/>
					<v-card-subtitle class="pa-2">
						<!-- <h4 class="subtitle-2 primary--text text-capitalize primary--text">
							{{ $tc(point, 1) }}: {{ new Intl.NumberFormat('el-GR').format(d.value.toFixed(0)) }}
						</h4> -->
					</v-card-subtitle>
					<v-divider/>
					<!-- <v-card-subtitle class="pa-2">
						<h4 class="caption grey--text">{{ $t("Source") }}: <span class="font-weight-bold">{{ sources.map(m => m.toUpperCase().replace('IMEDD', 'iMEdD LAB')).join(', ') }}</span></h4>
					</v-card-subtitle> -->
				</v-card>
			</div>
		</v-scroll-y-reverse-transition>
		<div :id="id" class="d7d-lines"></div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

import { line, select, scaleLinear, axisBottom, axisRight, max, scaleOrdinal, schemeCategory10 } from 'd3';
import {
	layoutTextLabel, layoutGreedy,
	layoutLabel, layoutRemoveOverlaps
} from '@d3fc/d3fc-label-layout';
import { ma } from 'moving-averages';
import * as colors from '@/helper/colors';
import annotation from 'd3-svg-annotation';

export default {
	name: 'chart-d7d-lines',
	props: ['id', 'data', 'uid', 'point', 'min', 'max'],
	computed: {
		...mapGetters(['locale'])
	},
	data () {
		return {
			chart: null,
			px: 100,
			py: 100,
			tooltip: false,
			d: null
			// max: 0,
			// min: 0
		};
	},
	watch: {
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

			const data = this.data.map(m => {
				const sma = ma(m[this.point], 7).filter((el) => {
					return el != null;
				});
				sma.unshift(...Array(m.dates.length - sma.length).fill(0));
				m.sma = sma;
				m.maxIdx = sma.indexOf(Math.max(...sma));
				return m;
			});

			const div = document.getElementById(this.id);
			while (div.firstChild) {
				div.removeChild(div.firstChild);
			}
			this.chart = null;

			const colorScale = scaleOrdinal().domain([0, data.length]).range(schemeCategory10);

			const width = div.clientWidth;
			const height = 460;
			const margin = { top: 12, left: 0, bottom: 12, right: 64 };
			const innerWidth = width - margin.left - margin.right;
			const innerHeight = height - margin.top - margin.bottom;

			this.chart = select(div).append('svg')
				.attr('width', width)
				.attr('height', height)
				.attr('transform', `translate(${margin.left}, ${margin.top})`);

			this.chart.selectAll('*').remove();

			// this.max = max(data.map(m => m.sma).flat());
			const x = scaleLinear().range([0, innerWidth]).domain([0, data[0].dates.length]);
			const y = scaleLinear().range([innerHeight - margin.top, 0]).domain([0, this.max ? this.max : max(data.map(m => m.sma).flat())]).nice(10);

			const l = line()
				.x((d, i) => {
					return x(i);
				})
				.y(d => {
					return y(d);
				});

			this.chart
				.append('g')
				.attr('class', 'x axis')
				.attr('transform', `translate(0, ${innerHeight})`)
				.call(
					axisBottom(x)
						.ticks(6)
						.tickFormat(d => this.$moment(data[0].dates[d]).format('MM/Y'))
				)
				.call(g => g.select('.domain').remove());

			this.chart
				.append('g')
				.attr('class', 'y axis')
				.attr('transform', `translate(${margin.left},${margin.top})`)
				.call(axisRight(y)
					.ticks(4)
					.tickSize(width - margin.left - margin.right))
				.call(g => g.select('.domain')
					.remove())
				.call(g => g.selectAll('.tick:not(:first-of-type) line')
					.attr('stroke-opacity', 0.5)
					.attr('stroke-dasharray', '2,2'))
				.call(g => g.selectAll('.tick text')
					.attr('x', 4)
					.attr('dy', -4));

			this.chart
				.selectAll('.line')
				.data(data)
				.enter()
				.append('path')
				.attr('id', d => 'line-' + d.uid)
				.attr('transform', `translate(0,${margin.top})`)
				.attr('fill', 'none')
				.attr('stroke', (d, i) => {
					return colorScale(i);
				})
				.attr('stroke-width', 2)
				.attr('stroke-opacity', 0.7)
				.attr('d', (d) => {
					return l(d.sma);
				})
				.on('mouseover', function (e, d) {
					select(this)
						.attr('stroke', colors.testsCS[7])
						.attr('stroke-width', 4)
						.attr('stroke-opacity', 0.9);

					select('.annotation-' + d.uid)
						.selectAll('g.annotation-connector, g.annotation-note')
						.classed('hidden', false);
				})
				.on('mouseout', function (e, d) {
					const i = data.findIndex(x => x.uid === d.uid);
					select(this)
						.attr('stroke', colorScale(i))
						.attr('stroke-width', 2)
						.attr('stroke-opacity', 0.7);
					select('.annotation-' + d.uid)
						.selectAll('g.annotation-connector, g.annotation-note')
						.classed('hidden', true);
				});

			const annotations = this.data.map(m => {
				return {
					id: 'annotation-' + m.uid,
					note: {
						title: m.region + ' ' + this.$moment(m.dates[m.maxIdx]).format('LL'), // this.$moment(m.date, 'DD/MM/YYYY').format('LL'),
						label: `Deaths / 100K Ratio ${m.sma[m.maxIdx].toFixed(2)}`,
						padding: 6,
						wrap: 180,
						align: 'middle',
						id: m.uid
					},
					className: 'annotation-' + m.uid,
					data: m,
					type: annotation.annotationCalloutCircle,
					x: x(m.maxIdx),
					y: y(m.sma[m.maxIdx]),
					dy: 80 - y(m.sma[m.maxIdx]),
					dx: -48, // - x(m.maxIdx),
					subject: { radius: 4 },
					color: 'black', // m.importance > 10 ? 'black' : 'lightgrey',
					connector: {
						type: 'line',
						lineType: 'horizontal',
						endScale: 1
					}
				};
			});

			const makeAnnotations = annotation.annotation()
				.annotations(annotations)
				.on('subjectover', function (a) {
					a.type.a.selectAll('g.annotation-connector, g.annotation-note')
						.classed('hidden', false);
					select('#line-' + a.data.uid)
						.attr('stroke', colors.testsCS[7])
						.attr('stroke-width', 4)
						.attr('stroke-opacity', 0.9);
				})
				.on('subjectout', function (a) {
					a.type.a.selectAll('g.annotation-connector, g.annotation-note')
						.classed('hidden', true);

					const i = data.findIndex(x => x.uid === a.data.uid);
					select('#line-' + a.data.uid)
						.attr('stroke', colorScale(i))
						.attr('stroke-width', 2)
						.attr('stroke-opacity', 0.7);
				});

			this.chart
				.append('g')
				.attr('transform', `translate(${margin.left},${margin.top})`)
				.call(makeAnnotations);
			this.chart.selectAll('g.annotation-connector, g.annotation-note').classed('hidden', true);
			this.chart.selectAll('.connector')
				.attr('stroke', colors.testsCS[7])
				.style('stroke-dasharray', ('3, 3'));

			this.chart.selectAll('.connector-end')
				.attr('stroke', colors.testsCS[7])
				.attr('fill', colors.testsCS[7]);

			this.chart
				.selectAll('.point')
				.data(data)
				.enter()
				.append('circle')
				.attr('transform', `translate(0,${margin.top})`)
				.attr('r', 3)
				.attr('cx', (d, i) => {
					return x(d.maxIdx);
				})
				.attr('cy', (d, i) => y(d.sma[d.maxIdx]))
				.attr('opacity', 0);

			// const labels = this.chart
			// 	.selectAll('.title')
			// 	.data(data)
			// 	.enter()
			// 	.append('text')
			// 	.attr('transform', `translate(${margin.left},${margin.top})`)
			// 	.attr('id', d => 'title-' + d.uid)
			// 	// .classed('hidden', d => d.uid !== this.uid)
			// 	.attr('x', width - margin.right + 12)
			// 	.attr('y', (d) => y(d.sma[d.sma.length - 1]) + 3)
			// 	.attr('dy', (d) => 0)
			// 	.attr('fill', () => {

			// 	})
			// 	.text((d) => {
			// 		return d.region;
			// 	});

			const labelPadding = 2;
			const textLabel = layoutTextLabel()
				.padding(labelPadding)
				.value(d => {
					return d.region;
				});
			const strategy = layoutRemoveOverlaps(layoutGreedy());
			const ls = layoutLabel(strategy)
				.size((d, i, g) => {
					const textSize = g[i].getElementsByTagName('text')[0].getBBox();
					return [textSize.width + labelPadding * 2, textSize.height + labelPadding * 2];
				})
				.position(d => {
					return [
						width - margin.right,
						y(d.sma[d.sma.length - 1])
					];
				})
				.component(textLabel);

			this.chart
				.append('g')
				.attr('transform', `translate(${margin.left},${margin.top})`)
				.datum(data).call(ls);
		}
	}
};
</script>

<style lang="less">
.d7d-lines{
	display: inline-block;
	// width: 140px;
	max-height: 460px;
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

		.point, .line {
			cursor: pointer;
		}

		text {
			fill: rgba(180, 180, 180, 1);;
			text-anchor: start;
			font: normal 9px 'Roboto';
		}

		.label {
			rect {
				fill: none;
			}

			text {
				fill: rgba(180, 180, 180, 1);;
				font: normal 9px 'Roboto';
			}
		}

		.annotation path {
			stroke: 'red';
			fill: 'red';
		}
		.annotation path.connector-arrow,
		.title text, .annotation text,
		.annotation.callout.circle .annotation-subject path {
			fill: rgba(140, 140, 140, 1);
		}

		.annotation-note-title  {
			font-weight: bold;
			fill: rgba(100, 100, 100, 1);
		}

		.annotation.xythreshold {
			cursor: move;
		}

		.hidden {
			display: none;
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
