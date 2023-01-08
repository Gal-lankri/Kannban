<template>
    <section class="board-nav flex column " :style="style" :class="{ isDark: isDark }, { navIsHidden: navIsHidden }">
        <div class="nav-title flex row align-center justify-between" :class="{ isDark: isDark }">
            <span>Workspace</span>
            <button class="btn-regular btn-toggle" @click="toggleBoardNav" :class="{ isDark: isDark }"> <span
                    class="fa-solid arrow-icon"></span></button>
        </div>

        <button class="btn-nav flex align-center" :class="{ isDark: isDark }" @click="openView('Boards')">
            <span class="trello-home trello-icon"></span>
            <span> Boards</span>
        </button>

        <button class="btn-nav flex align-center" :class="{ isDark: isDark }" @click="openView('Members')">
            <span class="trello-home join-icon"></span>
            <span> Members</span>
        </button>

        <button class="btn-nav flex align-center" :class="{ isDark: isDark }" @click="openView('Boards')">
            <span class="trello-home settings-icon"></span>
            <span> Settings</span>
        </button>
        <div class="nav-title flex row align-center justify-between " :class="{ isDark: isDark }">
            <span>Your Boards</span>
            <button class="btn-regular" @click="isAddBoard = true"> <span class="fa-regular plus-icon"></span></button>
        </div>
        <div class="boards-container flex column ">
            <button v-for="board in boards" :key="board._id" class="btn-nav"
                :class="{ isDark: isDark, isClicked: this.$route.params.id === board._id }"
                @click="goToBoard(board._id)">
                <div v-if="board.style?.backgroundImage" class="board-icon" :style="boardBGC(board.style)"></div>
                <div v-else class="board-icon" :style="boardBGC(board.style)"></div>
                <span v-if="(board.title.length > 25)">{{ board.title.slice(0, 25) }}...</span>
                <span v-else>{{ board.title }}</span>
            </button>
        </div>
    </section>
    <div class="add-board-in-board-nav">
        <add-board-modal v-if="isAddBoard" @addBoard="addBoard" v-click-outside="() => isAddBoard = false"
            @closeEdit="(isAddBoard = false)" />
    </div>
</template>

<script>
import { utilService } from '../services/util.service'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { boardService } from '../services/board.service.local'
import addBoardModal from '../cmps/add-board-modal.vue'

export default {
    name: 'board-nav',
    props: ['rgb', 'boards'],
    emits: ['showAddMembers', 'boards'],
    components: { addBoardModal },
    created() {

    },
    data() {
        return {
            boardToAdd: boardService.getEmptyBoard(),
            isAddBoard: false,
            navIsHidden: false,
            isClicked: false,
            // btns: [
            //     {
            //         txt: 'Boards',
            //         icon: 'trello-home trello-icon'
            //     },
            //     {
            //         txt: 'Members',
            //         icon: 'trello-home join-icon'
            //     },
            //     {
            //         txt: 'Settings',
            //         icon: 'trello-home settings-icon'
            //     },
            // ]
        }
    },
    methods: {
        openView(view) {
            switch (view) {
                case 'Boards':
                    this.$router.push('/board')
                    break
                case 'Members':
                    this.$emit('showAddMembers')
                    break
            }
        },
        toggleBoardNav() {
            this.navIsHidden = !this.navIsHidden
        },
        goToBoard(id) {
            return this.$router.push({ path: `/board/${id}` })
        },
        boardBGC(style) {
            // console.log()
            if (style.bgColor) return { backgroundColor: style.bgColor }
            return { backgroundImage: `url(${style.backgroundImage})` }
        },
        async addBoard({ bcg, title, members }) {
            if (bcg.startsWith('#')) {
                this.boardToAdd.style = { bgColor: bcg }
            } else {
                this.boardToAdd.style = { backgroundImage: bcg }
            }
            this.boardToAdd.title = title
            this.boardToAdd.members = members
            this.isAddBoard = false
            try {
                await this.$store.dispatch({ type: 'addBoard', board: this.boardToAdd })
                showSuccessMsg('Board added')
                this.boardToAdd = boardService.getEmptyBoard()
            } catch (err) {
                console.log(err)
                showErrorMsg('Cannot add board')
            }
        },
    },
    computed: {
        style() {
            if (!this.rgb) return false
            if (this.board.style.bgColor) return utilService.getBCG(this.rgb.value, -20, 0.9)
            return this.rgb.isDark ? utilService.getBCG(this.rgb.value, 0, 0.9) : utilService.getBCG(this.rgb.value, -0, 0.8)
        },
        isDark() {
            if (!this.rgb) return false
            return this.rgb.isDark
        },
        board() {
            return this.$store.getters.board
        },

    },
    watch: {
        boards: function (newVal, oldVal) { // watch it
            // console.log(this.boards)
        }
    }
}
</script>
