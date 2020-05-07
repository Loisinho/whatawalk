<template lang="pug">
    div
        div.content
            div.profile
                div.profile__main
                    img.profile__img(src="https://www.icsi.org/wp-content/plugins/awsm-team-pro/images/default-user.png" alt="Profile image")
                    div.profile__links
                        div.profile__following
                            span {{ following }}
                            router-link(to="/following") Following
                        div.profile__followers
                            span {{ followers }}
                            router-link(to="/followers") Followers
                        button.profile__edit {{ btnValue }}
                div.profile__data
                    h1.profile__username @{{ username }}
                    div.profile__group
                        font-awesome-icon.profile__icon(:icon="faUser")
                        h3.profile__field {{ name }}
                    div.profile__group
                        font-awesome-icon.profile__icon(:icon="faMapMarkerAlt")
                        h3.profile__field {{ ubication }}
                    div.profile__group
                        font-awesome-icon.profile__icon(:icon="faBirthdayCake")
                        h3.profile__field {{ birthday }}
                    p.profile__description.profile__field {{ description }}
</template>

<script>
import { faUser, faMapMarkerAlt, faBirthdayCake } from "@fortawesome/free-solid-svg-icons";

export default {
    name: "Profile",
    data: () => {
        return {
            faUser,
            faMapMarkerAlt,
            faBirthdayCake,
            following: "10K",
            followers: "999M",
            username: "lorem",
            name: "Lorem Ipsum",
            ubication: "Loremhood, New Lorem, Loremland",
            birthday: "19/10/1998",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            btnValue: "edit",
            // status: false
        }
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
            display: flex;
            align-items: center;
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
                        text-decoration: none;
                        -webkit-tap-highlight-color: transparent;
                        color: #ffffff;

                        &:hover {
                            color: #acacac;
                        }
                    }
                }

                .profile__edit {
                    width: 100%;
                    text-transform: uppercase;
                    padding: 5px;
                    font-size: $profile-link-size;
                    font-weight: 600;
                    background: transparent;
                    color: #ffffff;
                    border: 4px solid #ffffff;
                    cursor: pointer;
                    outline: none;
                    transition: all 0.4s;

                    &:hover {
                        background: #ffffff;
                        color: $form-submit-border;
                    }
                }
            }

        }

        .profile__data {
            .profile__group {
                display: flex;
                align-items: center;

                .profile__icon {
                    width: $profile-icon-size;
                    margin: 0 3px;
                }
            }

            .profile__description {
                padding: 10px 5px;
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
        .profile__data .profile__group .profile__icon {
            width: vw-to-px(map-get($container-widths, "sd"), $profile-icon-size);
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
        .profile__data .profile__group .profile__icon {
            width: vw-to-px(map-get($container-widths, "md"), $profile-icon-size);
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "ld")) {
    .content .profile {
        .profile__main .profile__links {
            .profile__following, .profile__followers, .profile__edit {
                font-size: vw-to-px(map-get($container-widths, "ld"), $profile-link-size);
            }
        }
        .profile__data .profile__group .profile__icon {
            width: vw-to-px(map-get($container-widths, "ld"), $profile-icon-size);
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "xd")) {
    .content .profile {
        .profile__main .profile__links {
            .profile__following, .profile__followers, .profile__edit {
                font-size: vw-to-px(map-get($container-widths, "xd"), $profile-link-size);
            }
        }
        .profile__data .profile__group .profile__icon {
            width: vw-to-px(map-get($container-widths, "xd"), $profile-icon-size);
        }
    }
}
</style>
