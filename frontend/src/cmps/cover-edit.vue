<template>
    <section class="task-editor cover-edit" @click.stop="">
        <button class="btn-close" @click.stop="closeEdit">
            <span class="trellicons x-icon"></span>
        </button>
        <div class="title">Cover</div>
        <button class="btn-remove" @click="removeCover">Remove cover</button>
        <h4 class="mini-title">Colors</h4>
        <div class="colors-pallet flex row wrap justify-between align-center">
            <div v-for=" color in colorsPallet" :key="color" :style="{ backgroundColor: color }" class="color-sample"
                @click="updateCover(color)">

            </div>
        </div>
        <div class="mini-title">Attachments</div>
        <!-- <button class="btn-upload" @click="">Upload a cover image </button> -->
        <img-uploader @uploaded="updateCover"></img-uploader>

        <h4 class="mini-title">Photos from Unsplash</h4>
        <div class="photos-container flex justify-between  wrap">
            <img v-if="!imgUrls" src="../assets/svg/loader.svg" alt="" class="loader">
            <!-- <img v-else v-for="index in 12" :key="index" :src="imgUrls[index]" @click="updateCover(imgUrls[index])"> -->
            <img v-else v-for="index in 12" :key="imgUrls[index]" :src="imgUrls[index]" @click="updateCover(imgUrls[index])"
                v-show="isShowImg[index]" @load="() => { isShowImg[index] = true }">
        </div>

        <input type="text" placeholder="Search Photos..." @input="debounceHandler" v-model="searchTxt"
            @keyup.enter="($event) => $event.target.blur()">
    </section>
</template>

<script>
import axios from 'axios'
import { utilService } from '../services/util.service';
import imgUploader from '../cmps/img-uploader.vue'
export default {
    name: 'cover-edit',
    data() {
        return {
            isShowImg: [false, false, false, false, false, false,
                false, false, false, false, false, false,],
            imageDownloadUrl: '',
            clientId: 'wONkEH1Be08ksV3ijwHHpfu8tfvmD6SnhsRpvZBWVgg',
            searchTxt: '',
            imgUrls: '',
            colorsPallet: ['#7bc86c', '#f5dd29', '#ffaf3f', '#ef7564', '#cd8de5', '#5ba4cf', '#29cce5', '#6deca9', '#ff8ed4', '#172b4d'],
        }
    },
    components: {
        imgUploader
    },
    created() {
        this.debounceHandler = utilService.debounce(this.getPhotos, 600)
        this.debounceHandler()
    },
    methods: {
        removeCover() {
            this.$emit('updateTask', '')
        },
        getPhotos() {
            const key = "unsplashDB";

            // if (!localStorage.getItem(key)) console.log(this.searchTxt);
            if (!this.searchTxt && localStorage.getItem(key)) {
                this.imgUrls = JSON.parse(localStorage.getItem(key))
                console.log('from cache');
            }
            else {
                let apiUrl = `https://api.unsplash.com/search/photos?query=${this.searchTxt ? this.searchTxt : "landscape"
                    }&orientation=landscape&per_page=1200&client_id=${this.clientId}`;
                axios(apiUrl).then(({ data }) => {
                    this.imgUrls = data.results.map((res) => res.urls.full).slice(0, 4);

                    // console.log(this.imgUrls);
                });
            }
        },
        updateCover(value) {
            this.$emit('updateTask', value)
        },

        closeEdit() {
            this.$emit('closeEdit')
        },
    },
    computed: {

    }
}
</script>
