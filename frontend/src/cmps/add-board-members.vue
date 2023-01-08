<template>
    <div class="screen"></div>

    <section class="add-board-members" v-click-outside="close">
        <div class="add-board-members-header">
            <div>Share board</div>
            <button class="btn-close">
                <span class="trellicons x-icon" @click.stop="close"></span>
            </button>
        </div>

        <div class="add-board-members-search">
            <input type="text" placeholder="Email address or name" v-model="filterByName" @input="setSearchedMembers"
                v-focus>
            <button>Share</button>

            <div v-if="(searchedMembers.length > 0)" class="search-results">
                <div class="searched-member" v-for="member in searchedMembers.slice(0, 5)" @click="addMember(member)">
                    <div class="flex align-center grow">
                        <div v-if="member.imgUrl" class="member-image" :style="memberImage(member.imgUrl)"> </div>
                        <span v-else class="member-initials">
                            {{ getInitials(member.fullname) }}
                        </span>
                        <span class="fullname">{{ member.fullname + " " }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="board-members">
            <span>Recently joined</span>
            <div v-for="member in boardMembers" :key="member._id" class="board-member w-100">
                <div class="member-user flex row align-center justify-center w-100">
                    <!-- <div class="flex align-center grow"> -->
                    <div v-if="member.imgUrl" class="member-image" :style="memberImage(member.imgUrl)"> </div>
                    <span v-else class="member-initials">
                        {{ getInitials(member.fullname) }}
                    </span>
                    <span class="fullname grow">{{ member.fullname + " " }}</span>

                    <button @click="confirm(member._id)">
                        <span class="trellicons x-icon"></span>
                    </button>
                    <!-- </div> -->
                </div>
            </div>
        </div>
    </section>


    <confirm-modal :msg="'Are you sure?'" v-if="isConfirmModal" @remove="removeFromBoard"
        @closeModal="() => { isConfirmModal = false }" v-click-outside="() => { isConfirmModal = false }" />
</template>
<script>
import { utilService } from "../services/util.service";
import Multiselect from '@vueform/multiselect'
import { ref } from 'vue'

import confirmModal from "./confirm-modal.vue";

export default {
    name: "members-edit",
    props: [],
    components: { Multiselect, confirmModal },
    emits: ['removeMember', 'addMember', 'close'],
    created() {
        this.debounceHandler = utilService.debounce(this.getBoardMembers, 500)
        // console.log(this.boardMembers)
    },
    data() {
        return {
            filterByName: '',
            searchedMembers: [],
            // searchedMembersObjects: [],
            membersToAdd: [],
            value: [],
            value1: ref([]),
            options: [
                // {
                //     value: 'Option1',
                //     label: 'Option1',
                // },
                // {
                //     value: 'Option2',
                //     label: 'Option2',
                // },
                // {
                //     value: 'Option3',
                //     label: 'Option3',
                // },
                // {
                //     value: 'Option4',
                //     label: 'Option4',
                // },
                // {
                //     value: 'Option5',
                //     label: 'Option5',
                // },
            ],
            isConfirmModal: false,
            memberIdToRemove: ''
        }
    },
    methods: {
        getInitials(fullname) {
            return utilService.getInitials(fullname);
        },
        removeFromBoard() {
            this.$emit('removeMember', this.memberIdToRemove)
            this.memberIdToRemove = ''
            this.isConfirmModal = false
        },
        confirm(memberId) {
            this.isConfirmModal = true
            this.memberIdToRemove = memberId
        },
        memberImage(imgUrl) {
            return { backgroundImage: `url(${imgUrl})` };
        },

        addMember(member) {
            this.searchedMembers = []
            this.membersToAdd.push(member)
            this.$emit('addMember', member)
        },
        isMemberInBoard(memberId) {
            // console.log(this.boardMembers);
            if (!this.boardMembers.length) return
            const member = this.boardMembers.find(member => member._id === memberId)
            return member !== -1
        },
        setSearchedMembers() {
            if (!this.filterByName) {
                this.searchedMembers = []
                return
            }
            // console.log('members')
            // const boardMembers = JSON.parse(JSON.stringify(this.$store.getters.members))
            // console.log(this.users)
            // console.log(this.boardMembersIds)
            const regex = new RegExp(this.filterByName, 'i');
            this.searchedMembers = this.users.filter(user => {
                if (this.boardMembersIds.includes(user._id))
                    return false
                return regex.test(user.fullname)
            })
            // console.log(this.searchedMembers);
            // console.log(this.users);
            // console.log(this.boardMembersIds);
        },
        close() {
            this.$emit('close')
        }


    },
    computed: {

        boardMembers() {
            const boardMembers = JSON.parse(JSON.stringify(this.$store.getters.board.members)).reverse()
            // this.searchedMembersObjects = boardMembers.map(member => {
            //     return {

            //         _id: member._id,
            //         fullname: member.fullname,
            //         imgUrl: member.imgUrl

            //     }
            // })
            return boardMembers

        },
        users() {
            // console.log(this.$store.getters.users);
            return this.$store.getters.users
        },
        noSearchResults() {
            return !this.boardMembers.length

        },
        boardMembersIds() {
            return this.$store.getters.board.members.map(member => member._id)
        }


    },
};
</script>
