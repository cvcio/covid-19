<template>
	<div id="map" class="d-block"
		:class="
			[
				($vuetify.breakpoint.smAndDown ? 'mobile' : 'desktop'),
				($route.meta.iframe ? 'frame' : ''),
			].join(' ')
		">
		<v-btn-toggle class="key-toggle elevation-2" rounded mandatory dense v-model="mapKey" v-if="!$route.meta.iframe && mapSource === 'covid'"
			:class="
				[
					($vuetify.breakpoint.smAndDown ? 'mobile' : 'desktop'),
					($route.meta.iframe ? 'mt-n12 frame' : ''),
				].join(' ')
			">
			<v-btn text small class="font-weight-bold" value="cases">
				{{ $tc("cases", 1) | normalizeNFD }}
			</v-btn>
			<v-btn text small class="font-weight-bold" value="deaths">
				{{ $tc("deaths", 1) | normalizeNFD }}
			</v-btn>
		</v-btn-toggle>

		<v-btn v-if="$route.meta.iframe" small class="font-weight-bold link-to-map mt-5 text-inherit white" rounded target="_blank" href="https://lab.imedd.org/" >
			<v-icon x-small class="mr-2" color="primary">fa-link</v-icon>
			<span class="font-weight-bold">IMΕdD LAB</span>:
			<span class="text-capitalize">{{$t(mapLevel)}}</span>,
			<span class="text-capitalize">{{$tc(mapKey, 1)}}</span>,
			<span class="text-capitalize">{{mapPeriodIDX > 0 ? $moment(mapPeriod).format('ll') + ' - ' + $moment().format('ll'): $moment().format('ll')}}</span>
		</v-btn>

		<v-btn v-if="!$route.meta.iframe" small class="font-weight-bold embed-map text-inherit primary" fab @click="setEmbed">
			<v-icon x-small>fa-code</v-icon>
		</v-btn>

		<v-scroll-y-reverse-transition>
			<div class="tooltip elevation-4" :style="'top:'+y+'px;left:'+x+'px;'" ref="tooltipGlobal" v-if="point !== null" v-show="tooltip && point !== null">
				<v-card class="elevation-0 white pa-0 arrow_box" min-width="180px">
					<v-card-title class="pa-2 subtitle-2">
						<span class="text-uppercase">
							{{
								mapPeriodIDX > 0 ? $moment(point.data.from).format("ll") + ' - ': ''
							}}
							{{
								$moment(point.data.to).format("ll")
							}}
						</span>
					</v-card-title>
					<v-divider/>
					<v-card-title class="pa-2 subtitle-2">
						<span class="text-uppercase">
							{{ point["name_" + locale.code] | normalizeNFD }}
						</span>
					</v-card-title>
					<v-divider/>
					<template v-if="mapSource === 'covid'">
						<v-card-subtitle class="pa-2">
							<h4 class="subtitle-2 primary--text text-capitalize primary--text">
								{{ $tc("cases", 1) }}:
								<span class="font-weight-bold text-lowercase">
									{{
										new Intl.NumberFormat('el-GR').format(point.data.vC.toFixed(2))
									}}
									({{
										new Intl.NumberFormat('el-GR').format(point.data.vIC.toFixed(2)) + ' ' + $t('Per 100K')
									}})
								</span>
							</h4>
							<h4 class="subtitle-2 primary--text text-capitalize secondary--text">
								{{ $tc("deaths", 1) }}:
								<!-- <span class="font-weight-bold" v-if="mapPeriodIDX < 3 && mapLevel === 'greece'">
									- ({{ $t('No Data') }})
								</span>
								<span class="font-weight-bold" v-else>
									{{ new Intl.NumberFormat('el-GR').format(point.data.vD.toFixed(2)) }}
								</span> -->
								<span class="font-weight-bold text-lowercase">
									{{ new Intl.NumberFormat('el-GR').format(point.data.vD.toFixed(2)) }}
									({{
										new Intl.NumberFormat('el-GR').format(point.data.vID.toFixed(2)) + ' ' + $t('Per 100K')
									}})
								</span>
							</h4>
						</v-card-subtitle>
						<v-divider/>
						<template v-if="mapPeriodIDX > 0">
							<v-card-subtitle class="pa-2">
								<h4 class="subtitle-2 primary--text text-capitalize">
									{{ $t("7-Day Moving Average") }}
								</h4>
								<sparklines class="d-block" :data="point.data['new_' + mapKey]" id="sparklines" style="height: 60px;"/>
							</v-card-subtitle>
							<v-divider/>
						</template>

						<template v-if="point.data.note">
							<v-card-subtitle class="pa-2">
								<template v-for="(m, i) in point.data.note">
									<h4 :key="'unk-' + i">
										<h4 class="caption grey--text">
											{{ $t(m.region) }}:
										<span class="text-uppercase font-weight-bold">
											{{ new Intl.NumberFormat('el-GR').format(m.value.toFixed(2)) }}
										</span></h4>
									</h4>
								</template>
							</v-card-subtitle>
							<v-divider/>
						</template>
					</template>
					<template v-else-if="mapSource === 'vaccines'">
						<v-card-subtitle class="pa-2">
							<h4 class="subtitle-2 primary--text text-capitalize primary--text">
								{{ $t("Vaccinated People") }}:
								<span class="font-weight-bold text-lowercase">
									{{
										new Intl.NumberFormat('el-GR').format(point.data.vP.toFixed(2))
									}}
									({{
										new Intl.NumberFormat('el-GR').format(point.data.vIP.toFixed(2)) + '% ' + $t('local population')
									}})
								</span>
							</h4>
							<h4 class="subtitle-2 primary--text text-capitalize primary--text">
								{{ $t("Vaccinations") }}:
								<span class="font-weight-bold text-lowercase">
									{{
										new Intl.NumberFormat('el-GR').format(point.data.vS.toFixed(2))
									}}
								</span>
							</h4>
						</v-card-subtitle>
						<v-divider/>
					</template>
					<v-card-subtitle class="pa-2">
						<h4 class="caption grey--text">{{ $t("Source") }}: <span class="font-weight-bold">{{ point.data.sources.map(m => m.toUpperCase().replace('IMEDD', 'iMEdD LAB')).join(', ') }}</span></h4>
					</v-card-subtitle>
				</v-card>
			</div>
		</v-scroll-y-reverse-transition>

		<div class="legend" :class="$vuetify.breakpoint.smAndDown ? 'center': ''">
			<v-row no-gutters>
				<v-col class="caption font-weight-bold" :class="$vuetify.breakpoint.smAndDown ? 'text-center' : ''">
					{{ $t("Per 100K of population")}}
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
		...mapGetters('filters', [
			'mapLevel', 'mapSource',
			'mapPeriod', 'mapPeriodIDX',
			'mapVaccinationsPeriod', 'mapVaccinationsPeriodIDX'
		]),
		mapKey: {
			get () {
				return this.$store.state.filters.mapKey;
			},
			set (value) {
				this.$store.commit('filters/setMapKey', value);
			}
		},
		embed () {
			return {
				title: '',
				subtitle: '',
				text: '',
				mapKey: this.mapKey,
				mapLevel: this.mapLevel,
				period: this.mapPeriodIDX,
				view: null,
				aggregation: null,
				availablePeriods: [
					{
						text: { en: 'Last day', el: 'Τελευταία ημέρα' },
						value: 0
					},
					{
						text: { en: 'Last 14 days', el: 'Τελευταίες 14 ημέρες' },
						value: 1
					},
					{
						text: { en: 'Last 3 months', el: 'Τελευταίο τρίμηνο' },
						value: 2
					},
					{
						text: { en: 'Historical data', el: 'Από την αρχή' },
						value: 3
					}
				],
				lang: this.locale.code,
				id: 'map-view'
			};
		}
	},
	watch: {
		mapLevel (value, old) {
			if (value !== old && this.map && !this.$route.meta.iframe) {
				// this.resetFilters();
				this.load();
				if (this.mapSource === 'covid') {
					this.updatePosition(
						this.mapLevel === 'greece' ? [23.7208298, 37.9908697] : [0, 30],
						this.mapLevel === 'greece' ? 5.5 : 2.5
					);
				}
			}
		},
		mapKey (value, old) {
			if (value !== old && this.map && !this.$route.meta.iframe) {
				this.load();
			}
		},
		mapPeriod (value, old) {
			if (value !== old && this.map && !this.$route.meta.iframe) {
				this.load();
			}
		},
		mapVaccinationsPeriod (value, old) {
			if (value !== old && this.map && !this.$route.meta.iframe) {
				this.load();
			}
		},
		mapSource (value, old) {
			if (value !== old && this.map && !this.$route.meta.iframe) {
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
		if (this.$route.query.mapLevel && this.$route.query.mapLevel !== '') {
			this.$store.commit('filters/setMapLevel', this.$route.query.mapLevel);
		}
		if (this.$route.query.period && this.$route.query.period !== '') {
			this.$store.commit('filters/setMapPeriodFromIDX', parseInt(this.$route.query.period));
		}
		if (this.$route.query.period && this.$route.query.period !== '') {
			this.$store.commit('filters/setMapVaccinationsPeriodFromIDX', parseInt(this.$route.query.period));
		}
		if (this.$route.query.mapKey && this.$route.query.mapKey !== '') {
			this.$store.commit('filters/setMapKey', this.$route.query.mapKey);
		}
		if (this.geo && this.geo.features) {
			console.debug('geo loaded from storage');
			this.load();
		} else {
			console.debug('request geo');
			this.$store.dispatch('internal/getGeo')
				.then(() => {
					console.log(this.geo);
					this.load();
				});
		}
	},
	methods: {
		setEmbed () {
			this.$store.commit('setEmbedDialog', true);
			this.$store.commit('setEmbed', this.embed);
		},
		beforeDestroy () {
			if (!this.map) return;
			this.map.off('load', this.onLoad);
			this.map.off('mouseenter', 'covid', this.onMouseEnter);
			this.map.off('mouseleave', 'covid', this.onMouseLeave);
			this.map.off('mouseenter', 'vaccines', this.onMouseEnter);
			this.map.off('mouseleave', 'vaccines', this.onMouseLeave);
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
			this.$store.commit('filters/setMapVaccinationsPeriod', '2020-01-01');
			if (this.mapLevel === 'global') {
				//
			} else {
				//
			}
		},
		loadCovid () {
			this.$store.dispatch('external/getMapData', { level: this.mapLevel, keys: this.mapKey, from: this.mapPeriod })
				.then(res => {
					const values = res.map(m => {
						let v = 0;
						if (this.mapPeriodIDX === 0) {
							if (m.cases.length > 1 && m.cases[0] === m.cases[1]) {
								v = m['new_' + this.mapKey][m['new_' + this.mapKey].length - 2];
							} else {
								v = m['new_' + this.mapKey][m['new_' + this.mapKey].length - 1];
							}
						} else {
							v = sum(m['new_' + this.mapKey]);
						}
						return m.population > 0 ? (v / m.population) * 100000 : 0;
					});

					this.min = Math.min(...values);
					this.max = Math.max(...values, 1);
					this.median = mean([...values, 1]);
					this.colors = colors[this.mapKey + 'CS'];
					let palette = this.palette(this.min, this.max, this.colors);
					this.geo.features.map(m => {
						m.properties.active = false;
						m.properties.opacity = 0;
						m.properties.color = '#fafafa';
						let unk = [];
						if (typeof m.properties.uid === 'string' && m.properties.uid.substring(0, 2) !== 'EL') return m;
						if (this.mapKey === 'deaths' && this.mapLevel === 'greece') {
							if (m.properties.uid === 300) {
								m.properties.active = true;

								let cs = [];
								if (this.mapPeriodIDX === 0) {
									cs = res.map(n => n.new_deaths[n.new_deaths.length - 1]);
								} else {
									cs = res.map(n => sum(n.new_deaths));
								}
								const v = sum(cs);

								m.properties.data = {
									sources: ['imedd']
								};
								m.properties.data.vD = 0;
								m.properties.data.vC = 0;

								if (this.mapPeriodIDX === 0) {
									m.properties.data.vD = sum(res.map(n => n.new_deaths[n.new_deaths.length - 1]).flat());
									m.properties.data.vC = sum(res.map(n => n.new_cases[n.new_cases.length - 1]).flat());
									m.properties.data.new_deaths = [];
									m.properties.data.new_cases = [];
								} else {
									var s = (r, a) => r.map((b, i) => a[i] + b);
									m.properties.data.vD = sum(res.map(n => sum(n.new_deaths)).flat());
									m.properties.data.vC = sum(res.map(n => sum(n.new_cases)).flat());
									m.properties.data.new_deaths = res.map(n => n.new_deaths).reduce(s);
									m.properties.data.new_cases = res.map(n => n.new_cases).reduce(s);
								}
								m.properties.data.vIC = (m.properties.data.vC / m.properties.population) * 100000;
								m.properties.data.vID = (m.properties.data.vD / m.properties.population) * 100000;

								this.min = 0;
								this.max = v;
								palette = this.palette(0, v * 2, this.colors);
								m.properties.color = this.colors[5];
								m.properties.opacity = v > 0 ? 0.6 : 0.9;
							}
						} else {
							if (m.properties.group === this.mapLevel) {
								if (m.properties.group === 'greece') {
									unk = res.filter(m => m.geo_unit === '-').map(m => {
										let x = [];
										if (this.mapPeriodIDX === 0) {
											x = m['new_' + this.mapKey][m['new_' + this.mapKey].length - 1];
										} else {
											x = sum(m['new_' + this.mapKey]);
										}
										if (x <= 0) return false;
										if (!m.region) return false;
										return {
											region: m.region,
											value: x
										};
									});
								}

								const obj = res.find(o => o.uid === m.properties.uid);
								if (obj) {
									m.properties.data = obj;
									m.properties.data.vD = 0;
									m.properties.data.vC = 0;
									m.properties.data.vIC = 0;

									let v = [];
									if (this.mapPeriodIDX === 0) {
										if (obj.cases.length > 1 && obj.cases[0] === obj.cases[1]) {
											m.properties.data.vD = obj.new_deaths[obj.new_deaths.length - 2];
											m.properties.data.vC = obj.new_cases[obj.new_cases.length - 2];
											v = obj['new_' + this.mapKey][obj['new_' + this.mapKey].length - 2];
										} else {
											m.properties.data.vD = obj.new_deaths[obj.new_deaths.length - 1];
											m.properties.data.vC = obj.new_cases[obj.new_cases.length - 1];
											v = obj['new_' + this.mapKey][obj['new_' + this.mapKey].length - 1];
										}
									} else {
										m.properties.data.vD = sum(obj.new_deaths);
										m.properties.data.vC = sum(obj.new_cases);
										v = sum(obj['new_' + this.mapKey]);
									}

									m.properties.data.vIC = (m.properties.data.vC / obj.population) * 100000;
									m.properties.data.vID = (m.properties.data.vD / obj.population) * 100000;

									m.properties.active = true;
									m.properties.color = obj.population > 0 ? palette((v / obj.population) * 100000) : palette(0);
									m.properties.opacity = v > 0 ? 0.9 : 0.6;

									if (m.properties.group === 'greece') {
										m.properties.data.note = unk.filter(m => !!m); // unk.length > 0 ? unk.join('') : null;
									}
								}
							}
						}

						return m;
					});

					if (this.map) {
						this.map.getSource('covid').setData(this.geo);
						this.updateLayers(this.mapSource);
					} else {
						this.draw();
					}
				});
		},
		loadVaccines () {
			this.$store.dispatch('external/getGRVaccinesAGG', { from: this.mapVaccinationsPeriodIDX > 0 ? this.mapVaccinationsPeriod : this.$moment().subtract(2, 'days').format('YYYY-MM-DD') })
				.then(res => {
					console.log(res);

					const values = res.map(m => {
						const v = sum(m.new_total_distinct_persons);
						return m.population > 0 ? (v / m.population) * 100000 : 0;
					});

					this.min = Math.min(...values);
					this.max = Math.max(...values, 1);
					this.median = mean([...values, 1]);
					this.colors = colors.vaccinesCS;
					const palette = this.palette(this.min, this.max, this.colors);
					this.geo.features.map(m => {
						m.properties.active = false;
						m.properties.opacity = 0;
						m.properties.color = '#fafafa';

						const obj = res.find(o => o.uid === m.properties.areaid || o.uid === m.properties.uid);
						if (m.properties.group === 'greece') {
							if (obj) {
								m.properties.data = obj;
								m.properties.data.vP = 0;
								m.properties.data.vIP = 0;
								m.properties.data.vS = 0;

								let vP = [];
								let vS = [];
								if (this.mapVaccinationsPeriodIDX === 0) {
									if (obj.new_total_distinct_persons.length > 1 && obj.new_total_distinct_persons[0] === obj.new_total_distinct_persons[1]) {
										vP = obj.new_total_distinct_persons[obj.new_total_distinct_persons.length - 2];
										vS = obj.new_total_vaccinations[obj.new_total_vaccinations.length - 2];
									} else {
										vP = obj.new_total_distinct_persons[obj.new_total_distinct_persons.length - 1];
										vS = obj.new_total_vaccinations[obj.new_total_vaccinations.length - 1];
									}
								} else {
									vP = sum(obj.new_total_distinct_persons);
									vS = sum(obj.new_total_vaccinations);
								}
								m.properties.active = true;
								m.properties.data.vP = vP;
								m.properties.data.vIP = (m.properties.data.vP / obj.population) * 100;
								m.properties.data.vS = vS;
								m.properties.color = obj.population > 0 ? palette((vP / obj.population) * 100000) : palette(0);
								m.properties.opacity = vP > 0 ? 0.9 : 0.6;
							} else {
							}
						}

						return m;
					});

					if (this.map) {
						this.map.getSource('covid').setData(this.geo);
						this.updateLayers(this.mapSource);
					} else {
						this.draw();
					}
				});
		},
		updateLayers (n) {
			if (!this.map) return;
			if (n === 'vaccines') {
				this.map.setLayoutProperty('covid', 'visibility', 'none');
				this.map.setLayoutProperty('vaccines', 'visibility', 'visible');
				// this.addLayerVaccines();
				// this.map.removeLayer('covid');
				// this.map.removeLayer('covid-border');
			} else {
				this.map.setLayoutProperty('covid', 'visibility', 'visible');
				this.map.setLayoutProperty('vaccines', 'visibility', 'none');
				// this.addLayerCovid();
				// this.map.removeLayer('vaccines');
				// this.map.removeLayer('vaccines-border');
			}
		},
		load () {
			if (this.mapSource === 'covid') {
				this.loadCovid();
			} else if (this.mapSource === 'vaccines') {
				this.loadVaccines();
			}
		},
		palette (min, max, colors) {
			const d = (max - min) / 12;
			return scaleThreshold()
				.range(colors)
				.domain([min + d * 1, min + d * 2, min + d * 3, min + d * 4, min + d * 5, min + d * 6, min + d * 7, min + d * 8, min + d * 9, min + d * 10, min + d * 11]);
		},
		draw () {
			mapboxgl.accessToken = this.$APP_MAPBOX;
			const zoom = this.mapLevel === 'greece' ? 5.5 : 2.5;
			this.map = new mapboxgl.Map({
				container: 'map',
				style: this.$APP_MAPBOX_STYLE,
				zoom: zoom,
				center: this.mapLevel === 'greece' ? [23.7208298, 37.9908697] : [0, 30],
				maxZoom: 15,
				minZoom: 1,
				antialias: true,
				attributionControl: true,
				interactive: true
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
			this.addLayerCovid();
			this.addLayerVaccines();

			this.updatePosition();
		},
		addLayerCovid () {
			this.map.addLayer({
				id: 'covid',
				type: 'fill',
				source: 'covid',
				layout: {
					visibility: this.mapSource === 'covid' ? 'visible' : 'none'
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
		addLayerVaccines () {
			this.map.addLayer({
				id: 'vaccines',
				type: 'fill',
				source: 'covid',
				layout: {
					visibility: this.mapSource === 'vaccines' ? 'visible' : 'none'
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
				id: 'vaccines-border',
				type: 'line',
				source: 'covid',
				paint: {
					'line-color': 'black',
					'line-opacity': 0.9,
					'line-width': 1
				},
				filter: ['in', 'name_el', '']
			}, this.bottomLayer);
			this.map.on('mousemove', 'vaccines', this.onMouseEnterV);
			this.map.on('mouseleave', 'vaccines', this.onMouseLeaveV);
		},
		onMouseEnterC (e) {
			if (!this.map) return;

			this.x = e.point.x;
			this.y = e.point.y;

			let features = [];
			features = this.map.queryRenderedFeatures(e.point, {
				layers: ['covid']
			}).filter(m => this.mapKey === 'deaths' && this.mapLevel === 'greece' ? m.properties.uid === 300 : m.properties.group === this.mapLevel);

			if (features.length > 0) {
				this.map.setFilter('covid-border',
					['in', 'name_el', features[0].properties.name_el]
				);
				this.point = features[0].properties;
				this.point.data = JSON.parse(this.point.data);
				this.map.getCanvas().style.cursor = 'pointer';
				this.tooltip = true;
			} else {
				this.map.getCanvas().style.cursor = '';
				this.tooltip = false;
				this.point = null;
			}
		},

		onMouseEnterV (e) {
			if (!this.map) return;

			this.x = e.point.x;
			this.y = e.point.y;

			let features = [];
			features = this.map.queryRenderedFeatures(e.point, {
				layers: ['vaccines']
			}).filter(m => m.properties.group === 'greece');

			if (features.length > 0) {
				this.map.setFilter('vaccines-border',
					['in', 'name_el', features[0].properties.name_el]
				);
				this.point = features[0].properties;

				this.point.data = JSON.parse(this.point.data);
				this.map.getCanvas().style.cursor = 'pointer';
				this.tooltip = true;
			} else {
				this.map.getCanvas().style.cursor = '';
				this.tooltip = false;
				this.point = null;
			}
		},

		onMouseLeaveC () {
			if (!this.map) return;

			this.map.getCanvas().style.cursor = '';
			this.map.setFilter('covid-border',
				['in', 'uid', '']
			);
			this.tooltip = false;
			this.point = null;
		},
		onMouseLeaveV () {
			if (!this.map) return;

			this.map.getCanvas().style.cursor = '';
			this.map.setFilter('vaccines-border',
				['in', 'uid', '']
			);
			this.tooltip = false;
			this.point = null;
		},
		updatePosition (coords = [23.7208298, 37.9908697], zoom = 5.5) {
			if (!this.map) return;

			this.map.flyTo({
				center: coords,
				zoom: this.$vuetify.breakpoint.smAndDown ? 0.9 * zoom : zoom,
				essential: true,
				padding: { top: 0, bottom: 0, left: (this.$vuetify.breakpoint.smAndDown ? 0 : 360), right: 0 }
				// speed: this.$vuetify.breakpoint.smAndDown ? 0 : 5
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import "~mapbox-gl/dist/mapbox-gl.css";

#map {
	top: 64px;
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
		top: 160px;
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
			};
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
</style>
