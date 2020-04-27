<template lang="pug">
    div.alert(:class="{'alert--active': active, 'alert--error': type === 'error', 'alert--warning': type === 'warning', 'alert--success': type === 'success'}")
        p.alert__msg {{ msg }}
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "Alert",
    computed: {
        ...mapState({
            msg: state => state.alert.msg,
            type: state => state.alert.type,
            active: state => state.alert.active,
        })
    }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/styles";

.alert {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    max-height: 0;
    font-size: $alert-size;
    text-align: center;
    transition: max-height 0.4s;

    &.alert--active {
        max-height: 100px;
    }

    &.alert--error {
        background: $alert-error-bg;
    }

    &.alert--warning {
        background: $alert-warning-bg;
    }

    &.alert--success {
        background: $alert-success-bg;
    }

    .alert__msg {
        padding: 10px;
    }
}

@media only screen and (min-width: map-get($breakpoints, "sd")) {
    .alert {
        font-size: font-size-vw(map-get($container-widths, "sd"), $alert-size);
    }
}
</style>
