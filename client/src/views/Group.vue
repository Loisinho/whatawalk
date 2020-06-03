<template lang="pug">
    div
        div.content
            div.group
                div.group__main
                    h1.group__title {{ group.title }}
                    div.group__options(v-if="group.admin")
                        font-awesome-icon(:icon="faEllipsisV")
                div.group__info
                    div.group__img
                        div.image__box
                        img(src="" alt="Group image")
                    div.group__description
                        p {{ group.description }}
                    div.group__travel
                        p {{ group.travel }}
                    div.group__membership
                        div.chain
                            div.chain__link(v-bind:key="member.username" v-for="member in group.members.slice(0, 5)" v-bind:member="member")
                                div.image__box
                                img(:src="webUrl + 'profile/' + member.img" alt="Member image")
                            div.chain__overly(v-if="group.members.length > 5") ...
                        button.chain__btn(@click="showMembers = !showMembers") {{ showMembers? "Hide " : "Show " }} members
                    div.group__members(v-if="showMembers")
                        div.group__member(v-bind:key="member.username" v-for="(member, i) in group.members" v-bind:member="member" @click="$router.push({name: 'profile', params: {id: member.username}})")
                            div.member__img
                                div.image__box
                                img(:src="webUrl + 'profile/' + member.img" alt="User image")
                            span.member__username @{{ member.username }}
                            div.member__functions(v-if="group.admin && member.username !== username")
                                button.member__admin(type="button" @click.stop="admin(i)") {{ member.admin? "Dismiss as admin" : "Make group admin" }}
                                button.member__remove(type="button" @click.stop="remove(i)") Remove member
                            span.member__functions(v-else-if="member.admin") Admin
                                font-awesome-icon(:icon="faCrown")
</template>

<script>
import { mapState } from "vuex";
import { faEllipsisV, faCrown } from "@fortawesome/free-solid-svg-icons";

export default {
    name: "Group",
    computed: {
        ...mapState({
            username: state => state.session.username
        })
    },
    data: () => {
        return {
            faEllipsisV,
            faCrown,
            group: {
                title: null,
                img: null,
                description: null,
                travel: null,
                admins: [],
                members: [],
                chat: []
            },
            webUrl: process.env.VUE_APP_URL + "media/images/",
            showMembers: false,
            status: null
        }
    },
    methods: {
        async find() {
            try {
                let res = await this.$http.get(`groups/${this.$route.params.id}/find`);
                document.querySelector(".group__img > img").src = process.env.VUE_APP_URL + `media/images/group/${res.data.img}`;
                this.group = res.data;
            } catch (error) {
                this.$router.push({name: error.response.status === 401? "login": "home"});
                this.$store.commit("alert/activateAlert", {
                    msg: error.response.data,
                    type: "error"
                });
            }
        },
        async admin(i) {
            try {
                await this.$http.patch(`groups/${this.$route.params.id}/admin`, {member: this.group.members[i]._id});
                this.group.members[i].admin = !this.group.members[i].admin;
            } catch (error) {
                if (error.response.status === 401) this.$router.push({name: "login"});
                this.$store.commit("alert/activateAlert", {
                    msg: error.response.data,
                    type: "error"
                });
            }
        },
        async remove(i) {
            try {
                await this.$http.patch(`groups/${this.$route.params.id}/remove`, {member: this.group.members[i]._id});
                this.group.members.splice(i, 1);
            } catch (error) {
                if (error.response.status === 401) this.$router.push({name: "login"});
                this.$store.commit("alert/activateAlert", {
                    msg: error.response.data,
                    type: "error"
                });
            }
        }
    },
    created: function() {
        this.find();
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

.group {
    background: red;

    .group__main {
        line-height: 40px;
        overflow: hidden;

        .group__title {
            width: calc(100% - 40px);
            float: left;
            font-size: $group-title;
            word-wrap: break-word;
        }

        .group__options {
            @include container-flex("b");
            width: 40px;
            height: 40px;
            float: left;
            font-size: 23px;
            cursor: pointer;

            &:hover > svg {
                transform: scale(1.08);
            }
        }
    }

    .group__info {
        .group__img {
            @include image-box;
            position: relative;
            width: 100%;

            .image__box {
                padding-bottom: 40%;
            }
        }

        .group__membership {
            @include image-chain();
            padding: 10px;
            overflow: hidden;

            .chain .chain__link {
                border-color: red;
            }
        }
    
        .group__members {
            .group__member {
                @include container-flex("v");
                padding: 5px 10px;
                cursor: pointer;

                .member__img {
                    @include image-box;
                    position: relative;
                    width: $chain-size;
                    border-radius: 50%;
                    overflow: hidden;

                    .image__box {
                        padding-bottom: 100%;
                    }
                }

                .member__username {
                    margin-left: 20px;
                    font-size: $usercard-font-size;
                    font-weight: 600;
                }

                .member__functions {
                    @include container-flex();
                    flex-wrap: wrap;
                    margin-left: auto;
                    font-size: $group-small-size;

                    .member__admin {
                        @include button-alpha(#fcca11, $hover: false);
                    }

                    .member__remove {
                        @include button-alpha(#ff0000, $hover: false);
                    }

                    .member__admin, .member__remove {
                        width: auto;
                        margin-left: auto;
                        border-width: 3px;
                        font-size: $group-small-size;

                        &:hover {
                            transform: scale(0.92);
                        }
                    }

                    > svg {
                        margin-left: 5px;
                        color: #fcca11;
                    }
                }

                &:nth-child(odd) {
                    background: darken(red, 25%);
                }

                &:nth-child(even) {
                    background: darken(red, 18%);
                }

                &:hover {
                    transform: scale(1.01);
                    box-shadow: 0 2px 8px #000000;
                }
            }
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    .group {
        .group__main .group__title {
            font-size: vw-to-px(map-get($container-widths, "sd"), $group-title);
        }

        .group__info .group__members .group__member {
            .member__img {
                width: vw-to-px(map-get($container-widths, "sd"), $chain-size);
            }

            .member__username {
                font-size: vw-to-px(map-get($container-widths, "sd"), $groupcard-title-size);
            }

            .member__functions {
                font-size: vw-to-px(map-get($container-widths, "sd"), $group-small-size);

                .member__admin, .member__remove {
                    font-size: vw-to-px(map-get($container-widths, "sd"), $group-small-size);
                }
            }
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "md")) {
    .group .group__main .group__title {
        font-size: vw-to-px(map-get($container-widths, "md"), $group-title);
    }
}

@media only screen and (min-width: map-get($breakpoints, "ld")) {
    // .group .group__main .group__title {
    //     font-size: vw-to-px(map-get($container-widths, "ld"), $group-title);
    // }
}

@media only screen and (min-width: map-get($breakpoints, "xd")) {
    // .group .group__main .group__title {
    //     font-size: vw-to-px(map-get($container-widths, "xd"), $group-title);
    // }
}
</style>
