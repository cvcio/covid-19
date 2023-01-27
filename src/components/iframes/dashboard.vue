<template >
    <v-card flat class="dashboard_card" style="margin-left:auto">
        <v-container fluid class="px-0">

            <v-row class="px-4" align="center">
                <v-col cols="8">
                    <autocomplete-map-period model="mapCasesPeriod" :label="$t('label.period')"
                        :disabled="mapSource !== 'covid'" />
                </v-col>
            </v-row>

            <v-row class="px-4" align="center" no-gutters>
                <v-col cols="12" class="secondary--opac pa-2 mb-1" style="position:relative">
                    <h4 class="text-2rem text-xs-h5 font-weight-bold grey--text" style="z-index:1;">
                        <span class="secondary--text" v-if="mapCasesPeriodIDX < 6">
                            {{
                                new Intl.NumberFormat('el-GR').format(daily['deaths'].toFixed(2))
                            }}
                        </span>
                        <span class="secondary--text" v-if="mapCasesPeriodIDX === 6">
                            {{
                                new Intl.NumberFormat('el-GR').format(total['deaths'].toFixed(2))
                            }}
                        </span>
                        <span class="" v-if="mapCasesPeriodIDX < 6"> /
                            {{
                                new Intl.NumberFormat('el-GR').format(total['deaths'].toFixed(2))
                            }}
                        </span>
                    </h4>
                    <p class="caption small-caption text-uppercase secondary--text mb-0" style="z-index:1;">
                        <span v-if="mapCasesPeriodIDX < 6">{{ $tc('deaths', 1) | normalizeNFD }} / </span>
                        {{ $t('total deaths') | normalizeNFD }}
                    </p>
                </v-col>

                <v-col cols="12" class="hospital--opac pa-2 mb-1" style="position:relative">
                    <h4 class="text-2rem text-xs-h5 font-weight-bold grey--text" style="z-index:1;">
                        <span class="hospital--text" v-if="mapCasesPeriodIDX < 6">
                            {{
                                new Intl.NumberFormat('el-GR').format(daily['hospital_admissions'].toFixed(2))
                            }}
                        </span>
                        <span class="hospital--text" v-if="mapCasesPeriodIDX === 6">
                            {{
                                new Intl.NumberFormat('el-GR').format(total['hospital_admissions'].toFixed(2))
                            }}
                        </span>
                        <span class="" v-if="mapCasesPeriodIDX < 6"> /
                            {{
                                new Intl.NumberFormat('el-GR').format(total['hospital_admissions'].toFixed(2))
                            }}
                        </span>
                    </h4>
                    <p class="caption small-caption text-uppercase hospital--text mb-0" style="z-index:1;">
                        <span v-if="mapCasesPeriodIDX < 6">{{ $t('admissions', 1) | normalizeNFD }} / </span>
                        {{ $t('total admissions') | normalizeNFD }}
                    </p>
                </v-col>

                <v-col cols="12" class="intubated--opac pa-2 mb-1" style="position:relative">
                    <h4 class="text-2rem text-xs-h5 font-weight-bold grey--text" style="z-index:1;">
                        <span class="intubated--text" v-if="mapCasesPeriodIDX < 6">
                            {{
                                new Intl.NumberFormat('el-GR').format(daily['intubated'].toFixed(2))
                            }}
                        </span>
                        <span class="intubated--text" v-if="mapCasesPeriodIDX === 6">
                            {{
                                new Intl.NumberFormat('el-GR').format(total['intubated'].toFixed(2))
                            }}
                        </span>
                        <span class="" v-if="mapCasesPeriodIDX < 6"> /
                            {{
                                new Intl.NumberFormat('el-GR').format(total['intubated'].toFixed(2))
                            }}
                        </span>
                    </h4>
                    <p class="caption small-caption text-uppercase intubated--text mb-0" style="z-index:1;">
                        <span v-if="mapCasesPeriodIDX < 6">{{ $t('avg intubated') | normalizeNFD }} / </span>
                        {{ $t('overall avg intubated') | normalizeNFD }}
                    </p>
                </v-col>
            </v-row>

            <v-row class="mt-1 mb-4 px-7 py-0" align="center">
                <v-col cols="12" class="py-0 px-3">
                    <v-row class="outlined">
                        <v-col class="pa-2 grey--text">
                            <h4 class="text-1-2rem text-xs-subtitle-2 font-weight-bold">
                                {{
                                    new Intl.NumberFormat('el-GR').format(vaccines.totalDistinctPersons.toFixed(2))
                                        || '-'
                                }}
                                <v-tooltip bottom transition="slide-y-reverse-transition">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn class="ma-0 pa-0" x-small icon color="" dark v-bind="attrs" v-on="on">
                                            <v-icon x-small color="grey lighten-1">mdi-information</v-icon>
                                        </v-btn>
                                    </template>
                                    <span class="caption">{{
                                        $t('People vaccinated with at least one dose')
                                    }}</span>
                                </v-tooltip>
                            </h4>
                            <p class="caption small-caption text-uppercase blue-grey--text mb-0">
                                {{ $t('Vaccinated People') | normalizeNFD }}
                            </p>
                        </v-col>
                        <v-col class="pa-2 grey--text" align-self="center">
                            <h4 class="text-1-2rem text-xs-subtitle-2 font-weight-bold">
                                {{
                                    new Intl.NumberFormat('el-GR').format(vaccines.totalVaccinations.toFixed(2)) ||
                                        '-'
                                }}
                                <v-tooltip bottom transition="slide-y-reverse-transition">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn class="ma-0 pa-0" x-small icon color="" dark v-bind="attrs" v-on="on">
                                            <v-icon x-small color="grey lighten-1">mdi-information</v-icon>
                                        </v-btn>
                                    </template>
                                    <span class="caption">{{ $t('Cumulative vaccine doses received') }}</span>
                                </v-tooltip>
                            </h4>
                            <p class="caption small-caption text-uppercase blue-grey--text mb-0">
                                {{ $t('Vaccinations') | normalizeNFD }}
                            </p>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row class="px-4" align="center">
                <v-col cols="12">
                    <v-progress-linear :value="vaccines.percent" background-color="grey lighten-4" color="#81B15F"
                        height="24" class="vaccines-progress">
                        <template v-slot:default="{ value }">
                            <span class="caption font-weight-bold text-end px-2">
                                {{
                                    new Intl.NumberFormat('el-GR').format(value.toFixed(2))
                                }}%
                                {{ $t('of population') }}
                            </span>
                        </template>
                    </v-progress-linear>
                </v-col>
            </v-row>

            <v-row class="px-4" align="center">
                <v-col cols="12">
                    <h5 class="grey--text s-subtitle-2 subtitle-2">{{ $t('week') }}
                        {{ $moment(waste.date).subtract(7, 'days').format('ll') }} -
                        {{ $moment(waste.date).format('ll') }}
                    </h5>
                    <p class="s-caption caption blue-grey--text mb-0">
                        <strong>{{ waste[`place_${locale.code}`] }}</strong>:
                        {{ $t('increase') }} <span class="red--text"> {{ waste.percent }}% </span>
                        {{ $t('in_the_average') }}
                    </p>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>


