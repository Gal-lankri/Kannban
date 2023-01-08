<template>
    <div v-if="getBackground" class="task-preview-cover" @click="goTo" :class="getCoverType"
        :style="{ backgroundColor: getBackground, backgroundImage: `url(${getBackground})` }"></div>
    <section v-if="task" class="task-preview-details flex column " @click="goTo">
        <section v-if="labels" class="labels-preview">
            <ul class="clean-list flex">
                <li :title="(label.title)" @click.stop="togglePreviewLabels" v-for="label in labels" :key="label.id"
                    :style="{ backgroundColor: label.color, height: isPreviewLabelsOpen ? '17px' : '', transition: isPreviewLabelsOpen ? 'all 0.7s' : 'all 0.7s', filter: !isPreviewLabelsOpen ? 'saturate(5)' : 'saturate(1.5)' }">
                    <div v-if="isPreviewLabelsOpen" :style="{ backgroundColor: label.color }" class="color-circle">
                    </div>
                    <span v-if="isPreviewLabelsOpen">{{ label.title }}</span>
                </li>
            </ul>
        </section>
        <div class="task-title">
            <h3>{{ task.title }}</h3>
        </div>
        <section class="task-preview-icons flex wrap justify-between gap5">
            <div class="preview-icons flex row align-center">
                <div v-if="task.dueDate" class="task-date-preview flex">
                    <!-- <input class="trellicons icon-clock" type="checkbox" 
                        v-model="isComplete" /> -->
                    <div class="btn-date flex" @click.stop="toggleIsComplete"
                        :style="{ backgroundColor: getIsComplete ? '#61bd4f' : '', color: getIsComplete ? '#ffff' : ''}">
                        <span class="trellicons icon-clock"></span>
                        <span class="fa-regular square-icon"></span>
                        <span class="date-str" :style="{ color: getIsComplete ? '#ffff' : '' }"> {{ getDueDateStr }}</span>
                        <span v-if="getDueDateStr < Date.now()" class="time-tag"
                            :style="{ backgroundColor: '#ec9488' }"></span>

                    </div>
                    <!-- <span class="date-str">{{ getDueDateStr }}</span> -->
                </div>
                <span v-if="task.description" class="trellicons desc-icon" title="This card has a description"></span>
                <div class="attachments flex" v-if="task.attachments && task.attachments.length " title="Attachments">
                    <span  class="trellicons attachment" ></span>
                    <span>{{
                            task.attachments.length
                    }}</span>
                </div>
                <span v-if="task.location" class="trellicons location-icon"></span>
                <div v-if="taskTodosLength" class="task-todos flex"
                    :style="{ backgroundColor: allTodosDone, color: allTodosDone ? '#fdfefd' : '' }"
                    title="Checklist items">
                    <span class="trellicons checklist-icon flex"></span>
                    <span>{{ taskDoneTodos }}/{{ taskTodosLength }}</span>
                </div>
            </div>
            <!-- <section v-if="dueDateStr" class="dates-preview">
                <h4>Due date</h4>
                <div class="flex row">
                    
                    <button class="btn-date">{{ dueDateStr }}

                        <span v-if="isComplete" class="time-tag" :style="{ backgroundColor: '#61bd4f' }">complete</span>
                        <span v-else-if="dueDateMs < Date.now()" class="time-tag"
                            :style="{ backgroundColor: '#ec9488' }">overdue</span>

                    </button>
                </div>
            </section> -->
            <div class="flex row shrink justify-between grow">
                <div class=""></div>
                <members-preview v-if="task.memberIds" :memberIds="task.memberIds" :isTaskDetails="false"
                    class="members-task-preview justify-end" />
            </div>
        </section>
    </section>
</template>
<script>

import membersPreview from './members-preview.vue'

