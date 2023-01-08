<template>
    <div class="screen"></div>

    <section v-if="task" class="task-details" v-click-outside="closeDetails">
        <section class="task-cover">
            <button class="close-task" @click="closeDetails">
                <span class="trellicons x-icon"></span>
            </button>
            <!-- <cover-preview v-if="task.style?.imgUrl" class="full" :coverBcg="task.style" /> -->
            <cover-preview v-if="task.style?.imgUrl || task.style?.bgColor" class="full" :coverBcg="task.style"
                @closeEdit="closeEditor" />
        </section>
        <section class="task-header task-cmp flex column align-start">
            <div class="task-title flex row align-center">
                <span class="trellicons card-icon large"></span>
                <input v-model="title" @input="debounceHandler('title', title)"
                    @keyup.enter="($event) => $event.target.blur()" />
            </div>
            <div class="flex column pad-40">
                <span class="small">In list <span class="underline">{{ getGroupName }}</span></span>
            </div>
        </section>

        <section class="task-details-aside">
            <section class="add-to-card flex column">
                <div class="btns-block">
                    <button v-if="!isUserOnTask" class="btn w-100 btn-join" @click.stop="toggleMember()">
                        <span class="trello-home join-icon"></span>
                        <span>Join</span>
                    </button>
                </div>
                <h4>Add to card</h4>
                <div class="btns-block">
                    <button v-for="btn in addBtns" :key="btn.arg" class="btn w-100" @click="pickEditor(btn.arg)">
                        <span :class="btn.icon"></span>
                        <span>{{ btn.title }}</span>
                    </button>
                </div>
            </section>
            <section class="btns-actions flex column">
                <h4>Actions</h4>
                <!-- <button class="btn" @click="pickEditor('copy-task-edit')">
                    <span class="trellicons move"></span>
                    <span>Move</span>
                </button> -->
                <div class="btns-block">
                    <button class="btn w-100" @click="pickEditor('copy-task-edit')">
                        <span class="trellicons copy"></span>
                        <span>Copy</span>
                    </button>
                    <button class="btn w-100" @click="isShowDelete = !isShowDelete">
                        <span class="trellicons archive"></span>
                        <span>Remove</span>
                    </button>
                    <button v-if="isShowDelete" class="delete-btn btn w-100" @click="removeTask"
                        v-click-outside="() => (isShowDelete = false)">
                        <span class="grow">Confirm deletion </span>
                    </button>
                </div>
            </section>
        </section>
        <!-- @updateChecklists="debounceHandler('checklist-preview', $event)" /> -->
        <section class="task-main flex column gap20">
            <section class="task-tags flex row pad-40 wrap gap20">
                <members-preview v-if="task.memberIds" :memberIds="task.memberIds"
                    @openMembersEditor="openMembersEditor" :isTaskDetails="true" />
                <labels-preview v-if="task.labelIds"
                    @openLabelsDetails="pickedEditor = { isOpen: true, editorType: 'labels-edit' }" />
            </section>
            <dates-preview class="pad-40" @markComplete="updateTask('dates-preview', $event)"
                :isComplete="task.isComplete" />
            <description-preview :description="task.description"
                @updateDescription="updateTask('description', $event)" />
            <location-preview v-if="task.location" :location="task.location"
                @removeLocation="updateTask('location-edit', '')" />
            <attachment-preview :attachments="task.attachments" v-if="task.attachments?.length"
                @updateCover="updateTask('cover-edit', $event)"
                @updateAttachments="updateTask('attachment-preview', $event)" />
            <!-- <checklists-preview v-if="task.checklists" :checklists="task.checklists"
                @updateChecklists="updateTask('checklist-preview', $event)" /> -->
            <!-- <checklists-preview v-if="task.checklists" :checklists="task.checklists" -->
            <checklists-preview v-if="task.checklists" @updateChecklists="updateTask('checklist-preview', $event)" />
            <activities-preview :taskId="task.id" />
        </section>
    </section>

    <component :is="pickedEditor.editorType" @closeEdit="closeEditor" v-click-outside="closeEditor"
        @updateTask="updateTask(pickedEditor.editorType, $event)" @addChecklist="addChecklist"
        @updateLabel="updateLabel" @updateMembers="updateTask" @copyTask="copyTask"
        @updateBoardLabels="updateBoardLabels" class="z-index-100" @removeLabel="removeBoardLabel">
    </component>

    <!-- <confirm-modal :msg="'Are you sure?'" v-if="isConfirmModal"/> -->
</template>

