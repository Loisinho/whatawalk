<template lang="pug">
    div#new
        form.new__container(@submit.prevent="add" :class="{'new__container--open': open}")
            div.new__icon(aria-label="Create new post" @click="add")
                font-awesome-icon(v-if="text === ''" :icon="faPen" :class="{'new__icon--close': open}")
                font-awesome-icon(v-else :icon="faSave")
            div.new__form
                textarea.new__text(v-model="text" aria-label="Writes" rows="6" maxlength="254" placeholder="Writes..") {{ text }}
                label.image__upload(for="image__file")
                    input#image__file(type="file" aria-label="Upload image" @change="fileName")
                    font-awesome-icon(:icon="faPaperclip")
                    span {{ img }}
            input(type="submit" value="" style="display: none;" :disabled="text === ''")
</template>

<script>
import { faPen, faSave, faPaperclip } from "@fortawesome/free-solid-svg-icons";

export default {
    name: "New",
    data: () => {
        return {
            faPen,
            faSave,
            faPaperclip,
            open: false,
            text: "",
            img: "",
            status: true
        }
    },
    methods: {
        async add() {
            if (this.status) {
                this.open = !this.open;
                if (this.text !== "") {
                    try {
                        this.status = false;
                        let data = new FormData();
                        data.append("text", this.text);
                        data.append("img", document.getElementById("image__file").files[0]);
                        let res = await this.$http.post("publications/create", data);
                        this.$emit('new-publication', res.data);
                    } catch (error) {
                        if (error.response.status === 401) {
                            this.$store.commit("session/disconnect");
                            this.$router.push({name: "login"});
                        }
                        this.$store.commit("alert/activateAlert", {
                            msg: error.response.data,
                            type: "error"
                        });
                    } finally {
                        document.getElementById("image__file").value = "";
                        this.text = "";
                        this.img = "";
                        this.status = true;
                    }
                }
            }
        },
        outside(e) {
            if (e.target.contains(document.getElementById("new"))) {
                this.open = false;
                document.getElementById("image__file").value = "";
                this.text = "";
                this.img = "";
            }
        },
        fileName() {
            let input = document.getElementById("image__file");
            this.img = input.files[0].name;
        }
    },
    beforeDestroy: function() {
        window.removeEventListener("click", this.outside);
    },
    created: function() {
        window.addEventListener("click", this.outside);
    }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

#new {
    position: fixed;
    right: 10px;
    bottom: 10px;

    .new__container {
        position: relative;
        top: 0;
        right: 0;
        width: 40px;
        height: 40px;
        border-radius: 20px;
        box-shadow: -2px 2px 8px #000000;
        overflow: hidden;
        background: #ffffff;
        transition: all $transition-time;

        .new__icon {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 40px;
            height: 40px;
            border-radius: 20px;
            background: #ffffff;
            color: $nav-links-bg;
            line-height: 40px;
            text-align: center;
            font-size: 23px;
            cursor: pointer;

            &:hover {
                box-shadow: inset -2px -2px 4px rgba(#fff, 0.6),
                            inset 2px 2px 4px rgba(#000, 0.6);

                > svg {
                    transform: scale(0.92);
                }
            }

            svg {
                transition: all $transition-time;
                
                &.new__icon--close {
                    transform: rotateZ(-90deg);
                }
            }
        }

        .new__form {
            @include container-flex($direction: column);
            position: absolute;
            right: 40px;
            bottom: 0;
            width: calc(100vw - 80px);
            height: 120px;
            padding: 2px 0;
            color: $nav-links-bg;

            .new__text {
                height: 80px;
                padding: 5px;
                border: 0;
                border-bottom: 1px solid $nav-links-bg;
                font-size: 18px;
            }

            .image__upload {
                @include container-flex("v");
                margin: 5px 0;

                > input[type="file"] {
                    width: 0;
                    height: 0;
                    display: block;
                    overflow: hidden;

                    + svg {
                        font-size: 30px;
                        display: block;
                        color: $profile-upload-color;
                        cursor: pointer;
                        transition: all 0.4s;

                        &:hover {
                            color: darken($profile-upload-color, 20%);
                        }
                    }
                }

                > span {
                    width: calc(100% - 35px);
                    margin-left: 5px;
                    word-wrap: break-word;
                }
            }
        }

        &.new__container--open {
            width: calc(100vw - 20px);
            height: calc(120px);

            .new__icon {
                background: $nav-links-bg;
                color: #ffffff;
            }
        }
    }
}

@media only screen and (min-width: map-get($breakpoints, "ld")) {
    #new .new__container {
        .new__form {
            width: calc(60vw - 100px);
        }

        &.new__container--open {
            width: calc(60vw - 40px);
        }
    }
}
</style>
