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
            <Draggable class="task-preview" v-for="task in tasksToShow" :key="task.id">
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

const errorDemoBoard = 'This is a demo board, changes won\'t be saved to database.'

export default {
    components: { taskPreview, Container, Draggable, copyTaskEdit, confirmModal },
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
    data() {
        return {
            isCardOpen: false,
            currTask: {
                id: utilService.makeId(),
                title: '',
            },
            isMenuOpen: false,
            newGroupTitle: JSON.parse(JSON.stringify(this.group.title)),
            tasksCopy: [],
            tasksToShow: this.group.tasks,
            dropCounter: 0,
            isRemoveClicked: false,
            prevBoard: null,
            draggingOn: false
        }
    },

    async created() {
        this.tasksToShow = JSON.parse(JSON.stringify(this.group.tasks))
        this.prevBoard = this.$store.getters.board
        this.dropDebounce = utilService.debounce(this.onDrop, 500)
    },

    methods: {
        async onDrop(dropResult) {
            const { removedIndex, addedIndex, payload, element } = dropResult
            if (removedIndex === null && addedIndex === null) return
            this.tasksToShow = this.applyDrag(this.tasksToShow, dropResult)
            try {
                await this.$store.dispatch({
                    type: 'updateTasks',
                    payload: { tasks: this.tasksToShow, groupId: this.group.id, addedIndex }
                })
            }
            catch ({ err, preTasks }) {
                if (err?.response?.status === 401) {
                    showErrorMsg(errorDemoBoard)
                } else {
                    showErrorMsg('Error occurred while moving task.')
                    this.$store.commit({ type: 'updateBoard', board: this.oldBoard })
                    this.$store.commit({ type: 'setBoard', boardId: this.oldBoard._id })
                    this.tasksToShow = JSON.parse(JSON.stringify(this.group.tasks || []))

                }
            }
        },
        onDragStart(dragResult) {
            const { isSource, payload, willAcceptDropt } = dragResult
            if (!isSource) return
            this.prevBoard = JSON.parse(JSON.stringify(this.$store.getters.board))
        },
        applyDrag(arr, dragResult) {
            let { removedIndex, addedIndex, payload } = dragResult
            if (removedIndex === null && addedIndex === null) return arr

            const result = [...arr]
            let itemToAdd = payload
            // if (payload === null) return

            if (removedIndex !== null) {
                itemToAdd = result.splice(removedIndex, 1)[0]
            }
            if (addedIndex !== null && removedIndex !== null) {
                result.splice(addedIndex, 0, itemToAdd)
            }
            else if (addedIndex !== null) result.splice(addedIndex, 0, itemToAdd.itemToMove)
            return result
        },

        getShouldAcceptDrop(index, sourceContainerOptions, payload) {
            return true
        },

        getChildPayload(index) {
            this.tasksToShow = JSON.parse(JSON.stringify(this.group.tasks))

            return {
                itemToMove: this.tasksToShow[index]
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
    watch: {
        filterBy: {
            handler: function (filterBy, oldVal) {
                const regex = new RegExp(filterBy.title, 'i')
                this.tasksToShow = this.group.tasks.filter(task => regex.test(task.title))
                if (filterBy.isNoMembers)
                    this.tasksToShow = this.tasksToShow.filter(task => !task.memberIds?.length)
                if (filterBy.isAssignToMe)
                    this.tasksToShow = this.tasksToShow.filter(task => task.memberIds?.includes(this.user._id))
                if (filterBy.membersIds.length) {
                    this.tasksToShow = this.tasksToShow.filter(task => {
                        if (!task.memberIds?.length) return false
                        return task.memberIds.some(memberId => filterBy.membersIds.includes(memberId))
                    })
                }
                if (filterBy.isNoLabels) {
                    this.tasksToShow = this.tasksToShow.filter(task => !task.labelIds?.length)
                }
                if (filterBy.labelIds.length) {
                    this.tasksToShow = this.tasksToShow.filter(task => {
                        if (!task.labelIds?.length) return false
                        return task.labelIds.some(labelId => filterBy.labelIds.includes(labelId))
                    })
                }
            },
            deep: true
        },
        group: {
            handler: function (val, oldVal) {
                // if (this.draggingOn) return
                setTimeout(() => {
                    this.tasksToShow = JSON.parse(JSON.stringify(this.group.tasks))
                }, 600)



            },
            deep: true
        },
        tasksToShow: {
            handler: function (val, oldVal) {
            },
            deep: true
        }
    },

    computed: {
        oldBoard() {
            return this.$store.getters.oldBoard
        },
        user() {
            return this.$store.getters.loggedinUser

        },

        dragClass() {
            return 'on-drag'
        }
    },

}
</script>