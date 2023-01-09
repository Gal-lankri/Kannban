<template>
    <section class="chart-treemap">


        <apexchart type="treemap" height="350" :options="chartOptions" :series="series"></apexchart>
        <h1>Chart Spline</h1>

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
            series: [
                {
                    data: [
                        {
                            x: 'New Delhi',
                            y: 218
                        },
                        {
                            x: 'Kolkata',
                            y: 149
                        },
                        {
                            x: 'Mumbai',
                            y: 184
                        },
                        {
                            x: 'Ahmedabad',
                            y: 55
                        },
                        {
                            x: 'Bangaluru',
                            y: 84
                        },
                        {
                            x: 'Pune',
                            y: 31
                        },
                        {
                            x: 'Chennai',
                            y: 70
                        },
                        {
                            x: 'Jaipur',
                            y: 30
                        },
                        {
                            x: 'Surat',
                            y: 44
                        },
                        {
                            x: 'Hyderabad',
                            y: 68
                        },
                        {
                            x: 'Lucknow',
                            y: 28
                        },
                        {
                            x: 'Indore',
                            y: 19
                        },
                        {
                            x: 'Kanpur',
                            y: 29
                        }
                    ]
                }
            ],
            chartOptions: {
                legend: {
                    show: false
                },
                chart: {
                    height: 350,
                    type: 'treemap'
                },
                title: {
                    text: 'Basic Treemap'
                }
            },
        }



    },
    methods: {},
    computed: {},
}
</script>
