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
                colors: ["#54bebe", "#76c8c8", "#98d1d1", "#badbdb", "#dedad2", "#e4bcad", "#df979e", "#d7658b", "#c80064"],

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
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
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
