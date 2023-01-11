<template>
    <section class="task-editor dates-edit" @click.stop="">
        <button class="btn-close">
            <span class="trellicons x-icon" @click.stop="closeEdit"></span>
        </button>
        <div class="title">Due date</div>
        <span class="mini-title">Date</span>
        <datepicker :inline="true" v-model="date" ref="inputRef"></datepicker>
        <!-- <form @submit.prevent="addDate">
            <div class="dates-picker">
                <input type="date" v-model="dateStr" @input="convertDate" data-date-inline-picker="true">

                <input type="time" v-model="timeStr" @input="convertTime">
            </div>
        </form> -->
        <div>
            <span class="mini-title">Time</span>
            <input type="time" v-model="timeStr" @input="convertTime" />
        </div>
        <section class="flex column">
            <button class="btn-save" @click.prevent="addDate">Save</button>
            <button class="btn-remove" @click="removeDate">Remove</button>
        </section>
    </section>
</template>

<script>
import Datepicker from "vuejs3-datepicker";

export default {
    name: 'dates-edit',
    data() {
        return {
            date: "",
            dateStr: "",
            timeStr: "10:00",
            myTimeStr: "",
            myDateStr: "",
        };
    },
    components: {
        Datepicker,
    },
    created() { },
    methods: {
        addDate() {
            const dateStr = this.$refs.inputRef.selectedDate
            if (!dateStr) return
            const dateParsed = JSON.parse(JSON.stringify(dateStr))
            const chosenDateAndTime = dateParsed.slice(0, 11) + this.timeStr + dateParsed.slice(16, -1)
            const timestamp = Date.parse(chosenDateAndTime)
            this.$emit('updateTask', timestamp)
        },
        removeDate() {
            this.$emit('updateTask', 0)
        },
        closeEdit() {
            this.$emit('closeEdit')
        },
    },
    computed: {
        getTimeInMs() {
            const timeStr = this.convertDate + " " + this.convertTime;

            return Date.parse(this.myDateStr + " " + this.myTimeStr);
        },
    },
};
</script>
