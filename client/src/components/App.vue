<template lang="pug">
    div#app
        transition(name="fade" mode="out-in")
            router-view#www(:key="$route.path")
        Alert
        Logo
        Access
        Menu
</template>

<script>
import Alert from "./Alert.vue";
import Logo from "./layout/Logo.vue";
import Access from "./layout/Access.vue";
import Menu from "./layout/Menu.vue";

export default {
    components: {
        Alert,
        Logo,
        Access,
        Menu
    },
    methods: {
        resized: function() {
            document.body.classList.add('body--resize');
            setTimeout(function() {
                document.body.classList.remove('body--resize');
            }, 400);
        }
    },
    mounted: function() {
        window.addEventListener("resize", this.resized);
    }
};
</script>

<style lang="scss">
@import "../assets/styles/styles";
</style>
