<template lang="pug">
    div.groupcard(@click="$router.push({name: 'group', params: {id: group._id}})" :class="{'groupcard--notification': groups.includes(group._id)}")
        div.groupcard__img
            div.image__box
            img(:src="webUrl + 'group/' + group.img" alt="Group image")
        div.groupcard__info
            div.groupcard__title
                span {{ group.title }}
                font-awesome-icon(v-if="group.private" :icon="faLock")
            p.groupcard__description {{ group.description }}
            div.groupcard__membership
                div.chain
                    div.chain__link(v-bind:key="member.user.username" v-for="member in group.members" v-bind:member="member")
                        div.image__box
                        img(:src="webUrl + 'profile/' + member.user.img" alt="Member image")
                    div.chain__overly(v-if="group.members.length > 5") ...
                button.chain__btn(v-if="group.join" @click.stop="join") join
</template>

<script>
import { mapState } from "vuex";
import { faLock } from "@fortawesome/free-solid-svg-icons";

export default {
    name: "GroupCard",
    props: ["group"],
    computed: {
        ...mapState({
            username: state => state.session.username,
            groups: state => state.session.groups
        })
    },
    data: () => {
        return {
            faLock,
            webUrl: process.env.VUE_APP_URL + "media/images/"
        }
    },
    methods: {
        async join() {
            try {
                await this.$http.get(`groups/join?group=${this.group._id}`);
                this.$store.commit("session/newGroup", this.group._id);
                this.group.join = false;
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

.groupcard {
    @include container-flex($direction: column);
    margin-bottom: 20px;
    background: $profile-bg;
    cursor: pointer;

    .groupcard__img {
        @include image-box;
        position: relative;
        width: 100%;

        .image__box {
            padding-bottom: 40%;
        }
    }

    .groupcard__info {
        padding: 10px;

        .groupcard__title {
            font-size: $groupcard-title-size;
            font-weight: bold;
            margin-bottom: 5px;
            word-wrap: break-word;

            > span {
                padding-right: 5px;
            }
        }

        .groupcard__description {
            font-size: $group-small-size;
            margin-bottom: 5px;
            word-wrap: break-word;
        }

        .groupcard__membership {
            @include image-chain();
        }
    }

    &.groupcard--notification {
        .groupcard__info .groupcard__title {
            animation: notify 1s ease-out alternate infinite;
        }
    }

    &:hover {
        transform: scale(0.96);
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    .groupcard .groupcard__info {
        .groupcard__title {
            font-size: vw-to-px(map-get($container-widths, "sd"), $groupcard-title-size);
        }

        .groupcard__description {
            font-size: vw-to-px(map-get($container-widths, "sd"), $group-small-size);
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "md")) {
    .groupcard .groupcard__info {
        .groupcard__title {
            font-size: vw-to-px(map-get($container-widths, "md"), $groupcard-title-size);
        }

        .groupcard__description {
            font-size: vw-to-px(map-get($container-widths, "md"), $group-small-size);
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "ld")) {
    .groupcard {
        width: calc(50% - 10px);
        float: left;

        &:nth-child(odd) {
            margin-right: 10px;
        }

        &:nth-child(even) {
            margin-left: 10px;
        }

        .groupcard__info {
            .groupcard__title {
                font-size: vw-to-px(map-get($container-widths, "ld"), $groupcard-title-size);
            }

            .groupcard__description {
                font-size: vw-to-px(map-get($container-widths, "ld"), $group-small-size);
            }
        }
    }
}

@keyframes notify {
    0% {
        color: $body-color;
    }
    100% {
        color: $alert-success-bg;
    }
}
</style>
