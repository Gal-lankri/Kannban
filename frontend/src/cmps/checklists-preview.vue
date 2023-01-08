<template>
    <section class="checklist-preview" v-if="editedChecklists">
        <div v-for="(checklist, index) in editedChecklists" :key="checklist.id" class="checklist-container">
            <div class="flex align-center  justify-between">
                <span class="trellicons checklist-icon large"></span>
                <div v-if="checklistIdTitlePicked !== editedChecklists[index].id" class="task-cmp-title grow"
                    @click="pickChecklist(checklist)">
                    <div>{{ checklist.title }}</div>
                </div>
                <textarea v-else class="checklist-title-input task-cmp-title grow" v-if="editedChecklists[index]"
                    @input="editChecklistTitle(checklist, $event)" @focus="pickChecklist(checklist)"
                    :value="editedChecklist.title" @keydown.enter.prevent="save">
                    </textarea>
                <button v-if="!editedChecklist" class="btn-delete "
                    @click.stop="removeChecklist(checklist.id)">Remove</button>
            </div>
            <div class="title-btns pad-40 flex row gap5" v-if="checklistIdTitlePicked === editedChecklists[index].id">
                <button class="btn-save" @click="save">Save</button>
                <button class="close-btn" @click="close">Cancel</button>
            </div>

            <section class=" flex column">

                <section class="flex row align-center justify-center">
                    <span class="percentage">
                        {{ progress[checklist.id] }}%
                    </span>
                    <div class="progress  w-100" v-if="checklist">
                        <div class="inner-progress" :style="progressBarStyle[checklist.id]"></div>
                    </div>
                </section>


                <form class="todos-container flex column " @change="debounceHandler(checklist)">
                    <div class="todo-container flex row w-100 align-start" v-for="todo in checklist.todos"
                        :key="todo.id">
                        <input type="checkbox" v-model="doneTodosIds" @change="toggleTodo(todo.id)" :value="todo.id"
                            @keydown.enter="($event) => $event.target.blur()">
                        <span class="checkmark"></span>
                        <div class="todo-edit-container" @click="todoEditId = todo.id">
                            <div v-if="(todoEditId !== todo.id)" class="grow" :class="{ 'line-through': todo.isDone }">
                                {{
                                        todo.title
                                }}</div>
                            <div class="todo-edit flex column gap2" v-else>
                                <textarea class="checklist-title-input todo-title-input task-cmp-title grow"
                                    v-model="todo.title" @keydown.enter.prevent="updateTodo">
                                </textarea>
                                <div class="todo-edit-btns flex row gap5">
                                    <button class="btn-save" @click.stop="updateTodo">Save</button>
                                    <button class="close-btn" @click.stop="todoEditId = ''">
                                        <span class="trellicons x-icon"></span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button v-if="(todoEditId !== todo.id)" class="btn-delete margin-0"
                            @click="removeTodo(index, checklist)"> <span class=" trello-home archive-icon">
                            </span></button>
                        <!-- <button v-if="(todoEditId !== todo.id)" class="btn-delete margin-0"
                            @click="isOpenOptions = !isOpenOptions">
                            <span class=" fa-solid elipsis-icon">
                            </span>
                        </button> -->
                    </div>
                </form>

                <button class="add-todo-btn pad-40" v-if="!checklistPicked"
                    @click="(checklistPicked = checklist.id)">Add an
                    item</button>
                <div v-else-if="checklist.id === checklistPicked" class="add-todo pad-40 flex column">
                    <textarea placeholder="Add an item" v-model="todoTxt"
                        @keydown.enter.prevent="saveTodo(checklist)"></textarea>
                    <div>
                        <button class="btn-save" @click="saveTodo(checklist)">Save</button>
                        <button class="close-btn" @click="checklistPicked = false">Cancel</button>
                    </div>
                </div>
            </section>
        </div>
    </section>
</template>

<script>
import { utilService } from '../services/util.service'

