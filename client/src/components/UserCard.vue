<template lang="pug">
    //- router-link.usercard(:to="{name: 'profile', params: {id: user.username}}")
    div.usercard
        img.usercard__img(:src="webUrl + user.img" alt="User image")
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
    height: $explore-user-container-height;
    padding: 10px 5% 10px 10px;
    margin-bottom: 10px;
    background: $profile-bg;

    .usercard__img {
        height: 100%;
    }

    .usercard__username {
        margin-left: 20px;
        font-size: $explore-user-font-size;
        font-weight: 600;
    }

    .usercard__btn {
        @include button-alpha();
        margin-left: auto;
        // margin-right: 10px;
        width: auto;
        text-transform: capitalize;
        font-size: $explore-user-font-size;

        &:hover {
            background: transparent;
            color: #ffffff;
        }

        > svg {
            margin-left: 5px;
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    .usercard {
        height: vw-to-px(map-get($container-widths, "sd"), $explore-user-container-height);

        .usercard__username, .usercard__btn {
            font-size: vw-to-px(map-get($container-widths, "sd"), $explore-user-font-size);
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "md")) {
    .usercard {
        height: vw-to-px(map-get($container-widths, "md"), $explore-user-container-height);

        .usercard__username, .usercard__btn {
            font-size: vw-to-px(map-get($container-widths, "md"), $explore-user-font-size);
        }
    }
}
</style>
