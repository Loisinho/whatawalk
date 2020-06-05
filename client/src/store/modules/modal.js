// Initial state
const state = {
    msg: null,
    active: false
}

// Mutations
const mutations = {
    activateModal(state, payload) {
        state.active = payload.active;
        state.msg = payload.msg? payload.msg : null;
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
