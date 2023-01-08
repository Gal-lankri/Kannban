<template>
  <div class="login-signup">
    <p>{{ msg }}</p>
    <div class="logo gap flex row align-center justify-center">
      <span class="fa-brands trello-icon "></span>
      <span class="">Kannban</span>
    </div>
    <section class="login-main-layout ">
      <div v-if="loggedinUser" class="user-loggedin flex column justify-center align-center gap20">
        <div class="flex align-center member-cover ">
          <div v-if="loggedinUser.imgUrl" class="member-image" :style="memberImage(loggedinUser.imgUrl)"> </div>
          <span v-else class="member-initials">
            {{ getInitials(loggedinUser.fullname) }}
          </span>
        </div>
        <h3>
          {{ loggedinUser.fullname }}
        </h3>
        <h2>
          {{ loggedinUser.email }}
        </h2>
        <div class="flex gap5 column w-100">
          <button class="btn login-btn" @click="$router.push('/board')">Back to Kannban</button>
          <button class="btn login-btn" @click="doLogout">Logout</button>
        </div>
      </div>
      <div v-else class="login-signup-container">
        <!-- <h1 v-else>Sign up to Kanban</h1> -->
        <form v-if="!isSignUp" @submit.prevent="doLogin">
          <h1>Log in to Kanban</h1>
          <div class="login-container">
            <input type="text" placeholder="Enter email" v-model="loginCred.email"
              @keyup.enter="($event) => $event.target.blur()">
            <input type="text" placeholder="Enter password" v-model="loginCred.password"
              @keyup.enter="($event) => $event.target.blur()">
            <button class="btn login-btn">Log in</button>
          </div>
          <div>OR</div>
        </form>
        <form v-else @submit.prevent="doSignup">
          <h1>Sign up for your account</h1>
          <div class="signup-container">
            <input type="text" placeholder="Enter full name" v-model="signupCred.fullname"
              @keyup.enter="($event) => $event.target.blur()">
            <input type="text" placeholder="Enter email" v-model="signupCred.email"
              @keyup.enter="($event) => $event.target.blur()">
            <input type="text" placeholder="Enter password" v-model="signupCred.password"
              @keyup.enter="($event) => $event.target.blur()">
            <!-- <img-uploader @uploaded="onUploaded"></img-uploader> -->
            <button class="btn login-btn">Sign up</button>
          </div>
          <div>OR</div>
        </form>
        <button class="btn google-btn">
          <span class="icon"></span>
          Continue with Google
        </button>
        <GoogleLogin :callback="loginWithGoogle" />
        <hr class="bottom-form-separator">

        <div v-if="!isSignUp" class="login-footer">
          <span href="">Can't log in?</span>
          <span class="fa-solid fa-circle"></span>
          <span href="" @click.prevent="(isSignUp = true)">Sign up for an account
          </span>
        </div>
        <div v-else class="signup-footer">
          <span href="" @click.prevent="(isSignUp = false)">
            Already have an account? Log In
          </span>
        </div>
      </div>
    </section>
    <img class="bottom-right-img"
      src="https://aid-frontend.prod.atl-paas.net/atlassian-id/front-end/5.0.385/static/media/trello-right.16b9c9bb.svg"
      alt="">
    <img class="bottom-left-img"
      src="https://aid-frontend.prod.atl-paas.net/atlassian-id/front-end/5.0.385/static/media/trello-left.7317ad1f.svg"
      alt="">
  </div>
</template>

<script>
import { utilService } from "../services/util.service";

import imgUploader from '../cmps/img-uploader.vue'
import { decodeCredential } from 'vue3-google-login'
// import { googleTokenLogin } from "vue3-google-login"
export default {
  name: 'login-signup',
  data() {
    return {
      msg: '',
      loginCred: { email: '', password: '' },
      signupCred: { email: '', password: '', fullname: '', imgUrl: '' },
      isSignUp: false
    }
  },
  computed: {
    users() {
      return this.$store.getters.users
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser
    },
  },
  created() {
    this.loadUsers
  },
  methods: {
    getInitials(fullname) {
      return utilService.getInitials(fullname);
    },
    memberImage(imgUrl) {
      return { backgroundImage: `url(${imgUrl})` };
    },
    async loginWithGoogle(res) {
      console.log(res);
      const userData = decodeCredential(res.credential)
      const googleUserCred = {
        email: userData.email,
        fullname: userData.name,
        imgUrl: userData.picture,
        password: '',
        isGoogleUser: true
      }
      try {
        const user = await this.$store.dispatch({ type: "login", userCred: googleUserCred })
        console.log(user);
        if (user) this.$router.push('/board')
        // else {
        //   this.isSignUp = true
        //   this.signupCred.email = userData.email
        //   this.signupCred.imgUrl = userData.picture
        // }
      }
      catch (err) {
        console.log(err)
        this.msg = 'Failed to login'
      }
    },
    setUserImg(imgUrl) {
      console.log(imgUrl);
    },
    async doLogin() {
      if (!this.loginCred.email || !this.loginCred.password) {
        this.msg = 'Please enter email/password'
        return
      }
      // if (this.loginCred.email.toLowerCase()
      //   .match(
      //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      //   )) {
      //   console.log('hiiiiiiiiiiiiiiiiiiiiii');
      //   return
      // }
      try {
        const user = await this.$store.dispatch({ type: "login", userCred: this.loginCred })
        console.log(user);
        if (user) this.$router.push('/board')
        else console.log('User name and password dont match');
      } catch (err) {
        console.log(err)
        this.msg = 'Failed to login'
      }
    },
    async doLogout() {
      try {
        await this.$store.dispatch({ type: 'logout' })
      } catch (err) {
        console.log('userStore: Error in logout', err)
      }
    },

    loadUsers() {
      this.$store.dispatch({ type: "loadUsers" })
    },
    async removeUser(userId) {
      try {
        await this.$store.dispatch({ type: "removeUser", userId })
        this.msg = 'User removed'
      } catch (err) {
        this.msg = 'Failed to remove user'
      }
    },
    onUploaded(imgUrl) {
      this.signupCred.imgUrl = imgUrl
    }
  },
  watch: {
    getLoggedInUser() {
      // console.log(this.getLoggedInUser)
    }
  },
}
</script>