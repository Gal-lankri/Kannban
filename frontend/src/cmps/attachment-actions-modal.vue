<template>
    <section class="attachment-actions-modal">
        <div class="modal-header">
            <div>Edit attachment</div>
            <span class="trellicons x-icon" @click.stop="close"></span>
        </div>
        <div class="modal-main">
            <div>Link name</div>
            <input type="text" v-model="name" @keyup.enter="($event) => $event.target.blur()">

            <button @click="updateAttachment">Update</button>
        </div>
    </section>
</template>

<script>
export default {
    props: {
        attachment: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            name: this.attachment.name
        }
    },
    methods: {
        updateAttachment() {
            const newAttachment = JSON.parse(JSON.stringify(this.attachment))
            newAttachment.name = this.name
            this.$emit('updateAttachment', newAttachment)
        },
        close() {
            this.$emit('closeModal')
        }
    },
}
</script>