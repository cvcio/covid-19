<template>
	<div>
		<div id="mapbox" class="mapbox"></div>
		<div id="legend">
			<v-row no-gutters class="">
				<v-col>
					<v-card class="pa-0" width="196">
						<v-btn-toggle v-model="typeOfMap" mandatory light tile style="width: 100%;" borderless>
							<v-btn value="deaths" tile x-small class="grow" >
								Θανατοι
							</v-btn>
							<v-btn value="cases" tile x-small>
								Κρουσματα
							</v-btn>
						</v-btn-toggle>
						<v-card-text class="pa-2 pt-0">
							<v-row no-gutters justify="center" align="center" class="pa-0">
								<v-col>
									<v-slider
										v-model="value"
										class="extra-small-text font-weight-bold"
										min="0"
										:max="dates.length - 1"
										hide-details
										always-dirty
										:label="$moment(dates[value]).format('ll')"
									>
									</v-slider>
								</v-col>
								<v-col class="shrink text-right">
									<v-btn
										:color="isPlaying ? 'primary' : 'primary'"
										dark
										depressed
										icon
										small
										@click="togglePlay"
									>
										<v-icon small>
										{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}
										</v-icon>
									</v-btn>
								</v-col>
							</v-row>


							<v-row no-gutters justify="center" align="center" class="">
								<v-col v-if="typeOfMap === 'cases'" class="extra-small-text font-weight-bold text-center">
									ΚΡΟΥΣΜΑΤΑ / {{ level === 'greece' ? '100K' : '1M' }} ΠΛΗΘΥΣΜΟΥ
								</v-col>
								<v-col v-else class="extra-small-text font-weight-bold text-center">
									ΘΑΝΑΤΟΙ / {{ level === 'greece' ? '100K' : '1M' }} ΠΛΗΘΥΣΜΟΥ
								</v-col>
							</v-row>
							<template v-for="(c, i) in colors">
								<span class="stop" :key="i" :style="'background-color:' + c"></span>
							</template>
							<v-row justify="space-between" align="center" class="my-0 py-0">
								<v-col class="extra-small-text font-weight-bold my-0 py-0">0</v-col>
								<v-col class="extra-small-text font-weight-bold text-center my-0 py-0">
									{{ stats.mean ? stats.mean.toFixed(2) : '-' }}
								</v-col>
								<v-col class="extra-small-text font-weight-bold text-right my-0 py-0">
									{{ stats.max ? stats.max.toFixed(2) : '-' }}
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</div>
		<v-tooltip top :position-x="x" :position-y="y" v-model="tooltip" transition="slide-y-reverse-transition" allow-overflow eager offset-overflow color="white" light max-width="280" content-class="pa-0 elevation-3">
			<div class="my-0 py-0 primary--text" v-html="tooltipText"></div>
		</v-tooltip>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { scaleThreshold } from 'd3';
import chroma from 'chroma-js';
import { findIndex, filter, uniq, max } from 'lodash';
import * as simple from 'simple-statistics';

