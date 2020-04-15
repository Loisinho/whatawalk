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
        clickable: function() {
            let x = document.getElementById("menu");
            if (x.className === "responsive")
                x.className = "";
            else
                x.className = "responsive";
        },
        menu: function() {
            let width = window.innerWidth;
            let icon = document.getElementById("menu__icon");
            if (width < 991)
                icon.addEventListener("click", this.clickable);
            else
                icon.removeEventListener("click", this.clickable);
        }
    },
    mounted: function() {
        this.menu();
        window.addEventListener("resize", this.menu);
    }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variables";

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

            &:hover > * {
                top: 19px;
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

            &:hover {
                background: $nav-links-hover-bg;
            }

            &.router-link-exact-active {
                color: $nav-links-active-color;
            }
        }
    }

    &.responsive {
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

@media screen and (min-width: 991px) {
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
