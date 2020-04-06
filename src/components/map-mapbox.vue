<template>
	<div>
		<div id="mapbox" class="mapbox"></div>
		<div id="legend">
			<!-- <v-row no-gutters class="">
				<v-col>
					<v-card class="" width="224">
						<v-card-text>
							<v-row no-gutters justify="center" align="center" class="mt-3">
								<v-col class="text-left">
									<span class="title font-weight-light">
										{{ $moment(dates[value]).format('ll') }}
									</span>
								</v-col>
								<v-col class="text-right">
									<v-btn
										:color="isPlaying ? 'accent' : 'primary'"
										dark
										depressed
										fab
										@click="togglePlay"
									>
										<v-icon large>
										{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}
										</v-icon>
									</v-btn>
								</v-col>
							</v-row>
							<v-slider
								v-model="value"
								min="0"
								:max="dates.length"
								label=""
								inverse-label
								hide-details
								always-dirty
							></v-slider> -->

							<v-row no-gutters justify="center" align="center" class="mt-3">
								<v-col class="extra-small-text font-weight-bold text-center">
									ΚΡΟΥΣΜΑΤΑ / {{ level === 'greece' ? '100K' : '1M' }} ΠΛΗΘΥΣΜΟΥ
								</v-col>
							</v-row>
							<template v-for="(c, i) in colors">
								<span class="stop" :key="i" :style="'background-color:' + c"></span>
							</template>
							<v-row justify="space-between" align="center" class="my-0 py-0">
								<v-col class="extra-small-text font-weight-bold my-0 py-0">0</v-col>
								<v-col v-if="level !== 'greece'" class="extra-small-text font-weight-bold text-center my-0 py-0">
									{{ metrics.meanWorld.toFixed() }}
								</v-col>
								<v-col v-else class="extra-small-text font-weight-bold text-center my-0 py-0">
									{{ metrics.meanGreece.toFixed() }}
								</v-col>
								<v-col v-if="level !== 'greece'" class="extra-small-text font-weight-bold text-right my-0 py-0">
									{{ metrics.maxWorld.toFixed() }}
								</v-col>
								<v-col v-else class="extra-small-text font-weight-bold text-right my-0 py-0">
									{{ metrics.maxGreece.toFixed() }}
								</v-col>
							</v-row>
						<!-- </v-card-text>
					</v-card>
				</v-col>
			</v-row> -->
		</div>
		<v-tooltip top :position-x="x" :position-y="y" v-model="tooltip" transition="slide-y-reverse-transition" allow-overflow eager offset-overflow color="white" light max-width="280" content-class="pa-0 elevation-3">
			<div class="my-0 py-0 primary--text" v-html="tooltipText"></div>
		</v-tooltip>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { scaleQuantile, scaleLinear } from 'd3';
import chroma from 'chroma-js';
import { findIndex, filter, sumBy, cloneDeep, find, debounce } from 'lodash';
import * as simple from 'simple-statistics';

