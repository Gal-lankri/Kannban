<template>
    <h1>DASHBOARD</h1>
</template>
<script>
import { isReferencedIdentifier } from '@vue/compiler-core'

export default {
    name: '',
    props: [],
    components: {},
    mounted() {
        // console.log(this.users)
        // console.log(this.boardMemberIds)
        // console.log(this.taskMemberIds)
        // console.log(this.availableMembersIds)
        // console.log(this.tasksAmount)
        // console.log(this.labels)
        // console.log(this.mapLabels)
        // console.log(this.nextDueDate)
        // console.log(this.locations)
        // console.log(this.levels)
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
