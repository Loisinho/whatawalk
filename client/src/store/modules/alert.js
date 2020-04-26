// Initial state
const state = {
    msg: "",
    type: "",
    active: false
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
        setTimeout(() => { state.active = false; }, 3000);
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
