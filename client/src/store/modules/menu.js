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
        state.clickable = payload;
    }
}

export default {
    // namespaced: true,
    state,
    mutations
}
