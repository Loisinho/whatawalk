<template lang="pug">
    div.test
        h1 Test
        p Press the button to test a server route.
        button.btn(title="Test" @click="test()") TEST
        div {{ data }}
</template>

<script>
export default {
    name: "Test",
    data() {
        return {
            data: ""
        }
    },
    methods: {
        test() {
            this.$http
                .get("users/test")
                .then(res =>
                    this.data = res.data
                )
                .catch(err => {
                    if (err.response.status == 401) {
                        this.$store.state.session.isLoggedIn = false;
                        this.$router.push({name: "login"})
                    }
                });
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
