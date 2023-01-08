<template>
    <section class="create-label-modal task-editor">
        <div class="create-label-header w-100">
            <div class="title w-100">Edit Label</div>
            <button class="btn-close" @click.stop="closeEdit">
                <span class="trellicons x-icon"></span>
            </button>
        </div>
        <div class="create-label-main">
            <div class="picked-color" :style="{ backgroundColor: getPickedColor }"><span>{{ title }}</span></div>
            <h4 class="mini-title">Title</h4>
            <input type="text" v-model="title" @keyup.enter="save">

            <h4 class="mini-title">Select a color</h4>
            <div class="colors-container flex row wrap gap5 justify-between">
                <div class="label-color" v-for="color in colorPallet" :style="{ backgroundColor: color }"
                    @click="(pickedColor = color)"></div>
            </div>
            <button class="btn-remove">Remove color</button>
            <button class="btn-save" @click="save">Save</button>
            <button class="btn-remove" @click="removeLabel(label)" v-if="label">Delete</button>
        </div>
    </section>
</template>

<script>
export default {
    name: 'create-label-modal',
    props: {
        label: {
            type: String,
            required: true
        },
    },
    data() {
        return {
            colorPallet: ['#b7ddb0', '#f5ea92', '#fad29c', '#efb3ab', '#dfc0eb'
                , '#7bc86c', '#f5dd29', '#ffaf3f', '#ef7564', '#cd8de5', '#8bbdd9', '#8fdfeb'
                , '#b3f1d0', '#f9c2e4', '#505f79', '#5ba4cf', '#29cce5', '#6deca9'
                , '#ff8ed4', '#344563'],
            pickedColor: '',
            title: ''
        }
    },
    created() {
        // console.log(this.label);
        if (this.label) {
            this.pickedColor = this.label.color
            this.title = this.label.title
        }
    },
    methods: {
        save() {
            if (!this.pickedColor) return
            this.$emit('createdLabel', { color: this.pickedColor, title: this.title, id: this.label?.id || '' })
        },
        closeEdit() {
            this.$emit('closeEdit')
        },
        removeLabel(label) {
            this.$emit('removeLabel', label)
        }
    },
    computed: {
        getPickedColor() {
            return this.pickedColor
        }
    },
    watch: {
        label: {
            handler: function (val, oldVal) {
                this.pickedColor = this.label.color
                this.title = this.label.title
            },
            deep: true
        }
    },
}
</script>