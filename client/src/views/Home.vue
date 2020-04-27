<template lang="pug">
    div#content
        section#header
            div.header__title
                img.header__logo(src="../assets/logo.svg" alt="WhatAWalk")
                div.header__name
                    span What A Walk
        section#access
            div(@click="menuStatus(false)")
                router-link.access__link(to="/login") Log In
            div(@click="menuStatus(false)")
                router-link.access__link(to="/signup") Sign Up
        section#main
</template>

<script>
import { mapMutations } from "vuex";

export default {
    name: "Home",
    methods: {
        ...mapMutations("menu", [
            'menuStatus'
        ])
    }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

#content {
    width: 100%;

    #header {
        width: 100%;
        height: calc(100vh - 240px);
        min-height: 400px;
        display: flex;
        flex-direction: column;

        .header__title {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .header__logo {
                width: 100%;
            }

            .header__name {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                transform: translateY(50%);
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                z-index: -1;

                > span {
                    font-family: $logo-font-family;
                    font-size: $home-header-name-size;
                    font-weight: 600;
                    line-height: 100%;
                    text-transform: uppercase;
                    text-align: center;
                    color: $header-name-color;
                    white-space: nowrap;
                }
            }
        }
    }

    #access {
        position: sticky;
        top: 70px;
        width: 100%;
        padding: 0 25%;
        display: flex;
        justify-content: space-evenly;

        .access__link {
            text-decoration: none;
            -webkit-tap-highlight-color: transparent;
            font-size: $home-access-link-size;
            text-transform: uppercase;
            font-weight: bold;
            color: #ffffff;
        }

        .access__link:after {
            content: " ";
            display: block;
            width: 0;
            margin: 0 auto;
            border: 1px solid rgba(#ffffff, 0);
            transition: all 400ms ease-in-out;
        }

        .access__link:hover:after {
            width: 100%;
            border-color: #ffffff;
        }
    }

    #main {
        width: 100%;
        height: 2000px;
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    #content #access .access__link {
        font-size: font-size-vw(map-get($container-widths, "sd"), $home-access-link-size);
    }
}

@media only screen and (min-width: map-get($breakpoints, "md")) {
    #content #access .access__link {
        font-size: font-size-vw(map-get($container-widths, "md"), $home-access-link-size);
    }
}

@media only screen and (min-width: map-get($breakpoints, "ld")) {
    #content #access {
        top: 12px;

        .access__link {
            font-size: font-size-vw(map-get($container-widths, "ld"), $home-access-link-size);
        }
    }
}
</style>
