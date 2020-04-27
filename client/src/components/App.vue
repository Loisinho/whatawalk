<template lang="pug">
    div#app
        div#www
            router-view
        Logo
        Menu
</template>

<script>
import Logo from "./layout/Logo.vue";
import Menu from "./layout/Menu.vue";

export default {
    components: {
        Logo,
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

*, *:before, *:after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    background: $body-bg;
    color: $body-color;
    font-family: $body-font-family;

    #www {
        width: 100%;
        margin: 0 auto;
        padding: 100px 30px 0 30px;
    }

    &.body--resize * {
        transition: none !important;
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    body #www {
        max-width: map-get($container-widths, "sd");
    }
}

@media only screen and (min-width: map-get($breakpoints, "md")) {
    body #www {
        max-width: map-get($container-widths, "md");
    }
}

@media only screen and (min-width: map-get($breakpoints, "ld")) {
    body #www {
        max-width: map-get($container-widths, "ld");
    }
}

@media only screen and (min-width: map-get($breakpoints, "xd")) {
    body #www {
        max-width: map-get($container-widths, "xd");
    }
}
</style>
