<template lang="pug">
    div
        div.content
            div.explore
                UserCard(v-bind:key="item.id" v-for="item in items" v-bind:user="item")
</template>

<script>
import UserCard from "../components/UserCard.vue";

export default {
    name: "Explore",
    components: {
        UserCard
    },
    data: () => {
        return {
            keyword: null,
            items: []
        }
    },
    created: function() {
        this.items = this.$route.params.items;
    }
}
</script>

<style lang="scss" scoped></style>
