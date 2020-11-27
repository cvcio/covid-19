<template>
	<div id="map" class="d-block primary lighten-5" :class="$vuetify.breakpoint.smAndDown ? 'mobile' : 'desktop'">
		<v-btn-toggle class="key-toggle elevation-2" rounded dense v-model="mapKey">
			<v-btn text small class="font-weight-bold" value="cases">
				{{ $tc("cases", 1) | normalizeNFD }}
			</v-btn>
			<v-btn text small class="font-weight-bold" value="deaths">
				{{ $tc("deaths", 1) | normalizeNFD }}
			</v-btn>
			<!-- <v-btn text small class="font-weight-bold" value="active" v-if="mapLevel === 'global'">
				{{ $tc("active", 1) | normalizeNFD }}
			</v-btn> -->
		</v-btn-toggle>

		<v-scroll-y-reverse-transition>
			<div class="tooltip elevation-4" :style="'top:'+y+'px;left:'+x+'px;'" ref="tooltipGlobal" v-if="point !== null" v-show="tooltip && point !== null">
				<v-card class="elevation-0 white pa-0 arrow_box" min-width="180px">
					<v-card-title class="pa-2 subtitle-2">
						<span class="">
							{{ point["name_" + locale.code]}}
						</span>
					</v-card-title>
					<v-divider/>
					<v-card-subtitle class="pa-2">
						<h4 class="subtitle-2 primary--text text-capitalize primary--text">
							{{ $tc("cases", 1) }}:
							<span class="font-weight-bold">
								{{
									new Intl.NumberFormat('el-GR').format(point.data.vC.toFixed(2))
								}}
							</span>
						</h4>
						<h4 class="subtitle-2 primary--text text-capitalize secondary--text">
							{{ $tc("deaths", 1) }}:
							<span class="font-weight-bold">
								{{ new Intl.NumberFormat('el-GR').format(point.data.vD.toFixed(2)) }}
							</span>
						</h4>
					</v-card-subtitle>
					<v-divider/>
					<v-card-subtitle class="pa-2">
						<h4 class="subtitle-2 primary--text text-capitalize">
							{{ $t("7-day moving average") }}
						</h4>
						<sparklines class="d-block" :data="point.data['new_' + mapKey]" style="height: 60px;"/>
					</v-card-subtitle>
					<v-divider/>

					<template v-if="point.data.note">
						<v-card-subtitle class="pa-2" v-html="point.data.note"></v-card-subtitle>
						<v-divider/>
					</template>
					<v-card-subtitle class="pa-2">
						<h4 class="caption grey--text">{{ $tc("Source", point.data.sources.length) }}: <span class="text-uppercase font-weight-bold">{{ point.data.sources.join(', ') }}</span></h4>
					</v-card-subtitle>
				</v-card>
			</div>
		</v-scroll-y-reverse-transition>

		<div class="legend" :class="$vuetify.breakpoint.smAndDown ? 'center': ''">
			<v-row no-gutters>
				<v-col class="caption font-weight-bold" :class="$vuetify.breakpoint.smAndDown ? 'text-center' : ''">
					Per 100K of population
				</v-col>
			</v-row>
			<v-row no-gutters>
				<template v-for="(color, index) in colors">
					<v-col :key="'scale-'+index" class="scale" :style="'background-color: ' + color + ';'"></v-col>
				</template>
			</v-row>
			<v-row no-gutters>
				<v-col class="caption font-weight-bold">{{ new Intl.NumberFormat('el-GR').format(min.toFixed(2)) }}</v-col>
				<v-col class="caption font-weight-bold text-center">{{ new Intl.NumberFormat('el-GR').format(median.toFixed(2)) }}</v-col>
				<v-col class="caption font-weight-bold text-end">{{ new Intl.NumberFormat('el-GR').format(max.toFixed(2)) }}</v-col>
			</v-row>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import mapboxgl from 'mapbox-gl';
import { scaleThreshold } from 'd3-scale';
import * as colors from '@/helper/colors';
import { sum, mean } from 'lodash';

