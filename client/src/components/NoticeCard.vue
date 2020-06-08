<template lang="pug">
    div.noticecard(v-if="notice.newest" style="cursor: pointer;" @click="$router.push({name: 'followers', params: {id: $route.params.id}})")
        div.noticecard__msg
            span.noticecard__sender {{ notice.newest }}
            |  {{ notice.newest === 1? "user has ": "users have " }} started to follow you!
    div.noticecard(v-else)
        div.noticecard__msg
            span.noticecard__sender(@click="$router.push({name: 'profile', params: {id: notice.sender.username}})") @{{ notice.sender.username }}
            |  invites you to join
            span.noticecard__group(@click="confirm")  {{ notice.group.title }}
        button.noticecard__cancel(type="button" @click="cancel")
            font-awesome-icon(:icon="faTimes")
</template>

<script>
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default {
    name: "NoticeCard",
    props: ["notice"],
    data: () => {
        return {
            faTimes
        }
    },
    methods: {
        async confirm() {
            try {
                await this.$http.get(`groups/join?group=${this.notice.group._id}`);
                this.$router.push({name: "group", params: {id: this.notice.group._id}});
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
        },
        async cancel() {
            try {
                await this.$http.delete(`notices/cancel`, {data: {notice: this.notice._id}});
                this.$emit('delete-notice', this.notice._id)
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

.noticecard {
    @include container-flex("v");
    padding: 10px;
    margin-bottom: 10px;
    background: $profile-bg;
    border-top-left-radius: 8vw;
    border-bottom-left-radius: 8vw;

    .noticecard__msg {
        font-size: $usercard-font-size;

        .noticecard__sender, .noticecard__group {
            font-weight: 600;
            cursor: pointer;
        }

        .noticecard__group {
            color: #02df93;
        }
    }

    .noticecard__cancel {
        @include button-alpha(#ff0000);
        width: auto;
        margin-left: auto;
        padding: 5px 10px;

        > svg {
            font-size: $usercard-font-size;
        }
    }

    &:hover {
        transform: scale(0.99);
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    .noticecard {
        .noticecard__msg, .noticecard__cancel > svg {
            font-size: vw-to-px(map-get($container-widths, "sd"), $usercard-font-size);
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "md")) {
    .noticecard {
        .noticecard__msg, .noticecard__cancel > svg {
            font-size: vw-to-px(map-get($container-widths, "md"), $usercard-font-size);
        }
    }
}
</style>
