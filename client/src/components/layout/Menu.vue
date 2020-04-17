<template lang="pug">
    nav#menu
        div#menu__bar
            div#menu__icon
                div.menu__line.menu__line--first
                div.menu__line.menu__line--second
        div#menu__links
            ul
                li
                    router-link(to="/") Home
                li
                    router-link(to="/about") About
                li
                    router-link(to="/test") Test
</template>

<script>
export default {
    name: "Header",
    methods: {
        menuModifier: function() {
            let menu = document.getElementById("menu");
            menu.className === "menu--open"? menu.className = "" : menu.className = "menu--open";
        },
        resizing: function() {
            let width = window.innerWidth;
            let icon = document.getElementById("menu__icon");
            document.getElementById("menu").classList.remove("menu--open");
            if (width < 991) {
                icon.addEventListener("click", this.menuModifier);
            } else {
                icon.removeEventListener("click", this.menuModifier);
            }
        }
    },
    mounted: function() {
        this.resizing();
        window.addEventListener("resize", this.resizing);
    }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/styles";

#menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;

    #menu__bar {
        background: $nav-bg-small;
        position: relative;
        padding: 10px;
        z-index: 1;

        #menu__icon {
            position: relative;
            top: 0;
            left: 0;
            width: 40px;
            height: 40px;

            .menu__line {
                width: 100%;
                height: 2px;
                background: $nav-menu-icon-bg;
                position: absolute;
                left: 0;
                transition: all 0.4s;
            }

            .menu__line--first {
                top: 10px;
            }
            
            .menu__line--second {
                top: 28px;
            }

            &:hover > .menu__line--first, &:hover > .menu__line--second {
                top: 19px;
            }

            @media (hover: none) {
                &:hover > .menu__line--first {
                    top: 10px;
                }

                &:hover > .menu__line--second {
                    top: 28px;
                }
            }
        }
    }

    #menu__links {
        background: $nav-links-bg;
        position: absolute;
        top: 100%;
        display: block;
        width: 100%;
        transform: translateY(-100%);
        transition: transform 0.4s;

        a {
            display: block;
            height: 60px;
            padding: 10px;
            text-decoration: none;
            text-align: center;
            text-transform: uppercase;
            font-size: 24px;
            color: $nav-links-color;
            -webkit-tap-highlight-color: transparent;

            &:hover {
                background: $nav-links-hover-bg;
            }

            &.router-link-exact-active {
                color: $nav-links-active-color;
            }
        }
    }

    &.menu--open {
        #menu__bar #menu__icon .menu__line--first {
            transform: rotate(45deg);
            top: 19px;
        }

        #menu__bar #menu__icon .menu__line--second {
            transform: rotate(-45deg);
            top: 19px;
        }

        #menu__links {
            transform: translateY(0);
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "ld")) {
    #menu {
        width: auto;
        height: 100%;

        #menu__bar {
            background: $nav-bg-big;
            padding: 20px;
            height: 100%;
            z-index: 0;

            #menu__icon {
                top: 50%;
                height: 50px;
                transform: translateY(-50%);

                .menu__line {
                    width: 2px;
                    height: 100%;
                    top: 0;
                }

                .menu__line--first {
                    left: 10px;
                }

                .menu__line--second {
                    left: 28px;
                }
            }
        }

        #menu__links {
            top: 0;
            width: 40vw;
            height: 100%;
            transform: translateX(-100%);
        }

        #menu__bar:hover ~ #menu__links, #menu__links:hover {
            transform: translateX(0);
        }
    }
}
</style>
