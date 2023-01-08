<template>
    <section v-if="boardMembers" class=" flex column"
        :class="[isTaskDetails ? 'members-preview' : 'members-task-preview']">
        <h4 v-if="isTaskDetails" class="title">Members</h4>
        <section class="members-container flex row align-center">
            <div v-for="member in taskMembers" :title="member.fullname">
                <div v-if="member.imgUrl" class="member-image" :style="memberImage(member.imgUrl)"
                    :title="member.fullname"> </div>
                <span v-else class="member-initials" :title="member.fullname">
                    {{ getInitials(member.fullname) }}
                </span>
            </div>
            <div v-if="isTaskDetails" class="btn-plus flex justify-center align-center" @click="openMembersEditor">
                <span class="fa-regular plus-icon"></span>
            </div>
        </section>
    </section>
</template>

<script>

import { utilService } from '../services/util.service.js'

export default {
    name: 'members-preview',
    props: ['memberIds', 'isTaskDetails'],
    components: {},
    created() {
        // console.log(this.memberIds, '***************')
        this.boardMembers = this.$store.getters.members

    },
    data() {
        return {
            boardMembers: null,
            // taskMembers: null,

        }
    },
    methods: {
        memberImage(imgUrl) {
            return { backgroundImage: `url(${imgUrl})` };
        },
        getInitials(fullname) {
            return utilService.getInitials(fullname)
        },
        openMembersEditor() {
            this.$emit('openMembersEditor')
        },

    },
    computed: {
        taskMembers() {

            const members = this.boardMembers.filter(member => {
                return this.memberIds.includes(member._id)
            })

            return this.isTaskDetails ? members : members.slice(0, 4)
        },
        class() {
            return this.isTaskDetails ? 'members-preview' : 'task-preview'
        }
    },
}
</script>
