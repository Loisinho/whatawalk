<template lang="pug">
    div.profile
        div.profile__main
            div.main__img
                div.image__box
                img(src="" alt="Profile image")
                ImageUpload(v-if="status === true")
            div.profile__measure
                h1.profile__username @{{ profile.username }}
                div.profile__links
                    div.profile__following
                        span.profile__amount {{ profile.following.amount }}
                        router-link(to="following") Following
                    div.profile__followers
                        span.profile__amount {{ profile.followers.amount }}
                        router-link(to="followers") Followers
                div.profile__actions(v-if="status === null")
                    button.profile__follow(type="button" @click="followAction") {{ profile.followers.status? "unfollow": "follow" }}
                    Selector(@select-group="invite" v-bind:title="'Invite to'")
                button.profile__edit(v-else-if="status === false" type="button" @click="edit") Edit
        div.profile__data
            div.profile__group(:class="{'profile__group--edit': status === true}")
                font-awesome-icon.profile__icon(v-if="profile.name || status === true" :icon="faUser")
                input.profile__field(v-if="status === true" type="text" v-model.trim="profile.name" maxlength="40" placeholder="What is your name?")
                h3.profile__field(v-else) {{ profile.name }}
            div.profile__group(:class="{'profile__group--edit': status === true}")
                font-awesome-icon.profile__icon(v-if="profile.ubication || status === true" :icon="faMapMarkerAlt")
                input.profile__field(v-if="status === true" type="text" v-model.trim="profile.ubication" maxlength="40" placeholder="Where are you from?")
                h3.profile__field(v-else) {{ profile.ubication }}
            textarea.profile__description(v-if="status === true" v-model="profile.description" rows="6" maxlength="254" placeholder="Tell us about yourself..") {{ profile.description }}
            p.profile__description(v-if="status === false") {{ profile.description }}
            button.profile__delete(v-if="status === true" type="button" @click="deleteAccount") Delete Account
        PublicationCard(v-bind:key="publication._id" v-for="publication in profile.publications" v-bind:publication="publication" v-bind:status="status" @delete-publication="deletePublication")
        LoadMore(v-if="more" @search-more="searchPublications")
        NewPublication(@new-publication="newPublication")
        Modal(@confirm-edit="confirmEdit" @cancel-edit="cancelEdit" @confirm-decision="confirmDecision" @cancel-decision="cancelDecision")
</template>

