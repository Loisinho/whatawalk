<template lang="pug">
    div#new
        form.new__container(@submit.prevent="add" :class="{'new__container--open': open}")
            div.new__icon(aria-label="Create new group" @click="add")
                font-awesome-icon(v-if="title === ''" :icon="faPlus" :class="{'new__icon--close': open}")
                font-awesome-icon(v-else :icon="faSave")
            div.new__form
                input(type="text" aria-label="Title" v-model.trim="title" placeholder="Group title" maxlength="40")
                label.new__checkbox(for="private")
                    input#private(type="checkbox" aria-label="Private?" aria-checked="false" @click="private = !private")
                    span
                    | Private
            input(type="submit" value="" style="display: none;" :disabled="title === ''")
</template>

<script>
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";

export default {
    name: "NewGroup",
    data: () => {
        return {
            faPlus,
            faSave,
            open: false,
            title: "",
            private: false,
            status: true
        }
    },
    methods: {
        async add() {
            if (this.status) {
                this.open = !this.open;
                if (this.title !== "") {
                    try {
                        this.status = false;
                        let res = await this.$http.post("groups/create", {title: this.title, private: this.private});
                        this.$emit('new-group', res.data);
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
                        this.title = "";
                        document.getElementById("private").checked = false;
                        this.private = false;
                        this.status = true;
                    }
                }
            }
        },
        outside(e) {
            if (e.target.contains(document.getElementById("new"))) {
                this.open = false;
                this.title = "";
            }
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
            float: right;
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
                    transform: rotateZ(45deg);
                }
            }
        }

        .new__form {
            position: absolute;
            right: 40px;
            bottom: 0;
            width: calc(100vw - 80px);
            height: 40px;
            padding: 2px 0;

            > * {
                float: left;
                height: 100%;
                font-size: 18px;
                color: $nav-links-bg;
            }

            > input[type="text"] {
                width: 60%;
                border-bottom: 1px solid $nav-links-bg;
            }

            .new__checkbox {
                @include custom-checkbox($form-success-color, "b");
            }
        }

        &.new__container--open {
            width: calc(100vw - 20px);

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
