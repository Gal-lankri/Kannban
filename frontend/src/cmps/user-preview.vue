<template>
    <section class="user-preview" id="user-preview">
        <div class="user-preview-header">
            <p>Account</p>
            <div class="header-links">
                <div v-if="user.imgUrl" class="user-img" :style="memberImage(user.imgUrl)"> </div>
                <span v-else class="btn flex row profile-btn" @click="(showUserPreview = true)">
                    {{ getInitials(user.fullname) }}
                </span>
                <div>
                    {{ user.fullname }}
                </div>

            </div>
        </div>

        <div class="user-preview-main">
            <div>
                <div class="links">
                    <div>
                        <span>
                            Profile and visibility
                        </span>
                    </div>
                    <div>
                        <span>
                            Activity
                        </span>
                    </div>
                    <div>
                        <span>
                            Cards
                        </span>
                    </div>
                    <div>
                        <span>
                            Settings
                        </span>
                    </div>
                    <div></div>
                </div>
            </div>
            <button @click="logout">Log out</button>
        </div>
    </section>
</template>

<script>
import { utilService } from '../services/util.service';
export default {
    props: {
        user: {
            type: Object,
            required: true,
        }
    },
    methods: {
        getInitials(fullname) {
            return utilService.getInitials(fullname)
        },
        memberImage(imgUrl) {
            return { backgroundImage: `url(${imgUrl})` };
        },
        logout() {
            this.$emit('logout')
        }
    },
}
</script>