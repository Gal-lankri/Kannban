import { createApp } from 'vue'

import { router } from './router.js'
import { store } from './store/store.js'


import './assets/styles/main.scss'
import rootCmp from './root-cmp.vue'

import VueGeolocation from "vue3-geolocation";
import GMaps from "vuejs3-google-maps";
import vue3GoogleLogin from 'vue3-google-login'
import GAuth from 'vue3-google-oauth2'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import contenteditable from 'vue-contenteditable'
import {
    focusDirective,
    rainbowDirective,
    customOnDirective,
    clickOutsideDirective,
} from './directives'

const app = createApp(rootCmp)
app.use(router)
app.use(store)


app.directive('click-outside', clickOutsideDirective)
app.directive('focus', focusDirective)

app.use(VueGeolocation);
app.use(GMaps, {
    load: {
        apiKey: "AIzaSyAV_zVjXKofPeV5nwAzfNKJ7Gt4VEMjHOw",
        libraries: ["places"],
    },
});
app.use(vue3GoogleLogin, {
    clientId: '1026456709194-stf9r3fts802im0jhpnst7qntrpq49of.apps.googleusercontent.com'
})
const gAuthOptions = { clientId: '1026456709194-stf9r3fts802im0jhpnst7qntrpq49of.apps.googleusercontent.com', scope: 'email', prompt: 'consent', fetch_basic_profile: false }
app.use(GAuth, gAuthOptions)
app.use(ElementPlus)
app.use(contenteditable)

app.mount('#app')
