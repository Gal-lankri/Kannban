<template>
    <section class="cover-preview" :style="bgcStyle">
    </section>
</template>

<script>
export default {
    name: 'cover-preview',
    props: {
        coverBcg: {
            type: Object,
            required: true
        }
    },
    computed: {

        bgcStyle() {
            if (this.coverBcg.imgUrl) return { backgroundImage: `url(${this.coverBcg.imgUrl})` }
            if (this.coverBcg.bgColor) return { backgroundColor: `${this.coverBcg.bgColor}` }
        }
    }
}
</script>