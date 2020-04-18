<template lang="pug">
    div#content
        section#header
            div.header__title
                img.header__logo(src="../assets/logo.svg" alt="WhatAWalk")
                div.header__name
                    span What A Walk
            div.header__access
                a.header__link(href="#") Log In
                a.header__link(href="#") Sign Up
        section#main
</template>

<script>
export default {
    name: "Home",
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

#content {
    width: 100%;

    #header {
        width: 100%;
        height: calc(100vh - 200px);
        min-height: 400px;
        display: flex;
        flex-direction: column;

        .header__title {
            width: 100%;
            height: calc(100% - 60px);
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

        .header__access {
            width: 50%;
            height: 60px;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            align-self: center;

            .header__link {
                text-decoration: none;
                -webkit-tap-highlight-color: transparent;
                font-size: $home-header-link-size;
                text-transform: uppercase;
                font-weight: bold;
                color: #ffffff;
            }

            .header__link:after {
                content: " ";
                display: block;
                width: 0;
                margin: 0 auto;
                border: 1px solid rgba(#ffffff, 0);
                transition: all 400ms ease-in-out;
            }

            .header__link:hover:after {
                width: 100%;
                border-color: #ffffff;
            }
        }
    }

    #main {
        width: 100%;
        height: 2000px;
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    #content #header {
        .header__title .header__name {
            font-size: font-size-vw(map-get($conatiner-widths, "sd"), $home-header-name-size);
        }

        .header__access .header__link {
            font-size: font-size-vw(map-get($conatiner-widths, "sd"), $home-header-link-size);
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "md")) {
    #content #header {
        .header__title .header__name {
            font-size: font-size-vw(map-get($conatiner-widths, "md"), $home-header-name-size);
        }

        .header__access .header__link {
            font-size: font-size-vw(map-get($conatiner-widths, "md"), $home-header-link-size);
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "ld")) {
    #content #header {
        .header__title .header__name {
            font-size: font-size-vw(map-get($conatiner-widths, "ld"), $home-header-name-size);
        }

        .header__access .header__link {
            font-size: font-size-vw(map-get($conatiner-widths, "ld"), $home-header-link-size);
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "xd")) {
    #content #header {
        .header__title .header__name {
            font-size: font-size-vw(map-get($conatiner-widths, "xd"), $home-header-name-size);
        }

        .header__access .header__link {
            font-size: font-size-vw(map-get($conatiner-widths, "xd"), $home-header-link-size);
        }
    }
}
</style>
