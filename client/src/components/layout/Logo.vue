<template lang="pug">
    div#logo
        router-link(to="/")
            img(src="../../assets/logo.svg" alt="WhatAWalk")
</template>

<script>
export default {
    name: "Logo"
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/styles";

#logo {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;

    img {
        height: 28px;
    }
}

@media only screen and (min-width: map-get($breakpoints, "ld")) {
    #logo {
        left: 16px;
        transform: translateX(0);
        z-index: 0;
    }
}
</style>
