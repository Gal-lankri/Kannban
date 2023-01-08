<template>
    <section class="task-editor checklist-edit" @click.stop="">
        <div class=" checklist-edit-header">
            <div class="title">Add checklist</div>
            <button class="btn-close" @click.stop="closeEdit">
                <span class="trellicons x-icon"></span>
            </button>
        </div>
        <div class="flex column">
            <label class="mini-title" for="checklist-input">Title</label>
            <input type="text" v-model="checklist.title" id="checklist-input" @keyup.enter="addChecklist" v-focus>
            <button class="btn-save" @click="addChecklist">Add</button>
        </div>
    </section>
</template>

<script>
export default {
    name: 'checklist-edit',
    data() {
        return {
            checklist: {
                id: '',
                title: 'Checklist',
                todos: [
                    // {
                    //     id: '',
                    //     title: '',
                    //     isDone: false
                    // }
                ]
            }
        }
    },
    methods: {
        closeEdit() {
            this.$emit('closeEdit')
        },
        addChecklist() {
            this.$emit('updateTask', this.checklist)
        }
    },
}
</script>