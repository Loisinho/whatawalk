import axios from "../../config";

// Initial state
const state = {
    first: true,
    isLoggedIn: false,
    username: null,
    img: null,
    notices: false
}

// Mutations
const mutations = {
    checkSession (state, payload) {
        if (!state.isLoggedIn && payload.isLoggedIn) {
            this._vm.$socket.client.open();
            this._vm.$socket.client.emit("storeClient", payload.username);
        }
        state.isLoggedIn = payload.isLoggedIn;
        state.username = payload.username;
        state.img = payload.img;
        state.notices = payload.notices;
    },
    disconnect (state) {
        state.isLoggedIn = false;
    },
    firstConnection (state) {
        state.first = false;
    },
    newNotice (state, payload=true) {
        state.notices = payload;
    },
}

// Actions
const actions = {
    async checkSession (context) {
        let user = await axios.get("users/session");
        if (user.data)
            context.commit("checkSession", {
                isLoggedIn: !!user.data,
                username: user.data.username,
                img: user.data.img,
                notices: user.data.notices
            });
        else
            context.commit("checkSession", {
                isLoggedIn: false,
                username: null
            });
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
