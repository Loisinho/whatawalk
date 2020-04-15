<template lang="pug">
    div#app
        Header
        div#content
            router-view
</template>

<script>
import Header from "./components/layout/Header.vue";
export default {
    name: "app",
    components: {
        Header
    }
};
</script>

<style lang="scss">
@import "./assets/styles/variables";

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    background: $body-bg;
    color: $body-color;
    font-family: $body-font-family;
}

#content {
    width: 100%;
    padding: 80px 10px;
}

@media screen and (min-width: 991px) {
    #content {
        width: 100%;
        padding: 100px 100px 0 100px;
    }
}
</style>
