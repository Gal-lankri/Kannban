<template>
    <section class="chart-pie">


        <apexchart v-if="data && title && color && type" :type="type" :options="chartOptions" :series="series"
            style="{color: 'white}" />


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
    }
    ,
    components: { apexchart: VueApexCharts, },
    created() {

    },
    mounted() {

        this.$nextTick(() => {
            window.dispatchEvent(new Event('resize'));
        });
    },
    data() {
        return {
            series: this.data?.at(0),
            chartOptions: {
                chart: {
                    foreColor: this.color,
                    width: 380,
                    type: 'donut',

                },
                colors: ["#ea5545", "#f46a9b", "#ef9b20", "#edbf33", "#ede15b", "#bdcf32", "#87bc45", "#27aeef", "#b33dc6"],

                stroke: {
                    width: 0,
                },
                labels: this.data?.at(1),
                states: {
                    hover: {
                        filter: 'none'
                    }
                },
                theme: {
                    // palette: 'palette2'
                },
                title: {
                    text: this.title,
                    align: 'center',
                },
                markers: {
                },
                dataLabels: {
                    enabled: false
                },
                responsive: [{
                    breakpoint: 960,
                    options: {
                        chart: {
                            width: 250
                        },
                    }
                }],
                legend: {
                    position: 'bottom',
                },
                fill: {
                    opacity: 1,
                    type: 'solid',
                }
            },
        }
    },
    methods: {},
    computed: {},
}
</script>
