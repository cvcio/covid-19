<template>
	<v-container fluid class="pa-0" v-scroll="onScroll">
		<v-container fluid class="pa-0">
			<v-row no-gutters>
				<div id="map-container" class="d-block grey">
					<v-row class="top-offset px-3 mb-0" no-gutters>
						<v-col cols="12" sm="6" md="5" lg="4" xl="2" class="">
							<v-card class="secondary" dark>
								<v-card-title class="text-h5 py-2">
									<span class="slab font-weight-thin">COVID&mdash;</span>
									<span class="slab font-weight-black">19</span>
								</v-card-title>
								<v-divider class="white ml-4" />
								<v-card-subtitle class="body-1 white--text py-2">
									The spread of the disease in Greece and worldwide
								</v-card-subtitle>
							</v-card>
						</v-col>
					</v-row>
					<v-row class="px-3 mt-8" no-gutters>
						<v-col cols="12" sm="6" md="5" lg="4" xl="2" class="">
							<h6 class="caption text-end">last update: {{ $moment().format('LLL') }}</h6>
							<v-card class="transparent" light>
								<v-tabs
										v-model="tab"
										background-color="transparent"
										grow
										slider-color="transparent elevation-0"
									>
									<v-btn icon tile rounded class="primary mb-1 mr-1 elevation-2" width="44" height="44">
										<v-icon class="" small color="white">
											fa-sliders-h
										</v-icon>
									</v-btn>
									<v-tab class="mr-1 white rounded-t" active-class="grey lighten-3">Greece</v-tab>
									<v-tab class="ml-1 white rounded-t" active-class="grey lighten-3">World</v-tab>
								</v-tabs>
								<v-tabs-items v-model="tab">
									<v-tab-item>
										<v-card flat>
											<v-container fluid class="px-0">
												<v-row class="px-4" align="center">
													<v-col cols="7">
														<v-switch dense hide-details class="pt-0">
															<template v-slot:label>
																<span class="subtitle-2 font-weight-bold">COVID—19</span>
															</template>
														</v-switch>
													</v-col>
													<v-col cols="5">
														<v-select hide-details prepend-icon="" class="pt-0" label="filter" color="primary">
															<template v-slot:prepend>
																<v-icon small class="mt-1" color="primary">
																	fa-clock
																</v-icon>
															</template>
														</v-select>
													</v-col>
												</v-row>
												<!-- <v-row class="px-4" align="center">
													<v-col cols="12">
														<v-btn-toggle class="d-flex">
															<v-btn text x-small class="text-lowercase" color="primary" style="width: 50%;" active-class="grey lighten-3">Cases</v-btn>
															<v-btn text x-small class="text-lowercase" color="primary" style="width: 50%;" active-class="grey lighten-3">Deaths</v-btn>
														</v-btn-toggle>
													</v-col>
												</v-row> -->
												<v-row class="px-4" align="center" no-gutters>
													<v-col cols="12" class="primary--opac pa-2 mb-1">
														<h4 class="text-h5 font-weight-bold grey--text">
															<span class="primary--text">99.999.999</span> / <span class="">99.999.999</span>
														</h4>
														<p class="caption small-caption text-uppercase primary--text mb-0">
															cases / total cases
														</p>
													</v-col>
													<v-col cols="12" class="secondary--opac pa-2">
														<h4 class="text-h5 font-weight-bold grey--text">
															<span class="secondary--text">99.999.999</span> / <span class="">99.999.999</span>
														</h4>
														<p class="caption small-caption text-uppercase secondary--text mb-0">
															deaths / total deaths
														</p>
													</v-col>
												</v-row>
												<v-row class="mt-1 mb-4 px-7 py-0" align="center">
													<v-col cols="12" class="py-0 px-3">
														<v-row class="outlined">
															<v-col class="pa-2 primary--text">
																<h4 class="subtitle-2 font-weight-bold">
																	99,999,99
																</h4>
																<p class="caption small-caption text-uppercase blue-grey--text mb-0">
																	active cases
																</p>
															</v-col>
															<v-col class="pa-2 orange--text">
																<h4 class="subtitle-2 font-weight-bold">
																	99,999,99
																</h4>
																<p class="caption small-caption text-uppercase blue-grey--text mb-0">
																	intubated
																</p>
															</v-col>
															<v-col class="pa-2 success--text">
																<h4 class="subtitle-2 font-weight-bold">
																	99,999,99
																</h4>
																<p class="caption small-caption text-uppercase blue-grey--text mb-0">
																	recovered
																</p>
															</v-col>
															<v-col class="pa-2 grey--text">
																<h4 class="subtitle-2 font-weight-bold">
																	99,999,999,000
																</h4>
																<p class="caption small-caption text-uppercase blue-grey--text mb-0">
																	tested
																</p>
															</v-col>
														</v-row>
													</v-col>

												</v-row>
												<v-divider class="ml-4" />
												<v-row class="px-4"  align="center">
													<v-col cols="7">
														<v-switch dense hide-details class="pt-0">
															<template v-slot:label>
																<span class="subtitle-2 font-weight-bold">SCHOOLS</span>
															</template>
														</v-switch>
													</v-col>
													<v-col cols="5">
														<v-select hide-details prepend-icon="" class="pt-0" label="filter" color="primary">
															<template v-slot:prepend>
																<v-icon small class="mt-1" color="primary">
																	fa-clock
																</v-icon>
															</template>
														</v-select>
													</v-col>
													<v-col cols="12" class="py-0">
														<p class="caption font-italic mt-0 grey--text">Activate this filter to see suspended schools on the map</p>
													</v-col>
													<v-col cols="12" class="py-0">
														<v-row class="blue-grey lighten-4 mx-0 mb-1" align="center">
															<v-col class="text-start py-1 caption">CLOSED</v-col>
															<v-col class="text-end py-1 title">27</v-col>
														</v-row>
														<v-row class="blue-grey lighten-4 mx-0 mb-1" align="center">
															<v-col class="text-start py-1 caption">CLOSED</v-col>
															<v-col class="text-end py-1 title">27</v-col>
														</v-row>
														<v-row class="blue-grey lighten-4 mx-0 mb-4" align="center">
															<v-col class="text-start py-1 caption">CLOSED</v-col>
															<v-col class="text-end py-1 title">27</v-col>
														</v-row>
													</v-col>
												</v-row>
												<v-divider class="ml-4" />
												<v-row class="px-4"  align="center">
													<v-col cols="7">
														<v-switch dense hide-details class="pt-0">
															<template v-slot:label>
																<span class="subtitle-2 font-weight-bold">POLICY RESPONSES</span>
															</template>
														</v-switch>
													</v-col>
													<v-col cols="5">
														<v-select hide-details prepend-icon="" class="pt-0" label="filter" color="primary">
															<template v-slot:prepend>
																<v-icon small class="mt-1" color="primary">
																	fa-clock
																</v-icon>
															</template>
														</v-select>
													</v-col>
													<v-col cols="12" class="py-0">
														<p class="caption font-italic mt-0 grey--text">Activate this filter to see suspended schools on the map</p>
													</v-col>
												</v-row>
												<v-divider class="ml-4" />
												<v-row class="px-4" align="center">
													<v-col cols="7">
														<v-switch dense hide-details class="pt-0">
															<template v-slot:label>
																<span class="subtitle-2 font-weight-bold">HOSPITALS</span>
															</template>
														</v-switch>
													</v-col>
													<v-col cols="5">
														<v-select hide-details prepend-icon="" class="pt-0" label="filter" color="primary">
															<template v-slot:prepend>
																<v-icon small class="mt-1" color="primary">
																	fa-clock
																</v-icon>
															</template>
														</v-select>
													</v-col>
													<v-col cols="12" class="py-0">
														<p class="caption font-italic mt-0 grey--text">Activate this filter to see suspended schools on the map</p>
													</v-col>
													<v-col cols="12" class="py-0">
														<v-row class="blue-grey lighten-4 mx-0 mb-1" align="center">
															<v-col class="text-end py-1 grow caption">OCCUPIED</v-col>
															<v-col class="text-end py-1 shrink title">
																27
															</v-col>
														</v-row>
													</v-col>
													<v-col cols="12" class="py-0">
														<v-row class="mb-1" align="center">
															<v-col class="text-start py-1 font-weight-bold caption">0</v-col>
															<v-col class="text-end py-1 font-weight-bold caption">
																120
															</v-col>
														</v-row>
													</v-col>
												</v-row>
											</v-container>
										</v-card>
									</v-tab-item>
									<v-tab-item>
										<v-card flat>
											<v-container fluid class="px-0">
												<v-row class="px-4" align="center">
													<v-col cols="7">
														<v-switch dense hide-details class="pt-0">
															<template v-slot:label>
																<span class="subtitle-2 font-weight-bold">COVID—19</span>
															</template>
														</v-switch>
													</v-col>
													<v-col cols="5">
														<v-select hide-details prepend-icon="" class="pt-0" label="filter" color="primary">
															<template v-slot:prepend>
																<v-icon small class="mt-1" color="primary">
																	fa-clock
																</v-icon>
															</template>
														</v-select>
													</v-col>
												</v-row>
												<!-- <v-row class="px-4" align="center">
													<v-col cols="12">
														<v-btn-toggle class="d-flex">
															<v-btn text x-small class="text-lowercase" color="primary" style="width: 50%;" active-class="grey lighten-3">Cases</v-btn>
															<v-btn text x-small class="text-lowercase" color="primary" style="width: 50%;" active-class="grey lighten-3">Deaths</v-btn>
														</v-btn-toggle>
													</v-col>
												</v-row> -->
												<v-row class="px-4" align="center" no-gutters>
													<v-col cols="12" class="primary--opac pa-2 mb-1">
														<h4 class="text-h5 font-weight-bold grey--text">
															<span class="primary--text">99.999.999</span> / <span class="">99.999.999</span>
														</h4>
														<p class="caption small-caption text-uppercase primary--text mb-0">
															cases / total cases
														</p>
													</v-col>
													<v-col cols="12" class="secondary--opac pa-2">
														<h4 class="text-h5 font-weight-bold grey--text">
															<span class="secondary--text">99.999.999</span> / <span class="">99.999.999</span>
														</h4>
														<p class="caption small-caption text-uppercase secondary--text mb-0">
															deaths / total deaths
														</p>
													</v-col>
												</v-row>
												<v-row class="mt-1 mb-4 px-7 py-0" align="center">
													<v-col cols="12" class="py-0 px-3">
														<v-row class="outlined">
															<v-col class="pa-2 primary--text">
																<h4 class="subtitle-2 font-weight-bold">
																	99,999,99
																</h4>
																<p class="caption small-caption text-uppercase blue-grey--text mb-0">
																	active cases
																</p>
															</v-col>
															<v-col class="pa-2 orange--text">
																<h4 class="subtitle-2 font-weight-bold">
																	99,999,99
																</h4>
																<p class="caption small-caption text-uppercase blue-grey--text mb-0">
																	intubated
																</p>
															</v-col>
															<v-col class="pa-2 success--text">
																<h4 class="subtitle-2 font-weight-bold">
																	99,999,99
																</h4>
																<p class="caption small-caption text-uppercase blue-grey--text mb-0">
																	recovered
																</p>
															</v-col>
															<v-col class="pa-2 grey--text">
																<h4 class="subtitle-2 font-weight-bold">
																	99,999,999,000
																</h4>
																<p class="caption small-caption text-uppercase blue-grey--text mb-0">
																	tested
																</p>
															</v-col>
														</v-row>
													</v-col>
												</v-row>
											</v-container>
										</v-card>
									</v-tab-item>
								</v-tabs-items>
							</v-card>
						</v-col>
					</v-row>
				</div>
			</v-row>
		</v-container>
		<v-container class="max-width">
			<v-scroll-y-transition>
				<div class="follow-nav" v-if="showAltNav">
					<v-btn fab tile left class="text-inherit" color="primary">
						<v-icon small>fa-map</v-icon>
					</v-btn>
					<v-btn fab tile left class="text-inherit" color="accent">
						<v-icon small>fa-home</v-icon>
					</v-btn>
				</div>
			</v-scroll-y-transition>
			<v-row justify="center" class="pa-0 ma-0 my-n10">
				<v-btn small tile class="mx-2 rounded-t elevation-0">
					INSIGHTS ON GREECE
					<v-icon right small>mdi-chevron-down</v-icon>
				</v-btn>
				<v-btn small tile class="mx-2 rounded-t elevation-0">
					INSIGHTS ON THE WORLD
					<v-icon right small>mdi-chevron-down</v-icon>
				</v-btn>
			</v-row>
			<v-row class="pt-12 my-12" align="stretch">
				<v-col cols="4">
					<h4 class="text-h4 primary--text mb-8">
						<span class="font-weight-thin slab">Lorem ipsum dolor sit amet, consectetur adipiscing elit</span>
					</h4>
					<p class="primary--text body-1">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at nisi a odio mollis pulvinar. Nam suscipit est est, quis porttitor massa ornare vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus risus mauris, semper et quam quis, congue suscipit enim. Cras eget enim nec tortor fringilla suscipit rutrum sed augue. Nullam at ante id risus mattis dapibus.
					</p>
				</v-col>
				<v-col cols="8">
					<v-card min-height="100%" color="blue-grey lighten-5">
						chart
					</v-card>
				</v-col>
			</v-row>
			<v-divider />
			<v-row class="my-12" align="center">
				<v-col cols="4">
					<h4 class="text-h4 primary--text mb-8">
						<span class="font-weight-thin slab">Lorem ipsum dolor sit amet, consectetur adipiscing elit</span>
					</h4>
					<p class="primary--text body-1">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at nisi a odio mollis pulvinar. Nam suscipit est est, quis porttitor massa ornare vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus risus mauris, semper et quam quis, congue suscipit enim. Cras eget enim nec tortor fringilla suscipit rutrum sed augue. Nullam at ante id risus mattis dapibus.
					</p>
					<p class="primary--text body-1">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at nisi a odio mollis pulvinar. Nam suscipit est est, quis porttitor massa ornare vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus risus mauris, semper et quam quis, congue suscipit enim. Cras eget enim nec tortor fringilla suscipit rutrum sed augue. Nullam at ante id risus mattis dapibus.
					</p>
				</v-col>
				<v-col cols="8">
					<v-card color="blue-grey lighten-5">
						chart
					</v-card>
				</v-col>
			</v-row>
			<v-row class="my-12" align="center">
				<v-col cols="4">
					<h4 class="text-h4 primary--text mb-8">
						<span class="font-weight-thin slab">Lorem ipsum dolor sit amet, consectetur adipiscing elit</span>
					</h4>
					<p class="primary--text body-1">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at nisi a odio mollis pulvinar. Nam suscipit est est, quis porttitor massa ornare vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus risus mauris, semper et quam quis, congue suscipit enim. Cras eget enim nec tortor fringilla suscipit rutrum sed augue. Nullam at ante id risus mattis dapibus.
					</p>
					<p class="primary--text body-1">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at nisi a odio mollis pulvinar. Nam suscipit est est, quis porttitor massa ornare vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus risus mauris, semper et quam quis, congue suscipit enim. Cras eget enim nec tortor fringilla suscipit rutrum sed augue. Nullam at ante id risus mattis dapibus.
					</p>
				</v-col>
				<v-col cols="8">
					<v-card color="blue-grey lighten-5">
						chart
					</v-card>
				</v-col>
			</v-row>
			<v-row class="my-12" align="center">
				<v-col cols="4">
					<h4 class="text-h4 primary--text mb-8">
						<span class="font-weight-thin slab">Lorem ipsum dolor sit amet, consectetur adipiscing elit</span>
					</h4>
					<p class="primary--text body-1">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at nisi a odio mollis pulvinar. Nam suscipit est est, quis porttitor massa ornare vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus risus mauris, semper et quam quis, congue suscipit enim. Cras eget enim nec tortor fringilla suscipit rutrum sed augue. Nullam at ante id risus mattis dapibus.
					</p>
					<p class="primary--text body-1">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at nisi a odio mollis pulvinar. Nam suscipit est est, quis porttitor massa ornare vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus risus mauris, semper et quam quis, congue suscipit enim. Cras eget enim nec tortor fringilla suscipit rutrum sed augue. Nullam at ante id risus mattis dapibus.
					</p>
				</v-col>
				<v-col cols="8">
					<v-card color="blue-grey lighten-5">
						chart
					</v-card>
				</v-col>
			</v-row>
			<v-row class="my-12" align="center">
				<v-col cols="4">
					<h4 class="text-h4 primary--text mb-8">
						<span class="font-weight-thin slab">Lorem ipsum dolor sit amet, consectetur adipiscing elit</span>
					</h4>
					<p class="primary--text body-1">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at nisi a odio mollis pulvinar. Nam suscipit est est, quis porttitor massa ornare vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus risus mauris, semper et quam quis, congue suscipit enim. Cras eget enim nec tortor fringilla suscipit rutrum sed augue. Nullam at ante id risus mattis dapibus.
					</p>
					<p class="primary--text body-1">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at nisi a odio mollis pulvinar. Nam suscipit est est, quis porttitor massa ornare vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus risus mauris, semper et quam quis, congue suscipit enim. Cras eget enim nec tortor fringilla suscipit rutrum sed augue. Nullam at ante id risus mattis dapibus.
					</p>
				</v-col>
				<v-col cols="8">
					<v-card color="white ">
						<v-app-bar flat color="blue-grey lighten-5 px-0 mx-0">
							<v-btn-toggle dense class="mr-2">
								<v-btn>option one</v-btn>
								<v-btn>option two</v-btn>
								<v-btn>option three</v-btn>
							</v-btn-toggle>
							<v-spacer/>
							<v-autocomplete class="ml-2" hide-details label="time-filter"></v-autocomplete>
							<v-autocomplete class="ml-2" hide-details label="other-filter"></v-autocomplete>
						</v-app-bar>
						<v-divider/>
						<v-container>
							<v-row class="px-5" align="center">
								chart
							</v-row>
						</v-container>
						<v-divider/>
						<v-footer class="caption small-caption pa-4">
							<span class="font-weight-bold">IMΕdD LAB</span>: Ελλαδά, θάνατοι, από την αρχή της πανδημίας
						</v-footer>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'home',
	components: {},
	computed: {
		...mapGetters([])
	},
	data () {
		return {
			tab: null,
			showAltNav: false
		};
	},
	methods: {
		onScroll (e) {
			// console.debug(window.innerHeight, e.target.scrollingElement.scrollTop);
			this.showAltNav = e.target.scrollingElement.scrollTop > window.innerHeight * 0.9;
		}
	}
};
</script>

<style lang="less" scoped>
#map-container {
	width: 100%;
	height: 95vh;
	.top-offset {
		margin-top: 76px;
	}
}
.container.max-width {
	width: 1264px;
}
.follow-nav {
	position: fixed;
	// top: 0;
	top: 76px;
	left: 16px;
	transform: translate(0, 0);
	z-index: 1;
	width: 40px;
	button {
		float: left;
		margin: 0 12px 12px 0;
	}
}

.primary--opac {
	background: #f2f7f7;
}
.accent--opac {
	background: rgba(255,0,0,0.1);
}
.secondary--opac {
	background: #f7f2f2;
}
.row.outlined {
	border: 1px solid #f2f7f7;
}
</style>
