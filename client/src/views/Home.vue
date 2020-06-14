<template lang="pug">
    div
        BgCanvas
        div.home_title
            h1 What A Walk
        div.content
            section.header
                div.header__title
                    img.header__logo(src="../assets/logo.svg" alt="WhatAWalk")
            section.access(v-if="!isLoggedIn")
                div(@click="menuStatus(false)")
                    router-link.access__link(to="/login") Log In
                div(@click="menuStatus(false)")
                    router-link.access__link(to="/signup") Sign Up
            section.main
                div.main__content
                    h3 A web aplication for travel groups
                    p The easiest way to plan any trip with friends, family or even users you just met in the app
                    img(src="../assets/images/group-of-people.jpg" alt="Group of people")
                div.main__content
                    h3 Firstly
                    p Get together with other users in a travel group, find the perfect plan and discuss it without distance being a problem.
                    img(src="../assets/images/sign-arrow-direction-travel.jpg" alt="Sign arrow direction travel")
                div.main__content
                    h3 Explore the world
                    p Adventures, relaxation, curiosity, find the perfect place and explore it in search of its gems before the trip, so you don't get lost during the trip.
                    img(src="../assets/images/silhouette-of-person-standing-near-camping-tent.jpg" alt="Silhouette of person standing near camping tent")
                div.main__content
                    h3 If you are lost
                    p Find the best restaurants, hotels, museums, places to visit nearby once you are there and notify the group.
                    img(src="../assets/images/map-inside-vehicle.jpg" alt="Map inside vehicle")
                div.main__content
                    h3 And finally...
                    p Share the best moments of the trip with the community and watch the moments of other users to start thinking about the next destination.
                    img(src="../assets/images/close-up-of-pictures.jpg" alt="Close up of pictures")
            section.footer
                router-link.footer__link(to="/about") About
                router-link.footer__link(to="/privacy") Privacy
</template>

<script>
import { mapState, mapMutations } from "vuex";
import BgCanvas from "../components/BgCanvas.vue";


export default {
    name: "Home",
    components: {
        BgCanvas
    },
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


.home_title {
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translateY(50%);
    width: 100%;
    line-height: 0;
    text-align: center;
    overflow: hidden;

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

.content {
    position: relative;
    
    .header {
        @include container-flex($direction: column);
        width: 100%;
        height: calc(100vh - 200px);
        min-height: 400px;

        .header__title {
            @include container-flex(b, column);
            width: 100%;
            height: 100%;

            .header__logo {
                width: 100%;
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
            @include link-border-animation;
            font-size: $home-access-link-size;
            font-weight: bold;
        }
    }

    .main {
        width: 100%;
        margin-top: 200px;
        text-align: center;

        .main__content {
            padding: 0 8%;
            margin-bottom: 100px;

            > h3 {
                margin-bottom: 20px;
                font-size: $home-main-title;
                font-weight: 800;
                text-transform: uppercase;
                color: $nav-links-bg;
            }

            > p {
                margin-bottom: 100px;
                font-size: $home-main-text;
                color: $form-main-color;
            }

            > img {
                width: 100%;
                border-radius: 5%;
                box-shadow: $form-shadow;
            }

            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    .footer {
        @include container-flex("h");
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        height: 40px;
        margin-top: 40px;

        > a {
            padding: 10px;
            color: $form-main-color;
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    .content {
        .access .access__link {
            font-size: vw-to-px(map-get($container-widths, "sd"), $home-access-link-size);
        }

        .main .main__content {
            > h3 {
                font-size: vw-to-px(map-get($container-widths, "sd"), $home-main-title);
            }

            > p {
                font-size: vw-to-px(map-get($container-widths, "sd"), $home-main-text);
            }
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "md")) {
    .content {
        .access .access__link {
            font-size: vw-to-px(map-get($container-widths, "md"), $home-access-link-size);
        }

        .main .main__content {
            > h3 {
                font-size: vw-to-px(map-get($container-widths, "md"), $home-main-title);
            }

            > p {
                font-size: vw-to-px(map-get($container-widths, "md"), $home-main-text);
            }
        }
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
