<template lang="pug">
    div.modal(:class="{'modal--active': active}")
        div.modal__edit(v-if="msg === null")
            button.modal__btn.modal__confirm(type="button" aria-label="Confirm" @click="confirmEdit") confirm
            button.modal__btn.modal__cancel(type="reset" aria-label="Cancel" @click="cancelEdit") cancel
        div.modal__decision(v-else)
            p.modal__msg {{ msg }}
            button.modal__btn.modal__confirm(type="button" aria-label="Confirm" @click="confirmDecision") confirm
            button.modal__btn.modal__cancel(type="reset" aria-label="Cancel" @click="cancelDecision") cancel
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "Modal",
    computed: {
        ...mapState({
            msg: state => state.modal.msg,
            active: state => state.modal.active
        })
    },
    methods: {
        confirmEdit() {
            this.$emit('confirm-edit');
        },
        cancelEdit() {
            this.$emit('cancel-edit');
        },
        confirmDecision() {
            this.$emit('confirm-decision');
        },
        cancelDecision() {
            this.$emit('cancel-decision');
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

.modal {
    background: $nav-links-bg;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    max-height: 0;
    text-align: center;
    transition: max-height 0.4s;

    .modal__confirm {
        @include button-alpha($alert-success-bg);
    }

    .modal__cancel {
        @include button-alpha($alert-error-bg);
    }

    .modal__btn {
        width: 50%;
        padding: 15px;
        border: 0px;

        &:hover {
            color: $nav-links-bg;
        }
    }

    .modal__msg {
        padding: 10px;
    }

    &.modal--active {
        max-height: 100vh;
    }
}
</style>
