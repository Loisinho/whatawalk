import axios from "../../config";

// Initial state
const state = {
    first: true,
    isLoggedIn: false,
    username: null,
    img: null,
    notices: false,
    groups: []
}

// Mutations
const mutations = {
    checkSession (state, payload) {
        let groupsJoin = [];
        let groupsNotify = [];
        payload.groups.map(i => {
            if (i.notify) groupsNotify.push(i.group);
            groupsJoin.push(i.group);
        });
        if (!state.isLoggedIn && payload.isLoggedIn) {
            this._vm.$socket.client.open();
            this._vm.$socket.client.emit("storeClient", payload.username);
            this._vm.$socket.client.emit("joinGroups", groupsJoin);
        }
        state.isLoggedIn = payload.isLoggedIn;
        state.username = payload.username;
        state.img = payload.img;
        state.notices = payload.notices;
        state.groups = groupsNotify;
    },
    disconnect (state) {
        state.isLoggedIn = false;
        state.notices = false;
        state.groups = [];
    },
    firstConnection (state) {
        state.first = false;
    },
    newNotice (state, payload=true) {
        state.notices = payload;
    },
    newGroup (state, payload) {
        state.groups.push(payload);
        this._vm.$socket.client.emit("joinGroups", [payload]);
    },
    removeGroup (state, payload) {
        let i = state.groups.indexOf(payload);
        if (i !== -1) state.groups.splice(i, 1);
    },
    newGroupMsg (state, payload) {
        state.groups.push(payload);
    }
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
                notices: user.data.notices,
                groups: user.data.groups
            });
        else
            context.commit("checkSession", {
                isLoggedIn: false,
                username: null,
                groups: []
            });
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
