<template>
    <section v-if="board" class="board-header flex row align-center justify-between wrap">
        <div class="flex align-center  wrap">
            <!-- <input type="text" v-model="board.title" :style="titleLength" @input="debounceHandler"
                @keyup.enter="setBoardTitle" /> -->
            <!-- <div class="input" ref="title" contenteditable="isEditable" @returned="setBoardTitle">{{ board.title }}
            </div> -->
            <contenteditable class="input" tag="div" ref="title" :contenteditable="isEditable" v-model="board.title"
                :no-nl="true" :no-html="true" @returned="setBoardTitle" />
            <div class="separation"></div>

            <div class="views-container flex align-center  wrap">
                <button v-if="board" v-for="(btn, i) in btns" class="btn"
                    :class="{ isDark: !isDark, isClicked: btnClicked === btn.isClicked }" :style="buttonBackground"
                    @click="btn.function(btn.isClicked)">
                    <span :class="btn.icon"></span>
                    <span v-if="btn.txt" class="txt">{{ btn.txt }}</span>
                </button>
            </div>
        </div>
        <div class="btns-container shrink  flex align-center row wrap justify-end  ">
            <span class="grow "></span>
            <button class="btn filter" :class="{ isDark: !isDark }" :style="buttonBackground" @click="filterTasks">
                <span class="trello-home filter-icon"></span>
                <span class="txt">Filter</span>
            </button>
            <!-- <span class="separation">&nbsp;&nbsp;|&nbsp;&nbsp;</span> -->
            <div class="separation"></div>

            <div v-for="member in board.members.slice(0, 5)" :key="member._id" :title="member.fullname"
                @click="isAddMembers = true" class="board-members">
                <div v-if="member.imgUrl" class="member-image" :style="memberImage(member.imgUrl)"
                    :title="member.fullname"> </div>
                <span v-else class="member-initials" :title="member.fullname">
                    {{ getInitials(member.fullname) }}
                </span>
            </div>
            <div v-if="(board.members.length > 5)" class="btn member-plus"><span class="fa-regular plus-icon"> {{
                    (board.members.length - 5)
            }}</span>
            </div>
            <!-- <div class="separation">&nbsp;|&nbsp;</div> -->
            <div class="separation"></div>
            <button class="btn elipsis" :class="{ isDark: !isDark }" :style="buttonBackground" @click="toggleBoardMenu">
                <span class="trello-home elipsis-icon"></span>
            </button>
        </div>
    </section>
    <!-- <add-board-members v-if="isAddMembers" @close="(isAddMembers = false)" v-click-outside="() => isAddMembers = false"
        @addMember="addMember" @removeMember="removeMember"/> -->
</template>

<script>
import { utilService } from "../services/util.service";
import addBoardMembers from "./add-board-members.vue";
import contenteditable from 'vue-contenteditable'; // Not needed it registered globally

export default {
    name: "board-header",
    props: {
        rgb: {
            type: Object,
            required: true,
        },
    },
    created() {
        this.debounceHandler = utilService.debounce(this.setBoardTitle, 1000)
    },

    data() {
        return {
            btnClicked: 'Board',
            isAddMembers: false,
            isEditable: true,
            message: "hello"
        }
    },

    methods: {
        memberImage(imgUrl) {
            return { backgroundImage: `url(${imgUrl})` };
        },
        getInitials(fullname) {
            return utilService.getInitials(fullname);
        },
        toggleBoardMenu() {
            this.$emit("toggleBoardMenu");
        },
        setBoardTitle() {
            console.log(this.$refs.title)
            // if (this.board.title.length > 15) this.board.title = this.board.title.slice(0, 15) + '...'

            this.$store.dispatch({ type: "updateBoard", board: this.board });
        },
        setBoardStar() {
            // console.log('star')
            if (!this.board) return
            this.board.isStarred = !this.board.isStarred
            this.$store.dispatch({ type: "updateBoard", board: this.board });
        },
        filterTasks() {
            this.$emit('filterTasks')
        }

    },

    computed: {
        isDark() {
            if (!this.rgb) return false;
            return this.rgb.isDark;
        },
        buttonBackground() {
            if (!this.rgb) return
            return this.rgb.isDark ? utilService.getBCG(this.rgb.value, 30, 0.5) : utilService.getBCG(this.rgb.value, 60, 0.5)
        },
        titleLength() {
            if (!this.board.title) return;
            // return { width: `${(this.board.title.length)}` + "ch" };
            return { width: `${(this.board.title.length) * 1}` + "ch" };
        },
        board() {

            const board = JSON.parse(JSON.stringify(this.$store.getters.board || {}))

            // if (board.title.length > 15) board.title = board.title.slice(0, 15)

            return board
        },
        isStarred() {
            // return "fa-regular star-icon"
            // if (!this.board.isStarred) return "fa-regular star-icon"
            return this.board.isStarred ? "fa-solid star-icon" : "fa-regular star-icon"
        },
        btns() {
            return [
                {
                    txt: null,
                    icon: this.board.isStarred ? "fa-solid star-icon" : "fa-regular star-icon",
                    function: this.setBoardStar
                },
                {
                    txt: "Board",
                    icon: "trello-home board-icon",
                    function: () => { this.btnClicked = 'Board'; this.$router.push(`/board/${this.$route.params.id}`) },
                    isClicked: "Board",

                },
                // {
                //     txt: "Table",
                //     icon: "trello-home table-icon",
                //     function: () => { this.btnClicked = 'Table' },
                //     isClicked: "Table",

                // },
                // {
                //     txt: "Calender",
                //     icon: "trello-home calender-icon",
                //     function: () => { this.btnClicked = 'Calender' },
                //     isClicked: "Calender",

                // },
                // {
                //     txt: "Dashboard",
                //     icon: "trello-home dashboard-icon",
                //     function: () => { this.btnClicked = 'Dashboard'; this.$router.push(`/board/${this.$route.params.id}/dashboard`) },
                //     isClicked: "Dashboard",
                // },
                {
                    txt: "Map",
                    icon: "trello-home location-icon",
                    function: () => { this.btnClicked = 'Map'; this.$router.push(`/board/${this.$route.params.id}/map`) },
                    isClicked: "Map",

                },
            ]
        }
    },
    components: {
        addBoardMembers,
        contenteditable
    }

};
</script>

<style>

</style>
