<template lang="pug">
    div.usercard(@click="$router.push({name: 'profile', params: {id: user.username}})")
        div.usercard__img
            div.image__box
            img(:src="webUrl + user.img" alt="User image")
        span.usercard__username @{{ user.username }}
        button.usercard__btn(v-if="user.username !== username" type="button" @click.stop="followAction") {{ user.follow? "unfollow": "follow" }}
            font-awesome-icon(v-if="user.follow" :icon="faUserMinus")
            font-awesome-icon(v-else :icon="faUserPlus")
</template>

<script>
import { mapState } from "vuex";
import { faUserPlus, faUserMinus } from "@fortawesome/free-solid-svg-icons";

export default {
    name: "UserCard",
    props: ["user"],
    computed: {
        ...mapState({
            username: state => state.session.username
        })
    },
    data: () => {
        return {
            faUserPlus,
            faUserMinus,
            webUrl: process.env.VUE_APP_URL + "media/images/profile/"
        }
    },
    methods: {
        async followAction() {
            try {
                await this.$http.get(`users/follow?user=${this.user.username}&follow=${!this.user.follow? "1": "0"}`);
                this.user.follow = !this.user.follow;
                this.$emit('update-break', this.user.follow);
            } catch (error) {
                if (error.response.status === 401) {
                    this.$store.commit("session/disconnect");
                    this.$router.push({name: "login"});
                }
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
@import "../assets/styles/styles";

.usercard {
    @include container-flex("v");
    padding: 10px 5% 10px 10px;
    margin-bottom: 10px;
    background: $profile-bg;
    border-top-left-radius: 8vw;
    border-bottom-left-radius: 8vw;
    cursor: pointer;

    .usercard__img {
        @include image-box;
        position: relative;
        width: $usercard-img-width;
        border-radius: 50%;
        overflow: hidden;

        .image__box {
            padding-bottom: 100%;
        }
    }

    .usercard__username {
        margin-left: 20px;
        font-size: $usercard-font-size;
        font-weight: 600;
    }

    .usercard__btn {
        @include button-alpha();
        margin-left: auto;
        width: auto;
        text-transform: capitalize;
        font-size: $usercard-font-size;

        &:hover {
            background: transparent;
            color: #ffffff;
            transform: scale(0.92);
        }

        > svg {
            margin-left: 5px;
        }
    }

    &:hover {
        transform: scale(0.99);
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    .usercard {
        .usercard__img {
            width: vw-to-px(map-get($container-widths, "sd"), $usercard-img-width);
        }

        .usercard__username, .usercard__btn {
            font-size: vw-to-px(map-get($container-widths, "sd"), $usercard-font-size);
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "md")) {
    .usercard {
        .usercard__img {
            width: vw-to-px(map-get($container-widths, "md"), $usercard-img-width);
        }

        .usercard__username, .usercard__btn {
            font-size: vw-to-px(map-get($container-widths, "md"), $usercard-font-size);
        }
    }
}
</style>
