<template>
    <div class="screen"></div>

    <section class="confirm-modal" v-click-outside="closeModal">
        <div class="confirm-modal-header">
            <h2>{{ msg }}</h2>
            <!-- <button class="btn-close" @click.stop="closeEdit">
                <span class="trellicons x-icon"></span>
            </button> -->
        </div>
        <div class="flex gap">
            <button class="btn-ok" @click="remove">OK</button>
            <button class="btn-cancel" @click="closeModal">Cancel</button>
        </div>
    </section>
</template>

<script>
export default {
    emits: ["remove", "closeModal"],
    props: {
        msg: {
            type: String,
            required: true
        },
    },
    methods: {
        remove() {
            this.$emit('remove')
        },
        closeModal() {
            this.$emit('closeModal')

        },
    },
}
</script>