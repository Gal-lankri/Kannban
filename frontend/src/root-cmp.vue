<template>
  <section class="main-layout">
    <user-msg />
    <main v-if="boards" class="app-main">
      <router-view @setRGB="setRGB" />
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
import axios from 'axios'
import { utilService } from './services/util.service'

export default {
  async created() {
    // console.log(this.$route)
    console.log('Vue App created')
    const user = userService.getLoggedinUser()
    if (user) store.commit({ type: 'setLoggedinUser', user })

    this.loadPhotos()

    try {
      await this.$store.dispatch({ type: 'loadBoards' })
      await this.$store.dispatch({ type: 'loadUsers' })
      // console.log(this.boards)
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
      // console.log('hiiiiiiiiiiii');
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
    loadPhotos() {
      const key = 'unsplashDB'
      if (localStorage.getItem(key)) return
      console.log('loading photos');
      let apiUrl = `https://api.unsplash.com/search/photos?query=landscape&orientation=landscape&per_page=20&client_id=${this.clientId}`
      axios(apiUrl).then(({ data }) => {
        const imgUrls = data.results.map(res => res.urls.full).slice(0, 14)
        utilService.saveToStorage(key, imgUrls)
        // console.log(this.imgUrls);
      })
        .catch((err) => {
          console.log('Cant load imgs', err);
        })
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
      console.log(isLoggedIn)
      return isLoggedIn

    }

  },
}
</script>