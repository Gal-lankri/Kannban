<template>
    <section v-if="task" class="copy-task-edit task-editor" @click.stop="">
        <button class="btn-close" @click.stop="closeEdit">
            <span class="trellicons x-icon"></span>
        </button>
        <div class="title">Copy task</div>

        <form class="copy-edit-main">
            <label class="mini-title" for="copy-input">Title</label>
            <textarea type="text" v-model="task.title" id="copy-input"></textarea>
            <label class="mini-title" for="copy-input">Choose board</label>
            <select class="board-select" v-model="toBoardId" @change="setBoard">
                <option v-for="board in getBoards" :key="board._id" :value="board._id">{{ board.title }}</option>
            </select>
            <!-- {{ toBoardId }} -->
            <label class="mini-title" for="copy-input">Choose list</label>
            <select class="group-select" v-model="toGroupId" @change="setGroup">
                <option v-for="group in board.groups" :key="group.id" :value="group.id">{{ group.title }}
                </option>
            </select>
            <!-- {{ toGroupId }} -->
            <button class="btn-add" @click="copyTask">Copy card</button>
        </form>
    </section>
</template>

<script>
export default {
    name: 'copy-task-edit',
    data() {
        return {
            toGroupId: '',
            toBoardId: '',
            // task: JSON.parse(JSON.stringify(this.getTask)),
            // toBoard: JSON.parse(JSON.stringify(this.getBoard)),
        }
    },
    created() {
        this.task = JSON.parse(JSON.stringify(this.getTask))
        this.board = JSON.parse(JSON.stringify(this.getBoard))
        this.group = JSON.parse(JSON.stringify(this.board))
        this.toGroupId = ''
        this.toBoardId = ''
    },

    methods: {
        closeEdit() {
            this.$emit('closeEdit')
        },
        copyTask() {
            delete this.task.id
            //TODOOOOOOO
            this.$emit('copyTask', { task: this.task, toGroupId: this.toGroupId, toBoardId: this.toBoardId })
        },
        setBoard() {
            this.board = this.getBoards.find(b => b._id === this.toBoardId)
            // console.log(this.board);
        },
        setGroup() {
            this.group = this.board.groups.find(g => g.id === this.toGroupId)
            // console.log(this.group);
        }
    },
    computed: {
        getTask() {
            return this.$store.getters.getEditedTask
        },
        getBoards() {
            return this.$store.getters.boards
        },
        getBoard() {
            return this.$store.getters.board
        },
        getGroups() {
            return this.board.groups
        }
    }

}
</script>
