// Initial state
const state = {
    msg: "",
    type: "",
    active: false,
    time: 3000
}

// Mutations
const mutations = {
    alertMsg(state, payload) {
        state.msg = payload;
    },
    alertType(state, payload) {
        state.type = payload;
    },
    alertActive(state) {
        state.active = true;
        setTimeout(() => { state.active = false; }, state.time);
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
