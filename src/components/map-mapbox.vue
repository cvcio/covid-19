<template>
	<div>
		<div id="mapbox" class="mapbox"></div>
		<v-tooltip top :position-x="x" :position-y="y" v-model="tooltip" transition="slide-y-reverse-transition" allow-overflow eager offset-overflow color="white" light max-width="280" content-class="pa-4 elevation-3">
			<!-- <v-row no-gutters>
				<v-spacer></v-spacer>
				<v-btn icon small @click="tooltip=false">
					<v-icon small>mdi-close</v-icon>
				</v-btn>
			</v-row> -->
			<div class="mb-0 primary--text" v-html="tooltipText"></div>
		</v-tooltip>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { select, scaleLinear, scaleLog, scalePow, scaleQuantize } from 'd3';
import chroma from 'chroma-js';
import { maxBy, minBy, mean, findIndex, filter, sumBy } from 'lodash';
import { parse } from 'querystring';
export default {
	name: 'map-mapbox',
	props: ['level'],
	computed: {
		...mapGetters([
			'worldGeoJson', 'byCountry', 'greece',
		])
	},
	data () {
		return {
			map: null,
			bottomLayer: null,
			x: -200,
			y: -200,
			tooltip: false,
			tooltipText: ''
		};
	},
	watch: {
		level (n, o) {
			if (n !== o) {
				this.updateLayers(n);
				this.setPosition(
					n === 'greece' ? [23.7208298, 37.9908697] : [0, 30],
					n === 'greece' ? 5 : 2
				);
			}
		}
	},
	mounted () {
		this.draw();
	},
	methods: {
		median (arr) {
			let mid = Math.floor(arr.length / 2);
			let nums = [...arr].sort((a, b) => a - b);
			return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
		},
		draw () {
			this.map = new this.$mapboxgl.Map({
				container: 'mapbox',
				style: 'mapbox://styles/kk-id-lb/ck7vzxw0z02qn1iplhxaz3b5p',
				zoom: this.level === 'greece' ? 5 : 2,
				center: this.level === 'greece' ? [23.7208298, 37.9908697] : [0, 30],
				maxZoom: 15,
    			minZoom: 1,
				antialias: true,
				attributionControl: false,
				interactive: true
			});

			const maxValueW = maxBy(this.byCountry, m => m.count).count;
			const maxValueG = maxBy(this.greece, m => m.cases ? parseInt(m.cases) : 0).cases;
			const medianW = this.median(this.byCountry.map(m => m.count));
			const meanW = Math.floor(mean(this.byCountry.map(m => m.count)));

			console.log('MEAN', meanW, 'MEDIAN', medianW, 'MAX', maxValueW);

			const scaleOpacityW = scaleQuantize().domain([0, maxValueW]).range([0, 1]);
			const scaleOpacityG = scaleQuantize().domain([0, maxValueG]).range([0, 1]);

			const scaleColorW = chroma.scale(['#fafa6e', 'red', '#8b0000']).domain([1, meanW, maxValueW]);
			const scaleColorG = chroma.scale(['red', 'darkslateblue']).domain([1, maxValueG]);
			const scaleSizeG = scaleLinear()
				.domain([1, maxValueG])
				.range([8, 48]);


			this.map.on('load', () => {
				// Swap Symbol's layer z-index
				let layers = this.map.getStyle().layers;
				for (let i = 0; i < layers.length; i++) {
					if (layers[i].type === 'symbol') {
						this.bottomLayer = layers[i].id;
						break;
					}
				}

				this.worldGeoJson.features.forEach(f => {
					if (f.properties.ADMIN !== 'Greece') {
						const idx_c = findIndex(this.byCountry, m => f.properties.ADMIN_GR === m.country);
						if (idx_c > -1) {
							f.properties.count = this.byCountry[idx_c].count;
							f.properties.deaths = this.byCountry[idx_c].deaths;
							f.properties.recovered = this.byCountry[idx_c].recovered;
						}
					} else {
						f.properties.count = sumBy(this.greece, m => m.cases);
						f.properties.deaths = sumBy(this.greece, m => m.dead);
						f.properties.recovered = undefined;
					}
					f.properties.opacity = f.properties.count === 0 ? 0 : 0.7; // scaleOpacityW(f.properties.count);
					f.properties.color = scaleColorW(f.properties.count).hex();
				});

				this.map.addSource('greece', {
					type: 'geojson',
					data: {
						type: 'FeatureCollection',
						features: filter(this.greece, m => m.lat !== '' && m.lng !== '').map(m => {
							m.color = m.county_normalized === 'ΕΛΛΑΔΑ' ? 'rgba(17,75,95,0.8)' : 'rgba(60,80,80,0.7)'; // scaleColorG(parseInt(m.cases)).alpha(0.8).css();
							m.size = scaleSizeG(parseInt(m.cases));
							return {
								type: 'Feature',
								properties: m,
								geometry: {
									type: 'Point',
									coordinates: [parseFloat(m.lng), parseFloat(m.lat)]
								}
							};
						})
					}
				});

				this.map.addSource('admin-0', {
					type: 'geojson',
					data: this.worldGeoJson
				});

				this.addLayers();
				this.map.on('mousemove', (e) => {
					let region = this.map.queryRenderedFeatures(e.point, {
						layers: ['admin-0', 'greece']
					});

					if (region.length > 0 && (region[0].properties.count || region[0].properties.cases)) {
						this.x = e.point.x;
						this.y = e.point.y;
						this.tooltip = true;
						if (region[0].layer.id === 'admin-0') {
							this.tooltipText = `
								<h3 class="subtitle-2 pa-2">${region[0].properties.ADMIN_GR}</h3>
								<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
								<div class="row no-gutters justify-space-between">
									<h3 class="body-2 pa-2">Κρούσματα</h3>
									<h3 class="body-2 font-weight-bold pa-2">${new Intl.NumberFormat('el-GR').format(region[0].properties.count) || '-'}</h3>
								</div>
								<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
								<div class="row no-gutters justify-space-between">
									<h3 class="body-2 pa-2">Νεκροί</h3>
									<h3 class="body-2 font-weight-bold red--text pa-2">${new Intl.NumberFormat('el-GR').format(region[0].properties.deaths) || '-'}</h3>
								</div>
								<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
								<div class="row no-gutters justify-space-between">
									<h3 class="body-2 pa-2">Ανάρρωσαν</h3>
									<h3 class="body-2 font-weight-bold pa-2">${region[0].properties.recovered ? new Intl.NumberFormat('el-GR').format(region[0].properties.recovered) : '-'}</h3>
								</div>
							`;
							if (region[0].properties.ADMIN !== 'Greece') {
								this.tooltipText += `<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
								<div class="row no-gutters justify-space-between mt-3">
									<h3 class="body-2 pa-2 grey--text">Πηγή δεδομένων: Johns Hopkins University</h3>
								</div>`;
							}
						}
						if (region[0].layer.id === 'greece') {
							this.tooltipText = `
								<h3 class="subtitle-2 pa-2">${region[0].properties.county_normalized !== 'ΕΛΛΑΔΑ' ? region[0].properties['Γεωγραφικό Διαμέρισμα'] : ''} ${region[0].properties.county_normalized !== 'ΕΛΛΑΔΑ' ? 'Ν. ' : ''} ${region[0].properties.county}</h3>
								<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
								<div class="row no-gutters justify-space-between">
									<h3 class="body-2 pa-2">Κρούσματα</h3>
									<h3 class="body-2 font-weight-bold pa-2">${new Intl.NumberFormat('el-GR').format(region[0].properties.cases) || '-'}</h3>
								</div>
								<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
								<div class="row no-gutters justify-space-between">
									<h3 class="body-2 pa-2">Νεκροί</h3>
									<h3 class="body-2 font-weight-bold red--text pa-2">${new Intl.NumberFormat('el-GR').format(region[0].properties.dead) || '-'}</h3>
								</div>
								<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
								<div class="row no-gutters justify-space-between">
									<h3 class="body-2 pa-2">Νοσηλεύονται</h3>
									<h3 class="body-2 font-weight-bold pa-2">${new Intl.NumberFormat('el-GR').format(region[0].properties.hospitalized) || '-'}</h3>
								</div>
								<!--<hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
								<div class="row no-gutters justify-space-between mt-3">
									<h3 class="body-2 pa-2 grey--text">Πηγή δεδομένων: ΕΟΔΥ${region[0].properties.county_normalized !== 'ΕΛΛΑΔΑ' ? '' : '<br/>Ο ΕΟΔΥ δεν έχει ανακοινώσει γεωγραφική περιοχή' }</h3>
								</div>-->
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
				});
			});
		},
		addLayers () {
			if (!this.map) return;

			this.map.addLayer({
				id: 'admin-0',
				type: 'fill',
				source: 'admin-0',
				layout: {
					visibility: 'visible'
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
				}
			}, this.bottomLayer);

			this.map.addLayer({
				id: 'greece',
				type: 'circle',
				source: 'greece',
				layout: {
					visibility: 'visible'
				},
				paint: {
					'circle-stroke-color': '#fff',
					'circle-stroke-width': 1,
					'circle-color': {
						'type': 'identity',
						'property': 'color'
					},
					'circle-radius': {
						'type': 'identity',
						'property': 'size'
					}
				}
			});
		},
		updateLayers (n) {
			if (n === 'admin-0') {
				this.map.setLayoutProperty('greece', 'visibility', 'none');
				return;
			}
			this.map.setLayoutProperty('greece', 'visibility', 'visible');
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
#mapbox {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
</style>
