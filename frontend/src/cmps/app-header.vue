<template>
    <header class="app-header" :style="headerBackground" :class="{ isDark: isDark }">
        <section class="flex row align-center">
            <router-link class="header-btn" :to="'/'" :class="{ isDark: isDark }">
                <span class="fa-brands trello-icon "></span>
            </router-link>
            <router-link class="header-btn" :to="'/board'" :class="{ isDark: isDark }">
                <span class="logo">Kannban</span>
            </router-link>
            <button v-if="this.$route.params?.id" class="create-btn flex align-center justify-center"
                :style="buttonBackground" @click="isAddBoard = true">
                <span>Create</span>
            </button>
        </section>
        <section class="user-buttons flex row align-center justify-center gap">
            <div class="search-boards flex row align-center gap justify-around"
                :class="{ 'whiteBackground': isInputInFocus, isDark: isDark }">
                <span class="trello-home glass-icon"></span>

                <input type="search" v-model="filterByTitle" placeholder="Search" @focus="(isInputInFocus = true)"
                    v-click-outside="outOfFocus">
                <div v-if="isInputInFocus" class="search-results flex column">
                    <div class="title">RECENT BOARDS</div>
                    <router-link v-for="board in boards" :key="board._id" :to="('/board/' + board._id)"
                        class="search-result flex row align-center gap">
                        <img v-if="board.style.backgroundImage" class="" :src="board.style.backgroundImage" />
                        <div v-else :style="{ backgroundColor: board.style.bgColor }"></div>
                        <span>{{ board.title }}</span>
                        <span>Trello workspace</span>

                    </router-link>
                </div>
            </div>
            <span class="trello-home bell-icon" @click="updateSeenNotifications">
                <span class="fa-solid notification-icon"
                    v-if="user.notifications && user.notifications.length && !user.notifications[0].isSeen"></span>
            </span>
            <span class="trello-home question-icon"></span>

            <div v-if="user?.imgUrl" class="member-image" :style="memberImage(user.imgUrl)"
                @click="(showUserPreview = !showUserPreview)"> </div>
            <div v-if="user?.bgColor" class="member-initials">
                {{ getInitials(user.fullname) }}
            </div>
        </section>

        <user-preview v-if="showUserPreview" :user="user" v-click-outside="closeUserPreview" @logout="logout" />
        <notification-modal v-if="isShowNotifications" v-click-outside="() => { isShowNotifications = false }"
            @removeNotification="removeNotification" :style="{ color: '#172b4d' }" />
    </header>
    <div class="add-board-in-board-nav">
        <add-board-modal v-if="isAddBoard" @addBoard="addBoard" v-click-outside="() => isAddBoard = false"
            @closeEdit="(isAddBoard = false)" />
    </div>
</template>


<script>

import { router } from '../router'
import { utilService } from '../services/util.service'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { boardService } from '../services/board.service.local'

import addBoardModal from '../cmps/add-board-modal.vue'
import userPreview from './user-preview.vue'
import notificationModal from './notification-modal.vue'
export default {
    name: 'app-header',
    props: ['rgb'],
    emits: ['showAddMembers', 'boards', 'logout', 'updateSeenNotifications', 'removeNotification', 'removeAllNotification'],
    components: { userPreview, notificationModal, addBoardModal },
    created() {
        // console.log(this.isDefaultBGC)
    },
    data() {
        return {
            showUserPreview: false,
            isInputInFocus: false,
            filterByTitle: '',
            isShowNotifications: false,
            isSeenNotifications: false,

            boardToAdd: boardService.getEmptyBoard(),
            isAddBoard: false,
        }
    },
    methods: {
        removeNotification(id) {
            this.$emit('removeNotification', id)
        },
        getInitials(fullname = 'Guest') {
            return utilService.getInitials(fullname)
        },
        updateSeenNotifications() {
            this.isShowNotifications = true
            if (!this.user.notifications || !this.user.notifications.length || this.user.notifications[0].isSeen) return
            this.$emit('updateSeenNotifications')
        },
        logout() {
            this.$emit('logout')
            this.showUserPreview = false
        },
        closeUserPreview() {
            this.showUserPreview = false
        },
        memberImage(imgUrl) {
            return { backgroundImage: `url(${imgUrl})` };
        },
        getInitials(fullname) {
            return utilService.getInitials(fullname)
        },
        changeDivStyle() {
            // console.log('focus')
            this.isInputInFocus = true
        },
        outOfFocus() {
            this.isInputInFocus = false
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
        isDark() {
            if (this.isDefaultBGC) {
                return true
            }
            if (!this.rgb) return false
            return this.rgb.isDark
        },
        headerBackground() {
            if (this.isDefaultBGC) {
                return { backgroundColor: '#026aa7' }
            }

            if (!this.rgb) return
            return this.rgb.isDark ? utilService.getBCG(this.rgb.value, -20, 1) : utilService.getBCG(this.rgb.value, +30, 1)
        },
        buttonBackground() {
            if (!this.rgb) return
            return this.rgb.isDark ? utilService.getBCG(this.rgb.value, 30, 0.5) : utilService.getBCG(this.rgb.value, 60, 0.5)
        },
        user() {
            return this.$store.getters.loggedinUser
        },
        notifications() {
            return this.$store.getters.loggedinUser.notifications
        },
        boards() {
            const boards = this.$store.getters.boards
            if (!this.filterByTitle) return boards.slice(0, 5)
            const regex = new RegExp(this.filterByTitle, 'i');
            return boards.filter(board => regex.test(board.title)).slice(0, 5)
        },
        isDefaultBGC() {
            // console.log(this.$route.params)
            if (!this.$route.params?.id) return true
            else return false
        }

    },
    watch: {
        isDefaultBGC() {
            // console.log(this.isDefaultBGC)
            this.headerBackground

        },
        // notifications: {
        //     handler: function (val, oldVal) {
        //         console.log('hi');
        //         if(notifications && notifications.length && !notification[0].isSeen)
        //             this.isSeenNotifications = true
        //         else this.isSeenNotifications = false
        //     },
        //     deep: true
        // }

    },


}

</script>