export default {
    name: 'checklists-preview',
    props: {
    },
    data() {
        return {
            editedChecklists: null,
            editedChecklist: null,

            checklistPicked: '',
            checklistIdTitlePicked: '',

            todoTxt: '',
            doneTodosIds: [],
            isOpenOptions: false,
            todoEditId: '',
            progress: {},
            progressBarStyle: {},
        }
    },
    created() {
        this.editedChecklists = JSON.parse(JSON.stringify(this.checklists || {}))
        this.debounceHandler = utilService.debounce(this.updateTodos, 500)
        this.updateProgressBarStyle()
        if (this.editedChecklists) {
            this.editedChecklists.forEach(checklist => {
                checklist.todos.forEach(todo => {
                    if (todo.isDone) {
                        this.doneTodosIds.push(todo.id)
                        // this.progress[checklist.id] ? this.progress[checklist.id] += 1 : this.progress[checklist.id] = 1
                    }
                })
            })
        }
    },
    methods: {
        pickChecklist(checklist) {
            this.editedChecklist = JSON.parse(JSON.stringify(checklist || {}))
            this.checklistIdTitlePicked = checklist.id
        },
        save() {
            const checklistIdx = this.editedChecklists.findIndex(checklist => checklist.id === this.editedChecklist.id)
            this.editedChecklists.splice(checklistIdx, 1, this.editedChecklist)
            this.$emit('updateChecklists', this.editedChecklists)
            this.editedChecklist = null
            this.checklistIdTitlePicked = ''
        },
        editChecklistTitle(checklist, ev) {
            this.editedChecklist.title = ev.target.value
        },
        close() {
            this.checklistIdTitlePicked = ''
        },
        removeChecklist(id) {
            const checklistIdx = this.editedChecklists.findIndex(checklist => checklist.id === id)
            const updatedChecklists = JSON.parse(JSON.stringify(this.editedChecklists || {}))
            updatedChecklists.splice(checklistIdx, 1)
            this.$emit('updateChecklists', updatedChecklists)
        },
        saveTodo(checklist) {
            if (!this.todoTxt.trim()) return
            const newTodo = {
                id: utilService.makeId(),
                title: this.todoTxt,
                isDone: false
            }
            checklist.todos.push(newTodo)
            this.updateChecklists(checklist, checklist)
            this.checklistPicked = false
            this.todoTxt = ''
        },
        removeTodo(todoIdx, checklist) {
            const newChecklist = JSON.parse(JSON.stringify(checklist || {}))
            checklist.todos.splice(todoIdx, 1)
            this.updateChecklists(newChecklist, checklist)
        },
        updateChecklists() {
            this.$emit('updateChecklists', this.editedChecklists)
        },

        updateTodos(checklist) {
            // this.progress[checklist.id] = 0
            checklist.todos.forEach(todo => {
                if (this.doneTodosIds.includes(todo.id)) {
                    todo.isDone = true
                    // this.progress[checklist.id] += 1
                }
                else {
                    todo.isDone = false
                }
            })
            this.updateChecklists(checklist)
        },
        updateTodo() {
            this.todoEditId = ''
            this.updateChecklists()
        },
        toggleTodo(todoId) {
            this.editedChecklists.forEach(checklist => {
                checklist.todos.forEach(todo => {
                    if (todo.id === todoId) {
                        todo.isDone = !todo.isDone
                        if (todo.isDone) {
                            // this.progress[checklist.id] += 1
                            this.doneTodosIds.push(todoId)
                        }
                        else {
                            const todoIdx = this.doneTodosIds.findIndex(id => id === todoId)
                            // this.progress[checklist.id] = 1
                            this.doneTodosIds.splice(todoIdx, 1)
                        }
                        this.updateProgressBarStyle()
                    }
                })
            })
        },
        setProgress(checklist) {
            const doneTodos = checklist.todos.length
            const numOfTodos = checklist.todos.filter(todo => todo.isDone).length
            this.progress = doneTodos / numOfTodos
        },
        updateProgressBarStyle() {
            this.editedChecklists.forEach(checklist => {
                const total = checklist.todos.length
                // console.log(total)
                const done = checklist.todos.filter(todo => todo.isDone === true).length
                // console.log(done)
                var progress = ((+done / +total) * 100).toFixed(0)
                if (isNaN(progress)) progress = 0
                // console.log(progress)
                this.progress[checklist.id] = progress
                if (+progress === 100) this.progressBarStyle[checklist.id] = { background: '#61bd4f', width: `${progress}%` }
                else if (+progress > 0) this.progressBarStyle[checklist.id] = { background: '#5ba4cf', width: `${progress}%` }
                else this.progressBarStyle[checklist.id] = { background: '#e2e4e9', width: `${progress}%` }
            })
        },
    },
    computed: {
        checklists() {
            const task = this.$store.getters.getEditedTask
            return task.checklists
        }
    },

    watch: {
        checklists: {
            handler: function (val, oldVal) {
                this.editedChecklists = JSON.parse(JSON.stringify(this.checklists || {}))
            },
            deep: true
        }
    },
}
</script>