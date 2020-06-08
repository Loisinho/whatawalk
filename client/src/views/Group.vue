<template lang="pug">
    div
        div.content
            div.group
                div.group__info
                    div.group__header
                        h1.group__title {{ group.title }}
                        div.group__options(v-if="group.admin" @click="openOptions = !openOptions")
                            font-awesome-icon(:icon="faEllipsisV")
                            div.options__box(v-if="openOptions")
                                p(@click="editGroup") Edit group
                                p(@click="makeDecision('delete')") Delete group
                                p(@click="makeDecision('leave')") Leave group
                    div.group__main
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
                Chat(v-bind:group="group._id" v-bind:chat="group.chat")
                Modal(@confirm-edit="confirmEdit" @cancel-edit="cancelEdit" @confirm-decision="confirmDecision" @cancel-decision="cancelDecision")
</template>

<script>
import axios from "../config";
import store from "../store";
import Modal from "../components/Modal.vue";
import Chat from "../components/Chat.vue";
import { mapState } from "vuex";
import { faEllipsisV, faCrown } from "@fortawesome/free-solid-svg-icons";

export default {
    name: "Group",
    components: {
        Modal,
        Chat
    },
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
            auxGroup: {},
            webUrl: process.env.VUE_APP_URL + "media/images/",
            openOptions: false,
            showMembers: false,
            confirmDecision: function() {},
            status: ""
        }
    },
    methods: {
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
        },
        editGroup() {
            this.status = true;
            this.auxGroup = {
                title: this.group.title,
                description: this.group.description,
                travel: this.group.travel
            };
            this.$store.commit("modal/activateModal", {active: true});
        },
        // TODO:
        async confirmEdit() {
            console.log("confirmEdit");
            this.$store.commit("modal/activateModal", {active: false});
            this.status = false;
        },
        cancelEdit() {
            this.$store.commit("modal/activateModal", {active: false});
            this.status = false;
            this.group.title = this.auxGroup.title;
            this.group.description = this.auxGroup.description;
            this.group.travel = this.auxGroup.travel;
            document.querySelector(".group__img > img").src = process.env.VUE_APP_URL + `media/images/group/${this.group.img}`;
        },
        makeDecision(decision) {
            switch(decision) {
                case "delete":
                    this.confirmDecision = this.deleteGroup;
                    this.$store.commit("modal/activateModal", {active: true, msg: "Are you sure you want to delete this group?"});
                    break;
                case "leave":
                    this.confirmDecision = this.leaveGroup;
                    this.$store.commit("modal/activateModal", {active: true, msg: "Are you sure you want to leave this group?"});
                    break;
            }
        },
        // TODO: 
        async deleteGroup() {
            console.log("deleteGroup");
            this.$store.commit("modal/activateModal", {active: false});
        },
        // TODO: 
        async leaveGroup() {
            console.log("leaveGroup");
            this.$store.commit("modal/activateModal", {active: false});
        },
        cancelDecision() {
            this.$store.commit("modal/activateModal", {active: false});
        }
    },
    beforeDestroy: function() {
        this.$store.commit("modal/activateModal", {active: false});
    },
    beforeRouteEnter: async function(to, from, next) {
        try {
            let res = await axios.get(`groups/${to.params.id}/find`);
            next(vm => {
                vm.group = res.data;
                document.querySelector(".group__img > img").src = process.env.VUE_APP_URL + `media/images/group/${res.data.img}`;
            });
        } catch (error) {
            if (error.response.status === 401) {
                store.commit("session/disconnect");
                next({name: "login"});
            } else {
                next({name: "home"});
            }
            this.$store.commit("alert/activateAlert", {
                msg: error.response.data,
                type: "error"
            });
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

.content {
    margin-bottom: 45px;

    .group {
        margin-bottom: 45px;
        z-index: 0;
        background: red;

        .group__info {
            .group__header {
                @include container-flex();
                
                .group__title {
                    width: calc(100% - 40px);
                    line-height: 40px;
                    font-size: 22px;
                    word-wrap: break-word;
                }

                .group__options {
                    @include container-flex("b");
                    position: relative;
                    width: 40px;
                    height: 40px;
                    font-size: 22px;
                    cursor: pointer;

                    .options__box {
                        position: absolute;
                        top: 0;
                        right: 100%;
                        z-index: 1;
                        background: $nav-links-bg;

                        > p {
                            line-height: 40px;
                            font-size: 16px;
                            padding: 0 10px;
                            color: $nav-links-color;
                            white-space: nowrap;

                            &:first-child::after {
                                content: "";
                                position: absolute;
                                top: 0;
                                left: 100%;
                                width: 10px;
                                height: calc(100% / 3);
                                border: {
                                    top: 20px solid transparent;
                                    right: 0;
                                    bottom: 20px solid transparent;
                                    left: 10px solid $nav-links-bg;
                                }
                            }

                            &:hover {
                                background: $nav-links-hover-bg;
                            }
                        }
                    }

                    &:hover > svg {
                        transform: scale(1.08);
                    }
                }
            }

            .group__main {
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
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    .content .group {
        .group__info .group__main .group__members .group__member {
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

@media only screen and (min-width: map-get($breakpoints, "ld")) {
    .content .group {
        @include container-flex();

        .group__info {
            width: 100%;
            height: 400vh;
        }

        .chat {
            position: sticky;
            top: 100px;
            left: 0;
            width: 100%;
            max-height: calc(100vh - 200px);
            margin-left: 5px;
        }
    }
}
</style>
