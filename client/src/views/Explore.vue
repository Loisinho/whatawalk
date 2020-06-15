<template lang="pug">
    div.expositor
        UserCard(v-if="pick === 'users'" v-bind:key="item.username" v-for="item in items" v-bind:user="item" @update-break="updateBreak")
        GroupCard(v-if="pick === 'groups'" v-bind:key="item._id" v-for="item in items" v-bind:group="item")
        NoticeCard(v-if="pick === 'notices'" v-bind:key="item._id" v-for="item in items" v-bind:notice="item" @delete-notice="deleteNotice")
        NewGroup(v-if="pick === 'groups'" @new-group="newGroup")
        PublicationCard(v-if="pick === 'publications'" v-bind:key="item._id" v-for="item in items" v-bind:publication="item")
        p.expositor__empty(v-if="items.length === 0") NOTHING!!
        p.expositor__empty(v-if="items.length === 0" style="margin-bottom: 10px;") This page is completely empty...
        LoadMore(v-if="status" @search-more="search")
</template>

<script>
import UserCard from "../components/UserCard.vue";
import GroupCard from "../components/GroupCard.vue";
import NoticeCard from "../components/NoticeCard.vue";
import NewGroup from "../components/NewGroup.vue";
import PublicationCard from "../components/PublicationCard.vue";
import LoadMore from "../components/LoadMore.vue";


export default {
    name: "Explore",
    components: {
        UserCard,
        GroupCard,
        NoticeCard,
        NewGroup,
        PublicationCard,
        LoadMore
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
                this.status = false;
                let res = await this.$http.get(`${this.pick}/search?op=${this.op}&id=${this.id}&break=${this.break}`);
                if (res.data.length > 0) {
                    this.items = this.items.concat(res.data);
                    this.break += res.data.length;
                    document.addEventListener("scroll", this.dueScroll);
                    this.status = true;
                } else {
                    this.$store.commit("session/newNotice", false);
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
        updateBreak(follow) {
            if (this.op !== "default") follow? this.break++: this.break--;
        },
        newGroup(group) {
            this.items.unshift(group);
            this.break++;
            this.$store.commit("session/newGroup", group._id);
        },
        deleteNotice(id) {
            this.items.map(i => i._id === id? this.items.splice(this.items.indexOf(i), 1) : i);
            this.break--;
        }
    },
    created: function() {
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
}
</style>
