import Vue from "vue"
import Vuex from "vuex"
import menu from "./modules/menu"
import alert from "./modules/alert"

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        menu,
        alert
    }
})
