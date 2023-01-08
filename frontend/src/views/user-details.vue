<template>
  <section v-if="user">
    <h1>User Details - {{ user.fullname }}</h1>
    <h3>{{ user.email }} score: {{ user.score }}</h3>
    <img style="max-width: 200px;" :src="user.imgUrl" />
    <ul>
      <li v-for="review in user.givenReviews" :key="review._id">
        {{ review.txt }}
        <router-link :to="`/user/${review.aboutUser._id}`">
          About {{ review.aboutUser.fullname }}
        </router-link>
      </li>
    </ul>

    <details>
      <summary>Full JSON</summary>
      <pre>{{ user }}</pre>
    </details>
  </section>
</template>

<script>
// import {userService} from '../services/user.service'

export default {
  data() {
    return {
      // user: null
    }
  },
  async created() {
    // const user = await userService.getById(id)
    // this.user = user
  },
  watch: {
    userId: {
      handler() {
        if(this.userId){
            this.$store.dispatch({ type: "loadAndWatchUser", userId: this.userId })
        }
      },
      immediate: true,
    },
  },
  computed: {
    user() {
      return this.$store.getters.watchedUser
    },
    userId() {
      return this.$route.params.id
    },
  },
}
</script>