<script>
import labelsPreview from "../cmps/labels-preview.vue";
import labelsEdit from "../cmps/labels-edit.vue";
import checklistEdit from "../cmps/checklist-edit.vue";
import membersEdit from "../cmps/members-edit.vue";
import checklistsPreview from "../cmps/checklists-preview.vue";
import activitiesPreview from "../cmps/activities-preview.vue";
import membersPreview from "../cmps/members-preview.vue";
import descriptionPreview from "../cmps/description-preview.vue";
import copyTaskEdit from "../cmps/copy-task-edit.vue";
import datesEdit from "../cmps/dates-edit.vue";
import datesPreview from "../cmps/dates-preview.vue";
import coverEdit from "../cmps/cover-edit.vue";
import coverPreview from "../cmps/cover-preview.vue";
import locationEdit from "../cmps/location-edit.vue";
import locationPreview from "../cmps/location-preview.vue";
import attachmentEdit from "../cmps/attachment-edit.vue";
import attachmentPreview from "../cmps/attachment-preview.vue";
import confirmModal from "../cmps/confirm-modal.vue";

import { utilService } from "../services/util.service";

export default {
    emits: [
        "setRGB",
        "closeEdit",
        "updateTask",
        "addChecklist",
        "updateLabel",
        "updateMembers",
        "copyTask",
        "updateBoardLabels",
        "removeLabel",
    ],
    props: {},
    components: {
        labelsEdit,
        labelsPreview,
        checklistEdit,
        membersEdit,
        checklistsPreview,
        activitiesPreview,
        membersPreview,
        descriptionPreview,
        copyTaskEdit,
        datesEdit,
        datesPreview,
        coverEdit,
        coverPreview,
        locationEdit,
        locationPreview,
        attachmentEdit,
        attachmentPreview,
        confirmModal,
    },

    data() {
        return {
            show: false,

            pickedEditor: {
                isOpen: false,
                editorType: "",
            },

            groupId: this.$route.params.groupId,
            boardId: this.$route.params.boardId,
            task: null,
            showActivities: false,
            description: "",
            title: "",
            isShowDelete: false,
            addBtns: [
                { arg: "members-edit", icon: "trellicons members-icon", title: "Members" },
                { arg: "labels-edit", icon: "trellicons labels-icon", title: "Labels" },
                { arg: "checklist-edit", icon: "trellicons checklist-icon", title: "Checklist" },
                { arg: "dates-edit", icon: "fa-regular date-icon", title: "Dates" },
                { arg: "attachment-edit", icon: "fa-solid attachment-icon", title: "Attachment" },
                { arg: "location-edit", icon: "trellicons location-icon", title: "Location" },
                { arg: "cover-edit", icon: "trellicons cover-icon", title: "Cover" },
            ],
            isCreateLabel: false,
            isConfirmModal: false,

            // labelIds: this.$store.getters.labelIds
        };
    },

    async created() {
        this.debounceHandler = utilService.debounce(this.updateTask, 600);
        const { id, taskId, groupId } = this.$route.params;
        // console.log(taskId);
        try {
            // await this.$store.dispatch({ type: 'loadBoards' })
            this.$store.commit({ type: "setBoard", boardId: id });
            this.$store.commit({ type: "setEditedTask", taskId, groupId, boardId: id });
            this.task = JSON.parse(JSON.stringify(this.getTask));

            this.title = this.getTask.title;
            this.description = this.task.description;
        } catch (err) {
            console.log(err);
        }
    },

    methods: {
        updateTitle(ev) {
            if (typeof ev.data !== "string") return;
            this.task.title += ev.data;
        },
        pickEditor(type) {
            this.pickedEditor.editorType = type;
            this.pickedEditor.isOpen = true;
        },
        closeEditor() {
            // await this.updateTask()
            this.pickedEditor = {
                isOpen: false,
                type: "",
            };
        },
        updateLabel(label) {
            this.$store.dispatch({
                type: "updateLabel",
                payload: {
                    label,
                    activity: {
                        txt: "Updated label title",
                        boardId: this.$route.params.id,
                        groupId: this.groupId,
                        taskId: this.task.id,
                        task: {
                            id: this.task.id,
                            title: this.task.title,
                        },
                        byMember: {
                            _id: this.user._id,
                            fullname: this.user.fullname,
                            imgUrl: this.user.imgUrl || "",
                        },
                    },
                },
            });
        },
        async removeTask() {
            try {
                await this.$store.dispatch({
                    type: "removeTask",
                    payload: {
                        taskId: this.task.id,
                        activity: {
                            txt: `Deleted ${this.task.title}`,
                            boardId: this.$route.params.id,
                            groupId: this.groupId,
                            taskId: this.task.id,
                            byMember: {
                                _id: this.user._id,
                                fullname: this.user.fullname,
                                imgUrl: this.user.imgUrl || "",
                            },
                        },
                    },
                });
                // console.log('remove!');
                this.closeDetails();
            } catch (err) {
                console.log("Failed in task remove", err);
            }
        },
        async copyTask(data) {
            try {
                const { task, toGroupId, toBoardId } = data;
                // console.log(data, 'BOARDDDDDDDDDDDDDDDDDDD');
                task.id = utilService.makeId();
                this.$store.dispatch({
                    type: "copyTask",
                    toBoardId,
                    toGroupId,
                    task,
                    activity: {
                        txt: `Made copy for ${task.title}`,
                        byMember: {
                            _id: this.user._id,
                            fullname: this.user.fullname,
                            imgUrl: this.user.imgUrl || "",
                        },
                    },
                });
                this.closeEditor();
            } catch (err) {
                console.log("Failed in task copy", err);
            }
        },

        async updateTask(type, data) {
            // console.log("hi");
            let taskToUpdate = JSON.parse(JSON.stringify(this.task));
            var txt;
            switch (type) {
                case "labels-edit":
                    if (!taskToUpdate?.labelIds) taskToUpdate.labelIds = [];
                    taskToUpdate.labelIds = data.labelIds;
                    txt = "Updated label";
                    break;
                case "description":
                    txt = `Updated ${taskToUpdate.title} description`;
                    taskToUpdate.description = data;
                    break;
                case "title":
                    txt = `Updated ${taskToUpdate.title} title to ${data}`;
                    taskToUpdate.title = data;
                    break;
                case "checklist-edit":
                    txt = `Added checklist ${data.title} in ${taskToUpdate.title}`;
                    if (!taskToUpdate?.checklists) taskToUpdate.checklists = [];
                    data.id = utilService.makeId();
                    taskToUpdate.checklists.push(data);
                    this.closeEditor();
                    break;
                case "members-edit":
                    // console.log('update task', data)
                    taskToUpdate.memberIds = data.memberIds;
                    txt = `${data.action} ${data.fullname} ${data.action === "added" ? "to" : "from"
                        } ${this.task.title}`;
                    break;
                case "checklist-preview":
                    txt = `Edited checklist ${data.title} in ${taskToUpdate.title}`;
                    taskToUpdate.checklists = data;
                    break;
                case "dates-edit":
                    taskToUpdate.dueDate
                        ? (txt = `Changed due date for ${taskToUpdate.title}`)
                        : (txt = `Added due date for ${taskToUpdate.title}`);
                    taskToUpdate.dueDate = data;
                    this.closeEditor();
                    break;
                case "dates-preview":
                    data
                        ? (txt = `Marked ${this.task.title} as complete`)
                        : (txt = `Unmarked ${this.task.title} as complete`);
                    taskToUpdate.isComplete = data;
                    // console.log(taskToUpdate);
                    break;
                case "cover-edit":
                    // console.log(data);
                    txt = `Updated  ${this.task.title} cover`;
                    if (data.startsWith("#")) {
                        taskToUpdate.style = {
                            bgColor: data,
                        };
                    } else {
                        taskToUpdate.style = {
                            imgUrl: data,
                        };
                    }
                    break;
                case "location-edit":
                    if (!data) txt = `Removed  ${this.task.title} location`;
                    else txt = `Updated  ${this.task.title} location to ${data.name}`;
                    taskToUpdate.location = data;
                    this.closeEditor();
                    break;
                case "attachment-edit":
                    txt = `Added  ${this.task.title} attachment`;
                    if (data.type === "image") {
                        taskToUpdate.style = {
                            imgUrl: data.url,
                        };
                    }
                    if (!taskToUpdate.attachments) taskToUpdate.attachments = [];
                    taskToUpdate.attachments.unshift(data);
                    // console.log(data);
                    this.closeEditor();
                    break;
                case "attachment-preview":
                    txt = `Updated  ${this.task.title} attachments`;
                    // if (taskToUpdate.style === data.url)
                    // console.log(data.url);
                    taskToUpdate.attachments = data;
                    break;
            }
            try {
                var prevTask = JSON.parse(JSON.stringify(this.task));
                this.$store.commit({
                    type: "updateTask",
                    payload: { task: taskToUpdate, groupId: this.groupId },
                });
                this.task = JSON.parse(JSON.stringify(this.getTask));
                // console.log(this.task);
                let updatedTask = await this.$store.dispatch({
                    type: "updateTask",
                    payload: {
                        task: taskToUpdate,
                        groupId: this.groupId,
                        activity: {
                            txt,
                            // memberIds: this.task.memberIds,
                            boardId: this.$route.params.id,
                            groupId: this.groupId,
                            taskId: this.task.id,
                            task: {
                                id: this.task.id,
                                title: this.task.title,
                            },
                            byMember: {
                                _id: this.user._id,
                                fullname: this.user.fullname,
                                imgUrl: this.user.imgUrl || "",
                            },
                        },
                    },
                });
                // this.task = updatedTask;
            } catch (err) {
                this.$store.commit({
                    type: "updateTask",
                    payload: { task: prevTask, groupId: this.groupId },
                });
                this.task = JSON.parse(JSON.stringify(this.getTask));
                console.log("Failed in task update");
                // this.task = prevTask
            }
        },
        closeDetails() {
            // this.$store.dispatch({
            //     type: "updateTask",
            //     payload: {
            //         task: this.task,
            //         boardId: this.$route.params.id,
            //         groupId: this.groupId,
            //     },
            // })
            this.$router.push(`/board/${this.$route.params.id}`);
        },
        confirm() {
            this.isConfirmModal = true;
        },
        async removeBoardLabel(label) {
            try {
                this.$store.dispatch({
                    type: "removeBoardLabel",
                    label,
                    activity: {
                        txt: "Deleted label",
                        boardId: this.$route.params.id,
                        groupId: this.groupId,
                        taskId: this.task.id,
                    },
                });
            } catch (err) {
                console.log(err);
            }
            const labelIdx = taskToUpdate.labelIds.find((labelId) => labelId === data);
            taskToUpdate.labelIds.splice(labelIdx, 1);
            txt = "removed label";
        },
        async addChecklist(checklist) {
            await this.$store.dispatch({
                type: "addChecklist",
                payload: {
                    task: this.task,
                    checklist,
                    groupId: this.groupId,
                    activity: {
                        txt: "Added checklist",
                        boardId: this.$route.params.id,
                        groupId: this.groupId,
                        taskId: this.task.id,
                    },
                },
            });
            this.closeEditor();
        },
        openMembersEditor() {
            this.pickEditor("members-edit");
        },
        openCreateLabel() {
            this.isCreateLabel = true;
            this.closeEditor();
        },
        async updateBoardLabels(label) {
            // console.log(label);
            this.$store.dispatch({
                type: "updateBoardLabels",
                label,
                // activity: {
                //     txt: "Added new label",
                //     boardId: this.$route.params.id,
                //     groupId: this.groupId,
                //     taskId: this.task.id,
                // },
            });
        },
        toggleMember() {
            const user = this.user;
            const memberIds = JSON.parse(JSON.stringify(this.getTask.memberIds || []));
            // console.log(user);
            // console.log(memberIds);
            // console.log("********************");
            var action;
            const memberIdx = memberIds.findIndex((id) => {
                return user._id === id;
            });
            if (memberIdx < 0) {
                memberIds.push(user._id);
                action = "added";
            } else {
                memberIds.splice(memberIdx, 1);
                action = "removed";
            }

            this.updateTask("members-edit", {
                memberIds: memberIds,
                fullname: user.fullname,
                action,
            });
            // this.$emit('updateMembers', 'members-edit', { memberIds: memberIds, fullname: user.fullname, action })
        },
    },
    computed: {
        getLabels() {
            return this.$store.getters.labels;
        },
        getChecklists() {
            return this.$store.getters.checklists;
        },

        user() {
            return this.$store.getters.loggedinUser;
        },
        getTask() {
            const task = this.$store.getters.getEditedTask;
            // console.log(task);
            return task;
        },
        getTaskLabels() {
            if (!this.task?.labelIds) return [];
            return this.$store.getters.labels.map((label) => {
                if (this.task.labelIds.includes(label.id)) return label;
            });
        },
        getGroupName() {
            const board = this.$store.getters.board;
            // console.log(`board:`, board);
            const group = board.groups.find((group) => group.id === this.$route.params.groupId);
            // console.log(group.title, 'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT');
            if (!group.title) return "";
            return group.title;

            // return JSON.parse(JSON.stringify(this.$store.getters.getEditedTask)).title
        },
        isUserOnTask() {
            const memberIds = JSON.parse(JSON.stringify(this.getTask.memberIds || []));

            const idx = memberIds.findIndex((id) => id === this.user._id);
            return idx === -1 ? false : true;
        },
    },
};
</script>
