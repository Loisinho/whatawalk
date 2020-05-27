<template lang="pug">
    div.profile
        div.profile__main
            div.profile__img
                div.image__box
                img(src="" alt="Profile image")
                label.profile__upload(v-if="status === 'save'" for="profile__file")
                    input#profile__file(type="file" @change="previewImage")
                    font-awesome-icon(:icon="faArrowAltCircleUp")
            div.profile__action
                h1.profile__username @{{ profile.username }}
                div.profile__links
                    div.profile__following
                        span.profile__amount {{ profile.following.amount }}
                        router-link(to="following") Following
                    div.profile__followers
                        span.profile__amount {{ profile.followers.amount }}
                        router-link(to="followers") Followers
                button.profile__edit(v-if="status === 'edit'" type="button" @click="status = 'save'") {{ status }}
                button.profile__edit(v-else-if="status === 'save'" type="button" @click="save") {{ status }}
                button.profile__edit(v-else type="button" @click="followAction") {{ profile.followers.status? "unfollow": "follow" }}
        div.profile__data
            div.profile__group(:class="{'profile__group--edit': status === 'save'}")
                font-awesome-icon.profile__icon(v-if="profile.name || status === 'save'" :icon="faUser")
                h3.profile__field(v-if="status !== 'save'") {{ profile.name }}
                input.profile__field(v-else type="text" v-model.trim="profile.name" maxlength="40" placeholder="What is your name?")
            div.profile__group(:class="{'profile__group--edit': status === 'save'}")
                font-awesome-icon.profile__icon(v-if="profile.ubication || status === 'save'" :icon="faMapMarkerAlt")
                h3.profile__field(v-if="status !== 'save'") {{ profile.ubication }}
                input.profile__field(v-else type="text" v-model.trim="profile.ubication" maxlength="40" placeholder="Where are you from?")
            p.profile__description(v-if="status !== 'save'") {{ profile.description }}
            textarea.profile__description(v-else v-model="profile.description" rows="6" maxlength="254" placeholder="Tell us about yourself..") {{ profile.description }}
            button.profile__delete(v-if="status === 'save'" type="button") Delete
</template>

<script>
import { mapState } from "vuex";
import { faUser, faMapMarkerAlt, faArrowAltCircleUp } from "@fortawesome/free-solid-svg-icons";