<script>
import axios from "../config";
import store from "../store";
import { mapState } from "vuex";
import { faUser, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Selector from "../components/Selector.vue";
import Modal from "../components/Modal.vue";
import ImageUpload from "../components/ImageUpload.vue";
import PublicationCard from "../components/PublicationCard.vue";
import NewPublication from "../components/NewPublication.vue";
import LoadMore from "../components/LoadMore.vue";

export default {
    name: "Profile",
    components: {
        Selector,
        Modal,
        ImageUpload,
        PublicationCard,
        NewPublication,
        LoadMore
    },
    computed: {
        ...mapState({
            username: state => state.session.username
        })
    },
    data: () => {
        return {
            faUser,
            faMapMarkerAlt,
            profile: {
                username: null,
                name: "",
                ubication: "",
                description: "",
                following: {
                    amount: 0,
                    status: false
                },
                followers: {
                    amount: 0,
                    status: false
                },
                publications: []
            },
            auxProfile: {},
            break: 0,
            more: false,
            status: ""
        }
    },
    methods: {
        async followAction() {
            try {
                await this.$http.get(`users/follow?user=${this.profile.username}&follow=${!this.profile.followers.status? "1": "0"}`);
                this.profile.followers.status = !this.profile.followers.status;
                this.profile.followers.status? this.profile.followers.amount++: this.profile.followers.amount--;
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
        async invite(group) {
            try {
                let res = await this.$http.post("groups/invite", {guest: this.$route.params.id, group: group});
                this.$socket.client.emit("notify", this.$route.params.id);
                this.$store.commit("alert/activateAlert", {
                    msg: res.data,
                    type: "success"
                });
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
        edit() {
            this.status = true;
            this.auxProfile = {
                name: this.profile.name,
                ubication: this.profile.ubication,
                description: this.profile.description
            };
            this.$store.commit("modal/activateModal", {active: true});
        },
        async confirmEdit() {
            try {
                let data = new FormData();
                data.append("name", this.profile.name);
                data.append("ubication", this.profile.ubication);
                data.append("description", this.profile.description);
                data.append("img", document.getElementById("image__file").files[0]);
                let res = await this.$http.post(`users/${this.username}/profile/edit`, data);
                document.querySelector(".main__img > img").src = process.env.VUE_APP_URL + `media/images/profile/${res.data.img}`;
                this.$store.state.session.img = res.data.img;
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
            this.profile.name = this.auxProfile.name;
            this.profile.ubication = this.auxProfile.ubication;
            this.profile.description = this.auxProfile.description;
            document.querySelector(".main__img > img").src = process.env.VUE_APP_URL + `media/images/profile/${this.profile.img}`;
        },
        deleteAccount() {
            this.$store.commit("modal/activateModal", {active: true, msg: "Are you sure you want to delete your account?"});
        },
        async confirmDecision() {
            try {
                await this.$http.get("users/deleteaccount");
                this.$socket.client.close();
                this.$store.commit("session/disconnect");
                this.$router.push({name: "home"});
            } catch (error) {
                this.$store.commit("alert/activateAlert", {
                    msg: error.response.data,
                    type: "error"
                });
            }
        },
        cancelDecision() {
            this.$store.commit("modal/activateModal", {active: true});
        },
        async searchPublications() {
            try {
                this.more = false;
                let res = await this.$http.get(`publications/search?op=own&break=${this.break}`);
                if (res.data.length > 0) {
                    this.profile.publications = this.profile.publications.concat(res.data);
                    this.break += res.data.length;
                    document.addEventListener("scroll", this.dueScroll);
                    this.more = true;
                }
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
        newPublication(publication) {
            this.profile.publications.unshift(publication);
            this.break++;
        },
        deletePublication(id) {
            this.profile.publications.map(i => {
                i._id === id? this.profile.publications.splice(this.profile.publications.indexOf(i), 1) : i;
            });
            this.break--;
        }
    },
    beforeDestroy: function() {
        this.$store.commit("modal/activateModal", {active: false});
    },
    beforeRouteUpdate: async function(to, from, next) {
        try {
            let res = await this.$http.get(`users/${to.params.id}/profile`);
            this.profile = res.data;
            this.break = res.data.publications.length;
            if (this.break) this.more = true;
            document.querySelector(".main__img > img").src = process.env.VUE_APP_URL + `media/images/profile/${res.data.img}`;
            this.status = this.username === this.profile.username? false: null;
        } catch (error) {
            if (error.response.status === 401) {
                this.$store.commit("session/disconnect");
                this.$router.push({name: "login"});
            } else {
                this.$router.push({name: "home"});
            }
            this.$store.commit("alert/activateAlert", {
                msg: error.response.data,
                type: "error"
            });
        }
    },
    beforeRouteEnter: async function(to, from, next) {
        try {
            let res = await axios.get(`users/${to.params.id}/profile`);
            next(vm => {
                vm.profile = res.data;
                vm.break = res.data.publications.length;
                if (vm.break) vm.more = true;
                document.querySelector(".main__img > img").src = process.env.VUE_APP_URL + `media/images/profile/${res.data.img}`;
                vm.status = vm.username === vm.profile.username? false: null;
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

.profile {
    background: $profile-bg;
    padding: 10px;
    border-top-left-radius: $profile-border-top-left-radius;

    .profile__main {
        @include container-flex();
        margin-bottom: 10px;

        .main__img {
            @include image-box;
            position: relative;
            width: 40%;
            height: 40%;
            border-radius: 50%;
            overflow: hidden;

            .image__box {
                padding-bottom: 100%;
            }
        }

        .profile__measure {
            @include container-flex($direction: column);
            justify-content: center;
            width: 60%;
            padding: 0 6%;

            .profile__username {
                font-size: $profile-size;
                padding-bottom: 10px;
            }

            .profile__links {
                .profile__following, .profile__followers {
                    display: flex;
                    margin-bottom: 10px;
                    font-size: $profile-size;
                    text-transform: uppercase;

                    .profile__amount {
                        display: block;
                        width: 30%;
                        text-align: center;
                        border: 2px solid #ffffff;
                    }

                    > a {
                        @include link-border-animation;
                        padding-top: 2px;

                        &:after {
                            margin: 0;
                        }
                    }
                }
            }

            .profile__edit, .profile__follow {
                @include button-alpha($alpha: 0.5);
                font-size: $profile-size;
            }

            .profile__actions {
                .profile__follow {
                    margin-bottom: 10px;
                }
            }
        }
    }

    .profile__data {
        .profile__description {
            font-size: $profile-data-size;
            padding: 5px;
            border-radius: 5px;
        }

        h3, p {
            word-wrap: break-word;
        }

        textarea {
            width: 100%;
            margin-bottom: 4px;
            border: 0;
            font-family: $body-font-family;
            background: $profile-edit-bg;
            color: $profile-edit-color;
        }
            
        .profile__group {
            @include container-flex(v);
            padding: 2px 5px;

            .profile__icon {
                width: $profile-data-size;
                margin-right: 2px;
            }

            .profile__field {
                font-size: $profile-data-size;
            }

            > input {
                width: 100%;
                background: transparent;
            }

            &.profile__group--edit {
                @include field-edit();
                margin-bottom: 5px;
                padding: 5px;
            }
        }

        .profile__delete {
            @include button-alpha($profile-delete, 0.5);
            font-size: $profile-size;
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    .profile {
        border-top-left-radius: vw-to-px(map-get($container-widths, "sd"), $profile-border-top-left-radius);

        .profile__main .profile__measure {
            .profile__username, .profile__edit, .profile__follow {
                font-size: vw-to-px(map-get($container-widths, "sd"), $profile-size);
            }

            .profile__links {
                .profile__following, .profile__followers {
                    font-size: vw-to-px(map-get($container-widths, "sd"), $profile-size);
                }
            }
        }

        .profile__data {
            .profile__description {
                font-size: vw-to-px(map-get($container-widths, "sd"), $profile-data-size);
            }

            .profile__group {
                .profile__icon {
                    width: vw-to-px(map-get($container-widths, "sd"), $profile-data-size);
                }

                .profile__field {
                    font-size: vw-to-px(map-get($container-widths, "sd"), $profile-data-size);
                }
            }

            .profile__delete {
                font-size: vw-to-px(map-get($container-widths, "sd"), $profile-size);
            }
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "md")) {
    .profile {
        border-top-left-radius: vw-to-px(map-get($container-widths, "md"), $profile-border-top-left-radius);

        .profile__main .profile__measure {
            .profile__username, .profile__edit, .profile__follow {
                font-size: vw-to-px(map-get($container-widths, "md"), $profile-size);
            }
            
            .profile__links {
                .profile__following, .profile__followers {
                    font-size: vw-to-px(map-get($container-widths, "md"), $profile-size);
                }
            }
        }

        .profile__data {
            .profile__description {
                font-size: vw-to-px(map-get($container-widths, "md"), $profile-data-size);
            }

            .profile__group {
                .profile__icon {
                    width: vw-to-px(map-get($container-widths, "md"), $profile-data-size);
                }

                .profile__field {
                    font-size: vw-to-px(map-get($container-widths, "md"), $profile-data-size);
                }
            }
            
            .profile__delete {
                font-size: vw-to-px(map-get($container-widths, "md"), $profile-size);
            }
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "ld")) {
    .profile {
        border-top-left-radius: vw-to-px(map-get($container-widths, "ld"), $profile-border-top-left-radius);

        .profile__main .profile__measure .profile__actions {
            .profile__follow {
                width: calc(50% - 5px);
                margin-bottom: 0;
            }

            .profile__follow {
                margin-right: 10px;
            }
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "xd")) {
    .profile {
        border-top-left-radius: vw-to-px(map-get($container-widths, "xd"), $profile-border-top-left-radius);
    }
}
</style>
