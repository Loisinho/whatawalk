<template lang="pug">
    div.usercard(@click.self="$router.push({name: 'profile', params: {id: user.username}})")
        div.usercard__img
            div.image__box
            img(:src="webUrl + user.img" alt="User image")
        span.usercard__username @{{ user.username }}
        button.usercard__btn(v-if="user.username !== username" type="button" @click="followAction") {{ following? "unfollow": "follow" }}
            font-awesome-icon(v-if="following" :icon="faUserMinus")
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
            webUrl: process.env.VUE_APP_URL + "media/images/profile/",
            following: null
        }
    },
    methods: {
        async followAction() {
            try {
                await this.$http.get(`users/${this.username}/follow?user=${this.user.username}&follow=${!this.following? "1": "0"}`);
                this.following = !this.following;
                this.$emit('update-break', this.following);
            } catch (error) {
                if (error.response.status === 401) this.$router.push({name: "login"});
                this.$store.state.alert.msg = error.response.data;
                this.$store.state.alert.type = "error";
                this.$store.commit("alert/alertActive");
            }
        }
    },
    created: function () {
        this.following = this.user.follow? true: false;
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
        position: relative;
        width: $usercard-img-width;
        border-radius: 50%;
        overflow: hidden;

        .image__box {
            width: 100%;
            padding-bottom: 100%;
            background: #ffffff;
        }

        > img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            color: #000000;
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
