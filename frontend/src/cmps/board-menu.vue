<template>
    <section class="board-menu" :class="{ menuIsHidden: menuIsHidden }">
        <section v-if="(page === 'main')" class="board-menu-page  flex column">
            <section class="title flex justify-center row">
                <span>Menu</span>
                <button class="btn-close" @click="toggleBoardMenu">
                    <span class="fa-solid x-icon"></span>
                </button>
            </section>

            <section class="menu-container actions">
                <section class="nav-btns flex column">
                    <button class="btn">
                        <span class="fa-brands trello-icon"></span>
                        <span class="mini-title">About this board</span>
                    </button>
                    <button class="btn" @click="this.page = 'background'">
                        <span class="fa-regular img-icon"></span>
                        <span class="mini-title">Change background</span>
                    </button>
                </section>

                <section class="activities">
                    <button class="btn ">
                        <span class="trellicons activity-icon"></span>
                        <span class="mini-title">Activity</span>
                    </button>
                    <div v-if="getActivitiesLength" class="activities-container ">
                        <div v-for="activity in activitiesReverse" :key="activity.id"
                            class="activity flex row align-start">
                            <div class="activity">
                                <div v-if="activity.byMember.imgUrl" class="member-image"
                                    :style="memberImage(activity.byMember.imgUrl)"> </div>
                                <span v-else class="member-initials">
                                    {{ getInitials(activity.byMember.fullname) }}
                                </span>
                            </div>
                            <div class=" flex column justify-start">
                                <div>
                                    <span class="fullname">{{ activity.byMember.fullname + ' ' }}</span>
                                    <span>{{ activity.txt }}</span>
                                </div>
                                <span class="activity-time">{{ getTimeAgo(activity.createdAt) }}</span>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="flex w-100">

                    <button class="btn delete-btn w-100" @click="confirmDelete">
                        <span class="trellicons archive"></span>
                        <span class="mini-title">Archive board...</span>
                    </button>
                </section>
            </section>
        </section>

        <section v-if="page === 'background'" class="board-menu-page  flex column">
            <section class="title flex justify-center row">
                <button class="btn-back" @click="this.page = 'main'">
                    <span class="fa-solid arrow-icon"></span>
                </button>
                <span>Change background</span>
                <button class="btn-close" @click="toggleBoardMenu">
                    <span class="fa-solid x-icon"></span>
                </button>
            </section>
            <section>
                <div class="  flex row align-center justify-between">
                    <div class=" photos flex column align-center" @click="this.page = 'bgImg'">
                        <div class="btn">
                        </div>
                        <span>Photos</span>
                    </div>
                    <div class="colors flex column  align-center" @click="this.page = 'bgColor'">
                        <div class="btn">
                        </div>
                        <span>Colors</span>
                    </div>
                </div>
            </section>
            <section>
                <div class="mini-title">Costume</div>

                <div class="costume flex column ">
                    <div class="btn flex align-center justify-center">
                        <span class="fa-regular plus-icon"></span>
                    </div>
                </div>
            </section>
        </section>

        <section v-if="(page === 'bgColor')" class="board-menu-page  flex column">
            <section class="title flex justify-center row">
                <button class="btn-back" @click="this.page = 'background'">
                    <span class="fa-solid arrow-icon"></span>
                </button>
                <span>Colors</span>
                <button class="btn-close" @click="toggleBoardMenu">
                    <span class="fa-solid x-icon"></span>
                </button>
            </section>
            <section class=" flex row align-center wrap gap justify-between">
                <div v-for="color in colors" :key="color" class="color-sample" :style="{ backgroundColor: color }"
                    @click="setBoardStyle(color)">
                </div>
            </section>
        </section>

        <section v-if="(page === 'bgImg')" class="board-menu-page  flex column">
            <section class="title flex justify-center row">
                <button class="btn-back" @click="this.page = 'background'">
                    <span class="fa-solid arrow-icon"></span>
                </button>
                <span>Photos by Unsplash</span>
                <button class="btn-close" @click="toggleBoardMenu">
                    <span class="fa-solid x-icon"></span>
                </button>
            </section>
            <input type="text" placeholder="Search Photos..." @input="debounceHandler" v-model="searchTxt"
                @keyup.enter="getPhotos">
            <section class="images flex row align-center wrap gap justify-between">
                <img v-if="!imgUrls" src="../assets/svg/loader.svg" alt="" class="loader">
                <img v-else v-for="(imgUrl, index) in imgUrls" :key="imgUrl" :src="imgUrl" class="color-sample"
                    @click="setBoardStyle(imgUrl)" v-show="isShowImg[index]" @load="() => { isShowImg[index] = true }">
            </section>
        </section>
    </section>
</template>
<script>
import axios from 'axios'
import { utilService } from '../services/util.service';

export default {
    name: 'board-menu',
    emit: ['toggleBoardMenu'],
    props: ['menuIsHidden', 'activities'],
    components: {},
    created() {
        this.debounceHandler = utilService.debounce(this.getPhotos, 600)
        this.debounceHandler()
    },
    data() {
        return {
            isShowImg: [false, false, false, false, false, false,
                false, false, false, false, false, false, false, false],
            page: 'main',
            imageDownloadUrl: '',
            imgUrls: '',
            showBGCMenu: false,
            searchTxt: '',
            colors: ['#0079bf', '#d29034', '#519839', '#b04632', '#89609e', '#cd5a91', '#4bbf6b', '#00aecc', '#838c91'],
            clientId: 'wONkEH1Be08ksV3ijwHHpfu8tfvmD6SnhsRpvZBWVgg',

        };
    },
    methods: {
        confirmDelete() {
            // console.log('hi');
            this.$emit('confirmDelete')
        },
        getPhotos() {
            const key = "unsplashDB";

            // if (!localStorage.getItem(key)) console.log(this.searchTxt);
            if (!this.searchTxt && localStorage.getItem(key)) {
                this.imgUrls = JSON.parse(localStorage.getItem(key))
                console.log('from cache');
            }
            else {
                let apiUrl = `https://api.unsplash.com/search/photos?query=${this.searchTxt ? this.searchTxt : "landscape"
                    }&orientation=landscape&per_page=1200&client_id=${this.clientId}`;
                axios(apiUrl).then(({ data }) => {
                    this.imgUrls = data.results.map((res) => res.urls.full).slice(0, 12);

                    // console.log(this.imgUrls);
                });
            }
        },
        memberImage(imgUrl) {
            return { backgroundImage: `url(${imgUrl})` };
        },
        getInitials(fullname) {
            return utilService.getInitials(fullname)
        },
        getTimeAgo(timestamp) {
            return utilService.timeAgo(timestamp)
        },
        toggleMenuPage(page) {
            this.page = page

        },
        toggleBoardMenu() {
            // console.log("A");
            this.$emit("toggleBoardMenu", this.toggleBoardMenu);
        },
        setBoardStyle(style) {
            if (style.startsWith('#')) {
                this.board.style = { bgColor: style }
            } else {
                this.board.style = { backgroundImage: style }
            }
            this.$store.dispatch({ type: "updateBoard", board: this.board });
        }
    },
    computed: {
        getActivitiesLength() {
            return this.activities.length
        },
        activitiesReverse() {

            const activities = JSON.parse(JSON.stringify(this.activities))
            return activities.reverse()

        },
        board() {
            const board = JSON.parse(JSON.stringify(this.$store.getters.board || {}))

            return board
        },

    },
};
</script>
