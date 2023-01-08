<template>
  <section class="home-page ">

    <section class="header flex row align-center justify-between">
      <div class="logo gap flex row align-center justify-center">
        <span class="fa-brands trello-icon "></span>
        <span class="">Kannban</span>
      </div>


      <div class="login-btn flex justify-center align-center">
        <router-link :to="'/login'">
          Login
        </router-link>
      </div>

    </section>

    <section>
      <img class="wave" src="/src/assets/img/home-page/white-wave-bg.svg" alt="">
      <div class="demo-invite flex row align-start w-100 justify-center wrap">
        <div>
          <h1>Kannban brings all your tasks, teammates, and tools together!</h1>
          <p>Keep everything in the same place, even if your team isn't.</p>
          <div class="flex row gap20 justify-center ">
            <button class="btn-signup" @click="loginDemo">
              See Demo
            </button>
          </div>
        </div>

        <img class="img1" src="/src/assets/img/home-page/home1.jpeg" alt="">

      </div>
    </section>
  </section>


</template>

<script>
export default {
  name: 'home',
  data() {
    return {
    }
  },
  computed: {
  },
  created() {
  },
  methods: {

    async loginDemo() {
      // if (!this.loginCred.email || !this.loginCred.password) {
      //   this.msg = 'Please enter email/password'
      //   return
      // }
      try {
        const user = await this.$store.dispatch({ type: "login", userCred: { email: 'dima-demo@mystartup.org', password: '123', imgUrl: 'https://res.cloudinary.com/dnznyz6om/image/upload/v1670495585/htkfdnkkhbrxd3nddln7.webp' } })
        console.log(user);
        if (user) this.$router.push('/board')
        else console.log('User name and password dont match');
      } catch (err) {
        console.log(err)
        this.msg = 'Failed to login'
      }
    },
  }

}
</script>
