<template lang="pug">
    div
        UserCard(v-if="pick === 'users'" v-bind:key="item.username" v-for="item in items" v-bind:user="item" @update-break="updateBreak")
        button.expositor__btn(v-if="status" type="button" @click="search") Load
</template>

<script>
import UserCard from "../components/UserCard.vue";

export default {
    name: "Explore",
    components: {
        UserCard,
        GroupCard
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
    data: () => {
        return {
            status: true,
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
                let res = await this.$http.get(`users/search/${this.pick}?op=${this.op}&id=${this.id}&break=${this.break}`);
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

.expositor__btn {
    @include button-alpha();
    width: 20%;
    margin: 0 40%;
}
</style>
