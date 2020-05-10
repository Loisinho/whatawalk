<template lang="pug">
    div
        div.content
            div.profile
                div.profile__main
                    img.profile__img.profile__field(:src="'https://www.whatawalk.ooguy.com/media/images/profile/' + profile.img" alt="Profile image")
                    div.profile__links
                        div.profile__following
                            span {{ profile.following }}
                            router-link(to="/following") Following
                        div.profile__followers
                            span {{ profile.followers }}
                            router-link(to="/followers") Followers
                        button.profile__edit(v-if="status === 'edit'" @click="edit") {{ status }}
                        button.profile__edit(v-else-if="status === 'save'" @click="save") {{ status }}
                div.profile__data
                    h1.profile__username @{{ profile.username }}
                    div.profile__group(:class="{'profile__group--edit': status !== 'edit'}")
                        font-awesome-icon.profile__icon(v-if="profile.name || status === 'save'" :icon="faUser")
                        h3.profile__field(v-if="status !== 'save'") {{ profile.name }}
                        input.profile__field(v-else type="text" v-model.trim="profile.name" maxlength="40" placeholder="What is your name?")
                    div.profile__group(:class="{'profile__group--edit': status !== 'edit'}")
                        font-awesome-icon.profile__icon(v-if="profile.ubication || status === 'save'" :icon="faMapMarkerAlt")
                        h3.profile__field(v-if="status !== 'save'") {{ profile.ubication }}
                        input.profile__field(v-else type="text" v-model.trim="profile.ubication" maxlength="40" placeholder="Where are you from?")
                    p.profile__description.profile__field(v-if="status !== 'save'") {{ profile.description }}
                    textarea.profile__description.profile__field(v-else v-model="profile.description" rows="5" maxlength="254" placeholder="Tell us about yourself..") {{ profile.description }}
                    button.profile__delete(v-if="status === 'save'") Delete
</template>

<script>
import { mapState } from "vuex";
import { faUser, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

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
            profile: {
                username: null,
                name: null,
                img: null,
                ubication: null,
                description: null,
                following: 0,
                followers: 0,
            },
            status: "edit"
        }
    },
    methods: {
        async find() {
            try {
                let res = await this.$http.get(`users/profile/${this.$route.params.id}`);
                this.profile = res.data;
            } catch (error) {
                this.$store.state.alert.msg = error.response.data;
                this.$store.state.alert.type = "error";
                this.$store.commit("alert/alertActive");
            }
        },
        edit() {
            this.status = "save";
        },
        save() {
            this.status = "edit";
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

        .profile__main {
            @include container-flex(v);
            margin-bottom: 20px;

            .profile__img {
                position: relative;
                top: 0;
                left: 0;
                width: 40%;
                border-radius: 50%;
            }

            .profile__links {
                width: 60%;
                padding: 0 6%;

                .profile__following, .profile__followers {
                    display: flex;
                    margin-bottom: 10px;
                    font-size: $profile-link-size;
                    text-transform: uppercase;

                    > span {
                        display: block;
                        width: 30%;
                        text-align: center;
                    }

                    > a {
                        @include link-border-animation;
                    }
                }

                .profile__edit {
                    @include button-alpha($alpha: 0.5);
                    font-size: $profile-link-size;
                }
            }

        }

        .profile__data {
            .profile__username, .profile__description {
                padding: 10px 5px;
            }

            textarea {
                width: 100%;
                font-family: $body-font-family;
                font-size: $profile-textarea-size;
                background: $profile-edit-bg;
                border: 0;
                border-bottom: 4px solid $profile-edit-color;
                color: $profile-edit-color;
            }
            
            .profile__group {
                @include container-flex(v);

                .profile__icon {
                    width: $profile-icon-size;
                    margin: 0 3px;
                }

                > input {
                    width: 100%;
                    font-size: $profile-link-size;
                    background: transparent;
                    border: 0;
                    color: $profile-edit-color;
                }

                &.profile__group--edit {
                    background: $profile-edit-bg;
                    border-bottom: 4px solid $profile-edit-color;

                    .profile__icon {
                        color: $profile-edit-color;
                    }
                }
            }

            .profile__delete {
                @include button-alpha($profile-delete, 0.5);
                font-size: $profile-link-size;
            }
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    .content .profile {
        .profile__main .profile__links {
            .profile__following, .profile__followers, .profile__edit {
                font-size: vw-to-px(map-get($container-widths, "sd"), $profile-link-size);
            }
        }

        .profile__data {
            textarea {
                font-size: vw-to-px(map-get($container-widths, "sd"), $profile-textarea-size);
            }

            .profile__group {
                .profile__icon {
                    width: vw-to-px(map-get($container-widths, "sd"), $profile-icon-size);
                }

                > input {
                    font-size: vw-to-px(map-get($container-widths, "sd"), $profile-link-size);
                }
            }

            .profile__delete {
                font-size: vw-to-px(map-get($container-widths, "sd"), $profile-link-size);
            }
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "md")) {
    .content .profile {
        .profile__main .profile__links {
            .profile__following, .profile__followers, .profile__edit {
                font-size: vw-to-px(map-get($container-widths, "md"), $profile-link-size);
            }
        }

        .profile__data {
            textarea {
                font-size: vw-to-px(map-get($container-widths, "md"), $profile-textarea-size);
            }

            .profile__group {
                .profile__icon {
                    width: vw-to-px(map-get($container-widths, "md"), $profile-icon-size);
                }

                > input {
                    font-size: vw-to-px(map-get($container-widths, "md"), $profile-link-size);
                }
            }
            
            .profile__delete {
                font-size: vw-to-px(map-get($container-widths, "md"), $profile-link-size);
            }
        }
    }
}
</style>
