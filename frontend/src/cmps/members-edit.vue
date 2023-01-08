<template>
    <section v-if="boardMembers" class="members-editor task-editor flex column" @click.stop="">
        <button class="btn-close">
            <span class="trellicons x-icon" @click.stop="closeEdit"></span>
        </button>
        <div class="title flex justify-center">
            <span>Members</span>
        </div>
        <input type="search" placeholder="Search members" v-model="filterByName" @input="debounceHandler"
            @keyup.enter="($event) => $event.target.blur()" v-focus/>
        <span class="mini-title">Board members</span>
        <section class="members-container">
            <div v-for="member in boardMembers" :key="member._id" class="member">
                <div class="member-user flex row align-center" @click.stop="toggleMember(member)">
                    <div class="flex align-center grow">
                        <div v-if="member.imgUrl" class="member-image" :style="memberImage(member.imgUrl)"> </div>
                        <span v-else class="member-initials">
                            {{ getInitials(member.fullname) }}
                        </span>
                        <span class="fullname">{{ member.fullname + " " }}</span>
                    </div>
                    <div v-if="isMemberInTask(member._id)">
                        <div class="trellicons tick-icon"></div>
                    </div>
                </div>
            </div>
        </section>
        <section v-if="noSearchResults" class="no-results">
            <span>No results</span>
        </section>
    </section>
</template>
<script>
import { utilService } from "../services/util.service";

export default {

    name: "members-edit",
    props: [],
    components: {},
    created() {

        this.boardMembers = this.$store.getters.members
        this.debounceHandler = utilService.debounce(this.getBoardMembers, 500)

        // console.log(this.boardMembers)
    },
    data() {
        return {
            boardMembers: null,
            taskMembersIds: this.$store.getters.getEditedTask.memberIds,
            filterByName: '',
        };
    },
    methods: {
        getInitials(fullname) {
            return utilService.getInitials(fullname);
        },
        memberImage(imgUrl) {
            return { backgroundImage: `url(${imgUrl})` };
        },
        toggleMember(clickedMember) {
            this.getTaskMembersIds
            // console.log('********************', clickedMember)
            var action
            const memberIdx = this.taskMembersIds.findIndex(id => {
                return clickedMember._id === id
            })
            if (memberIdx < 0) {
                this.taskMembersIds.push(clickedMember._id)
                action = 'added'
            } else {
                this.taskMembersIds.splice(memberIdx, 1)
                action = 'removed'
            }
            this.$emit('updateMembers', 'members-edit', { memberIds: this.taskMembersIds, fullname: clickedMember.fullname, action })
        },
        isMemberInTask(memberId) {
            if (!this.taskMembersIds) return
            return this.taskMembersIds.includes(memberId)
        },
        getBoardMembers() {
            // console.log('members')
            const boardMembers = JSON.parse(JSON.stringify(this.$store.getters.members))

            const regex = new RegExp(this.filterByName, 'i');

            this.boardMembers = boardMembers.filter(member => regex.test(member.fullname))

        },
        closeEdit() {
            this.$emit('closeEdit')
        },


    },
    computed: {

        getTaskMembersIds() {
            this.taskMembersIds = JSON.parse(JSON.stringify(this.$store.getters.getEditedTask.memberIds || []));

        },
        noSearchResults() {
            return !this.boardMembers.length

        },


    },
};
</script>