<script>
import { mapGetters } from 'vuex';

export default {
    name: 'dashboard',
    components: {
        'autocomplete-map-period': require('@/components/content/autocomplete-map-period').default,
    },
    computed: {
        ...mapGetters(['locale']),
        ...mapGetters('filters', ['mapSource', 'mapCasesPeriod', 'mapCasesPeriodIDX', 'mapVaccinationsPeriod', 'mapVaccinationsPeriodIDX', 'periodInterval'])
    },
    watch: {
        mapCasesPeriod(value, old) {
            if (value !== old) {
                this.loadNew();
            }
        },
    },
    data() {
        return {
            total: {
                cases: 0,
                deaths: 0,
                intubated: 0,
                hospital_admissions: 0
            },
            daily: {
                cases: 0,
                deaths: 0,
                intubated: 0,
                hospital_admissions: 0
            },
            vaccines: {
                totalDistinctPersons: 0,
                totalVaccinations: 0,
                percent: 0
            },
            waste: {
                date: null,
                place: null,
                percent: 0
            },
            population: 10747828
        };
    },
    mounted() {
        this.loadStatic();
        this.loadNew();
    },
    methods: {
        loadNew() {
            const isLastWeek_covid = (this.mapCasesPeriodIDX == 0);
            this.$store.dispatch('external/getTimelineData', { from: (isLastWeek_covid) ? this.$moment().subtract(100, 'days').format('YYYY-MM-DD') : this.mapCasesPeriod.from, to: this.mapCasesPeriod.to, fields: ['daily_cases', 'cases_cum', 'deaths', 'deaths_cum', 'intubated', 'hospital_admissions',] })
                .then(res => {

                    if (isLastWeek_covid) {
                        const cases = res.filter(x => x.daily_cases != 0).map(x => x.daily_cases).pop();
                        const deaths = res.filter(x => x.deaths != 0).map(x => x.deaths).pop();
                        const hospital_admissions = res.filter(x => x.hospital_admissions != 0).map(x => x.hospital_admissions).pop();
                        const intubated = res.map(obj => obj.intubated).filter(x => x != 0).pop();

                        this.daily = {
                            cases: cases,
                            deaths: deaths,
                            hospital_admissions: hospital_admissions,
                            intubated: intubated
                        }
                    } else {
                        const cases = res.map(obj => obj.daily_cases).reduce((a, b) => { return a + b; }, 0);
                        const deaths = res.map(obj => obj.deaths).reduce((a, b) => { return a + b; }, 0);
                        const hospital_admissions = res.map(obj => obj.hospital_admissions).reduce((a, b) => { return a + b; }, 0);
                        const intubated = res.map(obj => obj.intubated).filter(x => x != 0);
                        const intubated_avg = intubated.reduce((a, b) => { return a + b; }, 0) / intubated.length;

                        this.daily = {
                            cases: cases,
                            deaths: deaths,
                            hospital_admissions: hospital_admissions,
                            intubated: intubated_avg
                        }
                    }
                });

            const isTotal_vaccinations = (this.mapCasesPeriodIDX == 6);
            this.$store.dispatch('external/getVaccinationsDataGroupByDate', { from: (isTotal_vaccinations) ? this.$moment().subtract(100, 'days').format('YYYY-MM-DD') : this.mapCasesPeriod.from, to: this.mapCasesPeriod.to })
                .then(res => {
                    this.population = 10747828;

                    const totaldistinctpersons = res.map(obj => obj.totaldistinctpersons);
                    this.vaccines.percent = (Math.max(...totaldistinctpersons) / this.population) * 100;

                    if (isTotal_vaccinations) {
                        const totalVaccinations = res.map(obj => obj.totalvaccinations);

                        this.vaccines.totalVaccinations = Math.max(...totalVaccinations);
                        this.vaccines.totalDistinctPersons = Math.max(...totaldistinctpersons);
                    } else {
                        const weeklydose1 = res.map(obj => obj.weeklydose1);
                        const weektotal = res.map(obj => obj.weektotal);
                        const totalweeklydose1 = weeklydose1.reduce((a, b) => { return a + b; }, 0);
                        const totalweektotal = weektotal.reduce((a, b) => { return a + b; }, 0);

                        this.vaccines.totalVaccinations = totalweektotal;
                        this.vaccines.totalDistinctPersons = totalweeklydose1;
                    }
                });
        },
        loadStatic() {
            const isTotal_waste = true;
            this.$store.dispatch('external/getTimelineData', { from: (isTotal_waste) ? this.$moment().subtract(365, 'days').format('YYYY-MM-DD') : this.mapCasesPeriod.from, to: this.$moment().format('YYYY-MM-DD'), fields: ['waste_highest_percent', 'waste_highest_place', 'waste_highest_place_en'] })
                .then(res => {
                    const waste_highest_percent = res.map(o => o.waste_highest_percent);
                    for (let i = waste_highest_percent.length - 1; i >= 0; i--) {
                        if (waste_highest_percent[i] > 0) {
                            this.waste = {
                                place_el: res[i].waste_highest_place,
                                place_en: res[i].waste_highest_place_en,
                                percent: res[i].waste_highest_percent,
                                date: res[i].date
                            };
                            break;
                        }
                    }
                });

            this.$store.dispatch('external/getTimelineData', { from: '2020-01-01', to: this.$moment().format('YYYY-MM-DD'), fields: ['daily_cases', 'cases_cum', 'deaths', 'deaths_cum', 'intubated', 'hospital_admissions',] })
                .then(res => {
                    const cases_cum = res.map(obj => obj.cases_cum).filter(x => x != 0).pop();
                    const deaths_cum = res.map(obj => obj.deaths_cum).filter(x => x != 0).pop();
                    const hospital_admissions_cum = res.map(obj => obj.hospital_admissions).reduce((a, b) => { return a + b; }, 0);
                    const intubated_cum = res.map(obj => obj.intubated).filter(x => x != 0);
                    const intubated_avg = intubated_cum.reduce((a, b) => { return a + b; }, 0) / intubated_cum.length;

                    this.total = {
                        cases: cases_cum,
                        deaths: deaths_cum,
                        hospital_admissions: hospital_admissions_cum,
                        intubated: intubated_avg
                    }
                });
        },
    }
};
</script>

<style lang="less" scoped>
.dashboard_card {
    width: 85%
}

@media only screen and (max-width: 600px) {
    .dashboard_card {
        width: 100%
    }
}

h5.s-subtitle-2 {
    font-size: 0.95rem !important;
}

p.s-caption {
    font-size: 0.90rem !important;
}

.events {
    pointer-events: all;
}

.primary--opac {
    background: #f2f7f7;
}

.accent--opac {
    background: rgba(255, 0, 0, 0.1);
}

.secondary--opac {
    background: #f7f2f2;
}

.hospital--opac {
    background: rgba(255, 159, 135, 0.1);
}

.hospital--text {
    color: rgb(255, 159, 135, 1);

}

.intubated--opac {
    background: rgba(234, 205, 132, 0.1)
}

.intubated--text {
    color: rgba(234, 205, 132, 1)
}

.row.outlined {
    border: 1px solid #f2f7f7;
}

.totals-sparklines {
    position: absolute;
    width: 180px;
    height: 60px;
    top: 0;
    right: 0;
    z-index: 0;

    @media only screen and (max-width: 1530px) {
        position: relative;
    }
}

.vaccines-progress {
    .v-progress-linear__content {
        width: 100%;

        span {
            width: 100%;
        }
    }
}
</style>
