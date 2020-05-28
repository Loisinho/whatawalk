<template lang="pug">
    div.groupcard(@click="$router.push({name: 'group', params: {id: group._id}})")
        div.groupcard__img
            div.image__box
            img(:src="webUrl + 'group/' + group.img" alt="Group image")
        div.groupcard__info
            div.groupcard__title
                span {{ group.title }}
                font-awesome-icon(v-if="group.private" :icon="faLock")
            p.groupcard__description {{ group.description }}
            div.groupcard__membership
                div.groupcard__members
                    div.groupcard__member(v-bind:key="member.username" v-for="member in group.members" v-bind:member="member")
                        div.image__box
                        img(:src="webUrl + 'profile/' + member.img" alt="Member image")
                div.groupcard__overly(v-if="group.members.length > 5") ...
                button.groupcard__btn(v-if="group.join" @click.stop="join") join
</template>

<script>
import { mapState } from "vuex";
import { faLock } from "@fortawesome/free-solid-svg-icons";

export default {
    name: "GroupCard",
    props: ["group"],
    computed: {
        ...mapState({
            username: state => state.session.username
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
                this.group.join = false;
            } catch (error) {
                if (error.response.status === 401) this.$router.push({name: "login"});
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
            font-size: $groupcard-small-size;
            margin-bottom: 5px;
            word-wrap: break-word;
        }

        .groupcard__membership {
            .groupcard__members {
                @include container-flex();
                position: relative;
                float: left;
                height: calc(#{$groupcard-member-size} + 2px * 2);

                .groupcard__member {
                    @include image-box;
                    box-sizing: content-box;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: $groupcard-member-size;
                    border: 2px solid $profile-bg;
                    border-radius: 50%;
                    overflow: hidden;

                    .image__box {
                        height: $groupcard-member-size;
                    }

                    @for $i from 2 to 6 {
                        &:nth-child(#{$i}) {
                            left: calc(#{$groupcard-member-size} / 3 * 2 * (#{$i} - 1));
                        }
                    }
                }
            }

            .groupcard__overly {
                float: left;
                margin-left: calc(#{$groupcard-member-size} / 3 * 12 - 2vw);
                height: calc(#{$groupcard-member-size} + 2px * 2);
                display: flex;
                align-items: flex-end;
            }

            .groupcard__btn {
                @include button-alpha();
                float: right;
                width: auto;
                height: calc(#{$groupcard-member-size} + 2px * 2);
                padding: 0 5%;
                font-size: $groupcard-small-size;
                border-width: 3px;
            }
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    $groupcard-member-size: vw-to-px(map-get($container-widths, "sd"), $groupcard-member-size);

    .groupcard .groupcard__info {
        .groupcard__title {
            font-size: vw-to-px(map-get($container-widths, "sd"), $groupcard-title-size);
        }

        .groupcard__description {
            font-size: vw-to-px(map-get($container-widths, "sd"), $groupcard-small-size);
        }

        .groupcard__membership {
            .groupcard__members {
                height: calc(#{$groupcard-member-size} + 2px * 2);

                .groupcard__member {
                    width: $groupcard-member-size;

                    .image__box {
                        height: $groupcard-member-size;
                    }

                    @for $i from 2 to 6 {
                        &:nth-child(#{$i}) {
                            left: calc(#{$groupcard-member-size} / 3 * 2 * (#{$i} - 1));
                        }
                    }
                }
            }

            .groupcard__overly {
                margin-left: calc(#{$groupcard-member-size} / 3 * 12 - #{vw-to-px(map-get($container-widths, "sd"), 2vw)});
                height: calc(#{$groupcard-member-size} + 2px * 2);
            }

            .groupcard__btn {
                height: calc(#{$groupcard-member-size} + 2px * 2);
                font-size: vw-to-px(map-get($container-widths, "sd"), $groupcard-small-size);;
            }
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "md")) {
    .groupcard .groupcard__info {
        .groupcard__title {
            font-size: vw-to-px(map-get($container-widths, "md"), $groupcard-title-size);
        }

        .groupcard__description {
            font-size: vw-to-px(map-get($container-widths, "md"), $groupcard-small-size);
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
                font-size: vw-to-px(map-get($container-widths, "ld"), $groupcard-small-size);
            }
        }
    }
}
</style>
