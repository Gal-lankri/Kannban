<template>
    <section class="dashboard flex column justify-around gap20" :style="background" :class="{ isDark: isDark }">
        <section class="flex row justify-around grow gap20">
            <div class="members-container flex column justify-between gap20">
                <div>Total board members:</div>
                <div class="bold">{{ members.length }}</div>
                <div>Members on board:</div>
                <div class="members flex column gap ">

                    <div v-for="member in members" :key="member._id" class="flex align-center ">
                        <div v-if="member.imgUrl" class="member-image" :style="memberImage(member.imgUrl)"> </div>
                        <span v-else class="member-initials">
                            {{ getInitials(member.fullname) }}
                        </span>
                        <span class="fullname">{{ member.fullname + " " }}</span>
                    </div>
                </div>


            </div>

            <div class=" gap flex column justify-between">


                <div class=" up-charts flex row justify-around align-start wrap">
                    <chart-pie title="Tasks By Labels" :data="labelsChartData" type="donut"
                        :color="textColor"></chart-pie>
                    <chart-pie title="Tasks Completed" :data="tasksChartData" type="pie" :color="textColor"></chart-pie>
                    <chart-pie title="Tasks By Member" :data="labelsChartData" type="donut"
                        :color="textColor"></chart-pie>
                </div>
                <div class="data flex row justify-around align-center ">
                    <div>
                        <div>Tasks on this board:</div>
                        <div class="bold">{{ tasksTotal }}</div>
                    </div>
                    <div>
                        <div>Upcoming deadline:</div>
                        <div class="bold"> {{
                            nextDueDate.dueDate ? new Date(nextDueDate.dueDate).toLocaleDateString('en-GB') :
                                'Not found'
                        }}</div>
                    </div>
                    <div>
                        <div>Last Activity:</div>
                        <div class="bold">{{ lastActivity }}</div>
                    </div>
                </div>
            </div>
        </section>
        <section class="chart-spline">
            <chart-spline title="Board Progress" :data="progressChartData" :color="textColor"></chart-spline>
        </section>
    </section>

</template>


<script>
import chartSpline from '../cmps/chart-spline.vue';
import chartPie from '../cmps/chart-pie.vue';
import chartTreemap from '../cmps/chart-treemap.vue';
import { utilService } from '../services/util.service';
export default {

    name: '',
    props: ['rgb'],
    components: { chartSpline, chartPie, chartTreemap },
    created() {
    },
    mounted() {
        // console.log(`dashboard:`)
        // console.log(this.users)
        // console.log(this.boardMemberIds)
        // console.log(this.taskMemberIds)
        // console.log(this.availableMembersIds)
        // console.log('task amount', this.tasksTotal)
        // console.log('labels map', this.labelsChartData)
        // console.log(this.nextDueDate)
        // console.log(this.locations)
        // console.log(this.levels)
    },
    data() {
        return {

            tasksNoDueDate: 0,
            tasksWithDate: 0,

        }
    },
    methods: {
        getInitials(fullname) {
            return utilService.getInitials(fullname);
        },
        memberImage(imgUrl) {
            return { backgroundImage: `url(${imgUrl})` };
        },
    },
    computed: {
        background() {
            if (!this.rgb) return
            return this.rgb.isDark ? utilService.getBCG(this.rgb.value, -20, 0.8) : utilService.getBCG(this.rgb.value, +30, 0.8)
        },
        textColor() {
            if (!this.rgb) return
            return this.rgb.isDark ? 'white' : '#172b4d'
        },
        isDark() {
            if (!this.rgb) return false
            return this.rgb.isDark
        },
        users() {
            let users = {}
            this.$store.getters.users.forEach(user => {
                users[user._id] = user
            })
            return users
        },
        members() {
            return this.$store.getters.board.members
        },
        lastActivity() {
            const timestamp = this.$store.getters.activities[this.$store.getters.activities.length - 1]?.createdAt
            return timestamp ? utilService.timeAgo(timestamp) : 'Not found'
        },
        boardMemberIds() {
            let members = []
            this.$store.getters.board.members.forEach(member => {
                if (members.includes(member._id)) return
                members.push(member._id)
            })
            return members
        },
        taskMemberIds() {
            let members = []
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
            let members = []
            this.$store.getters.board.members.forEach(member => {
                if (this.taskMemberIds.includes(member._id)) return
                members.push(member._id)
            })
            return members
        },


        tasksTotal() {
            let tasksTotal = 0
            this.$store.getters.board.groups.forEach(group => {
                tasksTotal += group.tasks.length
            })
            return tasksTotal
        },
        tasksCompleted() {
            let tasksCompleted = 0
            this.$store.getters.board.groups.forEach(group => {
                group.tasks?.forEach(task => {
                    if (task.isComplete) ++tasksCompleted
                })
            })
            return tasksCompleted
        },

        tasksChartData() {
            let tasksDone = this.tasksCompleted
            let tasksLeft = this.tasksTotal - tasksDone
            let series = [tasksDone, tasksLeft]
            const labels = ['Tasks Completed', 'Tasks Left']
            return [series, labels]
        },


        labelsChartData() {
            let boardLabels = this.$store.getters.board.labels
            let mapLabels = {}
            this.$store.getters.board.groups.forEach(group => {
                group.tasks.forEach(task => {
                    if (!task.labelIds) return
                    task.labelIds.forEach(id => {
                        if (!mapLabels[id]) mapLabels[id] = 1
                        else mapLabels[id] += 1
                    })
                })
            })
            let series = Object.values(mapLabels)
            const labels = boardLabels.map(label => {
                return label.title
            })

            return [series, labels]
        },
        progressChartData() {
            let series = this.$store.getters.board.groups.map(group => {
                return group.tasks ? group.tasks.length : 0
            })
            let labels = this.$store.getters.board.groups.map(group => {
                return group.title
            })

            return [series, labels]


        },
        nextDueDate() {
            let timestamp = 1670918400000167
            let soonTask = {}
            const now = Date.now()
            this.$store.getters.board.groups.forEach(group => {
                group.tasks.forEach(task => {
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
            console.log(`soonTask:`, soonTask)
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
