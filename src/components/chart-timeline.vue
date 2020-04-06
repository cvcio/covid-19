<template>
	<div id="timeline" class="chart" v-resize="resize"></div>
</template>

<script>
import { filter, keys, values, flatten, map, groupBy, sumBy, cloneDeep, maxBy, meanBy } from 'lodash';
import Highcharts from 'highcharts';
Highcharts.setOptions({
	time: {
		timezone: 'Europe/Athens'
	}
});

export default {
	name: 'chart-timeline',
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
		resize () {
			setTimeout(() => this.draw(), 100);
		},
		parseDate (v) {
			if (!v || v === '') return '';
			const dateString = v.split('/');
			return this.$moment(`20${dateString[2]}-${dateString[0]}-${dateString[1]}`, 'YYYY-MM-DD').toDate();
		},
		draw () {
			let totalcases = [];
			let cases = [];

			if (this.level === 'greece') {
				totalcases = cloneDeep(filter(this.$store.state.greeceTimeline, ['Status', 'total cases']));
			} else {
				totalcases = cloneDeep(this.$store.state.cases);
			}

			totalcases = totalcases.map(m => {
				delete m['Province/State'];
				delete m['Country/Region'];
				delete m['Lat'];
				delete m['Long'];
				delete m['Status'];
				delete m['sum'];

				const ks = keys(m);
				const vs = values(m);
				return ks.map((k, i) => {
					return {
						date: this.parseDate(k),
						value: parseInt(vs[i])
					};
				});
			});
			totalcases = groupBy(flatten(totalcases), 'date');
			totalcases = map(totalcases, (v, k) => {
				return {
					date: k,
					value: sumBy(v, 'value')
				};
			});

			cases = totalcases.map((m, i) => {
				return {
					date: m.date,
					value: i === 0 ? m.value : m.value - totalcases[i - 1].value
				};
			});

			const self = this;
			Highcharts.chart('timeline', {
				title: {
					text: ''
				},
				subtitle: {
					text: ''
				},
				credits: {
					enabled: false
				},

				xAxis: {
					type: 'datetime',
					labels: {
						style: {
							fontFamily: 'Roboto Mono',
							fontSize: '9px'
						},
						align: 'center',
						formatter: (m) => {
							return this.$moment(m.value).format('DD/MM');
						}
					},
				},
				yAxis: {
					labels: {
						y: -6,
						x: 0,
						align: 'left',
						style: {
							fontFamily: 'Roboto Mono',
							fontSize: '9px'
						},
					},
					showLastLabel: true,
					showFirstLabel: true,
				},

				chart: {
					animation: false,
					type: totalcases.length > 31 ? 'area' : 'column',
					style: {
						fontFamily: 'Roboto Mono',
						fontSize: '9px'
					},
					height: 240,
					margin: [0, 0, 60, 0],
				},

				legend: {
					layout: 'horizontal',
					align: 'center',
					verticalAlign: 'bottom',
					floating: true,
					symbolPadding: 2,
					margin: 0,
					itemStyle: {
						fontWeight: 'normal',
						fontFamily: 'Roboto Mono',
						fontSize: '9px'
					}
				},

				plotOptions: {
					series: {
						animation: false,
						lineWidth: 1,
						marker: {
							enabled: false
						},
						events: {
							legendItemClick: function (e) {
								e.preventDefault();
								var seriesIndex = this.index;
								var series = this.chart.series;
								if (this.visible && this.chart.restIsHidden) {
									for (var i = 0; i < series.length; i++) {
										if (series[i].index != seriesIndex) {
											series[i].show();
										}
									}
									this.chart.restIsHidden = false;
								} else {
									for (var j = 0; j < series.length; j++) {
										if (series[j].index != seriesIndex) {
											series[j].hide();
										}
									}
									this.show();
  									this.chart.restIsHidden = true;
								}
								return false;
							}
						},
					},
					column: {
						groupPadding: 0,
						grouping: false
					},
					area: {
						grouping: false
					}
				},

				tooltip: {
					backgroundColor: '#ffffff',
					borderWidth: 0,
					borderRadius: 0,
					shared: false,
					padding: 12,
					useHTML: true,
					formatter: function () {
						return `
						<span style="">
							<span class="grey--text">${ self.$moment(this.point.x).format('LL') }</span><br/>
							<span>${ this.series.name }:</span>
							<span class="font-weight-bold">${ new Intl.NumberFormat('el-GR').format(this.point.y) }</span>
						</span>
						`;
					}
				},

				series: [
					{
						name: 'Σύνολο Κρουσμάτων',
						borderWidth: 1,
						lineWidth: 1,
						color: 'rgba(160, 160, 160, 0.8)',
						lineColor: 'rgba(160, 160, 160, 1)',
						marker: {
							symbol: 'circle'
						},
						data: totalcases.map(m => {
							return {
								x: this.$moment(m.date).toDate(),
								y: m.value
							};
						})
					},
					{
						isIntermediateSum: true,
						name: 'Νέα Κρούσματα',
						borderWidth: 1,
						lineWidth: 1,
						color: 'rgba(17, 75, 95, 0.8)',
						lineColor: 'rgba(17, 75, 95, 1)',
						marker: {
							symbol: 'circle'
						},
						data: cases.map(m => {
							return {
								x: this.$moment(m.date).toDate(),
								y: m.value
							};
						})
					}
				]
			});
		}
	}
};
</script>

<style lang="less">
.chart {
	height: 240px;
	z-index: 0;
}
</style>
