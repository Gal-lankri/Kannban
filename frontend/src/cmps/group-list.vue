<template>

    <Container class="group-list flex scroll" orientation="horizontal" @drop="onDropGroup" group-name="group-lists"
        :get-child-payload="getChildPayload" :drop-class="dragClass">
        <Draggable id="group-details" v-for="(group, i) in groups" :key="group.id">
            <group @addTask="addTask" @updateGroup="updateGroup" @removeGroup="$emit('removeGroup', $event)"
                :group="group" :boardId="boardId" :filterBy="filterBy" />
        </Draggable>
        <section class="add-new-list">
            <transition name="open">
                <button class="open-add-list" v-if="!isFormOpen" @click="toggleForm" :class="{ isDark: rgb.isDark }"
                    :style="buttonBackground">
                    <span class="fa-regular plus-icon">
                    </span> Add a list</button>
            </transition>

            <transition name="close">
                <form v-if="isFormOpen" @submit.prevent="addGroup" class="flex group-list-form">
                    <input v-model="group.title" type="text" name="add-list" placeholder="Enter list title..." v-focus
                        @keyup.enter="addGroup">
                    <div class="add-list-btns flex">
                        <button class="add-list-btn">Add
                            list</button>
                        <button type="button" @click="toggleForm"><span class="fa-solid x-icon"></span></button>
                    </div>
                </form>
            </transition>
        </section>
    </Container>

</template>

<script>
import group from './group.vue';
import { utilService } from '../services/util.service.js';
import { Container, Draggable } from "vue3-smooth-dnd";
export default {
    name: 'group-list',
    props: {
        groups: {
            type: Array,
            required: true
        },
        boardId: {
            type: String
        },
        rgb: {
            type: Object
        },
        filterBy: {
            type: Object
        }
    },

    data() {
        return {
            isFormOpen: false,
            group: {
                id: '',
                title: '',
                isDrag: false,
                tasks: [],
            },
            groupsCopy: []

        }
    },
    created() {
        this.groupsCopy = JSON.parse(JSON.stringify(this.groups))
        // console.log(this.filterBy);
    },

    methods: {
        async onDropGroup(dropResult) {
            // console.log('ON DRAG groupList')
            try {
                this.groupsCopy = JSON.parse(JSON.stringify(this.groups))
                this.groupsCopy = this.applyDragGroup(this.groupsCopy, dropResult);
                const newGroups = await this.$store.dispatch({ type: 'updateGroups', groups: this.groupsCopy })
            }
            catch (prevGroups) {
                this.groupsCopy = JSON.parse(JSON.stringify(prevGroups))
            }
        },
        applyDragGroup(arr, dragResult) {
            const { removedIndex, addedIndex, payload } = dragResult;

            if (removedIndex === null && addedIndex === null) return arr;
            const result = [...arr];
            // console.log(result);
            let itemToAdd = payload;

            if (removedIndex !== null) {
                itemToAdd = result.splice(removedIndex, 1)[0];
            }
            if (addedIndex !== null && removedIndex !== null) {
                // console.log(itemToAdd);
                // console.log(itemToAdd.itemToMove);
                result.splice(addedIndex, 0, itemToAdd);
                // result.splice(addedIndex, 0, itemToAdd.itemToMove);
                // console.log(this.groupsCopy);
            }
            else if (addedIndex !== null) result.splice(addedIndex, 0, itemToAdd.itemToMove);
            return result;
        },
        getShouldAcceptDrop(index, sourceContainerOptions, payload) {
            return true;
        },
        getChildPayload(index) {
            // console.log(index);
            return {
                itemToMove: this.groupsCopy[index]
            }
        },


        toggleForm() {
            this.isFormOpen = !this.isFormOpen
        },

        addGroup() {
            const activity = {
                id: '',
                txt: "Added new Group",
                byMember: {
                    _id: this.user._id,
                    fullname: this.user.fullname,
                    imgUrl: this.user.imgUrl || '',
                },
                // task: this.task
            }
            if (!this.group.title) return
            this.$emit('addGroup', { ...this.group }, activity)
            this.group.title = ''
            this.group.tasks = []
        },
        updateGroup(group, activity) {
            // console.log('fhgfhghgfgf');
            // console.log(group);
            // console.log(activity);
            this.$store.dispatch({ type: 'updateGroup', group, activity })
        },
        addTask(groupId, task, activity) {
            // console.log('**************************', task)
            this.$emit('addTask', groupId, task, activity)
        }
    },
    computed: {
        user() {
            return this.$store.getters.loggedinUser
        },
        dragClass() {
            return 'on-drag'
        },
        buttonBackground() {
            // if (!this.rgb) return;
            return this.rgb.isDark
                ? utilService.getBCG(this.rgb.value, 30, 0.5)
                : utilService.getBCG(this.rgb.value, 60, 0.5);
        },

    },
    components: {
        group,
        Container,
        Draggable
    }

}
</script>

