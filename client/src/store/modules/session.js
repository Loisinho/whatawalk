import axios from "axios";

// Initial state
const state = {
    isLoggedIn: false,
    username: null,
    img: null
}

// Mutations
const mutations = {
    checkSession (state, payload) {
        state.isLoggedIn = payload.isLoggedIn;
        state.username = payload.username;
        state.img = payload.img;
    }
}

// Actions
const actions = {
    async checkSession (context) {
        let user = await axios.get(process.env.VUE_APP_URL + "users/session");
        if (user.data)
            context.commit("checkSession", {
                isLoggedIn: !!user.data,
                username: user.data.username || null,
                img: user.data.img
            });
        else
            context.commit("checkSession", {
                isLoggedIn: false,
                username: null
            });
    },
    async checkUser ({context}, username) {
        return await axios.get(process.env.VUE_APP_URL + `users/${username}/exists/username`);
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
