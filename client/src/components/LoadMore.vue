<template lang="pug">
    button#load__btn(type="button" @click="search") Load
</template>

<script>
export default {
    name: "New",
    methods: {
        dueScroll() {
            if (window.scrollY + window.innerHeight === document.body.scrollHeight) this.search();
        },
        search() {
            document.removeEventListener("scroll", this.dueScroll);
            this.$emit("search-more");
        }
    },
    beforeDestroy: function() {
        document.removeEventListener("scroll", this.dueScroll);
    },
    created: function() {
        document.addEventListener("scroll", this.dueScroll);
    }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

#load__btn {
    @include button-alpha();
    width: auto;
    margin-left: 50%;
    transform: translate(-50%);
    font-size: $usercard-font-size;
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    #load__btn {
        font-size: vw-to-px(map-get($container-widths, "sd"), $usercard-font-size);
    }
}
</style>
