<template>
    <section v-if="board" class="board-details flex row" :style="boardBGC">
        <section class="main flex column grow">
            <board-header :board="board" :class="{ isDark: rgb.isDark, menuIsShown: !menuIsHidden }" :rgb="rgb"
                @toggleBoardMenu="toggleBoardMenu" @filterTasks="filterTasks" />
            <filter-tasks-modal v-if="showFilter" @closeFilter="(showFilter = false)" @doFilter="doFilter"
                :filterBy="filterBy" />

            <router-view @addTask="addNewTask" @addGroup="addNewGroup" @removeGroup="removeGroup" :groups="board.groups"
                :boardId="board._id" :rgb="rgb" :filterBy="filterBy" />
        </section>
        <board-nav :rgb="rgb" :boards="boards" @showAddMembers="isAddBoardMembers = true"></board-nav>
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

const fac = new FastAverageColor();

export default {

    emits: ['setRGB'],

    data() {
        return {
            menuIsHidden: true,
            // style: 'src/assets/img/bgc-img-5.jpg',
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
        confirmModal
    },

    created() {
        this.setBoardId()
        socketService.emit('new board enter', this.board._id)
        socketService.on('board pushed', this.pushedBoard)
        socketService.on('activity pushed', this.pushedActivity)
    },

    methods: {
        async setBoardId() {
            if (!this.$route.params.id) return
            const { id } = this.$route.params
            console.log(id)
            this.$store.commit({ type: 'setBoard', boardId: id })
            try {
                console.log(this.board)
                if (this.board.style.bgColor) {
                    this.rgb.value = this.hexToRgbA(this.board.style.bgColor)
                    // console.log(this.rgb.value)
                    this.rgb.isDark = true
                } else {

                    const avgColor = await this.avgColor()
                    this.rgb.value = avgColor.value
                    this.rgb.isDark = avgColor.isDark

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
                console.log('fail in remove board');
            }
        },
        pushedActivity(board) {
            if (board.activities[board.activities.length - 1].txt.includes('Moved')) return
            // console.log(board.activities[board.activities.length - 1]);
            const membersIds = board.members.map(member => member._id)
            if (membersIds.includes(this.user._id)) {
                // console.log(this.board.activities[this.board.activities.length - 1]);
                const { txt, createdAt, byMember } = board.activities[board.activities.length - 1]
                // console.log('hi');
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
            // console.log('hiiiiii board details');
            this.$store.commit({ type: 'setPushedBoard', board })
        },
        removeMember(id) {
            this.$store.dispatch({ type: 'removeMember', memberId: id })
        },
        async avgColor() {
            // console.log(this.board)
            const url = this.board.style.backgroundImage
            try {
                const color = await fac.getColorAsync(url)
                // console.log(color)
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
                console.log(err)
            }
        },

        async removeGroup(groupId, activity) {
            var board = JSON.parse(JSON.stringify(this.board))
            try {
                await this.$store.dispatch({ type: 'removeGroup', board: board, groupId, activity })
            }
            catch (err) {
                console.log(err);
            }

        },

        async addNewTask(groupId, task, activity) {
            // var board = JSON.parse(JSON.stringify(this.board))
            const boardId = this.board._id
            console.log('********************************', task)
            try {
                await this.$store.dispatch({ type: 'addTask', boardId, groupId, task, activity })
            }
            catch (err) {
                console.log(err);
            }
        },

        addMember(member) {
            console.log(member);
            this.$store.dispatch({ type: 'addMember', member })
        },

        hexToRgbA(hex) {
            // console.log(hex)
            var c;
            c = hex.substring(1).split('');
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            const color = [(c >> 16) & 255, (c >> 8) & 255, c & 255, 255]
            // console.log(color)
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
            console.log(this.filterBy);
        },
        toggleMember(memberId) {
            console.log(memberId);
        }
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

    computed: {
        boardBGC() {
            if (this.board.style.bgColor) return { backgroundColor: this.board.style.bgColor }

            return { backgroundImage: `url(${this.board.style.backgroundImage})` }
        },
        color() {
            return this.rgb
        },
        board() {
            return this.$store.getters.board
        },
        boards() {
            return this.$store.getters.boards
        },
        style() {
            return this.$store.getters.board?.style
        },
        user() {
            return this.$store.getters.loggedinUser
        }
    },
    watch: {
        $route(to, from) {
            console.log(to, from, '.................................');
            this.setBoardId()
            socketService.emit('New board enter', this.board._id)
        },
        style(to, from) {
            this.setBoardId()
        },


    }

}
</script>