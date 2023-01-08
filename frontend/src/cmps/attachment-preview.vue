<template>
    <section class="attachment-preview">
        <div class="attachment-preview-header">
            <span class="fa-solid attachment-icon"></span>
            <div>Attachments</div>
        </div>
        <div class="attachment-preview-main">
            <div class="attachment-preview-item" v-for="(attachment, index) in  attachmentsForDisplay"
                :key="attachment.id">
                <div v-if="(attachment.type === 'image')" class="attachment-img"
                    :style="{ backgroundImage: `url(${attachment.url})` }"></div>
                <div v-else class="attachment-img">
                    <span class="fa-solid attachment-icon"></span>
                </div>
                <!-- <img :src="attachment.url" alt=""> -->
                <div class="attachment-info">
                    <span>{{ attachment.name }}</span>
                    <span class="trellicons external-link-icon" @click="goToLink(attachment.url)"></span>
                    <div class="attachment-actions">
                        <span>Added {{ timeForDisplay[index] }}</span>-
                        <span>Comment</span>-
                        <span @click.stop="remove(attachment.id)">Delete</span>-
                        <span @click.stop="(attachmentEditedId = attachment.id)">Edit</span>
                    </div>
                    <div>
                        <span class="trellicons cover-icon"></span>
                        <span @click.stop="updateCover(attachment.url)" v-if="(attachment.type === 'image')">Make
                            cover</span>
                    </div>
                    <attachment-actions-modal v-if="(attachment.id === attachmentEditedId)" :attachment="attachment"
                        @updateAttachment="updateAttachment" @closeModal="closeModal" />
                </div>
            </div>
            <div v-if="attachmentsCopy.length > 4">
                <div class="show-attachments" v-if="!isShowAll" @click="toggleShowAll">View
                    all attachments
                    ({{ (attachmentLength - attachmentsForDisplay.length) }} hidden)
                </div>
                <div class="show-attachments" v-else @click="toggleShowAll">Show fewer attachments</div>
            </div>
            <button>Add an attachment</button>
        </div>
    </section>
</template>

<script>
import { utilService } from '../services/util.service';
import attachmentActionsModal from './attachment-actions-modal.vue';
export default {
    props: {
        // attachments: {
        //     type: Array,
        //     required: true
        // },
    },
    data() {
        return {
            attachmentEditedId: '',
            attachmentsCopy: null,
            isShowAll: false
        }
    },
    created() {
        this.attachmentsCopy = this.attachmentsForDisplay
    },
    methods: {
        updateCover(imgUrl) {
            // console.log(imgUrl);
            this.$emit('updateCover', imgUrl)
        },
        toggleShowAll() {
            this.isShowAll = !this.isShowAll
            // this
        },
        updateAttachment(newAttachment) {
            this.attachmentsCopy = this.attachmentsForDisplay
            // console.log(newAttachment.id);
            const attachmentIdx = this.attachmentsCopy.findIndex(attachment => attachment.id === newAttachment.id)
            // console.log(attachmentIdx);
            this.attachmentsCopy.splice(attachmentIdx, 1, newAttachment)
            this.$emit('updateAttachments', this.attachmentsCopy)
            this.attachmentEditedId = ''
        },
        closeModal() {
            this.attachmentEditedId = ''
        },
        remove(id) {
            this.attachmentsCopy = this.attachmentsForDisplay
            const attachmentIdx = this.attachmentsCopy.findIndex(attachment => attachment.id === id)
            this.attachmentsCopy.splice(attachmentIdx, 1)
            this.$emit('updateAttachments', this.attachmentsCopy)
        },
        goToLink(url) {
            // console.log(url);
            window.open(url, '_blank');
        }
    },
    computed: {
        timeForDisplay() {
            return this.attachmentsForDisplay.map(att => {
                return utilService.timeAgo(att.createdAt)
            })
        },
        attachmentsForDisplay() {
            return this.isShowAll ?
                JSON.parse(JSON.stringify(this.$store.getters.getEditedTask.attachments))
                : JSON.parse(JSON.stringify(this.$store.getters.getEditedTask.attachments)).slice(0, 4)
        },
        attachmentLength() {
            return this.$store.getters.getEditedTask.attachments.length
        }

    },
    components: {
        attachmentActionsModal
    }
}
</script>