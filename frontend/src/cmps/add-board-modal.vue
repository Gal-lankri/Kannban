<template>
    <section class="task-editor add-board-modal flex column gap5" @click.stop="">
        <button class="btn-close" @click.stop="closeEdit">
            <span class="trellicons x-icon"></span>
        </button>
        <div class="title">
            <div class="">Create board</div>
        </div>

        <h4 class="mini-title">Background photo from Unsplash</h4>
        <div class="photos-container flex align-center justify-center">
            <img v-if="!imgUrls" src="../assets/svg/loader.svg" alt="">
            <img v-else v-for="index in 3" :key="index" :src="imgUrls[index]" @click="updateCover(imgUrls[index])" />
        </div>
        <input type="text" placeholder="Search Photos..." @input="debounceHandler" v-model="searchTxt"
            @keyup.enter="debounceHandler" />
        <h4 class="mini-title">Background color</h4>
        <div class="colors-pallet flex wrap row gap5 justify-between">
            <div v-for="color in colors" :key="color" :style="{ backgroundColor: color }" class="color-sample"
                @click="updateCover(color)">
            </div>
            <!-- <div class="color-sample">...</div> -->
        </div>
        <h4 class="mini-title">Board title</h4>
        <input class="" ref="title" type="text" v-model="title" v-focus :class="{ required: !title }" @input="print"
            placeholder="Enter title" @keyup.enter="addBoard" />
        <button class="btn-add" @click="addBoard" :class="{ required: !title }" :disabled="title === ''">Create</button>
    </section>
</template>

<script>
import axios from "axios";
import { utilService } from "../services/util.service";
import imgUploader from "../cmps/img-uploader.vue";
export default {
    name: "add-board-moadl",
    data() {
        return {
            imageDownloadUrl: "",
            clientId: "wONkEH1Be08ksV3ijwHHpfu8tfvmD6SnhsRpvZBWVgg",
            searchTxt: "",
            imgUrls: '',
            colors: [
                "#0079bf",
                "#d29034",
                "#519839",
                "#b04632",
                "#89609e",
                "#cd5a91",
                "#4bbf6b",
                "#00aecc",
                "#838c91",
            ],
            title: '',
            bcg: "/src/assets/img/bgc-img-5.jpg",
        };
    },
    components: {
        imgUploader,
    },
    created() {
        this.debounceHandler = utilService.debounce(this.getPhotos, 600);
        this.debounceHandler();

    },
    methods: {
        print() {
            // console.log(this.$refs.title.value)
            this.title = this.$refs.title.value
        },
        getPhotos() {
            const key = "unsplashDB";

            if (!localStorage.getItem(key)) console.log(this.searchTxt);
            if (!this.searchTxt && localStorage.getItem(key)) {
                this.imgUrls = JSON.parse(localStorage.getItem(key))
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
        updateCover(background) {
            this.bcg = background;
        },

        closeEdit() {
            this.$emit("closeEdit");
        },
        addBoard() {
            this.$emit("addBoard", { title: this.title, bcg: this.bcg, members: [{ _id: this.user._id, fullname: this.user.fullname, imgUrl: this.user.imgUrl }] });
        },

    },
    computed: {
        user() {
            return this.$store.getters.loggedinUser;
        },
    },
};
</script>
