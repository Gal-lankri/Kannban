<template>
    <section v-if="dueDateStr" class="dates-preview">
        <h4>Due date</h4>
        <div class="flex row">
            <input type="checkbox" @change="toggleIsComplete" v-model="isComplete">
            <button class="btn-date">{{ dueDateStr }}

                <span v-if="isComplete" class="time-tag" :style="{ backgroundColor: '#61bd4f' }">complete</span>
                <span v-else-if="dueDateMs < Date.now()" class="time-tag"
                    :style="{ backgroundColor: '#ec9488' }">overdue</span>

            </button>
        </div>
    </section>
</template>

<script>
export default {
    //
    name: 'dates-preview',
    data() {
        return {
            isComplete: false
        }
    },

    created() {
        // let isComplete = this.getIsComplete || false
        this.getIsComplete ? this.isComplete = true : this.isComplete = false
        // console.log(this.isComplete, 'from line 30');
    },

    methods: {
        toggleIsComplete() {
            // this.isComplete = !this.isComplete
            // console.log(this.isComplete);
            this.$emit('markComplete', this.isComplete)
        }
    },

    computed: {
        dueDateStr() {
            if (!this.$store.getters.getEditedTask?.dueDate) return ''
            const dueDateStr = new Date(this.$store.getters.getEditedTask.dueDate)
            return dueDateStr.toLocaleString('en-US', {
                dateStyle: 'long',
                timeStyle: 'short',
            })

        },
        dueDateMs() {
            return this.$store.getters.getEditedTask.dueDate
        },
        getIsComplete() {
            return this.$store.getters.getEditedTask.isComplete
        }
    }
}
</script>
