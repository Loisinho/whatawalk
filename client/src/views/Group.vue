<template lang="pug">
    div
        div.content
            div.group
                div.group__info
                    div.group__header
                        input.group__title(v-if="status" type="text" v-model.trim="group.title" maxlength="40" placeholder="Title")
                        h1.group__title(v-else) {{ group.title }}
                        div.group__options(@click="openOptions = !openOptions")
                            font-awesome-icon(:icon="faEllipsisV")
                            div.options__box(v-if="openOptions")
                                p(v-if="group.admin" @click="editGroup") Edit group
                                p(v-if="group.admin" @click="makeDecision('delete')") Delete group
                                p(@click="makeDecision('leave')") Leave group
                    div.group__main
                        div.main__img
                            div.image__box
                            img(src="" alt="Group image")
                            ImageUpload(v-if="status")
                        div.group__travel(:class="{'group__travel--edit': status}")
                            font-awesome-icon(:icon="faRoute")
                            p(v-if="group.travel" @click="$router.push({name: 'travels', params: {location: group.travel.location, list: group.travel.itinerary}})") Trip to {{ group.travel.location }}
                            p(v-else @click="$router.push({name: 'travels'})") Plan a trip
                            font-awesome-icon.travel__remove(v-if="status && group.travel" :icon="faTrashAlt" @click="group.travel = null")
                        div.group__membership
                            div.group__private(@click="group.private = status? !group.private : group.private" :class="{'group__private--edit': status}")
                                font-awesome-icon(v-if="group.private" :icon="faLock")
                                font-awesome-icon(v-else :icon="faUnlock")
                                p {{ group.private? "Private" : "Public" }}
                            button.members__btn(@click="showMembers = !showMembers") {{ showMembers? "Hide " : "Show " }} members
                        div.group__members(v-if="showMembers")
                            div.group__member(v-bind:key="member.user.username" v-for="(member, i) in group.members" v-bind:member="member" @click="$router.push({name: 'profile', params: {id: member.user.username}})")
                                div.member__img
                                    div.image__box
                                    img(:src="webUrl + 'profile/' + member.user.img" alt="User image")
                                span.member__username @{{ member.user.username }}
                                div.member__functions(v-if="group.admin && member.user.username !== username")
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
import ImageUpload from "../components/ImageUpload.vue";
import { mapState } from "vuex";
import { faEllipsisV, faCrown, faRoute, faTrashAlt, faLock, faUnlock, faArrowAltCircleUp } from "@fortawesome/free-solid-svg-icons";