export default {
	name: 'map-view',
	components: {
		sparklines: require('@/components/charts/sparklines').default
	},
	computed: {
		...mapGetters(['locale']),
		...mapGetters('internal', ['geo']),
		...mapGetters('filters', ['mapLevel', 'mapSource', 'mapPeriod', 'mapPeriodIDX']),
		mapKey: {
			get () {
				return this.$store.state.filters.mapKey;
			},
			set (value) {
				this.$store.commit('filters/setMapKey', value);
			}
		}
	},
	watch: {
		mapLevel (value, old) {
			if (value !== old) {
				// this.resetFilters();
				this.load();
				this.updatePosition(
					this.mapLevel === 'greece' ? [23.7208298, 37.9908697] : [0, 30],
					this.mapLevel === 'greece' ? 4.5 : 2
				);
			}
		},
		mapKey (value, old) {
			if (value !== old) {
				this.load();
			}
		},
		mapPeriod (value, old) {
			if (value !== old) {
				this.load();
			}
		}
	},
	data () {
		return {
			map: null,
			bottomLayer: null,
			x: 0,
			y: 0,
			tooltip: true,
			point: null,
			min: 0,
			max: 0,
			median: 0,
			colors: []
		};
	},
	mounted () {
		if (this.geo) {
			console.debug('geo loaded from storage');
			this.load();
		} else {
			console.debug('request geo');
			this.$store.dispatch('internal/getGeo')
				.then(() => {
					this.load();
				});
		}
	},
	methods: {
		beforeDestroy () {
			if (!this.map) return;
			this.map.off('load', this.onLoad);
			this.map.off('data', this.onData);
			this.map.off('mouseenter', 'covid', this.onMouseEnter);
			this.map.off('mouseleave', 'covid', this.onMouseLeave);
			this.map = null;
		},
		resetFilters () {
			// set source
			// set periodInterval
			// set date
			// set key
			this.$store.commit('filters/setMapKey', 'cases');
			this.$store.commit('filters/setMapSource', 'covid');
			this.$store.commit('filters/setMapPeriod', this.$moment().subtract(14, 'days').format('YYYY-MM-DD'));
			if (this.mapLevel === 'global') {
				//
			} else {
				//
			}
		},
		load () {
			this.$store.dispatch('external/getMapData', { level: this.mapLevel, keys: this.mapKey, from: this.mapPeriod })
				.then(res => {
					const values = res.map(m => {
						let v = 0;
						if (this.mapPeriodIDX === 0) {
							v = m['new_' + this.mapKey][m['new_' + this.mapKey].length - 1];
						} else {
							v = sum(m['new_' + this.mapKey]);
						}
						return m.population > 0 ? (v / m.population) * 100000 : 0;
					});

					this.min = Math.min(...values);
					this.max = Math.max(...values, 1);
					this.median = mean([...values, 1]);
					this.colors = colors[this.mapKey + 'CS'];

					const palette = this.palette(this.min, this.max, this.colors);
					this.geo.features.map(m => {
						m.properties.active = false;
						m.properties.opacity = 0;
						m.properties.color = '#fafafa';
						if (m.properties.group === this.mapLevel) {
							const obj = res.find(o => o.uid === m.properties.uid);
							if (obj) {
								m.properties.data = obj;
								m.properties.data.vD = 0;
								m.properties.data.vC = 0;

								let v = [];
								if (this.mapPeriodIDX === 0) {
									m.properties.data.vD = obj.new_deaths[obj.new_deaths.length - 1];
									m.properties.data.vC = obj.new_cases[obj.new_cases.length - 1];
									v = obj['new_' + this.mapKey][obj['new_' + this.mapKey].length - 1];
								} else {
									m.properties.data.vD = sum(obj.new_deaths);
									m.properties.data.vC = sum(obj.new_cases);
									v = sum(obj['new_' + this.mapKey]);
								}

								m.properties.active = true;
								m.properties.color = obj.population > 0 ? palette((v / obj.population) * 100000) : palette(0);
								m.properties.opacity = v > 0 ? 0.9 : 0.9;

								if (m.properties.uid === 'EL300') {
									const unk = res.filter(m => m.geo_unit === '-').map(m => {
										let x = [];
										if (this.mapPeriodIDX === 0) {
											x = m['new_' + this.mapKey][m['new_' + this.mapKey].length - 1];
										} else {
											x = sum(m['new_' + this.mapKey]);
										}
										if (x <= 0) return;
										return `
											<h4 class="caption grey--text">${this.$t(m.region)}: <span class="text-uppercase font-weight-bold">
											${new Intl.NumberFormat('el-GR').format(x.toFixed(2))}</span></h4>
										`;
									});
									m.properties.data.note = unk.length > 0 ? unk.join('') : null;
								}
							}
						}
						return m;
					});

					if (this.map) {
						this.map.getSource(this.mapSource).setData(this.geo);
					} else {
						this.draw();
					}
				});
		},
		palette (min, max, colors) {
			const d = (max - min) / 12;
			return scaleThreshold()
				.range(colors)
				.domain([min + d * 1, min + d * 2, min + d * 3, min + d * 4, min + d * 5, min + d * 6, min + d * 7, min + d * 8, min + d * 9, min + d * 10, min + d * 11]);
		},
		draw () {
			mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kZWZpbmVkIiwiYSI6ImNpcWY2OHN5bDAwOHZpMWt4ODV2a2EzdnUifQ.q-XTbW4kXMSRhT5alQ2J4g';
			this.map = new mapboxgl.Map({
				container: 'map',
				style: 'mapbox://styles/mapbox/light-v10',
				zoom: this.mapLevel === 'greece' ? 4.5 : 2,
				center: this.mapLevel === 'greece' ? [23.7208298, 37.9908697] : [0, 30],
				maxZoom: 15,
				minZoom: 1,
				antialias: true,
				attributionControl: true,
				interactive: true,
				pitchWithRotate: false,
				dragRotate: false,
				touchZoomRotate: false
			});

			this.map.on('load', this.onLoad);
		},
		onLoad () {
			if (!this.map) return;

			const layers = this.map.getStyle().layers;
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

			this.addLayers();
		},
		addLayers () {
			if (!this.map) return;

			this.map.addSource('covid', {
				type: 'geojson',
				data: this.geo
			});

			this.map.addLayer({
				id: 'covid',
				type: 'fill',
				source: 'covid',
				// layout: {
				// 	visibility: this.level === 'admin-0' ? 'visible' : 'none'
				// },
				paint: {
					'fill-color': {
						type: 'identity',
						property: 'color'
					},
					'fill-opacity': {
						type: 'identity',
						property: 'opacity'
					},
					'fill-outline-color': 'rgba(0, 0, 0, 0.2)'
				}
			}, this.bottomLayer);

			this.map.addLayer({
				id: 'covid-border',
				type: 'line',
				source: 'covid',
				paint: {
					'line-color': 'black',
					'line-opacity': 0.9,
					'line-width': 1
				},
				filter: ['in', 'uid', '']
			}, this.bottomLayer);
			// , this.bottomLayer
			this.map.on('mousemove', 'covid', this.onMouseEnter);
			this.map.on('mouseleave', 'covid', this.onMouseLeave);
		},
		onData () {
			// if (!this.map) return;
		},
		onMouseEnter (e) {
			if (!this.map) return;

			this.x = e.point.x;
			this.y = e.point.y;

			const features = this.map.queryRenderedFeatures(e.point, {
				layers: ['covid']
			}).filter(m => m.properties.group === this.mapLevel);

			if (features.length) {
				this.map.setFilter('covid-border',
					['in', 'uid', features[0].properties.uid]
				);
				this.point = features[0].properties;
				this.point.data = JSON.parse(this.point.data);
				this.map.getCanvas().style.cursor = 'pointer';
				this.tooltip = true;
				// console.log(this.point);
			} else {
				this.map.getCanvas().style.cursor = '';
				this.tooltip = false;
				this.point = null;
			}
		},
		onMouseLeave () {
			// if (!this.map) return;

			this.map.getCanvas().style.cursor = '';
			this.tooltip = false;
			this.point = null;
		},
		onClick () {
			// if (!this.map) return;
		},
		updatePosition (coords = [0, 30], zoom = 2) {
			if (!this.map) return;

			this.map.flyTo({
				center: coords,
				zoom: zoom,
				essential: true,
				padding: { top: 0, bottom: 0, right: 0, left: Math.floor((window.innerWidth / 2) - 240) }
			});
		},
		updateData () {
			// if (!this.map) return;
		},
		toggleLayers () {
			// if (!this.map) return;
		}
	}
};
</script>

<style lang="less" scoped>
@import "~mapbox-gl/dist/mapbox-gl.css";

#map {
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	position: absolute;
	z-index: -1;
	border: none !important;
	canvas {
		border: none !important;
		outline: none !important;
	}

	.key-toggle {
		z-index: 1;
		top: 76px;
		left: 50%;
		transform: translate(-50%, 0);
		position: absolute;
	}

	.tooltip {
		z-index: 99999999999999999999;
		position: absolute;
		top: 0;
		left: 0;
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
	.legend {
		z-index: 1;
		width: 288px;
		position: absolute;
		right: 16px;
		bottom: 24px;
		.scale {
			width: 24px;
			height: 24px;
			content: '';
			display: block;
		}

		&.center {
			right: 50%;
			transform: translate(50%, 0);
		}
	}
}
</style>
