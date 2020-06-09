<template lang="pug">
    div#access
        div.access__container
            span.access__element.access__main(:class="{'access__element--notification': groups.length || notices}")
                router-link(to="/login" v-if="!isLoggedIn" title="Login")
                    font-awesome-icon(:icon="faSignInAlt")
                img.access__icon(v-else :src="webUrl + img" alt="Profile image")
            span.access__element(v-if="isLoggedIn")
                router-link(:to="`/user/${username}/profile`" title="Profile")
                    font-awesome-icon(:icon="faUser")
            span.access__element(v-if="isLoggedIn" :class="{'access__element--notification': groups.length}")
                router-link(:to="`/user/${username}/groups`" title="Groups")
                    font-awesome-icon(:icon="faUsers")
            span.access__element(v-if="isLoggedIn" :class="{'access__element--notification': notices}")
                router-link(:to="`/user/${username}/notices`" title="Notices")
                    font-awesome-icon(:icon="faCommentAlt")
            span.access__element(v-if="isLoggedIn")
                router-link(event="" to="/logout" @click.native.prevent="logout" title="Logout")
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
            notices: state => state.session.notices,
            groups: state => state.session.groups
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
    sockets: {
        newNotice() {
            this.$store.commit("session/newNotice");
        },
        newMsg(data) {
            if (this.$route.path !== `/group/${data.group}`)
                this.$store.commit("session/newGroupMsg", data.group);
        }
    },
    methods: {
        async logout() {
            try {
                if (this.$route.name === "group")
                    await this.$http.get(`groups/${this.$route.params.id}/accessed`);
                await this.$http.get("users/logout");
                this.$socket.client.close();
                this.$store.commit("session/disconnect");
                this.$router.push({name: "login"});
            } catch (error) {
                this.$store.commit("alert/activateAlert", {
                    msg: error.response.data,
                    type: "error"
                });
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

            &.access__element--notification {
                > a, > .access__icon {
                    > svg {
                        animation: notify 1s ease alternate infinite;
                    }
                }

                &.access__main > img {
                    animation: mainNotify 1s ease alternate infinite;
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

@keyframes mainNotify {
    0% {
        box-shadow: 0 0 0 4px $body-bg;
    }
    100% {
        box-shadow: 0 0 0 4px $alert-success-bg;
    }
}

@keyframes notify {
    0% {
        color: $nav-links-bg;
    }
    100% {
        color: $alert-success-bg;
    }
}
</style>
