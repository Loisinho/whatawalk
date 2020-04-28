<template lang="pug">
    div.test
        h1 Test
        p Press the button to test a server route.
        button.btn(title="Test" @click="test()") TEST
        div {{ data }}
</template>

<script>
import axios from "axios";

export default {
    name: "Test",
    data() {
        return {
            data: ""
        }
    },
    methods: {
        test() {
            axios
                .get("https://www.whatawalk.ooguy.com/users/test")
                .then(res =>
                    this.data = res.data
                )
                .catch(err =>
                    console.log(err)
                );
        }
    }
}
</script>

<style lang="scss" scoped>
.btn {
    display: inline-block;
    border: none;
    background: #555;
    color: #fff;
    padding: 7px 20px;
    cursor: pointer;
}

.btn:hover {
    background: #666;
}
</style>
