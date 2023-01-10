<template>
    <section v-if="!imgReady" class="loader flex justify-center align-center">
        <img src="../assets/svg/loader.svg" alt="" :load="imgReady = true">
    </section>

    <section v-else class="board-preview">
        <div class="board-icon" :style="boardBGC(board.style)"></div>
        <span v-if="!board.isStarred" class="trellicons star" @click.stop="toggleStar"></span>
        <span v-else class="fa-solid star-icon" @click.stop="toggleStar"></span>
        <div class="board-title">{{ board.title }}</div>
    </section>
</template>

<script>
export default {
    name: 'board-preview',
    props: {
        board: Object,
    },
    data() {
        return {
            imgReady: false

        }
    },
    created() {
    },
    methods: {
        boardBGC(style) {
            if (style.bgColor) return { backgroundColor: style.bgColor }
            return { backgroundImage: `url(${style.backgroundImage})` }
        },
    },
    computed: {
        getBoardBc() {
            const style = { ...this.board.style }
            if (style.backgroundImage)
                return style.backgroundImage
            else {
                style.backgroundColor
            }
        },
        toggleStar() {
            this.$emit('toggleStar')
        }
    },
    components: {},

}
</script>