<template>
  <section class="main-layout">
    <user-msg />

    <main class="app-main">
      <section v-if="!boards" class="loader">
        <img src="./assets/svg/loader.svg" alt="">
      </section>
      <router-view v-else @setRGB="setRGB" />
    </main>

    <app-header v-if="isLoggedin" :rgb="getRGB" @logout="logout" @updateSeenNotifications="updateSeenNotifications"
      @removeNotification="removeNotification" @removeAllNotification="removeAllNotification" />
  </section>
</template>

<script>


import { store } from './store/store'
import appHeader from './cmps/app-header.vue'
import userMsg from './cmps/user-msg.vue'
import { userService } from './services/user.service'

export default {
  async created() {
    const user = userService.getLoggedinUser()
    if (user) store.commit({ type: 'setLoggedinUser', user })


    try {
      await this.$store.dispatch({ type: 'loadBoards' })
      await this.$store.dispatch({ type: 'loadUsers' })
    } catch (err) {
      console.log(err)
    }

  },

  data() {
    return {
      rgb: null,
      isDark: false,
      clientId: "wONkEH1Be08ksV3ijwHHpfu8tfvmD6SnhsRpvZBWVgg",
    }
  },

  components: {
    appHeader,
    userMsg
  },

  methods: {
    setRGB(rgb) {
      this.rgb = rgb
      this.isDark = rgb.isDark
    },
    async logout() {
      try {
        this.$router.push('/login')
      }
      catch (err) {
        console.log('Fail to logout', err);
      }
    },
    removeNotification(id) {
      this.$store.dispatch({ type: 'removeNotification', notId: id })
    },
    removeAllNotification() {
      this.$store.dispatch({ type: 'removeAllNotification' })
    },
    updateSeenNotifications() {
      this.$store.dispatch({ type: 'updateSeenNotifications' })
    }
  },

  computed: {
    getRGB() {
      return this.rgb
    },
    boards() {
      return this.$store.getters.boards
    },
    isLoggedin() {
      const isLoggedIn = this.$route.path !== '/login' && this.$route.path !== '/'
      return isLoggedIn

    }
  }
}

</script>