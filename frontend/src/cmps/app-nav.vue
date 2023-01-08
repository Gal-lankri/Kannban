<template>
    <section class="app-nav-container">
        <nav>
            <div class="boards-container flex column gap">
                <router-link class="btn home-btn flex align-center gap20" :to="'/board'">
                    <span class="trellicons icon-board"></span>
                    <span>Boards</span>
                </router-link>
                <!-- <router-link class="btn home-btn flex align-center gap20" :to="'/'">
                    <span class="trellicons icon-template-board"></span>
                    <span>Templates</span>
                </router-link> -->
                <router-link class="btn home-btn flex align-center gap20" :to="'/'">
                    <span class="trellicons icon-home"></span>
                    <span>Home</span>
                </router-link>
                <!-- <button >
                </button> -->
            </div>

            <div class="workspaces-container">

            </div>
        </nav>
    </section>
</template>

<script>
export default {


}
</script>
