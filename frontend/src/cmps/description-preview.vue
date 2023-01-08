<template>
    <section class="desc-container" v-click-outside="descClosed">
        <div class="flex row align-center">
            <span class="trellicons desc-icon large"></span>
            <div class="task-cmp-title grow">Description</div>
        </div>
        <div class="pad-40 flex column">
            <textarea placeholder="Add a more detailed description..." v-model="description" @focus="isDescOpen = true"
                :class="{ 'desc-open': isDescOpen }" @keydown.enter.prevent="updateDescription($event)">
                        {{ description }}
                    </textarea>
            <div class="desc-btns" v-if="isDescOpen">
                <button class="save-btn" @click="updateDescription">Save</button>
                <button class="cancel-btn" @click="isDescOpen = false">Cancel</button>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'task-description',
    props: ['description'],
    components: {},
    created() { },
    data() {
        return {

            isDescOpen: false,

        }
    },
    methods: {
        descClosed() {
            // console.log('outside********************')
            this.isDescOpen = false
        },
        updateDescription(event) {
            event.target.blur()
            this.isDescOpen = false
            this.$emit('updateDescription', this.description)
        }

    },
    computed: {},
}
</script>