export default {
	name: 'map-mapbox',
	props: ['level'],
	computed: {
		...mapGetters([
			'worldGeoJson', 'greeceGeoJson', 'greece', 'wom_data', 'globalData', 'greeceData'
		]),
		colors (n) {
			return chroma.scale('YlOrRd').mode('hsl').colors(12);
		}
	},
	data () {
		return {
			value: 0,
			isPlaying: false,
			interval: null,
			typeOfMap: 'deaths',

			map: null,
			bottomLayer: null,
			x: -200,
			y: -200,
			tooltip: false,
			tooltipText: '',
			dates: [],
			stats: {
				min: 0,
				mean: 0,
				max: 0
			}
		};
	},
	watch: {
		value (n, o) {
			if (n !== o) {
				this.setData();
			}
		},
		typeOfMap (n, o) {
			if (n !== o) {
				this.setData();
			}
		},
		level (n, o) {
			if (n !== o) {
				this.isPlaying = false;
				this.dates = n === 'admin-0' ? [...this.globalData[0].dates, new Date()] : [...this.greeceData[0].dates, new Date()];
				this.value = this.dates.length - 1;

				this.updateLayers(n);
				this.setPosition(
					n === 'greece' ? [23.7208298, 37.9908697] : [0, 30],
					n === 'greece' ? 4.5 : 2
				);
			}
		},
		isPlaying (n, o) {
			if (n !== o) {
				if (!n) {
					clearInterval(this.interval);
					return;
				} else {
					if (this.value === this.dates.length - 1) {
						this.value = 0;
					}
					this.interval = setInterval(() => {
						if (this.value === this.dates.length - 1) {
							this.isPlaying = false;
							return;
						} else {
							this.value++;
						}
					}, 500);
				}
			}
		}
	},
	mounted () {
		this.draw();
	},
	methods: {
		getColors (n) {
			return chroma.scale('YlOrRd').mode('hsl').colors(n);
		},
		getCKMeans (arr, n) {
			return simple.ckmeans(arr, n).map(v => v.pop());
		},
		togglePlay () {
			this.isPlaying = !this.isPlaying;
		},

		draw () {
			this.map = new this.$mapboxgl.Map({
				container: 'mapbox',
				style: 'mapbox://styles/trilikis/ck808u6u50uqs1iodusadk0ua',
				zoom: this.level === 'greece' ? 4.5 : 2,
				center: this.level === 'greece' ? [23.7208298, 37.9908697] : [0, 30],
				maxZoom: 15,
    			minZoom: 1,
				antialias: true,
				attributionControl: true,
				interactive: true
			});

			this.map.on('load', this.onLoad);
		},
		onLoad () {
			let layers = this.map.getStyle().layers;
			for (let i = 0; i < layers.length; i++) {
				if (layers[i].type === 'symbol') {
					this.bottomLayer = layers[i].id;
					break;
				}
			}

			this.map.style.stylesheet.layers.forEach((layer) => {
				if (layer.type === 'line' && layer['source-layer'] === 'road') {
					this.map.removeLayer(layer.id);
				}
			});

			this.dates = this.level === 'admin-0' ? [...this.globalData[0].dates, new Date()] : [...this.greeceData[0].dates, new Date()];
			this.addLayers();

			setTimeout(() => {
				this.value = this.dates.length;
			}, 1000);

			this.map.on('mousemove', this.onMouseMove);
			this.map.on('mouseleave', 'admin-0', this.onMouseLeave);
			this.map.on('mouseleave', 'okxe', this.onMouseLeave);
		},
		onMouseMove (e) {
			let region = this.map.queryRenderedFeatures(e.point, {
				layers: ['admin-0', 'okxe'],
			});

			if (region.length > 0 && (region[0].properties.TOOLTIP)) {
				this.map.getCanvas().style.cursor = 'pointer';
				this.x = e.point.x;
				this.y = e.point.y;
				this.tooltip = true;
				this.tooltipText = region[0].properties.TOOLTIP;
			}
		},
		onMouseLeave (e) {
			this.tooltip = false;
			this.tooltipText = '';
			this.map.getCanvas().style.cursor = '';
		},
		setData () {
			if (this.level === 'admin-0') {
				this.setDataWorld(this.value);
			} else {
				this.setDataGreece(this.value);
			}
		},

		setDataWorld (index) {
			if (!this.map) return;

			let arr = [];
			if (this.typeOfMap === 'deaths') {
				arr = this.wom_data.map(m => {
					return m.deathsIndex;
				});
				// if (this.value < this.dates.length - 1) {
				// 	arr = this.worldGeoJson.features.map(m => {
				// 		return m.properties.deathsIndex[this.value] ? m.properties.deathsIndex[this.value] : 0;
				// 	});
				// } else {
				// 	arr = this.wom_data.map(m => {
				// 		return m.deathsIndex;
				// 	});
				// }
			} else {
				arr = this.wom_data.map(m => {
					return m.totalIndex;
				});
				// if (this.value < this.dates.length - 1) {
				// 	arr = this.worldGeoJson.features.map(m => {
				// 		return m.properties.totalIndex[this.value] ? m.properties.totalIndex[this.value] : 0;
				// 	});
				// } else {
				// 	arr = this.wom_data.map(m => {
				// 		return m.totalIndex;
				// 	});
				// }
			}
			arr = uniq(arr);

			const ckm = this.getCKMeans(arr, arr.length >= 16 ? 16 : arr.length);
			this.stats.mean = ckm[Math.ceil(ckm.length / 2)] || null;
			this.stats.max = ckm[ckm.length - 1] || null;
			const scaleColorW = scaleThreshold().domain(uniq(ckm)).range(this.getColors(ckm.length >= 12 ? 12 : ckm.length + 1));
			this.worldGeoJson.features.forEach(f => {
				if (this.value < this.dates.length - 1) {
					f.properties.count = f.properties.cases[this.value] ? f.properties.cases[this.value] : 0;

					f.properties.DATE =  this.dates[this.value];
					f.properties.CASES = f.properties.cases[this.value] ? f.properties.cases[this.value] : 0;
					f.properties.DEATHS = f.properties.deaths[this.value] ? f.properties.deaths[this.value] : 0;
					f.properties.RECOVERED = f.properties.recovered[this.value] ? f.properties.recovered[this.value] : 0;
					f.properties.TOTALINDEX = f.properties.totalIndex[this.value] ? f.properties.totalIndex[this.value] : 0;
					f.properties.DEATHSINDEX = f.properties.deathsIndex[this.value] ? f.properties.deathsIndex[this.value] : 0;
					f.properties.UNKNOWN = null;
					f.properties.CRITICAL = null;
					f.properties.TOOLTIP = this.setWorldToolTip(f.properties);
					if (this.typeOfMap === 'deaths') {
						f.properties.opacity = f.properties.DEATHS === 0 ? 0 : 0.9;
						f.properties.color = scaleColorW(f.properties.DEATHSINDEX);
					} else {
						f.properties.opacity = f.properties.CASES === 0 ? 0 : 0.9;
						f.properties.color = scaleColorW(f.properties.TOTALINDEX);
					}
				} else {
					const idx_c = findIndex(this.wom_data, m => f.properties.ADMIN_GR === m.country);
					if (idx_c > -1) {
						f.properties.count = this.wom_data[idx_c].totalCases;

						f.properties.DATE = new Date();
						f.properties.CASES = this.wom_data[idx_c].totalCases ? this.wom_data[idx_c].totalCases : 0;
						f.properties.DEATHS = this.wom_data[idx_c].totalDeaths ? this.wom_data[idx_c].totalDeaths : 0;
						f.properties.RECOVERED = this.wom_data[idx_c].totalRecovered ? this.wom_data[idx_c].totalRecovered : 0;
						f.properties.TOTALINDEX = parseInt((f.properties.CASES * 1000000) / f.properties.pop_11);
						f.properties.DEATHSINDEX = parseInt((f.properties.DEATHS * 1000000) / f.properties.pop_11);
						f.properties.UNKNOWN = this.typeOfMap === 'deaths' ? filter(this.greece, m => m.county_normalized === 'ΕΛΛΑΔΑ')[0].dead: filter(this.greece, m => m.county_normalized === 'ΕΛΛΑΔΑ')[0].cases;
						f.properties.CRITICAL = filter(this.greece, m => m.county_normalized === 'ΕΛΛΑΔΑ')[0].critical;
						f.properties.TOOLTIP = this.setWorldToolTip(f.properties);

						if (this.typeOfMap === 'deaths') {
							f.properties.opacity = f.properties.DEATHS === 0 ? 0 : 0.9;
							f.properties.color = scaleColorW(f.properties.DEATHSINDEX);
						} else {
							f.properties.opacity = f.properties.CASES === 0 ? 0 : 0.9;
							f.properties.color = scaleColorW(f.properties.TOTALINDEX);
						}
					}
				}
			});

			if (this.map.getSource('admin-0')) {
				this.map.getSource('admin-0').setData(this.worldGeoJson);
			}
		},
		setWorldToolTip (data) {
			let text = '';
			text += `
			<div class="pa-2">
				<h5 class="caption grey--text px-2">${this.$moment(data.DATE).format('ll')}</h5>
				<h3 class="subtitle-2 pa-2 pt-0">${data.ADMIN_GR}</h3>
				<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
				<div class="row no-gutters justify-space-between">
					<h3 class="body-2 pa-2">Κρούσματα</h3>
					<h3 class="body-2 font-weight-bold pa-2">${new Intl.NumberFormat('el-GR').format(data.CASES) || '-'}</h3>
				</div>
				<!--<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
				<div class="row no-gutters justify-space-between">
					<h3 class="body-2 pa-2">Κρούσματα / 1Μ</h3>
					<h3 class="body-2 font-weight-bold pa-2">${new Intl.NumberFormat('el-GR').format(data.TOTALINDEX) || '-'}</h3>
				</div>-->
				<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
				<div class="row no-gutters justify-space-between">
					<h3 class="body-2 pa-2">Θάνατοι</h3>
					<h3 class="body-2 font-weight-bold red--text pa-2">${new Intl.NumberFormat('el-GR').format(data.DEATHS) || '-'}</h3>
				</div>
				<!--<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
				<div class="row no-gutters justify-space-between">
					<h3 class="body-2 pa-2">Θάνατοι / 1Μ</h3>
					<h3 class="body-2 font-weight-bold red--text pa-2">${new Intl.NumberFormat('el-GR').format(data.DEATHSINDEX) || '-'}</h3>
				</div>-->
				<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
				<div class="row no-gutters justify-space-between">
					<h3 class="body-2 pa-2">Ανάρρωσαν</h3>
					<h3 class="body-2 font-weight-bold pa-2">${new Intl.NumberFormat('el-GR').format(data.RECOVERED) || '-'}</h3>
				</div>
			`;
			if (data.NOTES !== '') {
				text += `
					<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
					<div class="row no-gutters justify-space-between">
						<h3 class="body-2 pa-2">${data.NOTES}</h3>
					</div>
				`;
			}

			if (data.ADMIN_GR === 'Ελλάδα' && data.UNKNOWN) {
				let k = '';
				if (this.typeOfMap === 'deaths') {
					k = data.UNKNOWN > 1 ? ' θάνατοι' : 'θάνατος';
				} else {
					k = data.UNKNOWN > 1 ? ' κρούσματα' : 'κρούσμα';
				}
				text += `
				<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
				<div class="row no-gutters justify-space-between">
					<h3 class="body-2 pa-2">Διασωληνωμένοι</h3>
					<h3 class="body-2 font-weight-bold pa-2">${new Intl.NumberFormat('el-GR').format(data.CRITICAL) || '-'}</h3>
				</div>
				<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
				<div class="row no-gutters justify-space-between">
					<h3 class="body-2 pa-2"><span class="font-weight-bold mr-1">${new Intl.NumberFormat('el-GR').format(data.UNKNOWN) || '-'}</span> ${ k } χωρίς γεωγραφικό προσδιορισμό</h3>
				</div>
				`;
			}

			text += '</div>';
			return text;
		},
		setDataGreece (index) {
			if (!this.map) return;
			let arr = [];
			if (this.typeOfMap === 'deaths') {
				arr = this.greece.map(m => {
					return m.deathsIndex;
				});
				// if (this.value < this.dates.length - 1) {
				// 	arr = this.greeceGeoJson.features.map(m => {
				// 		return m.properties.deathsIndex[this.value] ? m.properties.deathsIndex[this.value] : 0;
				// 	});
				// } else {
				// 	arr = this.greece.map(m => {
				// 		return m.deathsIndex;
				// 	});
				// }
			} else {
				arr = this.greece.map(m => {
					return m.totalIndex;
				});
				// if (this.value < this.dates.length - 1) {
				// 	arr = this.greeceGeoJson.features.map(m => {
				// 		return m.properties.totalIndex[this.value] ? m.properties.totalIndex[this.value] : 0;
				// 	});
				// } else {
				// 	arr = this.greece.map(m => {
				// 		return m.totalIndex;
				// 	});
				// }
			}
			arr = uniq(arr);

			const ckm = this.getCKMeans(arr, arr.length >= 16 ? 16 : arr.length);
			this.stats.mean = ckm[Math.ceil(ckm.length / 2)] || null;
			this.stats.max = ckm[ckm.length - 1] || null;
			const scaleColorW = scaleThreshold().domain(uniq(ckm)).range(this.getColors(ckm.length >= 12 ? 12 : ckm.length + 1));
			this.greeceGeoJson.features.forEach(f => {
				if (this.value < this.dates.length - 1) {
					f.properties.DATE =  this.dates[this.value];
					f.properties.CASES = f.properties.cases[this.value] ? f.properties.cases[this.value] : 0;
					f.properties.DEATHS = f.properties.deaths[this.value] ? f.properties.deaths[this.value] : 0;
					f.properties.TOTALINDEX = f.properties.totalIndex[this.value] ? parseFloat(f.properties.totalIndex[this.value]) : 0;
					f.properties.DEATHSINDEX = f.properties.deathsIndex[this.value] ? parseFloat(f.properties.deathsIndex[this.value]) : 0;
					f.properties.UNKNOWN = this.typeOfMap === 'deaths' ? filter(this.greeceData, m => m.country === 'ΕΛΛΑΔΑ')[0].deaths[this.value] : filter(this.greeceData, m => m.country === 'ΕΛΛΑΔΑ')[0].cases[this.value];
					f.properties.TOOLTIP = this.setGreeceToolTip(f.properties);

					if (this.typeOfMap === 'deaths') {
						f.properties.opacity = f.properties.DEATHS === 0 ? 0 : 0.9;
						f.properties.color = scaleColorW(f.properties.DEATHSINDEX);
					} else {
						f.properties.opacity = f.properties.CASES === 0 ? 0 : 0.9;
						f.properties.color = scaleColorW(f.properties.TOTALINDEX);
					}
				} else {
					f.properties.DATE = new Date();
					const idx_c = findIndex(this.greece, m => {
						return f.properties.ADMIN_GR === m.county;
					});
					if (idx_c > -1) {
						f.properties.CASES = this.greece[idx_c].cases ? this.greece[idx_c].cases : 0;
						f.properties.DEATHS = this.greece[idx_c].dead ? this.greece[idx_c].dead : 0;
						f.properties.HOSPITALIZED = this.greece[idx_c].hospitalized ? this.greece[idx_c].hospitalized : 0;
						f.properties.TOTALINDEX = parseFloat((f.properties.CASES * 100000) / f.properties.pop_11);
						f.properties.DEATHSINDEX = parseFloat((f.properties.DEATHS * 100000) / f.properties.pop_11);
						f.properties.UNKNOWN = this.typeOfMap === 'deaths' ? filter(this.greece, m => m.county_normalized === 'ΕΛΛΑΔΑ')[0].dead : filter(this.greece, m => m.county_normalized === 'ΕΛΛΑΔΑ')[0].cases;
						f.properties.TOOLTIP = this.setGreeceToolTip(f.properties);

						if (this.typeOfMap === 'deaths') {
							f.properties.opacity = f.properties.DEATHS === 0 ? 0 : 0.9;
							f.properties.color = scaleColorW(f.properties.DEATHSINDEX);
						} else {
							f.properties.opacity = f.properties.CASES === 0 ? 0 : 0.9;
							f.properties.color = scaleColorW(f.properties.TOTALINDEX);
						}
					}
				}
			});

			if (this.map.getSource('okxe')) {
				this.map.getSource('okxe').setData(this.greeceGeoJson);
			}
		},

		setGreeceToolTip (data) {
			let text = '';
			text += `
			<div class="pa-2 primary white--text border-top">
				<h5 class="caption grey--text px-2">${this.$moment(data.DATE).format('ll')}</h5>
				<h3 class="subtitle-2 pa-2 pt-0">${data.ADMIN_GR}</h3>
				<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
				<div class="row no-gutters justify-space-between">
					<h3 class="body-2 pa-2">Κρούσματα</h3>
					<h3 class="body-2 font-weight-bold pa-2">${new Intl.NumberFormat('el-GR').format(data.CASES) || '-'}</h3>
				</div>
				<!--<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
				<div class="row no-gutters justify-space-between">
					<h3 class="body-2 pa-2">Κρούσματα / 100K</h3>
					<h3 class="body-2 font-weight-bold pa-2">${new Intl.NumberFormat('el-GR').format(data.TOTALINDEX.toFixed(2)) || '-'}</h3>
				</div>-->

				<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
				<div class="row no-gutters justify-space-between">
					<h3 class="body-2 pa-2">Θάνατοι</h3>
					<h3 class="body-2 font-weight-bold red--text pa-2">${new Intl.NumberFormat('el-GR').format(data.DEATHS) || '-'}</h3>
				</div>
			</div>

			`;
			if (data.UNKNOWN) {
				let k = '';
				if (this.typeOfMap === 'deaths') {
					k = data.UNKNOWN > 1 ? ' θάνατοι' : 'θάνατος';
				} else {
					k = data.UNKNOWN > 1 ? ' κρούσματα' : 'κρούσμα';
				}
				text += `
				<div class="pa-2">
					<div class="row no-gutters justify-space-between">
						<h3 class="body-2 pa-2"><span class="font-weight-bold mr-1">${new Intl.NumberFormat('el-GR').format(data.UNKNOWN) || '-'}</span> ${ k } χωρίς γεωγραφικό προσδιορισμό</h3>
					</div>
				</div>
				`;
			}
			return text;
		},

		addLayers () {
			if (!this.map) return;

			this.map.addSource('admin-0', {
				type: 'geojson',
				data: null // this.worldGeoJson
			});

			this.map.addSource('okxe', {
				type: 'geojson',
				data: null // this.greeceGeoJson
			});

			this.map.addLayer({
				id: 'admin-0',
				type: 'fill',
				source: 'admin-0',
				layout: {
					visibility: this.level === 'admin-0' ? 'visible' : 'none'
				},
				paint: {
					'fill-color': {
						'type': 'identity',
						'property': 'color'
					},
					'fill-opacity': {
						'type': 'identity',
						'property': 'opacity'
					},
					'fill-outline-color': '#000'
				},
			}, this.bottomLayer);

			this.map.addLayer({
				id: 'okxe',
				type: 'fill',
				source: 'okxe',
				layout: {
					visibility: this.level === 'greece' ? 'visible' : 'none'
				},
				paint: {
					'fill-color': {
						'type': 'identity',
						'property': 'color'
					},
					'fill-opacity': {
						'type': 'identity',
						'property': 'opacity'
					},
					'fill-outline-color': '#000'
				},
			}, this.bottomLayer);

		},
		updateLayers (n) {
			if (!this.map) return;

			if (n === 'admin-0') {
				this.map.setLayoutProperty('okxe', 'visibility', 'none');
				this.map.setLayoutProperty('admin-0', 'visibility', 'visible');
				return;
			} else {
				this.map.setLayoutProperty('okxe', 'visibility', 'visible');
				this.map.setLayoutProperty('admin-0', 'visibility', 'none');
				return;
			}
		},
		setPosition (c, z) {
			if (!this.map) return;

			this.map.flyTo({
				center: c,
				zoom: z,
				essential: true
			});
		}
	}
};
</script>

<style lang="less">
#legend {
	display: block;
	position: fixed;

	right: 0;
	bottom: 0;

	transform: translate(-16px, -68px);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	z-index: 1;
	* > {
		line-height: 12px !important;
	}
	.v-label {
		font-size: 8px !important;
		line-height: 20px !important;
		margin-right: 0;
	}
	.stop {
		height: 6px;
		width: 15px;
		display: inline-block;
	}
}
#mapbox {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
.border-top {
	border-top-left-radius: 4px;
	border-top-right-radius: 4px;
}
.mapboxgl-ctrl-bottom-left, .mapboxgl-ctrl-bottom-right {
	bottom: 32px !important;
}
</style>
