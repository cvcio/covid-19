<!--
	"el": "N1 (3a) - Χάρτης Θανάτων άνα Δήμο",
	"en": "N1 (3a) - Death Map per Municipality"
-->

<template>

	<v-container fluid class="max-width pa-0">
		<v-container fluid class="pa-0">
			<v-row no-gutters class="no-events">
				<div id="mapm-container" class="d-block blue-grey lighten-4"
					:class="$vuetify.breakpoint.smAndDown ? 'mobile' : 'desktop'">
					<template>
						<div id="map_deaths" class="d-block events" :class="
							[
								($vuetify.breakpoint.smAndDown ? 'mobile' : 'desktop'),
								($route.meta.iframe ? 'frame' : ''),
							].join(' ')
						">
							<v-btn-toggle class="key-toggle elevation-2" rounded mandatory dense v-model="mapYear"
								v-if="!$route.meta.iframe" :class="
									[
										($vuetify.breakpoint.smAndDown ? 'mobile' : 'desktop'),
										($route.meta.iframe ? 'mt-n12 frame' : ''),
									].join(' ')
								">
								<v-btn text small class="font-weight-bold" value="all"> {{ $t("All") }} </v-btn>
								<v-btn text small class="font-weight-bold" value="2021"> 2021 </v-btn>
								<v-btn text small class="font-weight-bold" value="2020"> 2020 </v-btn>
							</v-btn-toggle>

							<v-btn v-if="$route.meta.iframe" small
								class="font-weight-bold link-to-map mt-5 text-inherit white" rounded target="_blank"
								href="https://lab.imedd.org/covid19/">
								<v-icon x-small class="mr-2" color="primary">fa-link</v-icon>
								<span class="font-weight-bold">IMΕdD LAB</span>:
								<span class="text-capitalize">{{ $t('greece') }}</span>,
								<span class="text-capitalize" v-if="$route.query.mapYear !== 'all'">
									{{ $tc('deaths',1) }} {{ mapYear }}
								</span>
								<span class="text-capitalize" v-else>
									{{ $t('total deaths') }} 2020-2021
								</span>
							</v-btn>

							<v-btn v-if="!$route.meta.iframe" small
								class="font-weight-bold embed-map text-inherit primary" fab @click="setEmbed">
								<v-icon x-small>fa-code</v-icon>
							</v-btn>

							<!-- Map Tooltip -->
							<v-scroll-y-reverse-transition>
								<div class="tooltip elevation-4" :style="'top:' + y + 'px;left:' + x + 'px;'"
									ref="tooltipGlobal" v-if="point !== null" v-show="tooltip && point !== null">
									<v-card class="elevation-0 white pa-0 arrow_box" min-width="180px">

										<template>
											<v-card-title class="pa-2 subtitle-2">
												<h4 class="caption grey--text"> {{ $t("Municipality") }}
													<span class="text-uppercase font-weight-bold">
														{{ $t(point.data.slug) | normalizeNFD }}:
													</span>
												</h4>
											</v-card-title>
											<v-divider />

											<template v-for="item in point.data.deaths_tooltip">
												<v-card-title v-if="item.year != 'all'" class="pa-2 subtitle-2"> {{
													item.year
												}} </v-card-title>
												<v-card-title v-else="item.year !='all'" class="pa-2 subtitle-2"> {{
													$t('Total')
												}} </v-card-title>
												<v-card-subtitle class="pa-2">
													<h4 class="subtitle-2 primary--text text-capitalize primary--text">

														<span class="font-weight-bold text-lowercase">
															{{ item.number }}
															({{
																new	Intl.NumberFormat('el-GR').format(item.per_hundred.toFixed(2)) + ' ' + $t('Per 100K')
															}})
														</span>
													</h4>
												</v-card-subtitle>
												<v-divider />
											</template>

										</template>
									</v-card>
								</div>
							</v-scroll-y-reverse-transition>

							<!-- Map Legend -->
							<div class="legend" :class="$vuetify.breakpoint.smAndDown ? 'center' : ''">
								<v-row no-gutters>
									<v-col class="caption font-weight-bold"
										:class="$vuetify.breakpoint.smAndDown ? 'text-center' : ''">
										{{ $t("Per 100K of population") }}
									</v-col>
								</v-row>
								<v-row no-gutters>
									<template v-for="(color, index) in colors">
										<v-col :key="'scale-' + index" class="scale"
											:style="'background-color: ' + color + ';'"></v-col>
									</template>
								</v-row>
								<v-row no-gutters>
									<v-col class="caption font-weight-bold">{{
										new Intl.NumberFormat('el-GR').format(min.toFixed(2))
									}}
									</v-col>
									<v-col class="caption font-weight-bold text-center">
										{{ new Intl.NumberFormat('el-GR').format(median.toFixed(2)) }}</v-col>
									<v-col class="caption font-weight-bold text-end">
										{{ new Intl.NumberFormat('el-GR').format(max.toFixed(2)) }}
									</v-col>
								</v-row>
							</div>
						</div>
					</template>
					<!-- <app-header class="bellow-map no-events" v-if="$vuetify.breakpoint.smAndDown" /> -->
				</div>
			</v-row>
		</v-container>
	</v-container>

