<template lang="pug">
    button#selector(type="button" @click="open" :class="{'selector__btn--active': optionsOpen}") {{ title }}
        div.selector__options(:class="{'selector__options--active': optionsOpen}")
            p(v-bind:key="groups._id" v-for="group in groups" v-bind:group="group" @click="selectGroup(group._id)") {{ group.title }}
</template>

<script>
export default {
    name: "Selector",
    props: {
        title: {
            type: String,
            default: "Title"
        }
    },
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
                    let res = await this.$http.get(`groups/groupadmin?guest=${this.$route.params.id}`);
                    this.groups = res.data;
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
            this.optionsOpen = !this.optionsOpen;
        },
        async selectGroup(group) {
            this.$emit('select-group', group);
        },
        outside(e) {
            if (e.target.contains(document.getElementById("selector"))) this.optionsOpen = false;
        }
    },
    beforeDestroy: function() {
        window.removeEventListener("click", this.outside);
    },
    created: function() {
        window.addEventListener("click", this.outside);
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

#selector {
    @include button-alpha($invite-color, 0.5);
    position: relative;
    font-size: $profile-size;

    .selector__options {
        position: absolute;
        top: 100%;
        left: -4px;
        width: 100%;
        display: none;
        box-sizing: content-box;
        border: 4px solid $invite-color;
        background: darken($invite-color, 15%);
        z-index: 1;

        &.selector__options--active {
            display: block;
            max-height: 120px;
            white-space: nowrap;
            overflow: auto;

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

    &.selector__btn--active {
        background: $invite-color;
        color: $form-submit-border;
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    #selector {
        font-size: vw-to-px(map-get($container-widths, "sd"), $profile-size);
    }
}

@media only screen and (min-width: map-get($breakpoints, "md")) {
    #selector {
        font-size: vw-to-px(map-get($container-widths, "md"), $profile-size);
    }
}

@media only screen and (min-width: map-get($breakpoints, "ld")) {
    #selector {
        width: calc(50% - 5px);
        margin-bottom: 0;
    }
}
</style>
