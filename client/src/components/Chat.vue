<template lang="pug">
    div.chat
        div.chat__board
            div.chat__msg(v-bind:key="chat._id"  v-for="msg in chat" :class="{'chat__msg--right': msg.user === username}")
                p.msg__user(v-if="msg.user !== username") {{ msg.user }}
                p.msg__text {{ msg.text }}
        form.chat__send(@submit.prevent="send" style="position: absolute; bottom: 0;")
            input.chat__text(type="text" v-model="text" maxlength="254" placeholder="...")
            input(type="submit" value="" style="display: none;")
            button.chat__btn(type="button" @click="send")
                font-awesome-icon(:icon="faPen")
</template>

<script>
import { mapState } from "vuex";
import { faPen } from "@fortawesome/free-solid-svg-icons";

export default {
    name: "Group",
    computed: {
        ...mapState({
            username: state => state.session.username
        })
    },
    props: {
        group: {
            type: String
        },
        chat: {
            type: Array,
            default: []
        }
    },
    data: () => {
        return {
            faPen,
            text: ""
        }
    },
    sockets: {
        newMsg(data) {
            this.chat.push({user: data.user, text: data.text});
            let board = document.querySelector(".chat__board");
            setTimeout(() => { board.scrollTop = board.scrollHeight; }, 50);
        }
    },
    methods: {
        async send() {
            try {
                if (this.text !== "") {
                    await this.$http.patch(`groups/${this.group}/msg`, {text: this.text});
                    this.$socket.client.emit("groupMsg", {user: this.username, group: this.group, text: this.text});
                    this.chat.push({user: this.username, text: this.text});
                    let board = document.querySelector(".chat__board");
                    setTimeout(() => { board.scrollTop = board.scrollHeight; }, 50);
                    this.text = "";
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
        }
    },
    mounted: function() {
        let board = document.querySelector(".chat__board");
        setTimeout(() => { board.scrollTop = board.scrollHeight; }, 200);
    },
    beforeDestroy: function() {
        this.$socket.client.emit("leaveGroup", this.group);
    },
    created: function() {
        this.$socket.client.emit("joinGroup", this.$route.params.id);
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

.chat {
    position: relative;
    width: 100%;
    min-height: 200px;
    height: calc(100vh - 200px);
    background: yellowgreen;

    .chat__board {
        @include container-flex($direction: column);
        width: 100%;
        height: calc(100% - 40px);
        overflow-y: auto;
        background: blueviolet;

        .chat__msg {
            background: black;
            max-width: 75%;
            margin: 5px auto 5px 5px;
            padding: 5px;
            border-radius: 5px;
            font-size: 16px;

            .msg__user {
                font-size: 14px;
                color: red;
            }

            &.chat__msg--right {
                margin: 5px 5px 5px auto;
            }
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
