<template lang="pug">
    button.profile__invite(type="button" @click="open" :class="{'profile__invite--active': optionsOpen}") Invite to
        div.profile__options(:class="{'profile__options--active': optionsOpen}")
            p(v-bind:key="groups._id" v-for="group in groups" v-bind:group="group" @click="invite(group._id)") {{ group.title }}
</template>

<script>
export default {
    name: "Invite",
    data: () => {
        return {
            optionsOpen: false,
            groups: []
        }
    },
    methods: {
        async open() {
            if (!this.optionsOpen) {
                try {
                    let res = await this.$http.get(`groups/invite?guest=${this.$route.params.id}`);
                    this.groups = res.data;
                } catch (error) {
                    if (error.response.status === 401) this.$router.push({name: "login"});
                    this.$store.commit("alert/activateAlert", {
                        msg: error.response.data,
                        type: "error"
                    });
                }
            }
            this.optionsOpen = !this.optionsOpen;
        },
        async invite(group) {
            try {
                let res = await this.$http.post("groups/invite", {guest: this.$route.params.id, group: group});
                this.$socket.client.emit("notify", this.$route.params.id);
                this.$store.commit("alert/activateAlert", {
                    msg: res.data,
                    type: "success"
                });
            } catch (error) {
                if (error.response.status === 401) this.$router.push({name: "login"});
                this.$store.commit("alert/activateAlert", {
                    msg: error.response.data,
                    type: "error"
                });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

.profile__invite {
    @include button-alpha($invite-color, 0.5);
    position: relative;
    font-size: $profile-size;

    .profile__options {
        position: absolute;
        left: -4px;
        width: 100%;
        display: none;
        box-sizing: content-box;
        border: 4px solid $invite-color;
        background: darken($invite-color, 15%);

        &.profile__options--active {
            display: block;

            > p {
                font-size: 20px;
                line-height: 40px;
                padding-left: 5px;
                text-transform: capitalize;
                cursor: pointer;

                &:hover {
                    background: $invite-color;
                }
            }
        }
    }

    &.profile__invite--active {
        background: $invite-color;
        color: $form-submit-border;
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    .profile__invite {
        font-size: vw-to-px(map-get($container-widths, "sd"), $profile-size);
    }
}

@media only screen and (min-width: map-get($breakpoints, "md")) {
    .profile__invite {
        font-size: vw-to-px(map-get($container-widths, "md"), $profile-size);
    }
}

@media only screen and (min-width: map-get($breakpoints, "ld")) {
    .profile__invite {
        width: calc(50% - 5px);
        margin-bottom: 0;
    }
}
</style>
