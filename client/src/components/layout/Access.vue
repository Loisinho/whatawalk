<template lang="pug">
    div#access
        div.access__container
            span.access__element.access__main
                router-link(to="/login" v-if="!isLoggedIn")
                    font-awesome-icon(:icon="faSignInAlt")
                span.access__icon(v-if="isLoggedIn")
                    font-awesome-icon(:icon="faUser")
            span.access__element(v-if="isLoggedIn")
                router-link(event="" to="/logout" @click.native.prevent="logout")
                    font-awesome-icon(:icon="faSignOutAlt")
</template>

<script>
import { mapState } from "vuex";
import { faUser, faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export default {
    name: "Access",
    computed: {
        ...mapState({
            isLoggedIn: state => state.session.isLoggedIn
        })
    },
    data: () => {
        return {
            faUser,
            faSignInAlt,
            faSignOutAlt
        }
    },
    methods: {
        async logout() {
            try {
                await this.$http.get("users/logout");
                this.$router.push({name: "home"});
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
        transition: all 0.4s;

        .access__element {
            position: absolute;
            top: 0;
            right: 0;
            display: flex;
            justify-content: center;
            transition: all 0.4s;

            > a, > .access__icon {
                width: 40px;
                height: 40px;
                margin: 10px;
                border-radius: 50%;
                line-height: 40px;
                text-decoration: none;
                text-align: center;
                font-size: 23px;
                background: $nav-links-bg;
                color: $nav-links-color;
                -webkit-tap-highlight-color: transparent;
                transition: all 0.4s;
            }

            > a:hover {
                background: $nav-links-color;
                color: $nav-links-bg;
            }

            &.access__main {
                z-index: 1;
            }
        }

        &:hover {
            height: 120px;

            > .access__element {
                &:nth-child(2) {
                    top: 60px;
                }
            }
        }
    }
}
</style>
