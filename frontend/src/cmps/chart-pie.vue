<template>
    <section class="chart-pie">


        <apexchart type="donut" :options="chartOptions" :series="series"></apexchart>
        <h1>Chart pie</h1>

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
            series: [44, 55, 13, 33],
            chartOptions: {
                chart: {
                    width: 200,
                    type: 'donut',
                },
                dataLabels: {
                    enabled: false
                },
                responsive: [{
                    breakpoint: 600,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            show: false
                        }
                    }
                }],
                legend: {
                    position: 'right',
                    offsetY: 0,
                    height: 230,
                    show: true
                }

            },
        }



    },
    methods: {},
    computed: {},
}
</script>
