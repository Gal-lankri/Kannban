<template>
    <section class="chart-spline">


        <h1>Chart Spline</h1>
        <apexchart type="area" height="350" :options="chartOptions" :series="series"></apexchart>

    </section>
</template>


<script>
import VueApexCharts from "vue3-apexcharts";

export default {
    name: '',
    props: [],
    components: { apexchart: VueApexCharts, },
    created() { },
    data() {
        return {
            series: [{
                name: 'series1',
                data: [31, 40, 28, 51, 42, 109, 100]
            },
            {
                name: 'series2',
                data: [11, 32, 45, 32, 34, 52, 41]
            }],
            chartOptions: {
                chart: {
                    height: 350,
                    type: 'area'
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                },
                xaxis: {
                    type: 'datetime',
                    categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
                },
                tooltip: {
                    x: {
                        format: 'dd/MM/yy HH:mm'
                    },
                },
                colors: ['#F44336', '#E91E63', '#9C27B0'],
                fill: {
                    colors: ['#F44336', '#E91E63', '#9C27B0']
                },
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
                title: {
                    text: 'fsfsf',
                    align: 'left',
                    margin: 10,
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                        fontFamily: undefined,
                        color: '#263238'
                    },
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
