<template>
    <section class="activities-preview task-cmp flex column ">
        <div class="flex row w-100 align-center ">
            <span class="trellicons activity-icon large "></span>
            <div class="task-cmp-title grow">Activities</div>
            <button class="btn" @click="isActShown = !isActShown">{{ isActShown ? 'Hide details' : 'Show details'
            }}</button>
        </div>
        <div v-if="isActShown" v-for="activity in activities" :key="activity.id"
            class="activity flex row align-start grow">
            <div class="activity-user flex row align-center">
                <div v-if="activity.byMember.imgUrl" class="member-image"
                    :style="memberImage(activity.byMember.imgUrl)"> </div>
                <span v-else class="member-initials">
                    {{ getInitials(activity.byMember.fullname) }}
                </span>
            </div>
            <div class=" flex column justify-start grow">
                <div>
                    <span class="fullname">{{ activity.byMember.fullname + ' ' }}</span>
                    <span>{{ activity.txt }}</span>
                </div>
                <span class="activity-time">{{ getTimeAgo(activity.createdAt) }}</span>
            </div>
        </div>
    </section>
</template>
<script>
import { utilService } from '../services/util.service';

export default {
    name: 'activities-preview',
    props: ['taskId'],
    components: {},
    created() { },
    data() {
        return {
            isActShown: true
        }
    },
    methods: {
        memberImage(imgUrl) {
            return { backgroundImage: `url(${imgUrl})` };
        },
        getInitials(fullname) {
            return utilService.getInitials(fullname)
        },
        getTimeAgo(timestamp) {

            return utilService.timeAgo(timestamp)
        },

    },
    computed: {
        activities() {
            const activities = this.$store.getters.activities
            // console.log(activities);

            return activities.filter(activity => {
                // console.log('****************', activity)
                if (!activity.task) return
                return activity.task.id === this.taskId
            }).reverse().splice(0, 5)
        },

    },
}
</script>
