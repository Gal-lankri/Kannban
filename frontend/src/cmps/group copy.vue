<template>
    <div class="group flex column">
        <div class="main-title flex justify-between">
            <h3>{{ group.title }}</h3>
            <button @click="toggleMenu"><span class="fa-solid elipsis-icon"></span></button>
            <div v-if="isMenuOpen" class="group-menu">
                <section class="title flex">
                    <span class="main-title">List actions</span>
                    <button @click="toggleMenu" class="btn"><span class="fa-solid x-icon"></span></button>
                </section>
                <div @click="removeGroup" class="remove btn"><span> Remove list</span></div>
            </div>
        </div>

        <ul class="clean-list flex column">
            <li v-for="task in group.tasks" :key="task.id">
                <task-preview :task="task" :groupId="this.group.id" :boardId="boardId" />
            </li>
        </ul>
        <button class="add-card-btn" v-if="!isCardOpen" @click="toggleCard">
            <span class="fa-regular plus-icon"></span><span>Add a card</span>
        </button>
        <form v-if="isCardOpen" @submit.prevent="addTask" class="flex">
            <textarea v-model="currTask.title" type="textarea" name="add-task" rows="4"
                placeholder="Enter a title for this card..." v-focus></textarea>
            <div class="add-list-btns flex">
                <button class="add-list-btn">Add card</button>
                <button type="button" @click.stop="toggleCard">
                    <span class="fa-solid x-icon"></span>
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import taskPreview from "../cmps/task-preview.vue";
import { utilService } from "../services/util.service.js";
export default {
    name: 'group',
    props: {
        group: {
            type: Object,
            required: true,
        },
        boardId: {
            type: String,
        },
    },
    data() {
        return {
            isCardOpen: false,
            currTask: {
                id: utilService.makeId(),
                title: '',
            },
            isMenuOpen: false

        }
    },

    created() {

    },

    methods: {
        toggleCard() {
            // console.log(this.isCardOpen);
            this.isCardOpen = !this.isCardOpen;
        },
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },
        addTask() {
            if (!this.currTask.title) return
            const activity = {
                id: '',
                txt: "Add new task",
                byMember: {
                    _id: this.user._id,
                    fullname: this.user.fullname,
                    imgUrl: this.user.imgUrl || '',
                },
                task: this.currTask
            }
            this.$emit('addTask', this.group.id, { ...this.currTask }, JSON.parse(JSON.stringify(activity)))
            this.currTask.title = ''
        },
        removeGroup() {
            this.toggleMenu
            const activity = {
                id: '',
                txt: ` Removed list ${this.group.title} `,
                byMember: {
                    _id: this.user._id,
                    fullname: this.user.fullname,
                    imgUrl: this.user.imgUrl || '',
                },
                task: this.currTask
            }
            this.$emit('removeGroup', this.group.id, JSON.parse(JSON.stringify(activity)))
        }

    },

    computed: {
        user() {
            return this.$store.getters.loggedinUser

        }
    },
    components: { taskPreview },
};
</script>
