<template>
    <section class="tasks-filter" v-click-outside="close">
        <div class="title">
            <span>Filter</span>
            <button class="btn-close" @click="close">
                <span class="trellicons x-icon"></span>
            </button>
        </div>

        <form class="tasks-filter-main flex column gap" @change.prevent="doFilter">
            <div class="text-filter  flex column gap">
                <h4>Keyword</h4>
                <div class="text-filter-input">
                    <input type="text" placeholder="Enter a keyword..." v-model="filterBy.title"
                        @keyup.enter="doFilter($event)">
                    <voice-recognition @searchByVoice="searchByVoice" />
                </div>
                <small>Search cards, members, labels, and more.</small>
            </div>


            <div class="members-filter flex column gap">
                <h4>Members</h4>
                <label for="no-members" class="no-members flex row gap">
                    <input id="no-members" type="checkbox" v-model="filterBy.isNoMembers">
                    <div class="member-image flex justify-center align-center">
                        <span class="trellicons members-icon"></span>
                    </div>
                    <span>No members</span>
                </label>
                <label for="self-assign" class="flex row gap">
                    <input id="self-assign" type="checkbox" v-model="filterBy.isAssignToMe">
                    <div v-if="loggedinUser.imgUrl" class="member-image" :style="memberImage(loggedinUser.imgUrl)"
                        :title="loggedinUser.fullname"> </div>
                    <span v-else class="member-initials" :title="loggedinUser.fullname">
                        {{ getInitials(loggedinUser.fullname) }}
                    </span>
                    <span>Cards assigned to me</span>
                </label>
                <div class="members-dropdown flex column gap">
                    <div class="header" @click="isShowMembers = !isShowMembers">
                        <!-- <input type="checkbox" v-model="isShowMembers"> -->
                        <span>Select members</span>
                        <span class="fa-solid caret-down">
                        </span>
                    </div>
                    <label v-for="member in members" v-if="isShowMembers" class="board-member flex row gap"
                        @click.stop="">
                        <input type="checkbox" v-model="filterBy.membersIds" :value="member._id">
                        <div v-if="member.imgUrl" class="member-image" :style="memberImage(member.imgUrl)"
                            :title="member.fullname"> </div>
                        <span v-else class="member-initials" :title="member.fullname">
                            {{ getInitials(member.fullname) }}
                        </span>
                        <span>{{ member.fullname }}</span>
                    </label>
                </div>

                <h4>Labels</h4>
                <div class="board-labels labels-dropdown flex column gap">
                    <label class="no-labels flex row gap">
                        <input type="checkbox" v-model="filterBy.isNoLabels">
                        <div class="member-image flex justify-center align-center">
                            <span class="trellicons labels-icon"></span>
                        </div>
                        <span>No labels</span>
                    </label>
                    <label v-for="(label, index) in labels.slice(0, 3)" :key="label.id" class="flex row align-center">
                        <input class="check-box" type="checkbox" v-model="filterBy.labelIds" :value="label.id">
                        <div class="label-color grow flex align-center"
                            :style="{ backgroundColor: rgbaColors[label.id] }">
                            <div :style="{ backgroundColor: label.color }" class="color-circle"></div>
                            {{ label.title }}
                        </div>
                    </label>

                    <div class="header" @click="showAllLabels = !showAllLabels">
                        <span>Select labels</span>
                        <span class="fa-solid caret-down">
                        </span>
                    </div>


                    <label v-for="(label, index) in labels.slice(4, labels.length - 1)" :key="label.id"
                        class="flex row align-center all-labels" v-if="showAllLabels">
                        <input class="check-box" type="checkbox" v-model="filterBy.labelIds" :value="label.id">
                        <div class="label-color grow flex align-center"
                            :style="{ backgroundColor: rgbaColors[label.id] }">
                            <div :style="{ backgroundColor: label.color }" class="color-circle"></div>
                            {{ label.title }}
                        </div>
                    </label>
                </div>
                <!-- </label> -->
            </div>
        </form>
    </section>
</template>

<script>
import { utilService } from '../services/util.service'
import voiceRecognition from './voice-recognition.vue';
export default {
    data() {
        return {
            filterBy: {
                title: '',
                membersIds: [],
                isNoMembers: false,
                isAssignToMe: false,
                labelIds: [],
                isNoLabels: false
            },
            isShowMembers: false,
            rgbaColors: {},
            showAllLabels: false
        }
    },
    created() {
        // console.log(this.loggedinUser);
        this.filterBy = JSON.parse(JSON.stringify(this.$store.getters.getFilterBy))
        // if (this.filterBy.membersIds && this.filterBy.length > 0) {
        //     this.isShowMembers = true
        // }
        // console.log(this.filterBy);
    },
    methods: {
        searchByVoice(transcript) {
            this.filterBy.title = transcript
            this.$emit('doFilter', this.filterBy)
        },
        doFilter(ev) {
            ev.preventDefault();

            // console.log(this.filterBy);
            this.$emit('doFilter', this.filterBy)
        },
        toggleIsNoMembers() {
            // this.filterBy.isNoMembers = !this.filterBy.isNoMembers
            // console.log(this.filterBy.isNoMembers)
            this.$emit('doFilter', this.filterBy)
        },
        toggleIsAssignToMe() {
            this.$emit('doFilter', this.filterBy)
        },
        close() {
            this.$emit('closeFilter')
        },
        filterByMember(id) {
            // console.log(this.filterBy.membersIds);
            this.$emit('doFilter', this.filterBy)
            // const memberIdx = this.membersIds.findIndex(memberId => memberId === id)
            // memberIdx === -1 ? this.membersIds.push(id) : this.membersIds.splice(memberIdx, 1)
        },
        toggleIsNoLabels() {
            this.$emit('doFilter', this.filterBy)
        },
        getInitials(fullname) {
            return utilService.getInitials(fullname)
        },
        memberImage(imgUrl) {
            return { backgroundImage: `url(${imgUrl})` };
        },
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
        members() {
            return this.$store.getters.board.members
        },
        labels() {
            const labels = this.$store.getters.labels
            labels.forEach(label => {
                // console.log(label.color)
                this.rgbaColors[label.id] = this.hexToRgbA(label.color)
            })
            return JSON.parse(JSON.stringify(labels))
        },
        loggedinUser() {
            return this.$store.getters.loggedinUser
        },
        rotateIcon() {
            if (this.isShowMembers) {
                return { transform: 'rotate(90deg)' }
            }
        }
    },
    components: { voiceRecognition }
}
</script>