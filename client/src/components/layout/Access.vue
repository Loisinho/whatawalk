<template lang="pug">
    div#access
        div.access__container
            span.access__element.access__main
                router-link(to="/login" v-if="!isLoggedIn")
                    font-awesome-icon(:icon="faSignInAlt")
                img.access__icon(v-else :src="webUrl + img" alt="Profile image")
            span.access__element(v-if="isLoggedIn")
                router-link(:to="`/user/${username}/profile`")
                    font-awesome-icon(:icon="faUser")
            span.access__element(v-if="isLoggedIn")
                router-link(:to="`/user/${username}/groups`")
                    font-awesome-icon(:icon="faUsers")
            span.access__element(v-if="isLoggedIn")
                router-link(:to="`/user/${username}/chats`")
                    font-awesome-icon(:icon="faCommentAlt")
            span.access__element(v-if="isLoggedIn")
                router-link(event="" to="/logout" @click.native.prevent="logout")
                    font-awesome-icon(:icon="faSignOutAlt")
</template>

<script>
import { mapState } from "vuex";
import { faUser, faUsers, faCommentAlt, faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export default {
    name: "Access",
    computed: {
        ...mapState({
            isLoggedIn: state => state.session.isLoggedIn,
            username: state => state.session.username,
            img: state => state.session.img,
        })
    },
    data: () => {
        return {
            faUser,
            faUsers,
            faCommentAlt,
            faSignInAlt,
            faSignOutAlt,
            webUrl: process.env.VUE_APP_URL + "media/images/profile/"
        }
    },
    methods: {
        async logout() {
            try {
                await this.$http.get("users/logout");
                this.$router.push({name: "login"});
            } catch (error) {
                this.$store.state.alert.msg = error.response.data;
                this.$store.state.alert.type = "error";
                this.$store.commit("alert/alertActive");
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/styles";

#access {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1;

    .access__container {
        position: relative;
        top: 0;
        right: 0;
        width: 60px;
        height: 60px;
        overflow: hidden;
        transition: all $transition-time;

        .access__element {
            @include container-flex(h);
            position: absolute;
            top: 0;
            right: 0;
            transition: all $transition-time;

            > a, > .access__icon {
                width: 40px;
                height: 40px;
                margin: 10px;
                border-radius: 50%;
                line-height: 40px;
                text-align: center;
                font-size: 23px;
                background: $nav-links-color;
                color: $nav-links-bg;
                transition: all $transition-time;
            }

            > a {
                &:hover {
                    box-shadow: inset -2px -2px 4px rgba(#fff, 0.6),
                                inset 2px 2px 4px rgba(#000, 0.6);
                }

                &:hover svg {
                    transform: scale(0.92);
                }
            }

            &.access__main {
                z-index: 1;
                
                > img {
                    object-fit: cover;
                }
            }
        }

        &:hover {
            $n: 5;
            height: calc(#{$n} * 60px);

            > .access__element {
                @for $i from 2 through $n {
                    &:nth-child(#{$i}) {
                        top: calc((#{$i} - 1) * 60px);
                    }
                }
            }
        }
    }
}
</style>
