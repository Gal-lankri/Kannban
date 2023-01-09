<template>
    <section class="dashboard flex column justify-between">
        <section class="flex row justify-between">

            <div>
                <div>task 0n this board: {{ tasksAmount }}</div>
                <div class="members-container">Members on board:
                    <div v-for="member in members">{{ member.fullname }}</div>
                    <div v-for="member in members">{{ member.fullname }}</div>
                    <pre></pre>
                </div>
            </div>

            <section class=" up-charts flex row justify-between align-end wrap">
                <chart-pie></chart-pie>
                <chart-pie></chart-pie>
                <chart-pie></chart-pie>
                <!-- <chart-treemap></chart-treemap> -->

            </section>
        </section>
        <chart-spline></chart-spline>
    </section>

</template>


<script>
import chartSpline from '../cmps/chart-spline.vue';
import chartPie from '../cmps/chart-pie.vue';
import chartTreemap from '../cmps/chart-treemap.vue';

export default {

    name: '',
    props: [],
    components: { chartSpline, chartPie, chartTreemap },
    mounted() {
        console.log(`dashboard:`)
        console.log(this.users)
        console.log(this.boardMemberIds)
        console.log(this.taskMemberIds)
        console.log(this.availableMembersIds)
        console.log('task amount', this.tasksAmount)
        console.log(this.labels)
        console.log(this.mapLabels)
        console.log(this.nextDueDate)
        console.log(this.locations)
        console.log(this.levels)
    },
    data() {
        return {
            tasksNoDueDate: 0,
            tasksCompleted: 0,
            tasksWithDate: 0,

        }
    },
    methods: {},
    computed: {
        users() {
            var users = {}
            this.$store.getters.users.forEach(user => {
                users[user._id] = user
            })
            return users
        },
        members() {
            console.log(this.$store.getters.board.members)
            return this.$store.getters.board.members
        },
        boardMemberIds() {
            var members = []
            this.$store.getters.board.members.forEach(member => {
                if (members.includes(member._id)) return
                members.push(member._id)
            })
            return members
        },
        taskMemberIds() {
            var members = []
            this.$store.getters.board.groups.forEach(group => {
                group.tasks.forEach(task => {
                    if (!task.memberIds) return
                    task.memberIds.forEach(id => {
                        if (members.includes(id)) return
                        members.push(id)
                    })
                })
            })
            return members
        },
        availableMembersIds() {
            var members = []
            this.$store.getters.board.members.forEach(member => {
                if (this.taskMemberIds.includes(member._id)) return
                members.push(member._id)
            })
            return members
        },
        tasksAmount() {
            var tasksAmount = 0
            this.$store.getters.board.groups.forEach(group => {
                tasksAmount += group.tasks.length
            })
            return tasksAmount
        },
        labels() {
            var labels = {}
            this.$store.getters.board.labels.forEach(label => {
                labels[label.id] = label
            })
            return labels
        },
        mapLabels() {
            var mapLabels = {}
            this.$store.getters.board.groups.forEach(group => {
                group.tasks.forEach(task => {
                    if (!task.labelIds) return
                    task.labelIds.forEach(id => {
                        if (!mapLabels[id]) mapLabels[id] = 1
                        else mapLabels[id] += 1
                    })
                })
            })
            return mapLabels
        },
        nextDueDate() {
            let timestamp = 1670918400000167
            let soonTask = {}
            const now = Date.now()
            this.$store.getters.board.groups.forEach(group => {
                group.tasks.forEach(task => {
                    // console.log(typeof task.dueDate)
                    if (task.dueDate !== undefined) {
                        if (((task.dueDate - now) > 0) && (task.dueDate < timestamp)) {
                            timestamp = task.dueDate
                            soonTask = task
                            this.tasksWithDate += 1
                        }
                    } else if (task.isComplete === true) {
                        this.tasksCompleted += 1
                    } else {
                        this.tasksNoDueDate += 1
                    }
                })
            })
            return soonTask
        },
        locations() {
            let mapLocations = {}
            this.$store.getters.board.groups.forEach(group => {
                group.tasks.forEach(task => {
                    if (task.location !== undefined) {
                        if (!mapLocations[task.location.name]) mapLocations[task.location.name] = 1
                        else mapLocations[task.location.name] += 1
                    }
                })
            })
            return mapLocations
        },
        levels() {
            let mapLevels = {}
            this.$store.getters.board.groups.forEach(group => {
                mapLevels[group.title] = group.tasks.length
            })
            return mapLevels
        },
    },
    watch: {
        nextDueDate() {
            // console.log(this.nextDueDate)
        }
    }
}
</script>
