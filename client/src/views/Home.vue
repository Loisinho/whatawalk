<template lang="pug">
    div
        div.content
            section.header
                div.header__title
                    img.header__logo(src="../assets/logo.svg" alt="WhatAWalk")
                    div.header__name
                        h1 What A Walk
            section.access(v-if="!isLoggedIn")
                div(@click="menuStatus(false)")
                    router-link.access__link(to="/login") Log In
                div(@click="menuStatus(false)")
                    router-link.access__link(to="/signup") Sign Up
            section.main
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
    name: "Home",
    computed: {
        ...mapState({
            isLoggedIn: state => state.session.isLoggedIn
        })
    },
    methods: {
        ...mapMutations("menu", [
            'menuStatus'
        ])
    }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

.content {
    .header {
        @include container-flex($direction: column);
        width: 100%;
        height: calc(100vh - 240px);
        min-height: 400px;

        .header__title {
            @include container-flex(b, column);
            width: 100%;
            height: 100%;

            .header__logo {
                width: 100%;
            }

            .header__name {
                @include container-flex(b);
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                transform: translateY(50%);
                overflow: hidden;
                z-index: -1;

                > h1 {
                    font-family: $logo-font-family;
                    font-size: $home-header-name-size;
                    font-weight: 600;
                    line-height: 100%;
                    text-transform: uppercase;
                    text-align: center;
                    background-color: $header-name-color;
                    color: transparent;
                    white-space: nowrap;
                    text-shadow: 6px 6px 12px rgba(#fff, 0.1);
                    -webkit-background-clip: text;
                       -moz-background-clip: text;
                            background-clip: text;
                }
            }
        }
    }

    .access {
        position: sticky;
        top: 70px;
        width: 100%;
        padding: 0 25%;
        display: flex;
        justify-content: space-evenly;

        .access__link {
            font-size: $home-access-link-size;
            font-weight: bold;

            @include link-border-animation;
        }
    }

    .main {
        width: 100%;
        height: 2000px;
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    .content .access .access__link {
        font-size: vw-to-px(map-get($container-widths, "sd"), $home-access-link-size);
    }
}

@media only screen and (min-width: map-get($breakpoints, "md")) {
    .content .access .access__link {
        font-size: vw-to-px(map-get($container-widths, "md"), $home-access-link-size);
    }
}

@media only screen and (min-width: map-get($breakpoints, "ld")) {
    .content .access {
        top: 12px;

        .access__link {
            font-size: vw-to-px(map-get($container-widths, "ld"), $home-access-link-size);
        }
    }
}
</style>
