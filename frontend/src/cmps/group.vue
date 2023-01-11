<template>
    <div class="group flex column">
        <div class="main-title flex column justify-between">
            <div class="flex row align-center justify-between w-100">
                <input v-model="newGroupTitle" @input="updateGroup" @keyup.enter="($event) => $event.target.blur()" />
                <button class="btn-menu" @click="toggleMenu">
                    <span class="fa-solid elipsis-icon"></span>
                </button>
            </div>

            <div v-if="isMenuOpen" class=" task-editor" v-click-outside="() => isMenuOpen = false">
                <section class=" title flex row justify-center">
                    <span>List actions</span>
                    <button @click="toggleMenu" class="btn-close">
                        <span class="trellicons x-icon"></span>
                    </button>
                </section>
                <div class="flex column">
                    <button @click="toggleModal" class="remove btn">
                        <span> Remove list</span>
                    </button>
                </div>
            </div>
        </div>

        <Container class="task-preview-container flex column" orientation="vertical" group-name="group-tasks"
            ref="group" @drop="onDrop" @drag-start="onDragStart"
            :shouldAcceptDrop="(e, payload) => (e.groupName === 'group-tasks' && !payload.loading)"
            :get-child-payload="getChildPayload" drop-class="" :drop-class="dragClass">
            <Draggable class="task-preview" v-for="task in editedTasks" :key="task.id">
                <task-preview :task="task" :groupId="this.group.id" :boardId="boardId" />
            </Draggable>
            <form ref="form" class="add-card-form flex" v-if="isCardOpen" @submit.prevent="addTask">
                <textarea v-model="currTask.title" type="textarea" name="add-task" rows="4"
                    placeholder="Enter a title for this card..." v-focus @keyup.enter="addTask"></textarea>
                <div class="add-list-btns flex">
                    <button class="add-list-btn">Add card</button>
                    <button type="button" @click.stop="toggleCard">
                        <span class="fa-solid x-icon"></span>
                    </button>
                </div>
            </form>
        </Container>
        <div v-if="!isCardOpen" class="add-card-container flex">
            <button class="add-card-btn" @click="toggleCard">
                <span class="fa-regular plus-icon"></span><span>Add a card</span>
            </button>
        </div>
    </div>

    <confirm-modal v-if="isRemoveClicked" :msg="'Are you sure?'" @remove="removeGroup" @closeModal="toggleModal" />
</template>

<script>
import taskPreview from "../cmps/task-preview.vue"
import { utilService } from "../services/util.service.js"
import { Container, Draggable } from "vue3-smooth-dnd"
import copyTaskEdit from './copy-task-edit.vue'
import confirmModal from './confirm-modal.vue'
import { showErrorMsg } from '../services/event-bus.service'

