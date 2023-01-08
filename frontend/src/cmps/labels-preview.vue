<template>
    <section class="labels-preview  flex column">
        <h4 class="title">Labels</h4>
        <section class="labels-container flex row align-center justify-start gap5 wrap">
            <div v-for="label in taskLabels" :key="label.id" :style="{ backgroundColor: rgbaColors[label.id] }"
                class="label-preview flex row align-center justify-start">
                <div :style="{ backgroundColor: label.color }" class="color-circle"></div>
                <span>{{ label.title }}</span>
            </div>
            <div class="btn-plus flex justify-center align-center">
                <span class="fa-regular plus-icon" @click="$emit('openLabelsDetails')"></span>
            </div>
        </section>
    </section>
</template>

<script>
export default {
    name: 'labels-preview',
    data() {
        return {
            rgbaColors: {},
        }
    },
    methods: {
        hexToRgbA(hex) {
            // console.log(hex)
            var c;
            c = hex.substring(1).split('');
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.5)';
        },
    },
    computed: {
        taskLabels() {
            const labels = this.$store.getters.taskLabels
            labels.forEach(label => {
                // console.log(label.color)
                this.rgbaColors[label.id] = this.hexToRgbA(label.color)
            })
            return labels
        },
    }
}
</script>