<template>
    <section class="task-editor attachment-edit" @click.stop="">
        <div class="title">Attach from…</div>
        <button class="btn-close" @click.stop="closeEdit">
            <span class="trellicons x-icon"></span>
        </button>

        <div class="attachment-options">
            <button class="btn-remove">
                <span>
                    Computer
                </span>
            </button>
            <imgUploader @uploaded="attachImage" />
        </div>
        <div class="attachment-link">
            <h4 class="mini-title">Attach a link</h4>
            <input type="text" placeholder="Paste any link here" v-model="url"
                @keyup.enter="($event) => $event.target.blur()" v-focus>
            <div v-if="url" class="link-name">
                <div>Link name (optional)</div>
                <input type="text" v-model="name" ref="input" @keyup.enter="attachLink">
            </div>
            <button class="btn-remove" @click="attachLink">Attach</button>
        </div>
    </section>
</template>

<script>
import { utilService } from '../services/util.service';
import imgUploader from './img-uploader.vue';
export default {
    data() {
        return {
            name: '',
            url: ''
        }
    },
    mounted() {
    },

    methods: {

        attachImage(url) {
            const attachment = {
                url,
                name: 'Your attachment',
                id: utilService.makeId(),
                type: 'image',
                createdAt: Date.now(),
            }
            this.$emit('updateTask', attachment)
        },
        attachLink() {
            if (!this.url) return
            const attachment = {
                url: this.url,
                name: this.name,
                id: utilService.makeId(),
                type: 'link',
                createdAt: Date.now()
            }
            this.$emit('updateTask', attachment)

            this.name = ''
            this.url = ''
        },
        closeEdit() {
            this.$emit('closeEdit')
        }
    },

    components: { imgUploader }
}
</script>