export default {
	name: 'map-mapbox',
	props: ['level'],
	computed: {
		...mapGetters([
			'worldGeoJson', 'greeceGeoJson', 'greece', 'wom_data', 'globalData'
		]),
		colors () {
			return chroma.scale('OrRd').mode('hsl').colors(48);
		},
		kmeansWorld () {
			return simple.ckmeans(this.wom_data.map(m => m.totalIndex), 48).map(v => v.pop());
		},
		kmeansGreece () {
			return simple.ckmeans(this.greece.map(m => m.totalIndex), 24).map(v => v.pop());
		},
		metrics () {
			return {
				meanWorld: this.kmeansWorld[Math.ceil(this.kmeansWorld.length / 2)],
				meanGreece: this.kmeansGreece[Math.ceil(this.kmeansGreece.length / 2)],
				maxWorld: this.kmeansWorld[this.kmeansWorld.length - 1],
				maxGreece: this.kmeansGreece[this.kmeansGreece.length - 1]
			};
		},

		dates () {
			return [...this.globalData[0].dates, new Date()];
		},

		data () {
			const f = cloneDeep(this.globalData).map(m => {
				m.cases = m.cases[this.value];
				m.deaths = m.deaths[this.value];
				m.recovered = m.recovered[this.value];
				return m;
			});
			return f;
		}
	},
	data () {
		return {
			value: 0,
			isPlaying: false,
			interval: null,

			map: null,
			bottomLayer: null,
			x: -200,
			y: -200,
			tooltip: false,
			tooltipText: '',

		};
	},
	watch: {
		value (n, o) {
			if (n !== o) {
				// this.setData();
			}
		},
		level (n, o) {
			if (n !== o) {
				// this.setData();
				this.updateLayers(n);
				this.setPosition(
					n === 'greece' ? [23.7208298, 37.9908697] : [0, 30],
					n === 'greece' ? 5 : 2
				);
			}
		},
		isPlaying (n, o) {
			if (n !== o) {
				if (!n) {
					clearInterval(this.interval);
					return;
				} else {
					this.interval = setInterval(() => {
						if (this.value === this.dates.length - 1) {
							this.value = 0;
						} else {
							this.value++;
						}
					}, 1000);
				}
			}
		}
	},
	mounted () {
		this.draw();
	},
	methods: {
		togglePlay () {
			this.isPlaying = !this.isPlaying;
		},

		draw () {
			if (!this.$mapboxgl.supported()) {
				console.log('Your browser does not support Mapbox GL');
				return;
			}
			this.map = new this.$mapboxgl.Map({
				container: 'mapbox',
				style: 'mapbox://styles/trilikis/ck808u6u50uqs1iodusadk0ua',
				zoom: this.level === 'greece' ? 5 : 2,
				center: this.level === 'greece' ? [23.7208298, 37.9908697] : [0, 30],
				maxZoom: 15,
    			minZoom: 1,
				antialias: true,
				attributionControl: true,
				interactive: true
			});

			console.debug(
				'WORLD KMEANS', this.kmeansWorld
			);

			console.debug(
				'GREECE KMEANS', this.kmeansGreece
			);

			const scaleColorW = scaleQuantile().domain(this.kmeansWorld).range(this.colors);
			const scaleColorG = scaleQuantile().domain(this.kmeansGreece).range(this.colors);

			this.map.on('load', () => {
				// Swap Symbol's layer z-index
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

				this.worldGeoJson.features.forEach(f => {
					const idx_c = findIndex(this.wom_data, m => f.properties.ADMIN_GR === m.country);
					if (f.properties.ADMIN !== 'Greece') {
						if (idx_c > -1) {
							f.properties.count = this.wom_data[idx_c].totalCases;
							f.properties.deaths = this.wom_data[idx_c].totalDeaths;
							f.properties.recovered = this.wom_data[idx_c].totalRecovered;
							f.properties.totalIndex = this.wom_data[idx_c].totalIndex;
							f.properties.deathsIndex = this.wom_data[idx_c].deathsIndex;
						}
					} else {
						f.properties.count = sumBy(this.greece, m => m.cases);
						f.properties.deaths = sumBy(this.greece, m => m.dead);
						f.properties.recovered = filter(this.greece, m => m.county_normalized === 'ΕΛΛΑΔΑ')[0].recovered;
						f.properties.critical = filter(this.greece, m => m.county_normalized === 'ΕΛΛΑΔΑ')[0].critical;
						f.properties.hospitalized = sumBy(this.greece, 'hospitalized');
						f.properties.unknown = filter(this.greece, m => m.county_normalized === 'ΕΛΛΑΔΑ')[0].cases;
						f.properties.totalIndex = this.wom_data[idx_c].totalIndex;
						f.properties.deathsIndex = 1;
					}

					f.properties.opacity = f.properties.count === 0 ? 0.2 : 0.9;
					// scaleOpacityW(f.properties.count);
					f.properties.color = scaleColorW(f.properties.totalIndex);
				});

				this.greeceGeoJson.features.forEach(f => {
					const idx_c = findIndex(this.greece, m => {
						return f.properties.NAME_GR === 'Ν. ' + m.county_normalized;
					});
					if (idx_c > -1) {
						f.properties.ADMIN_GR = this.greece[idx_c].county;
						f.properties.count = this.greece[idx_c].cases;
						f.properties.cases = this.greece[idx_c].cases;
						f.properties.deaths = this.greece[idx_c].dead;
						f.properties.recovered = this.greece[idx_c].recovered;
						f.properties.critical = this.greece[idx_c].critical;
						f.properties.hospitalized = this.greece[idx_c].hospitalized;
						f.properties.totalIndex = this.greece[idx_c].totalIndex;
					} else {
						f.properties.ADMIN_GR = '';
						f.properties.count = 0;
						f.properties.totalIndex = 0;
					}

					f.properties.gr_count = sumBy(this.greece, m => m.cases);
					f.properties.gr_deaths = sumBy(this.greece, m => m.dead);
					f.properties.gr_recovered = filter(this.greece, m => m.county_normalized === 'ΕΛΛΑΔΑ')[0].recovered;
					f.properties.gr_critical = filter(this.greece, m => m.county_normalized === 'ΕΛΛΑΔΑ')[0].critical;
					f.properties.gr_hospitalized = sumBy(this.greece, 'hospitalized');
					f.properties.gr_unknown = filter(this.greece, m => m.county_normalized === 'ΕΛΛΑΔΑ')[0].cases;

					f.properties.opacity = f.properties.count === 0 ? 0.2 : 0.9;
					// scaleOpacityW(f.properties.count);
					f.properties.color = scaleColorG(f.properties.totalIndex) || 'grey';
				});


				this.addLayers();

				this.map.on('mousemove', (e) => {
					let region = this.map.queryRenderedFeatures(e.point, {
						layers: ['admin-0', 'okxe'],
					});

					if (region.length > 0 &&
						region[0].properties.totalIndex &&
						(region[0].properties.count || region[0].properties.cases)) {
						this.map.getCanvas().style.cursor = 'pointer';
						this.x = e.point.x;
						this.y = e.point.y;
						this.tooltip = true;
						if (region[0].layer.id === 'admin-0') {
							this.tooltipText = `
							<div class="pa-2">
								<h3 class="subtitle-2 pa-2">${region[0].properties.ADMIN_GR}</h3>
								<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
								<div class="row no-gutters justify-space-between">
									<h3 class="body-2 pa-2">Κρούσματα</h3>
									<h3 class="body-2 font-weight-bold pa-2">${new Intl.NumberFormat('el-GR').format(region[0].properties.count) || '-'}</h3>
								</div>
								<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
								<div class="row no-gutters justify-space-between">
									<h3 class="body-2 pa-2">Κρούσματα / 1Μ</h3>
									<h3 class="body-2 font-weight-bold pa-2">${new Intl.NumberFormat('el-GR').format(region[0].properties.totalIndex) || '-'}</h3>
								</div>
								<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
								<div class="row no-gutters justify-space-between">
									<h3 class="body-2 pa-2">Θάνατοι</h3>
									<h3 class="body-2 font-weight-bold red--text pa-2">${new Intl.NumberFormat('el-GR').format(region[0].properties.deaths) || '-'}</h3>
								</div>
							`;
							if (region[0].properties.ADMIN !== 'Greece') {
								this.tooltipText += `
								<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
								<div class="row no-gutters justify-space-between">
									<h3 class="body-2 pa-2">Ανάρρωσαν</h3>
									<h3 class="body-2 font-weight-bold pa-2">${region[0].properties.recovered ? new Intl.NumberFormat('el-GR').format(region[0].properties.recovered) : '-'}</h3>
								</div>
								<!--<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
								<div class="row no-gutters justify-space-between mt-3">
									<h3 class="body-2 pa-2 grey--text">Πηγή δεδομένων: Johns Hopkins University</h3>
								</div>-->
								</div>`;
							} else {
								// this.tooltipText += `<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
								// <div class="row no-gutters justify-space-between">
								// 	<h3 class="body-2 pa-2">Νοσηλεύονται</h3>
								// 	<h3 class="body-2 font-weight-bold pa-2">${new Intl.NumberFormat('el-GR').format(region[0].properties.hospitalized) || '-'}</h3>
								// </div>`;
								this.tooltipText += `<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
								<div class="row no-gutters justify-space-between">
									<h3 class="body-2 pa-2">Διασωληνωμένοι</h3>
									<h3 class="body-2 font-weight-bold pa-2">${new Intl.NumberFormat('el-GR').format(region[0].properties.critical) || '-'}</h3>
								</div>`;
								this.tooltipText += `<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
								<div class="row no-gutters justify-space-between">
									<h3 class="body-2 pa-2">Εξιτήρια</h3>
									<h3 class="body-2 font-weight-bold pa-2">${new Intl.NumberFormat('el-GR').format(region[0].properties.recovered) || '-'}</h3>
								</div>`;
								this.tooltipText += `<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
								<div class="row no-gutters justify-space-between">
									<h3 class="body-2 pa-2"><span class="font-weight-bold mr-1">${region[0].properties.unknown ? new Intl.NumberFormat('el-GR').format(region[0].properties.unknown) : '-'}</span> κρούσματα χωρίς γεωγραφικό προσδιορισμό</h3>
								</div>
								</div>`;
							}
						}
						if (region[0].layer.id === 'okxe') {
							this.tooltipText = `
								<div class="pa-2 primary white--text border-top">
									<h3 class="subtitle-2 pa-2">${region[0].properties.ADMIN_GR}</h3>
									<hr role="separator" aria-orientation="horizontal" class="v-divider theme--dark">
									<div class="row no-gutters justify-space-between">
										<h3 class="body-2 pa-2">Κρούσματα</h3>
										<h3 class="body-2 font-weight-bold pa-2">${region[0].properties.cases ? new Intl.NumberFormat('el-GR').format(region[0].properties.cases) : '-'}</h3>
									</div>
									<hr role="separator" aria-orientation="horizontal" class="v-divider theme--dark">
									<div class="row no-gutters justify-space-between">
										<h3 class="body-2 pa-2">Κρούσματα / 100K</h3>
										<h3 class="body-2 font-weight-bold pa-2">${region[0].properties.totalIndex ? new Intl.NumberFormat('el-GR').format(region[0].properties.totalIndex.toFixed(2)) : '-'}</h3>
									</div>
									<hr role="separator" aria-orientation="horizontal" class="v-divider theme--dark">
									<div class="row no-gutters justify-space-between">
										<h3 class="body-2 pa-2">Θάνατοι</h3>
										<h3 class="body-2 font-weight-bold red--text pa-2">${region[0].properties.deaths ? new Intl.NumberFormat('el-GR').format(region[0].properties.deaths) : '-'}</h3>
									</div>
									<!--<hr role="separator" aria-orientation="horizontal" class="v-divider theme--dark">
									<div class="row no-gutters justify-space-between">
										<h3 class="body-2 pa-2">Νοσηλεύονται</h3>
										<h3 class="body-2 font-weight-bold pa-2">${region[0].properties.hospitalized ? new Intl.NumberFormat('el-GR').format(region[0].properties.hospitalized) : '-'}</h3>
									</div>-->
								</div>
							`;

							this.tooltipText += `
							<div class="pa-2"
								<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
								<div class="row no-gutters justify-space-between">
									<h3 class="body-2 pa-2"><span class="font-weight-bold mr-1">${region[0].properties.gr_unknown ? new Intl.NumberFormat('el-GR').format(region[0].properties.gr_unknown) : '-'}</span> κρούσματα χωρίς γεωγραφικό προσδιορισμό</h3>
								</div>
								</div>
							`;
						}
					} else {
						this.tooltip = false;
						this.tooltipText = '';
					}
				});
				this.map.on('mouseleave', 'admin-0', (e) => {
					this.tooltip = false;
					this.tooltipText = '';
					this.map.getCanvas().style.cursor = '';
				});

				this.map.on('mouseleave', 'okxe', (e) => {
					this.tooltip = false;
					this.tooltipText = '';
					this.map.getCanvas().style.cursor = '';
				});
			});
		},

		// draw () {
		// 	if (!this.$mapboxgl.supported()) {
		// 		console.log('Your browser does not support Mapbox GL');
		// 		return;
		// 	}

		// 	this.map = new this.$mapboxgl.Map({
		// 		container: 'mapbox',
		// 		style: 'mapbox://styles/trilikis/ck808u6u50uqs1iodusadk0ua',
		// 		zoom: this.level === 'greece' ? 5 : 2,
		// 		center: this.level === 'greece' ? [23.7208298, 37.9908697] : [0, 30],
		// 		maxZoom: 15,
    	// 		minZoom: 1,
		// 		antialias: true,
		// 		attributionControl: true,
		// 		interactive: true
		// 	});

		// 	this.map.on('load', () => {
		// 		let layers = this.map.getStyle().layers;
		// 		for (let i = 0; i < layers.length; i++) {
		// 			if (layers[i].type === 'symbol') {
		// 				this.bottomLayer = layers[i].id;
		// 				break;
		// 			}
		// 		}

		// 		this.map.style.stylesheet.layers.forEach((layer) => {
		// 			if (layer.type === 'line' && layer['source-layer'] === 'road') {
		// 				this.map.removeLayer(layer.id);
		// 			}
		// 		});

		// 		this.addLayers();
		// 		setTimeout(() => {
		// 			this.value = this.globalData[0].dates.length;
		// 		}, 1000);
		// 		this.map.on('mousemove', (e) => {
		// 			let region = this.map.queryRenderedFeatures(e.point, {
		// 				layers: ['admin-0', 'okxe'],
		// 			});
		// 			if (region.length > 0 && (region[0].properties.count || region[0].properties.cases)) {
		// 				this.map.getCanvas().style.cursor = 'pointer';
		// 				this.x = e.point.x;
		// 				this.y = e.point.y;
		// 				this.tooltip = true;

		// 				if (region[0].layer.id === 'admin-0') {
		// 					// let point = find(this.globalData, ['country', region[0].properties.ADMIN_GR]);
		// 					// if (point) {
		// 					this.tooltipText = `
		// 					<div class="pa-2">
		// 						<h3 class="subtitle-2 pa-2">${region[0].properties.ADMIN_GR}</h3>
		// 						<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
		// 						<div class="row no-gutters justify-space-between">
		// 							<h3 class="body-2 pa-2">Κρούσματα</h3>
		// 							<h3 class="body-2 font-weight-bold pa-2">${new Intl.NumberFormat('el-GR').format(region[0].properties.CASES) || '-'}</h3>
		// 						</div>
		// 						<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
		// 						<div class="row no-gutters justify-space-between">
		// 							<h3 class="body-2 pa-2">Κρούσματα / 1Μ</h3>
		// 							<h3 class="body-2 font-weight-bold pa-2">${new Intl.NumberFormat('el-GR').format(region[0].properties.TOTALINDEX) || '-'}</h3>
		// 						</div>
		// 						<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
		// 						<div class="row no-gutters justify-space-between">
		// 							<h3 class="body-2 pa-2">Θάνατοι</h3>
		// 							<h3 class="body-2 font-weight-bold red--text pa-2">${new Intl.NumberFormat('el-GR').format(region[0].properties.DEATHS) || '-'}</h3>
		// 						</div>
		// 					`;
		// 					if (region[0].properties.ADMIN !== 'Greece') {
		// 						this.tooltipText += `
		// 						<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
		// 						<div class="row no-gutters justify-space-between">
		// 							<h3 class="body-2 pa-2">Ανάρρωσαν</h3>
		// 							<h3 class="body-2 font-weight-bold pa-2">${new Intl.NumberFormat('el-GR').format(region[0].properties.RECOVERED) || '-'}</h3>
		// 						</div>
		// 						</div>`;
		// 					} else {
		// 						// Greece Tooltip
		// 					}
		// 					// }
		// 				} else if (region[0].layer.id === 'greece') {
		// 					// Greece Choropleth
		// 				}
		// 			} else {
		// 				this.tooltip = false;
		// 				this.tooltipText = '';
		// 				this.map.getCanvas().style.cursor = '';
		// 			}
		// 		});
		// 		this.map.on('mouseleave', 'admin-0', (e) => {
		// 			this.tooltip = false;
		// 			this.tooltipText = '';
		// 			this.map.getCanvas().style.cursor = '';
		// 		});
		// 		this.map.on('mouseleave', 'okxe', (e) => {
		// 			this.tooltip = false;
		// 			this.tooltipText = '';
		// 			this.map.getCanvas().style.cursor = '';
		// 		});
		// 	});
		// },
		// setData () {
		// 	if (!this.map) return;
		// 	// let arr = simple.ckmeans(this.globalData.map(m => m.totalIndex[this.value]), 48).map(v => v.pop());
		// 	const scaleColorW = scaleLinear().domain(this.kmeansWorld).range(this.colors);
		// 	this.worldGeoJson.features.forEach(f => {
		// 		f.properties.count = f.properties.cases[this.value] ? f.properties.cases[this.value] : 0;
		// 		f.properties.opacity = f.properties.count === 0 ? 0 : 0.9;
		// 		f.properties.color = f.properties.totalIndex[this.value] ?
		// 			scaleColorW(f.properties.totalIndex[this.value]) : scaleColorW(0);

		// 		f.properties.CASES = f.properties.cases[this.value] ? f.properties.cases[this.value] : 0;
		// 		f.properties.DEATHS = f.properties.deaths[this.value] ? f.properties.deaths[this.value] : 0;
		// 		f.properties.RECOVERED = f.properties.recovered[this.value] ? f.properties.recovered[this.value] : 0;
		// 		f.properties.TOTALINDEX = f.properties.totalIndex[this.value] ? f.properties.totalIndex[this.value] : 0;
		// 	});
		// 	if (this.map.getSource('admin-0')) {
		// 		this.map.getSource('admin-0').setData(this.worldGeoJson);
		// 	}
		// },
		scaleColor (v, arr) {
			return scaleQuantile()
				.domain(this.kmeansWorld)
				.range(this.colors)(v);
		},
		addLayers () {
			if (!this.map) return;

			this.map.addSource('admin-0', {
				type: 'geojson',
				data: this.worldGeoJson
			});

			this.map.addSource('okxe', {
				type: 'geojson',
				data: this.greeceGeoJson
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
	bottom: 72px;
	left: 50%;
	width: 192px;
	height: 24px;
	transform: translate(-50%, -50%);
	z-index: 1;
	.stop {
		height: 12px;
		width: 4px;
		float: left;
		// border-right: 1px solid white;
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
