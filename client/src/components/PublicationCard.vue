<template lang="pug">
    div.publication
        div.publication__img(v-if="publication.img")
            div.image__box
            img(:src="`${webUrl}publication/${publication.img}`" @click="show = true")
        div.publication__info
            div.publication__data
                div.publication__user(@click="showProfile")
                    div.image__box
                    img(:src="`${webUrl}profile/${publication.user.img}`" alt="User image")
                span.publication__username(@click="showProfile") @{{ publication.user.username }}
                div.publication__date {{ formatDate() }}
                    font-awesome-icon.publication__delete(v-if="status === true" :icon="faTrashAlt" @click="deletePublication")
            p.publication__text {{ publication.text }}
        div.publication__modal(v-if="show && publication.img")
            img.modal__img(:src="`${webUrl}publication/${publication.img}`" alt="Publication image")
            font-awesome-icon.modal__exit(:icon="faTimes" @click="show = false")
</template>

<script>
import { mapState } from "vuex";
import { faTimes, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export default {
    name: "PublicationCard",
    props: {
        status: {
            type: Boolean
        },
        publication: {
            type: Object
        }
    },
    computed: {
        ...mapState({
            username: state => state.session.username
        })
    },
    data: () => {
        return {
            faTimes,
            faTrashAlt,
            show: false,
            webUrl: process.env.VUE_APP_URL + "media/images/"
        }
    },
    methods: {
        async deletePublication() {
            try {
                await this.$http.delete(`publications/delete`, {data: {publication: this.publication._id}});
                this.$emit("delete-publication", this.publication._id);
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
        showProfile() {
            if (this.publication.user.username !== this.username)
                this.$router.push({name: "profile", params: {id: this.publication.user.username}})
        },
        formatDate() {
            let date = new Date(this.publication.date);
            return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

.publication {
    @include container-flex($direction: column);
    margin: 10px 0;
    background: $nav-links-color;
    color: $nav-links-bg;

    .publication__img {
        @include image-box;
        position: relative;
        width: 100%;
        cursor: pointer;

        .image__box {
            padding-bottom: 40%;
        }
    }

    .publication__info {
        padding: 10px;

        .publication__data {
            @include container-flex("v");
            margin-bottom: 5px;

            .publication__user {
                @include rounded-img;
                cursor: pointer;
            }

            .publication__username {
                width: 70%;
                margin-left: 5px;
                font-size: $groupcard-title-size;
                font-weight: bold;
                word-wrap: break-word;
                cursor: pointer;
            }

            .publication__date {
                margin-left: auto;
                font-size: $group-small-size;

                .publication__delete {
                    margin-left: 5px;
                    color: $alert-error-bg;
                    cursor: pointer;
                }
            }
        }

        .publication__text {
            font-size: $group-small-size;
            margin-bottom: 5px;
            word-wrap: break-word;
        }
    }

    .publication__modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 60px;
        background: rgba(#000000, 0.8);

        .modal__img {
            position: absolute;
            margin: auto;
            top: 60px;
            right: 0;
            bottom: 0;
            left: 0;
            max-width: calc(100% - 120px);
            max-height: calc(100vh - 160px);
        }

        .modal__exit {
            float: right;
            margin: 7.5px;
            font-size: 25px;
            cursor: pointer;
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    .publication {
        .publication__info {
            .publication__data {
                .publication__username {
                    font-size: vw-to-px(map-get($container-widths, "sd"), $groupcard-title-size);
                }

                .publication__date {
                    font-size: vw-to-px(map-get($container-widths, "sd"), $group-small-size);
                }
            }

            .publication__text {
                font-size: vw-to-px(map-get($container-widths, "sd"), $group-small-size);
            }
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "md")) {
    .publication {
        .publication__info {
            .publication__data {
                .publication__username {
                    font-size: vw-to-px(map-get($container-widths, "md"), $groupcard-title-size);
                }

                .publication__date {
                    font-size: vw-to-px(map-get($container-widths, "md"), $group-small-size);
                }
            }

            .publication__text {
                font-size: vw-to-px(map-get($container-widths, "md"), $group-small-size);
            }
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "ld")) {
    .publication {
        @include container-flex();

        .publication__img {
            width: 39%;
            // margin-left: auto;
            order: 1;

            .image__box {
                min-height: 100%;
            }
        }

        .publication__info {
            width: 60%;
            order: 0;
        }
    }
}
</style>
