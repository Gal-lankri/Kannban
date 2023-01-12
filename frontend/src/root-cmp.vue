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
    let user = userService.getLoggedinUser()
    if (!user) user = await this.$store.dispatch({ type: "login", userCred: {fullname: 'Dima Demo', email: 'dima-demo@mystartup.org', password: '123', imgUrl: 'https://res.cloudinary.com/dnznyz6om/image/upload/v1670495585/htkfdnkkhbrxd3nddln7.webp' } })
    store.commit({ type: 'setLoggedinUser', user })

    try {
      await this.$store.dispatch({ type: 'loadUsers' })
      await this.$store.dispatch({ type: 'loadBoards' })
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