</template>

<script>
import { mapGetters } from 'vuex';
import mapboxgl from 'mapbox-gl';
import { scaleThreshold } from 'd3-scale';
import * as colors from '@/helper/colors';
import { sum, mean } from 'lodash';

export default {
	name: 'map-view-municipalities',
	components: {
		sparklines: require('@/components/charts/sparklines').default
	},
	computed: {
		...mapGetters(['locale']),
		...mapGetters('internal', ['geom']),
		embed() {
			return {
				title: '',
				subtitle: '',
				text: '',
				mapLevel: null,
				mapYear: 'all',
				mapType: 'deaths',
				mapKey: null,
				period: null,
				view: null,
				aggregation: null,
				lang: this.locale.code,
				id: 'map-view-municipalities'
			};
		}
	},
	watch: {
		mapYear(value, old) {
			if (value !== old && this.map && !this.$route.meta.iframe) {
				// this.load();
				this.reloadMap();
			}
		}
	},
	data() {
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
			colors: [],
			mapYear: 'all',
			mapKey: 'deaths'
		};
	},
	mounted() {
		if (this.$route.query.mapYear && this.$route.query.mapYear !== '') {
			this.mapYear = this.$route.query.mapYear
		}
		if (this.geom && this.geom.features) {
			// console.debug('geom loaded from storage');
			this.load();
		} else {
			// console.debug('request geom');
			this.$store.dispatch('internal/getGeoMunicipalities')
				.then(() => {
					this.load();
				});
		}
	},
	methods: {
		setEmbed() {
			this.$store.commit('setEmbedDialog', true);
			this.$store.commit('setEmbed', this.embed);
		},
		beforeDestroy() {
			if (!this.map) return;
			this.map.off('load', this.onLoad);
			this.map.off('mouseenter', 'covid', this.onMouseEnter);
			this.map.off('mouseleave', 'covid', this.onMouseLeave);
			this.map = null;
		},
		reloadMap() {
			const values = this.geom.features.map(m => {
				const deaths = m.properties.data.deaths.find(obj => { return obj.year == this.mapYear; });
				return m.properties.data.pop_11 > 0 ? (deaths.number / m.properties.data.pop_11) * 100000 : 0;
			});

			this.min = Math.min(...values);
			this.max = Math.max(...values, 1);
			this.median = mean([...values, 1]);
			this.colors = colors[this.mapKey + 'CS'];
			const palette = this.palette(this.min, this.max, this.colors);

			this.geom.features.map(m => {
				m.properties.active = true;
				m.properties.opacity = 1;
				m.properties.color = '#fafafa';

				const deaths = m.properties.data.deaths.find(m => { return m.year == this.mapYear; });
				m.properties.color = m.properties.data.pop_11 > 0 ? palette((deaths.number / m.properties.data.pop_11) * 100000) : palette(0);
				m.properties.opacity = deaths.number > 0 ? 0.9 : 0.6;

				return m;
			});

			if (this.map) {
				this.map.getSource('covid').setData(this.geom);
				this.updateLayers();
			} else {
				this.draw();
			}
		},
		loadCovidDeaths() {
			this.$store.dispatch('external/getMunicipalitiesData')
				.then(res => {
					const values = res.map(m => {
						const deaths = m.deaths.find(obj => { return obj.year == this.mapYear; });
						return m.pop_11 > 0 ? (deaths.number / m.pop_11) * 100000 : 0;
					});

					this.min = Math.min(...values);
					this.max = Math.max(...values, 1);
					this.median = mean([...values, 1]);
					this.colors = colors[this.mapKey + 'CS'];
					const palette = this.palette(this.min, this.max, this.colors);

					// Remove Municipality of "Athos"
					this.geom.features = this.geom.features.filter((el) => { return el.id != 'c7b5978b-aca9-4d74-b8a5-d3a48d02f6d0.1'; });
					// ----- -----

					this.geom.features.map(m => {
						m.properties.active = true;
						m.properties.opacity = 1;
						m.properties.color = '#fafafa';

						const obj = res.find(o => o.code == m.properties.KWD_YPES);
						if (obj) {

							m.properties.data = { ...obj };

							const deaths = m.properties.data.deaths.find(m => { return m.year == this.mapYear; });
							m.properties.color = m.properties.data.pop_11 > 0 ? palette((deaths.number / m.properties.data.pop_11) * 100000) : palette(0);
							m.properties.opacity = deaths.number > 0 ? 0.9 : 0.6;

							var deaths_tooltip = obj.deaths.map((item) => {
								return {
									...item,
									per_hundred: (item.number / m.properties.data.pop_11) * 100000
								}
							})
							m.properties.data['deaths_tooltip'] = deaths_tooltip.sort((a, b) => { return a.year - b.year; });
						}
						return m;
					});

					if (this.map) {
						this.map.getSource('covid').setData(this.geom);
						this.updateLayers();
					} else {
						this.draw();
					}
				});
		},
		updateLayers() {
			if (!this.map) return;
			this.map.setLayoutProperty('covid', 'visibility', 'visible');
		},
		load() {
			this.loadCovidDeaths();
		},
		palette(min, max, colors) {
			const d = (max - min) / 12;
			return scaleThreshold()
				.range(colors)
				.domain([min + d * 1, min + d * 2, min + d * 3, min + d * 4, min + d * 5, min + d * 6, min + d * 7, min + d * 8, min + d * 9, min + d * 10, min + d * 11]);
		},
		draw() {
			mapboxgl.accessToken = this.$APP_MAPBOX;
			const zoom = 5.2;//5.5;
			this.map = new mapboxgl.Map({
				container: 'map_deaths',
				style: this.$APP_MAPBOX_STYLE,
				zoom: zoom,
				center: [24.373363, 38.277534],//[26.173363, 38.277534],
				maxZoom: 15,
				minZoom: 1,
				antialias: true,
				attributionControl: true,
				interactive: true
			});
			this.map.on('load', this.onLoad);
		},
		onLoad() {
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
		addLayers() {
			if (!this.map) return;

			this.map.addSource('covid', {
				type: 'geojson',
				data: this.geom
			});
			this.addLayerCovid();

			window.addEventListener("resize", (event) => {
				this.updatePosition();
			});

			this.updatePosition();
		},
		addLayerCovid() {
			this.map.addLayer({
				id: 'covid',
				type: 'fill',
				source: 'covid',
				layout: {
					// visibility: this.mapSource === 'covid' ? 'visible' : 'none'
					visibility: 'visible'
				},
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
				},
				filter: ['==', 'active', true]
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
				filter: ['in', 'name_el', '']
			}, this.bottomLayer);
			this.map.on('mousemove', 'covid', this.onMouseEnterC);
			this.map.on('mouseleave', 'covid', this.onMouseLeaveC);
		},
		onMouseEnterC(e) {
			if (!this.map) return;

			this.x = e.point.x;
			this.y = e.point.y;

			let features = [];
			features = this.map.queryRenderedFeatures(e.point);
			if (features.length > 0) {
				var pointFeatures = features.find(obj => {
					return obj.source === 'covid';
				});
				this.map.setFilter('covid-border',
					['in', 'NAME', pointFeatures.properties.NAME]
				);
				this.point = pointFeatures.properties;
				this.point.data = JSON.parse(this.point.data);
				this.map.getCanvas().style.cursor = 'pointer';
				this.tooltip = true;
			} else {
				this.map.getCanvas().style.cursor = '';
				this.tooltip = false;
				this.point = null;
			}
		},

		onMouseLeaveC() {
			if (!this.map) return;

			this.map.getCanvas().style.cursor = '';
			this.map.setFilter('covid-border',
				['in', 'uid', '']
			);
			this.tooltip = false;
			this.point = null;
		},
		updatePosition(coords = [24.373363, 38.277534], zoom = 5.5) {

			if (!this.map) return;

			zoom = 5.2;

			this.map.flyTo({
				center: coords,
				zoom: this.$vuetify.breakpoint.smAndDown ? 0.9 * zoom : zoom,
				essential: true,
				// padding: { top: 0, bottom: 0, left: (this.$vuetify.breakpoint.smAndDown || this.$route.meta.iframe ? 0 : 360), right: 0 }
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import "~mapbox-gl/dist/mapbox-gl.css";

#map_deaths {
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	position: absolute;
	border: none !important;

	canvas {
		border: none !important;
		outline: none !important;
	}

	.link-to-map {
		position: absolute;
		z-index: 1;
		right: 24px;
		top: 0;
	}

	&.mobile {
		.link-to-map {
			// top: 172px;
			right: 50%;
			transform: translate(50%, 0);
		}
	}

	&.frame {
		top: 0;
	}

	.embed-map {
		position: absolute;
		z-index: 1;
		right: 24px;
		top: 12px;

		&.mobile {
			top: 172px;
		}
	}

	.key-toggle {
		z-index: 1;
		top: 16px;
		left: 50%;
		transform: translate(-50%, 0);
		position: absolute;

		&.frame {
			left: 24px;
			top: 68px;
			transform: translate(0, 0);
		}

		&.mobile {
			// top: 172px;
			left: 50%;
			transform: translate(-50%, 0);

			&.frame {
				top: 120px;
			}

			;
		}
	}

	.tooltip {
		z-index: 99999999999999999999;
		position: absolute;
		top: 0;
		left: 0;
		transform: translate(-50%, -105%);

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

#mapm-container {
	position: relative;
	width: 100%;
	height: 90vh;
	z-index: 0;

	&.mobile {
		height: 70vh;
		// height: calc(100vh - 56px);
	}

	.top-offset {
		margin-top: 76px;
	}

	.map .tooltip {
		z-index: 1002;
		position: fixed;
	}

	.bellow-map {
		z-index: 1;
		position: relative;
	}

	;
}
</style>
