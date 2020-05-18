// Initial state
const state = {
    open: false,
    clickable: false,
}

// Mutations
const mutations = {
    menuStatus(state, payload) {
        if (state.clickable)
            state.open = payload? !state.open: false;
    },
    isClickable(state, payload) {
        if (payload > 991 && state.clickable === true) {
            state.clickable = false;
            state.open = false;
        } else if (payload < 991 && state.clickable === false) {
            state.clickable = true;
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
