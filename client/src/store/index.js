import Vue from "vue"
import Vuex from "vuex"
import session from "./modules/session"
import menu from "./modules/menu"
import alert from "./modules/alert"

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        session,
        menu,
        alert
    }
})
