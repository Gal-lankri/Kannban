<template>
    <section class="notifications" id="notifications">
        <div class="notifications-header">
            <p>Notifications</p>
        </div>
        <div class="mark-all">
            <span @click="removeAll" v-if="notifications && notifications.length">Mark all as read</span>
        </div>
        <div class="notifications-main" v-if="notifications && notifications.length">
            <div class="notification" v-for="notification in notifications">
                <span class="circle" @click="removeNotification(notification.id)">
                </span>
                <div class="notification-main">
                    <div class="header">
                        <div v-if="notification.byMember.imgUrl" class="member-image"
                            :style="memberImage(notification.byMember.imgUrl)"> </div>
                        <span v-else class="member-initials">
                            {{ getInitials(notification.byMember.fullname) }}
                        </span>
                        <strong>{{ notification.byMember.fullname }}</strong>
                    </div>
                    <div class="info">
                        <p> {{ notification.txt }} </p>

                        <small>
                            {{ getDueDateStr(notification.createdAt) }} at {{ new
                                Date(notification.createdAt).toLocaleTimeString('en-GB').slice(0, 5)
                            }}
                        </small>
                        <!-- <span>{{ getDueDateStr(notification.createdAt) }}</span>
                        <small>at</small>
                        <span>{{ new Date(notification.createdAt).toLocaleTimeString('en-GB').slice(0, 5) }}</span> -->
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="placeholder">
            <img src="https://a.trellocdn.com/prgb/dist/images/taco-sleep.ee2660df9335718b1a80.svg">
            <div>
                No unread notifications
            </div>
        </div>
    </section>
</template>

<script>
import { utilService } from '../services/util.service';
export default {
    methods: {
        memberImage(imgUrl) {
            return { backgroundImage: `url(${imgUrl})` };
        },
        getInitials(fullname) {
            if (fullname)
                return utilService.getInitials(fullname)
        },
        getDueDateStr(timeStamp) {
            // console.log(this.task.dueDate);
            return new Date(timeStamp).toDateString().slice(4, 10)
        },
        removeNotification(id) {
            this.$emit('removeNotification', id)
        },
        removeAll() {
            this.$emit('removeNotification', 'all')
        }
    },
    computed: {
        notifications() {
            return this.$store.getters.loggedinUser.notifications
        }
    }
}
</script>
