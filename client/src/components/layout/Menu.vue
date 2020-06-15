<template lang="pug">
    nav#menu(:class="{'menu--open': open}")
        div#menu__bar
            div#menu__icon(@click="menuStatus(true)")
                div.menu__line.menu__line--first
                div.menu__line.menu__line--second
        div#menu__links
            ul(v-if="!isLoggedIn")
                li(@click="menuStatus(false)")
                    router-link(to="/") Home
                li(@click="menuStatus(false)")
                    router-link(to="/about") About
            ul(v-else)
                li(@click="menuStatus(false)")
                    router-link(to="/publications") Publications
                li(@click="menuStatus(false)")
                    router-link(to="/travels") Travels
                li.menu__dropdown
                    a(href="javascript:void(0)" @click="exploreOpen = !exploreOpen") Explore
                    form.menu__explore(@submit.prevent="search" :class="{'menu__explore--active': exploreOpen}")
                        div.menu__category(@click="optionsOpen = !optionsOpen")
                            span.custom__select {{ pick }}
                            font-awesome-icon(:icon="faSortDown")
                            div.custom__options(:class="{'custom__options--active': optionsOpen}")
                                p(@click="pick = 'users'") users
                                p(@click="pick = 'groups'") groups
                                p(@click="pick = 'publications'") publications
                        input.menu__keyword(type="text" aria-label="Keyword" v-model.trim="keyword" placeholder="Keyword.." aria-required="true")
                        input(type="submit" aria-label="Search" value="" :disabled="keyword === ''")
                        button.menu__search(type="button" aria-label="Search" @click="search" :disabled="keyword === ''")
                            font-awesome-icon(:icon="faSearch")
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { faSearch, faSortDown } from "@fortawesome/free-solid-svg-icons";

export default {
    name: "Menu",
    computed: {
        ...mapState({
            open: state => state.menu.open,
            isLoggedIn: state => state.session.isLoggedIn
        })
    },
    data: () => {
        return {
            faSortDown,
            faSearch,
            exploreOpen: false,
            optionsOpen: false,
            pick: "users",
            keyword: ""
        }
    },
    methods: {
        ...mapMutations("menu", [
            "menuStatus",
            "isClickable"
        ]),
        resizing: function() {
            this.isClickable(window.innerWidth);
        },
        search: function() {
            this.menuStatus(false);
            this.$router.push({
                name: "explore",
                params: {
                    id: this.keyword
                },
                query: {
                    pick: this.pick,
                    op: "default"
                }
            }).catch(err => {});
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
        height: 60px;
        z-index: 1;

        #menu__icon {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 10px;
            width: 40px;
            height: 40px;
            margin: auto 0;
            cursor: pointer;

            .menu__line {
                width: 100%;
                height: 2px;
                background: $nav-menu-icon-bg;
                position: absolute;
                left: 0;
                transition: transform 0.2s, top 0.2s 0.2s;
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
        transition: transform $transition-time;
        box-shadow: $menu-shadow;

        li {
            a {
                display: block;
                line-height: 60px;
                text-align: center;
                text-transform: uppercase;
                font-size: 24px;
                color: $nav-links-color;

                &.router-link-exact-active {
                    color: $nav-links-active-color;
                }
            }

            &:hover {
                background: $nav-links-hover-bg;
            }

            .menu__explore {
                height: 110px;
                padding: 10px;
                margin-bottom: 10px;
                background: $nav-links-hover-bg;
                display: none;

                .custom__select, .menu__keyword, .menu__search {
                    height: 40px;
                    font-size: 20px;
                    background: transparent;
                    color: $nav-links-color;
                }

                .menu__category {
                    @include custom-select();
                    margin-bottom: 10px;

                    svg {
                        font-size: 20px;
                    }
                }

                .menu__keyword {
                    width: calc(100% - 40px);
                    padding-left: 5px;
                }

                .menu__search {
                    width: 40px;
                    border-radius: 50%;
                    background: $nav-links-color;
                    color: $nav-links-bg;

                    &:hover {
                        transform: scale(0.92);
                    }
                }

                &.menu__explore--active {
                    display: block;
                }
            }
        }
    }

    &.menu--open {
        #menu__bar #menu__icon .menu__line {
            transition: top 0.2s, transform 0.2s 0.2s;
        }

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

        &:hover > #menu__links {
            transform: translateX(0);
        }
    }
}
</style>
