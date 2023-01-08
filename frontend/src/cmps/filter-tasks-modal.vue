<template>
    <section class="tasks-filter">
        <div class="tasks-filter-header">
            <h2>Filter</h2>
            <span class="trellicons x-icon" @click="close"></span>
        </div>

        <form class="tasks-filter-main" @change.prevent="doFilter">
            <div class="text-filter">
                <p>Keyword</p>
                <div class="text-filter-input">
                    <input type="text" placeholder="Enter a keyword..." v-model="filterBy.title"
                        @keyup.enter="doFilter">
                    <voice-recognition @searchByVoice="searchByVoice" />
                </div>
                <small>Search cards, members, labels, and more.</small>
            </div>
            <div class="members-filter">
                <p>Members</p>
                <label for="no-members" class="no-members">
                    <input id="no-members" type="checkbox" v-model="filterBy.isNoMembers">
                    <span class="member-icon">
                        <svg width="18" height="18" role="presentation" focusable="false" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M12.0254 3C9.25613 3 7.01123 5.23858 7.01123 8C7.01123 10.7614 9.25613 13 12.0254 13C14.7946 13 17.0395 10.7614 17.0395 8C17.0395 5.23858 14.7946 3 12.0254 3ZM9.01688 8C9.01688 9.65685 10.3638 11 12.0254 11C13.6869 11 15.0338 9.65685 15.0338 8C15.0338 6.34315 13.6869 5 12.0254 5C10.3638 5 9.01688 6.34315 9.01688 8Z"
                                fill="currentColor"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M12.0254 11C16.7803 11 20.6765 14.6667 21.0254 19.3194C20.8721 20.2721 20.0439 21 19.0452 21H18.9741C18.9741 21 18.9741 21 18.9741 21L5.0767 21C5.07671 21 5.0767 21 5.0767 21L5.00562 21C4.00691 21 3.1787 20.2721 3.02539 19.3193C3.37428 14.6667 7.27038 11 12.0254 11ZM5.0767 19H18.9741C18.4875 15.6077 15.5618 13 12.0254 13C8.48892 13 5.56331 15.6077 5.0767 19ZM19.0451 19.9769V20.0231C19.0452 20.0154 19.0452 20.0077 19.0452 20C19.0452 19.9923 19.0452 19.9846 19.0451 19.9769Z"
                                fill="currentColor"></path>
                        </svg>
                    </span>
                    <span>No members</span>
                </label>
                <label for="self-assign">
                    <input id="self-assign" type="checkbox" v-model="filterBy.isAssignToMe">
                    <div v-if="loggedinUser.imgUrl" class="member-image" :style="memberImage(loggedinUser.imgUrl)"
                        :title="loggedinUser.fullname"> </div>
                    <span v-else class="member-initials" :title="loggedinUser.fullname">
                        {{ getInitials(loggedinUser.fullname) }}
                    </span>
                    <span>Cards assigned to me</span>
                </label>
                <!-- <label for="task-members">
                    <input id="task-members" type="checkbox"> -->
                <div class="board-members">
                    <label class="header">
                        <input type="checkbox" v-model="isShowMembers">
                        <span>Select members</span>
                        <span class="fa-solid caret-down">
                        </span>
                    </label>
                    <div v-for="member in members" v-if="isShowMembers" class="board-member">
                        <label @click.stop="">
                            <input type="checkbox" v-model="filterBy.membersIds" :value="member._id">
                            <div v-if="member.imgUrl" class="member-image" :style="memberImage(member.imgUrl)"
                                :title="member.fullname"> </div>
                            <span v-else class="member-initials" :title="member.fullname">
                                {{ getInitials(member.fullname) }}
                            </span>
                            <span>{{ member.fullname }}</span>
                        </label>
                    </div>
                </div>

                <div class="board-labels">
                    <span>Labels</span>
                    <label>
                        <input type="checkbox" v-model="filterBy.isNoLabels">
                        <span class="label-icon"><svg width="18" height="18" role="presentation" focusable="false"
                                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M13.1213 2.80762C12.3403 2.02657 11.0739 2.02657 10.2929 2.80762L3.92891 9.17158C1.19524 11.9052 1.19524 16.3374 3.92891 19.0711C6.66258 21.8047 11.0947 21.8047 13.8284 19.0711L20.1924 12.7071C20.9734 11.9261 20.9734 10.6597 20.1924 9.87869L13.1213 2.80762ZM18.7782 11.2929L11.7071 4.22183L5.34313 10.5858C3.39051 12.5384 3.39051 15.7042 5.34313 17.6569C7.29575 19.6095 10.4616 19.6095 12.4142 17.6569L18.7782 11.2929ZM10 14C10 14.5523 9.55228 15 9 15C8.44772 15 8 14.5523 8 14C8 13.4477 8.44772 13 9 13C9.55228 13 10 13.4477 10 14ZM12 14C12 15.6569 10.6569 17 9 17C7.34315 17 6 15.6569 6 14C6 12.3431 7.34315 11 9 11C10.6569 11 12 12.3431 12 14Z"
                                    fill="currentColor"></path>
                            </svg></span>
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
                    <label class="header">
                        <input type="checkbox" @change="(showAllLabels = !showAllLabels)">
                        <span>Select labels</span>
                        <span class="fa-solid caret-down">
                        </span>
                    </label>


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
        doFilter() {
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