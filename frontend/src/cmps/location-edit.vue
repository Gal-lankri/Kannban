<template>
    <section class="location-edit task-editor" @click.stop="">
        <div class="location-edit-header">
            <button class="btn-close">
                <span class="trellicons location-icon" @click.stop="closeEdit"></span>
            </button>
            <div class="title ">
                Add location
            </div>

            <input type="search" list="locations" id="location" placeholder="Search Google Maps" v-model="locTxt"
                @input="debounceHandler" @keyup.enter="($event) => $event.target.blur()" v-focus>
            <div class="btn-remove" v-for="locCords in locsCords" :value="locCords.name"
                @click="updateLocation(locCords)">
                {{ locCords.name }}
            </div>
        </div>

        <!-- <datalist id="locations">
                <option v-for="locCords in locsCords" :value="locCords.name"></option>
            </datalist> -->
    </section>
</template>

<script>
import axios from 'axios'
import { utilService } from '../services/util.service'
export default {
    name: 'location-edit',
    data() {
        return {
            locTxt: '',
            API_KEY: 'AIzaSyAV_zVjXKofPeV5nwAzfNKJ7Gt4VEMjHOw',
            locsCords: []
        }
    },
    created() {
        this.debounceHandler = utilService.debounce(this.getLocationByName, 1000)
        this.debounceHandler()
    },

    methods: {
        updateLocation(locCords) {
            const chosenLoc = this.locsCords.find(loc => {
                return loc.name === locCords.name
            })
            this.$emit('updateTask', chosenLoc)
        },
        getLocationByName() {
            if (!this.locTxt.trim()) return
            const locsUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${this.locTxt}&key=${this.API_KEY}&language=en`
            axios(locsUrl)
                .then(({ data }) => {
                    const topResults = data.results.slice(0, 5)
                    topResults.forEach(res => {
                        this.locsCords.push({ cords: res.geometry.location, name: res.formatted_address })
                    })
                })
                .catch((err) => {
                    console.log('Cant load locations', err);
                })
        },
    },
}
</script>