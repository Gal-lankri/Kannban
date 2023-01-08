<template>
    <section class="board-preview">
        <!-- <img :src="getBoardBc"> -->
        <div v-if="board.style.backgroundImage" class="board-icon" :style="boardBGC(board.style)"></div>
        <div v-else class="board-icon" :style="boardBGC(board.style)"></div>
        <span v-if="!board.isStarred" class="trellicons star" @click.stop="toggleStar"></span>
        <span v-else class="fa-solid star-icon" @click.stop="toggleStar"></span>
        <div class="board-title">{{ board.title }}</div>
        <!-- <group-list :group="board.groups"/> -->
    </section>
</template>

<script>
// import boardList from '../views/board-list.vue';
export default {
    name: 'board-preview',
    props: {
        board: Object,
    },
    methods: {
        boardBGC(style) {
            // console.log()
            if (style.bgColor) return { backgroundColor: style.bgColor }
            return { backgroundImage: `url(${style.backgroundImage})` }
        },
    },
    computed: {
        getBoardBc() {
            const style = { ...this.board.style }
            // console.log(style);
            if (style.backgroundImage)
                return style.backgroundImage
            // return { backgroundImage: `url(${style.backgroundImage})` }
            else {
                style.backgroundColor
                // return { backgroundColor: style.backgroundColor }
            }
        },
        toggleStar() {
            this.$emit('toggleStar')
        }
    },
    components: {},
    // created() {
    //     console.log(this.board)
    // },

}
</script>