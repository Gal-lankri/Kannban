<template>
    <section v-if="isLoaderShown" class="loader">
        <img src="../assets/svg/loader.svg" alt="">
        <img :src="board.style.backgroundImage" alt="" @load="isBGCLoaded = true" style="visibility: hidden">
    </section>
    <section v-else class="board-details flex row" :style="boardBGC">
        <!-- <user-msg></user-msg> -->
        <section class="main flex column grow">
            <board-header :board="board" :class="{ isDark: rgb.isDark, menuIsShown: !menuIsHidden }" :rgb="rgb"
                @toggleBoardMenu="toggleBoardMenu" @filterTasks="filterTasks" />
            <filter-tasks-modal v-if="showFilter" @closeFilter="(showFilter = false)" @doFilter="doFilter"
                :filterBy="filterBy" />

            <router-view @addTask="addNewTask" @addGroup="addNewGroup" @removeGroup="removeGroup" :groups="board.groups"
                :boardId="board._id" :rgb="rgb" :filterBy="filterBy" />
        </section>
        <board-nav :rgb="rgb" :boards="boards" @showAddMembers="isAddBoardMembers = true"
            @changeActiveBoard="changeActiveBoard"></board-nav>
        <board-menu :menuIsHidden="menuIsHidden" :activities="board.activities" @toggleBoardMenu="toggleBoardMenu"
            @confirmDelete="(isDelete = true)" />
        <!-- <router-view class="task-details-view"></router-view> -->
    </section>
    <add-board-members v-if="isAddBoardMembers" @close="(isAddBoardMembers = false)" @addMember="addMember"
        @removeMember="removeMember" />
    <task-details v-if="this.$route.params.taskId" />


    <confirm-modal :msg="'Permanently delete board?'" v-if="isDelete" @closeModal="() => { isDelete = false }"
        @remove="removeBoard" />
</template>


<script>
import { boardService } from '../services/board.service.local'
import { boardStore } from '../store/modules/board-store'
import { FastAverageColor } from 'fast-average-color'
import { socketService } from '../services/socket.service'
import boardHeader from '.././cmps/board-header.vue'
import groupList from '../cmps/group-list.vue'
import boardNav from '../cmps/board-nav.vue'
import boardMenu from '../cmps/board-menu.vue'
import taskDetails from '../views/task-details.vue'
import filterTasksModal from '../cmps/filter-tasks-modal.vue'
import addBoardMembers from '../cmps/add-board-members.vue'
import confirmModal from '../cmps/confirm-modal.vue'
import userMsg from '../cmps/user-msg.vue'
import { eventBus, showErrorMsg } from '../services/event-bus.service'

const fac = new FastAverageColor();