export default {
    name: "Group",
    components: {
        Modal,
        Chat,
        ImageUpload
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
            faRoute,
            faTrashAlt,
            faLock,
            faUnlock,
            faArrowAltCircleUp,
            group: {
                title: null,
                img: null,
                travel: null,
                private: null,
                admins: [],
                members: [],
                chat: []
            },
            auxGroup: {},
            webUrl: process.env.VUE_APP_URL + "media/images/",
            openOptions: false,
            showMembers: false,
            confirmDecision: function() {},
            status: false
        }
    },
    sockets: {
        kickOut() {
            window.removeEventListener("beforeunload", this.accessed);
            this.$store.commit("session/removeGroup", this.$route.params.id);
            this.$store.commit("alert/activateAlert", {
                msg: "You have been kicked out of the group.",
                type: "warning"
            });
            this.$router.push({name: "home"});
        },
        groupDeleted() {
            window.removeEventListener("beforeunload", this.accessed);
            this.$store.commit("session/removeGroup", this.$route.params.id);
            this.$store.commit("alert/activateAlert", {
                msg: "This group has been deleted.",
                type: "warning"
            });
            this.$router.push({name: "home"});
        }
    },
    methods: {
        async admin(i) {
            try {
                await this.$http.patch(`groups/${this.$route.params.id}/admin`, {member: this.group.members[i].user._id});
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
                await this.$http.patch(`groups/${this.$route.params.id}/remove`, {member: this.group.members[i].user._id});
                this.$socket.client.emit("leaveGroup", {group: this.$route.params.id, user: this.group.members[i].user.username});
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
            if (!this.status) {
                this.status = true;
                this.auxGroup = {
                    title: this.group.title,
                    img: this.group.img,
                    travel: this.group.travel,
                    private: this.group.private
                };
                this.$store.commit("modal/activateModal", {active: true});
            }
        },
        async confirmEdit() {
            try {
                let data = new FormData();
                data.append("title", this.group.title);
                data.append("travel", this.group.travel);
                data.append("private", this.group.private);
                data.append("img", document.getElementById("image__file").files[0]);
                let res = await this.$http.post(`groups/${this.$route.params.id}/edit`, data);
                document.querySelector(".main__img > img").src = process.env.VUE_APP_URL + `media/images/group/${res.data.img}`;
                this.$store.commit("modal/activateModal", {active: false});
                this.status = false;
            } catch (error) {
                if (error.response.status === 401) {
                    this.$store.commit("session/disconnect");
                    this.$router.push({name: "login"})
                };
                this.$store.commit("alert/activateAlert", {
                    msg: error.response.data,
                    type: "error"
                });
            }
        },
        cancelEdit() {
            this.$store.commit("modal/activateModal", {active: false});
            this.status = false;
            this.group.title = this.auxGroup.title;
            this.group.travel = this.auxGroup.travel;
            this.group.private = this.auxGroup.private;
            document.querySelector(".main__img > img").src = process.env.VUE_APP_URL + `media/images/group/${this.group.img}`;
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
        async deleteGroup() {
            try {
                let res = await this.$http.delete(`groups/${this.$route.params.id}/delete`);
                this.$socket.client.emit("leaveGroup", {group: this.$route.params.id, all: res.data});
                this.$store.commit("alert/activateAlert", {
                    msg: "Group deleted successfully.",
                    type: "success"
                });
                this.$router.push({name: "groups"});
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
        async leaveGroup() {
            try {
                this.$store.commit("modal/activateModal", {active: false});
                await this.$http.patch(`groups/${this.$route.params.id}/remove`);
                this.$socket.client.emit("leaveGroup", {group: this.$route.params.id});
                this.$store.commit("alert/activateAlert", {
                    msg: "You left the group.",
                    type: "success"
                });
                this.$router.push({name: "home"});
            } catch (error) {
                if (error.response.status === 401) this.$router.push({name: "login"});
                this.$store.commit("alert/activateAlert", {
                    msg: error.response.data,
                    type: "error"
                });
            }
        },
        cancelDecision() {
            this.$store.commit("modal/activateModal", {active: false});
        },
        async accessed() {
            if(!this.$store.state.alert.active && this.$store.state.session.isLoggedIn) {
                try {
                    await this.$http.get(`groups/${this.group._id}/accessed`);
                } catch (error) {
                    if (error.response.status === 401) this.$router.push({name: "login"});
                }
            }
        }
    },
    async beforeDestroy() {
        window.removeEventListener("beforeunload", this.accessed);
        this.$store.commit("modal/activateModal", {active: false});
        this.accessed();
    },
    beforeRouteEnter: async function(to, from, next) {
        try {
            let res = await axios.get(`groups/${to.params.id}/find`);
            res.data.members.sort(function(a, b) { 
                return a.user.username.localeCompare(b.user.username);
            });
            next(vm => {
                vm.group = res.data;
                document.querySelector(".main__img > img").src = process.env.VUE_APP_URL + `media/images/group/${res.data.img}`;
                window.addEventListener("beforeunload", vm.accessed);
                vm.$store.commit("session/removeGroup", to.params.id);
            });
        } catch (error) {
            if (error.response.status === 401) {
                store.commit("session/disconnect");
                next({name: "login"});
            } else {
                next({name: "home"});
            }
            store.commit("alert/activateAlert", {
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
        background: $profile-bg;

        .group__info {
            .group__header {
                @include container-flex();

                input.group__title {
                    @include field-edit();
                    height: 30px;
                    margin: 5px 0;
                    font-size: 18px;
                }
                
                .group__title {
                    width: calc(100% - 40px);
                    line-height: 40px;
                    padding-left: 5px;
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
                .main__img {
                    @include image-box;
                    position: relative;
                    width: 100%;

                    .image__box {
                        padding-bottom: 40%;
                    }
                }

                .group__travel {
                    @include container-flex();
                    margin: 5px 5px 0;
                    padding: 5px 5px 5px;
                    color: $alert-warning-bg;

                    > p {
                        padding-left: 5px;
                        cursor: pointer;

                        &:hover {
                            font-weight: bold;
                        }
                    }

                    .travel__remove {
                        margin-left: auto;
                        color: $alert-error-bg;
                        cursor: pointer;

                        &:hover {
                            transform: scale(0.92);
                        }
                    }

                    &.group__travel--edit {
                        @include field-edit();
                    }
                }

                .group__membership {
                    @include container-flex("v");
                    padding: 5px;

                    .group__private {
                        padding: 5px;

                        * {
                            float: left;
                        }

                        > p {
                            padding-left: 5px;
                        }

                        &.group__private--edit {
                            @include field-edit();
                            cursor: pointer;
                        }
                    }

                    .members__btn {
                        @include button-alpha($hover: false);
                        width: auto;
                        margin-left: auto;
                        border-width: 3px;

                        &:hover {
                            transform: scale(0.92);
                        }
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
                            background: darken($profile-bg, 25%);
                        }

                        &:nth-child(even) {
                            background: darken($profile-bg, 18%);
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
            padding: 0 5px;
        }

        .chat {
            position: sticky;
            top: 100px;
            left: 0;
            width: 100%;
            max-height: calc(100vh - 200px);
        }
    }
}
</style>
