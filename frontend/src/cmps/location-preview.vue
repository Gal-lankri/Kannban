<template>
    <section class="location-preview">
        <div class="flex row w-100 align-center ">
            <span class="trellicons location-icon large "></span>
            <div class="task-cmp-title grow">Location</div>
        </div>
        <div class="map-container">

            <GoogleMap api-key="AIzaSyAV_zVjXKofPeV5nwAzfNKJ7Gt4VEMjHOw" style="width: 100%; height: 100%"
                :center="location.cords" :zoom="14">
                <Marker :options="{ position: location.cords }" @click="(center = location.cords)" />

            </GoogleMap>
            <div class="location-preview-footer flex justify-between row">
                <span>{{ location.name || 'No name' }}</span>
                <div class="actions">
                    <span class="trellicons external-link-icon"></span>
                    <span class="fa-solid elipsis-icon" @click="isOpenOptions = true"></span>
                    <button v-if="isOpenOptions" v-click-outside="() => isOpenOptions = false" @click="remove">Remove
                        location</button>
                </div>
            </div>
        </div>

    </section>
</template>

<script>
import { remove } from '@vue/shared'
import { GoogleMap, Marker, CustomMarker } from 'vue3-google-map'
export default {
    name: 'location-preview',
    props: {
        location: {
            type: Object,
            required: true,
        },
    },
    components: { GoogleMap, Marker },
    data() {
        return {
            center: {},
            markers: [
            ],
            isOpenOptions: false,
        }
    },
    created() {
        this.center = this.location.cords
        // console.log(this.center, this.location, '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        const marker = {
            title: this.location.name || 'no name',
            label: '',
            position: this.location.cords

        }
        this.markers.push(marker)
        // console.log(this.location)
    },
    methods: {
        remove() {
            this.$emit('removeLocation')
        }
    },
}
</script>