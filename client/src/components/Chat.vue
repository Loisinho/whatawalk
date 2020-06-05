<template lang="pug">
    div.chat
        div.chat__board
            p.chat__msg(v-bind:key="chat._id"  v-for="msg in chat")
                strong {{ msg.user }}:
                |  {{ msg.text }}
        form.chat__send(@submit.prevent="send" style="position: absolute; bottom: 0;")
            input.chat__text(type="text" v-model="text" placeholder="...")
            input(type="submit" value="" style="display: none;")
            button.chat__btn(type="button" @click="send")
                font-awesome-icon(:icon="faPen")
</template>

<script>
import { mapState } from "vuex";
import { faPen } from "@fortawesome/free-solid-svg-icons";

export default {
    name: "Group",
    props: ["chat"],
    computed: {
        ...mapState({
            username: state => state.session.username
        })
    },
    data: () => {
        return {
            faPen,
            text: ""
        }
    },
    methods: {
        send() {
            if (this.text !== "") {
                console.log(this.username + " says " + this.text);
                this.chat.push({user: this.username, text: this.text});
                this.text = "";
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

.chat {
    width: 100%;
    background: yellowgreen;

    .chat__board {
        width: 100%;
        height: calc(100% - 40px);
        padding: 5px;
        background: blueviolet;

        .chat__msg {
            font-size: 16px;
        }
    }

    .chat__send {
        width: 100%;
        height: 40px;

        > * {
            float: left;
            height: 100%;
            font-size: 18px;
            color: $nav-links-bg;
        }

        .chat__text {
            width: calc(100% - 40px);
            padding-left: 5px;
        }

        .chat__btn {
            width: 40px;
        }
    }
}
</style>