export default {
    name: "Profile",
    computed: {
        ...mapState({
            username: state => state.session.username
        })
    },
    data: () => {
        return {
            faUser,
            faMapMarkerAlt,
            faArrowAltCircleUp,
            profile: {
                username: null,
                name: null,
                ubication: null,
                description: null,
                following: {
                    amount: null,
                    status: false
                },
                followers: {
                    amount: null,
                    status: false
                }
            },
            status: null
        }
    },
    methods: {
        async find() {
            try {
                let res = await this.$http.get(`users/${this.$route.params.id}/profile`);
                document.querySelector(".profile__img > img").src = process.env.VUE_APP_URL + `media/images/profile/${res.data.img}`;
                this.profile = res.data;
                this.status = this.username === this.profile.username? "edit": null;
            } catch (error) {
                this.$store.state.alert.msg = error.response.data;
                this.$store.state.alert.type = "error";
                this.$store.commit("alert/alertActive");
                this.$router.push({name: "home"});
            }
        },
        previewImage() {
            let input = document.getElementById("profile__file");
            if (input.files[0]) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    document.querySelector(".profile__img > img").src = e.target.result;
                }
                reader.readAsDataURL(input.files[0]);
            }
        },
        async save() {
            try {
                let data = new FormData();
                data.append("name", this.profile.name);
                data.append("ubication", this.profile.ubication);
                data.append("description", this.profile.description);
                data.append("img", document.getElementById("profile__file").files[0]);
                let res = await this.$http.post(`users/${this.$route.params.id}/profile/edit`, data);
                document.querySelector(".profile__img > img").src = process.env.VUE_APP_URL + `media/images/profile/${res.data.img}`;
                this.$store.state.session.img = res.data.img;
            } catch (error) {
                if (error.response.status === 401) this.$router.push({name: "login"});
                this.$store.state.alert.msg = error.response.data;
                this.$store.state.alert.type = "error";
                this.$store.commit("alert/alertActive");
            }
            this.status = "edit";
        },
        async followAction() {
            try {
                await this.$http.get(`users/${this.username}/follow?user=${this.profile.username}&follow=${!this.profile.followers? "1": "0"}`);
                this.profile.followers.status = !this.profile.followers.status;
                this.profile.followers.status? this.profile.followers.amount++: this.profile.followers.amount--;
            } catch (error) {
                if (error.response.status === 401) this.$router.push({name: "login"});
                this.$store.state.alert.msg = error.response.data;
                this.$store.state.alert.type = "error";
                this.$store.commit("alert/alertActive");
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

.content {
    .profile {
        background: $profile-bg;
        padding: 10px;
        border-top-left-radius: $profile-border-top-left-radius;

        .profile__main {
            @include container-flex();
            margin-bottom: 10px;

            .profile__img {
                @include image-box;
                position: relative;
                width: 40%;
                border-radius: 50%;
                overflow: hidden;

                .image__box {
                    padding-bottom: 100%;
                }

                .profile__upload {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);

                    > input[type="file"] {
                        width: 0;
                        height: 0;
                        display: block;
                        overflow: hidden;

                        + svg {
                            font-size: $profile-upload-size;
                            display: block;
                            color: $profile-upload-color;
                            cursor: pointer;
                            transition: all 0.4s;

                            &:hover {
                                color: darken($profile-upload-color, 20%);
                            }
                        }
                    }
                }
            }

            .profile__action {
                @include container-flex($direction: column);
                justify-content: space-between;
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

                .profile__edit {
                    @include button-alpha($alpha: 0.5);
                    font-size: $profile-size;
                }
            }

        }

        .profile__data {
            .profile__description {
                font-size: $profile-data-size;
                padding: 5px;
            }

            h3, p {
                word-break: break-all;
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
                    color: $profile-edit-color;
                }

                &.profile__group--edit {
                    background: $profile-edit-bg;
                    margin-bottom: 4px;

                    .profile__icon {
                        color: $profile-edit-color;
                    }
                }
            }

            .profile__delete {
                @include button-alpha($profile-delete, 0.5);
                font-size: $profile-size;
            }
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    .content .profile {
        border-top-left-radius: vw-to-px(map-get($container-widths, "sd"), $profile-border-top-left-radius);

        .profile__main {
            .profile__img .profile__upload > input[type="file"] + svg {
                font-size: vw-to-px(map-get($container-widths, "sd"), $profile-upload-size);
            }

            .profile__action {
                .profile__username, .profile__edit {
                    font-size: vw-to-px(map-get($container-widths, "sd"), $profile-size);
                }

                .profile__links {
                    .profile__following, .profile__followers {
                        font-size: vw-to-px(map-get($container-widths, "sd"), $profile-size);
                    }
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
    .content .profile {
        border-top-left-radius: vw-to-px(map-get($container-widths, "md"), $profile-border-top-left-radius);

        .profile__main {
            .profile__img .profile__upload > input[type="file"] + svg {
                font-size: vw-to-px(map-get($container-widths, "md"), $profile-upload-size);
            }

            .profile__action {
                .profile__username, .profile__edit {
                    font-size: vw-to-px(map-get($container-widths, "md"), $profile-size);
                }

                .profile__links {
                    .profile__following, .profile__followers {
                        font-size: vw-to-px(map-get($container-widths, "md"), $profile-size);
                    }
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
    .content .profile {
        border-top-left-radius: vw-to-px(map-get($container-widths, "ld"), $profile-border-top-left-radius);
    }
}

@media only screen and (min-width: map-get($breakpoints, "xd")) {
    .content .profile {
        border-top-left-radius: vw-to-px(map-get($container-widths, "xd"), $profile-border-top-left-radius);
    }
}
</style>
