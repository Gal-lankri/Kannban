<template>
    <section v-if="data && title && color" class="chart-spline">


        <apexchart type="area" height="350" :options="chartOptions" :series="series"></apexchart>

    </section>
</template>


<script>
import VueApexCharts from "vue3-apexcharts";

export default {
    name: '',
    props:
    {
        title: String,
        type: String,
        color: String,
        data: Array,
    },
    components: { apexchart: VueApexCharts, },
    created() {
    },
    mounted() {
        this.$nextTick(() => {
            this.series[0].data = this.data?.at(0)
            this.series[1].data = this.data?.at(1)
            window.dispatchEvent(new Event('resize'));
        });


    },
    data() {
        return {
            series: [{
                name: 'Total Tasks',
                data: []
            },
            {
                name: 'Completed Tasks]',
                data: []
            }],
            chartOptions: {
                chart: {
                    foreColor: this.color,
                    height: 350,
                    type: 'area'
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                },

                title: {
                    text: this.title,
                    align: 'center',
                },
                xaxis: {
                    type: 'category',
                    categories: this.data?.at(2)
                },
                tooltip: {
                    x: {
                        format: 'dd/MM/yy HH:mm'
                    },
                },
                colors: ["#ea5545", "#f46a9b", "#ef9b20", "#edbf33", "#ede15b", "#bdcf32", "#87bc45", "#27aeef", "#b33dc6"],

                dataLabels: {
                    style: {
                        colors: ['#F44336', '#E91E63', '#9C27B0']
                    }
                },
                markers: {
                    colors: ['#F44336', '#E91E63', '#9C27B0']
                },

                legend: {
                    show: true,
                    showForSingleSeries: false,
                    showForNullSeries: true,
                    showForZeroSeries: true,
                    position: 'bottom',
                    horizontalAlign: 'center',
                    floating: false,
                    fontSize: '14px',
                    fontFamily: 'Helvetica, Arial',
                    fontWeight: 400,
                    formatter: undefined,
                    inverseOrder: false,
                    width: undefined,
                    height: undefined,
                    tooltipHoverFormatter: undefined,
                    customLegendItems: [],
                    offsetX: 0,
                    offsetY: 0,
                    labels: {
                        colors: ['white'],
                        useSeriesColors: false
                    },
                },
                stroke: {
                    show: true,
                    curve: 'smooth',
                    lineCap: 'butt',
                    colors: undefined,
                    width: 0,
                    dashArray: 0,
                },

                label: {
                    borderColor: '#c2c2c2',
                    borderWidth: 1,
                    borderRadius: 2,
                    text: undefined,
                    textAnchor: 'middle',
                    offsetX: 0,
                    offsetY: -15,
                    mouseEnter: undefined,
                    mouseLeave: undefined,
                    click: undefined,
                    style: {
                        background: '#fff',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 400,
                        fontFamily: undefined,
                        cssClass: 'apexcharts-point-annotation-label',
                        padding: {
                            left: 5,
                            right: 5,
                            top: 0,
                            bottom: 2,
                        }
                    },
                },
                texts: [{
                    x: 0,
                    y: 0,
                    text: '',
                    textAnchor: 'start',
                    foreColor: 'white',
                    fontSize: '13px',
                    fontFamily: undefined,
                    fontWeight: 400,
                    appendTo: '.apexcharts-annotations',
                    backgroundColor: 'transparent',
                    borderColor: '#c2c2c2',
                    borderRadius: 0,
                    borderWidth: 0,
                    paddingLeft: 4,
                    paddingRight: 4,
                    paddingTop: 2,
                    paddingBottom: 2,
                }],

            }
        }


    },
    methods: {},
    computed: {},




}
</script>
