// Initial state
const state = {
    msg: "",
    type: "",
    active: false,
    time: 3000
}

// Mutations
const mutations = {
    activateAlert(state, payload) {
        state.msg = payload.msg;
        state.type = payload.type;
        state.active = true;
        setTimeout(() => { state.active = false; }, state.time);
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