export default {

    emits: ['setRGB'],

    data() {
        return {
            isBGCLoaded: false,
            isLoaderShown: true,
            menuIsHidden: true,
            rgb: {
                value: '',
                isDark: false,
            },
            showFilter: false,
            isAddBoardMembers: false,
            tasksToShow: [],
            filterBy: {},
            isDelete: false
        }
    },

    components: {
        boardNav,
        boardHeader,
        groupList,
        boardMenu,
        taskDetails,
        filterTasksModal,
        addBoardMembers,
        confirmModal,
        userMsg
    },

    created() {
        this.setBoardId()
        socketService.emit('new board enter', this.board._id)
        socketService.on('board pushed', this.pushedBoard)
        socketService.on('activity pushed', this.pushedActivity)
    },

    unmounted() {
        this.$store.commit({
            type: 'setFilterBy', filterBy: {
                title: '',
                membersIds: [],
                isNoMembers: false,
                isAssignToMe: false,
                labelIds: [],
                isNoLabels: false
            }
        })
    },

    methods: {
        async setBoardId() {
            if (!this.$route.params.id) return
            const { id } = this.$route.params
            this.$store.commit({ type: 'setBoard', boardId: id })
            try {
                if (this.board.style.bgColor) {
                    this.isBGCLoaded = true
                    this.rgb.value = this.hexToRgbA(this.board.style.bgColor)
                    this.rgb.isDark = true
                    this.isLoaderShown = false
                } else {

                    const avgColor = await this.avgColor()
                    this.rgb.value = avgColor.value
                    this.rgb.isDark = avgColor.isDark
                    this.isLoaderShown = false

                }
                this.$emit('setRGB', this.rgb)

            } catch (err) {
                console.log(err)
            }
        },
        async removeBoard() {
            try {
                await this.$store.dispatch({ type: 'removeBoard', boardId: this.board._id })
                this.$router.push('/board')
            }
            catch (err) {
                if (err.response.status === 401) showErrorMsg ('You are not allowed to edit demo board')
                else showErrorMsg ('fail in remove board')
                console.log('fail in remove board');
            }
        },
        pushedActivity(board) {
            if (board.activities[board.activities.length - 1].txt.includes('Moved')) return
            const membersIds = board.members.map(member => member._id)
            if (membersIds.includes(this.user._id)) {
                const { txt, createdAt, byMember } = board.activities[board.activities.length - 1]
                const notification = {
                    txt: txt + ' in ' + board.title,
                    byMember: {
                        fullname: byMember.fullname,
                        imgUrl: byMember.imgUrl
                    },
                    createdAt,
                    isSeen: false
                }
                this.$store.dispatch({ type: 'addNotification', notification })
            }
        },
        pushedBoard(board) {
            this.$store.commit({ type: 'setPushedBoard', board })
        },
        removeMember(id) {
            this.$store.dispatch({ type: 'removeMember', memberId: id })
        },
        async avgColor() {

            const url = this.board.style.backgroundImage
            try {
                const color = await fac.getColorAsync(url)

                return color
            } catch (err) {
                console.log(`err:`, err)
            }
        },

        async addNewGroup(group, activity) {
            var board = JSON.parse(JSON.stringify(this.board))
            try {
                await this.$store.dispatch({ type: 'addGroup', board: board, group, activity })
            }
            catch (err) {
                if (err.response.status === 401) showErrorMsg ('You are not allowed to edit demo board')
                else showErrorMsg ('fail in add new group')
                console.log(err)
            }
        },

        async removeGroup(groupId, activity) {
            var board = JSON.parse(JSON.stringify(this.board))
            try {
                await this.$store.dispatch({ type: 'removeGroup', board: board, groupId, activity })
            }
            catch (err) {
                if (err.response.status === 401) showErrorMsg ('You are not allowed to edit demo board')
                showErrorMsg ('fail in remove group')
                console.log(err);
            }
        },

        async addNewTask(groupId, task, activity) {
            const boardId = this.board._id
            try {
                await this.$store.dispatch({ type: 'addTask', boardId, groupId, task, activity })
            }
            catch (err) {
                if (err.response.status === 401) showErrorMsg ('You are not allowed to edit demo board')
                else showErrorMsg ('fail in add new task')
                console.log(err);
            }
        },

        async addMember(member) {
            try {
                await this.$store.dispatch({ type: 'addMember', member })
            } catch (err) {
                console.log(err.response.status)
                if (err.response.status === 401) showErrorMsg ('You are not allowed to edit demo board')
                else showErrorMsg ('fail in add member')
            }
        },

        hexToRgbA(hex) {

            var c;
            c = hex.substring(1).split('');
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            const color = [(c >> 16) & 255, (c >> 8) & 255, c & 255, 255]

            return color
        },

        toggleBoardMenu() {
            this.menuIsHidden = !this.menuIsHidden
        },

        filterTasks() {
            this.showFilter = true
        },

        doFilter(filterBy) {
            this.filterBy = filterBy
            this.$store.commit({ type: 'setFilterBy', filterBy: JSON.parse(JSON.stringify(filterBy)) })
        },
        toggleMember(memberId) {
            console.log(memberId);
        },
        changeActiveBoard() {
            this.isBGCLoaded = false
            this.isLoaderShown = true

        }
    },



    computed: {
        user() {
            return this.$store.getters.loggedinUser
        },
        board() {
            return this.$store.getters.board
        },
        boards() {
            return this.$store.getters.boards
        },
        boardBGC() {
            if (this.board.style.bgColor) return { backgroundColor: this.board.style.bgColor }

            return { backgroundImage: `url(${this.board.style.backgroundImage})` }
        },
        color() {
            return this.rgb
        },
        style() {
            return this.$store.getters.board?.style
        },
    },
    watch: {
        $route(to, from) {
            this.setBoardId()
            socketService.emit('New board enter', this.board._id)
        },
        style(to, from) {
            this.setBoardId()
        },


    }

}
</script>