export default {
    name: 'group',
    emits: ["addTask", "updateGroup", "removeGroup"],
    props: {
        group: {
            type: Object,
            required: true,
        },
        boardId: {
            type: String,
        },
        filterBy: {
            type: Object,
        },
    },
    components: { taskPreview, Container, Draggable, copyTaskEdit, confirmModal },

    data() {
        return {
            isCardOpen: false,
            currTask: {
                id: utilService.makeId(),
                title: '',
            },
            isMenuOpen: false,
            newGroupTitle: JSON.parse(JSON.stringify(this.group.title)),
            prevTasks: [],
            editedTasks: [],
            dropCounter: 0,
            isRemoveClicked: false,
            prevBoard: null
        }
    },

    created() {

        this.editedTasks = JSON.parse(JSON.stringify(this.group.tasks || []))
        this.dropDebounce = utilService.debounce(this.onDrop, 500)


    },

    methods: {
        onDragStart(dragResult) {
            console.log(`dragResult:`, dragResult)
            const { isSource, payload, willAcceptDropt } = dragResult

            if (!isSource) return
            this.prevBoard = JSON.parse(JSON.stringify(this.$store.getters.board))
        },

        async onDrop(dropResult) {
            const { removedIndex, addedIndex, payload, element } = dropResult
            if (removedIndex === null && addedIndex === null) return

            const tasks = JSON.parse(JSON.stringify(this.group.tasks || []))
            this.editedTasks = this.applyDrag(tasks, dropResult)



            try {

                await this.$store.dispatch({
                    type: 'updateTasks',
                    payload: { tasks: this.editedTasks, groupId: this.group.id, addedIndex, type: 'dnd' }
                })


            }
            catch (prevTasks) {
                showErrorMsg('Error in drag and drop')
                this.$store.commit({ type: 'updateBoard', board: this.prevBoard })
                this.$store.commit({ type: 'setBoard', boardId: this.prevBoard._id })
                this.editedTasks = JSON.parse(JSON.stringify(this.group.tasks || []))
            }


        },

        applyDrag(tasks, { removedIndex, addedIndex, payload }) {

            if (removedIndex === null && addedIndex === null) return tasks
            if (payload === null) return

            if (removedIndex !== null) {
                tasks.splice(removedIndex, 1)[0]
            }
            else if (addedIndex !== null) {
                tasks.splice(addedIndex, 0, { ...payload.itemToMove })
            }
            return tasks
        },

        getShouldAcceptDrop(index, sourceContainerOptions, payload) {
            return true
        },

        getChildPayload(index) {
            console.log(`index:`, index)

            return {
                itemToMove: this.editedTasks[index]
            }
        },

        updateGroup() {
            if (!this.newGroupTitle) return
            const activity = {
                id: '',
                txt: `Updated Group: ${this.group.title}`,
                byMember: {
                    _id: this.user._id,
                    fullname: this.user.fullname,
                    imgUrl: this.user.imgUrl || '',
                },
            }
            const group = JSON.parse(JSON.stringify(this.group))
            group.title = this.newGroupTitle
            this.$emit('updateGroup', group, activity)
        },
        copyGroup() {
            this.$stor.dispatch({ type: 'addGroup', group: JSON.parse(JSON.stringify(this.group)) })
        },
        toggleCard() {
            this.isCardOpen = !this.isCardOpen

            if (this.isCardOpen) {
                setTimeout(() => {
                    this.$refs.form.scrollIntoView()
                }, 100)
            }
        },
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen
        },
        toggleModal() {
            this.isRemoveClicked = !this.isRemoveClicked
        },
        addTask() {
            if (!this.currTask.title) return
            const activity = {
                id: '',
                txt: `Added ${this.currTask.title} task to ${this.group.title}`,
                byMember: {
                    _id: this.user._id,
                    fullname: this.user.fullname,
                    imgUrl: this.user.imgUrl || '',
                },
                task: this.currTask
            }
            this.$emit('addTask', this.group.id, { ...this.currTask }, JSON.parse(JSON.stringify(activity)))
            this.currTask = {
                id: utilService.makeId(),
                title: '',
            }
        },
        removeGroup() {
            this.toggleMenu
            const activity = {
                id: '',
                txt: ` Deleted list ${this.group.title} `,
                byMember: {
                    _id: this.user._id,
                    fullname: this.user.fullname,
                    imgUrl: this.user.imgUrl || '',
                },
                task: this.currTask
            }
            this.$emit('removeGroup', this.group.id, JSON.parse(JSON.stringify(activity)))
        },
        isScroll() {
            var hasVerticalScrollbar = this.$refs.group.offsetHeight != this.$refs.group.clientHeight
            return hasVerticalScrollbar
        }

    },

    computed: {
        user() {
            return this.$store.getters.loggedinUser

        },
        board() {
            return this.$store.getters.board

        },
        dragClass() {
            return 'on-drag'
        },
        editedTask() {
            return this.$store.getters.getEditedTask
        }
    },
    watch: {
        filterBy: {
            handler: function (filterBy, oldVal) {
                const regex = new RegExp(filterBy.title, 'i')
                this.editedTasks = this.editedTasks.filter(task => regex.test(task.title))
                if (filterBy.isNoMembers)
                    this.editedTasks = this.editedTasks.filter(task => !task.memberIds?.length)
                if (filterBy.isAssignToMe)
                    this.editedTasks = this.editedTasks.filter(task => task.memberIds?.includes(this.user._id))
                if (filterBy.membersIds.length) {
                    this.editedTasks = this.editedTasks.filter(task => {
                        if (!task.memberIds?.length) return false
                        return task.memberIds.some(memberId => filterBy.membersIds.includes(memberId))
                        // task.memberIds?.includes(this.user._id)
                    })
                }
                if (filterBy.isNoLabels) {
                    this.editedTasks = this.editedTasks.filter(task => !task.labelIds?.length)
                }
                if (filterBy.labelIds.length) {
                    this.editedTasks = this.editedTasks.filter(task => {
                        if (!task.labelIds?.length) return false
                        return task.labelIds.some(labelId => filterBy.labelIds.includes(labelId))
                    })
                }
            },
            deep: true
        },
        group: {
            handler: function (val, oldVal) {
                setTimeout(() => {
                    this.editedTasks = JSON.parse(JSON.stringify(this.group.tasks || []))
                }, 600);

            },
            deep: true
        },
        editedTask: {
            handler: function (val, oldVal) {
                this.editedTasks.forEach((task) => {
                    if (task.id === val.id) task = val
                })
            },
            deep: true

        }
    },

}
</script>
