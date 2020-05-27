<template lang="pug">
    div.expositor
        UserCard(v-if="pick === 'users'" v-bind:key="item.username" v-for="item in items" v-bind:user="item" @update-break="updateBreak")
        GroupCard(v-if="pick === 'groups'" v-bind:key="item._id" v-for="item in items" v-bind:group="item")
        New(v-if="pick === 'groups'" @new-group="newGroup")
        p.expositor__empty(v-if="items.length === 0") NOTHING!!
        p.expositor__empty(v-if="items.length === 0") This page is completely empty...
        button.expositor__btn(v-if="status" type="button" @click="search") Load
</template>

<script>
import UserCard from "../components/UserCard.vue";
import GroupCard from "../components/GroupCard.vue";
import New from "../components/New.vue";

export default {
    name: "Explore",
    components: {
        UserCard,
        GroupCard,
        New
    },
    props: {
        pick: {
            type: String,
            default: "users"
        },
        op: {
            type: String,
            default: "default"
        }
    },
    watch: {
      	pick: function() {
            this.break = 0;
            this.items = [];
            this.search();
        }
    },
    data: () => {
        return {
            status: false,
            id: null,
            break: 0,
            items: []
        }
    },
    methods: {
        async search() {
            try {
                document.removeEventListener("scroll", this.dueScroll);
                this.status = false;
                let res = await this.$http.get(`${this.pick}/search?op=${this.op}&id=${this.id}&break=${this.break}`);
                if (res.data.length > 0) {
                    this.items = this.items.concat(res.data);
                    this.break += res.data.length;
                    document.addEventListener("scroll", this.dueScroll);
                    this.status = true;
                }
            } catch (error) {
                if (error.response.status === 401) this.$router.push({name: "login"});
                this.$store.state.alert.msg = error.response.data;
                this.$store.state.alert.type = "error";
                this.$store.commit("alert/alertActive");
            }
        },
        dueScroll() {
            if (window.scrollY + window.innerHeight === document.body.scrollHeight) this.search();
        },
        updateBreak(follow) {
            if (this.op !== "default") follow? this.break++: this.break--;
        },
        newGroup(group) {
            this.items.push(group);
        }
    },
    beforeDestroy: function() {
        document.removeEventListener("scroll", this.dueScroll);
    },
    created: function() {
        document.addEventListener("scroll", this.dueScroll);
        this.id = this.$route.params.id;
        this.search();
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

.expositor {
    .expositor__empty {
        text-align: center;
    }

    .expositor__btn {
        @include button-alpha();
        width: 20%;
        margin: 0 40%;
    }
}
</style>