export default {
    name: 'task-preview',
    props: {
        task: {
            type: Object,
            required: true
        },
        groupId: {
            type: String,
            required: true
        },
        boardId: {
            type: String,
            required: true
        }
    },

    components: {
        membersPreview
    },

    data() {
        return {
            taskLabelsIds: null,
            isLabelsOpen: false,
            isComplete: false
        }
    },

    created() {
        this.taskLabelsIds = this.task.labelIds
        this.getIsComplete ? this.isComplete = true : this.isComplete = false
        // console.log(this.isComplete);

    },

    methods: {
        goTo() {
            this.$router.push(`/board/${this.boardId}/${this.groupId}/${this.task.id}`)
        },
        togglePreviewLabels() {
            this.isLabelsOpen = !this.isLabelsOpen
            this.$store.commit({ type: 'togglePreviewLabels', isOpen: this.isLabelsOpen })
        },
        toggleIsComplete() {
            // this.isComplete = !this.isComplete
            this.updateTask(!this.getIsComplete)
        },
        async updateTask(data) {
            // console.log(data)
            let taskToUpdate = JSON.parse(JSON.stringify(this.task))
            taskToUpdate.isComplete = data
            const txt = data ? `Marked ${this.task.title} as complete` : `Unmarked ${this.task.title} as complete`
            taskToUpdate.isComplete = data

            try {
                // console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', this.task);
                this.$store.commit({ type: 'updateTask', payload: { task: taskToUpdate, groupId: this.groupId } })
                let updatedTask = await this.$store.dispatch({
                    type: "updateTask",
                    payload: {
                        task: taskToUpdate,
                        groupId: this.groupId,
                        activity: {
                            txt,
                            memberIds: this.task.memberIds,
                            boardId: this.$route.params.id,
                            groupId: this.groupId,
                            taskId: this.task.id,
                            task: {
                                id: this.task.id,
                                title: this.task.title
                            },
                            byMember: {
                                _id: this.user._id,
                                fullname: this.user.fullname,
                                imgUrl: this.user.imgUrl || "",
                            },
                        },
                    },
                })
            } catch (prevTask) {
                this.$store.commit({ type: 'updateTask', payload: { task: prevTask, groupId: this.groupId } })
                this.task = JSON.parse(JSON.stringify(this.getTask))
                console.log("Failed in task update")
            }

        }
    },

    computed: {
        labels() {
            if (!this.task.labelIds || !this.task.labelIds.length) return
            return this.$store.getters.board.labels.filter(labels => {
                if (this.task.labelIds.includes(labels.id))
                    return labels
            })
        },

        isPreviewLabelsOpen() {
            return this.$store.getters.isPreviewLabelsOpen
        },

        taskTodos() {
            const taskTodos = []
            if (this.task.checklists) {
                this.task.checklists.forEach(checklist => {
                    if (checklist.todos) {
                        checklist.todos.forEach(todo => {
                            taskTodos.push(todo)
                        })
                    }
                })
            }
            return taskTodos
        },

        taskDoneTodos() {
            const doneTodos = this.taskTodos.filter(todo => todo.isDone)
            return doneTodos.length
        },

        taskTodosLength() {
            // console.log(this.taskTodos.length);
            return this.taskTodos.length
        },

        getBackground() {
            if (this.task.style?.bgColor) {
                return this.task.style.bgColor
            } else if (this.task.style?.imgUrl) {
                return this.task.style.imgUrl
            }
        },

        allTodosDone() {
            if (this.taskTodosLength === this.taskDoneTodos)
                return '#61bd4f'
        },
        getCoverType() {
            if (this.getBackground === this.task.style.bgColor)
                return 'background-color'
            else {
                return 'background-img'
            }
        },
        getDueDateStr() {
            // console.log(this.task.dueDate);
            return new Date(this.task.dueDate).toDateString().slice(4, 10)
        },
        getIsComplete() {
            return this.task.isComplete
        }, user() {
            return this.$store.getters.loggedinUser;
        }


    }
}

</script>