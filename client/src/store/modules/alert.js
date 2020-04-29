// Initial state
const state = {
    msg: "",
    type: "",
    active: false,
    time: 3000
}

// Mutations
const mutations = {
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
