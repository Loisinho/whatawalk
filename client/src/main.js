import Vue from "vue"
import App from "./components/App.vue"
import router from "./router"
import store from "./store"
import Axios from "axios"
import Vuelidate from "vuelidate"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import VueSocketIOExt from "vue-socket.io-extended"
import io from "socket.io-client"
 
const socket = io(process.env.VUE_APP_URL, {
    autoConnect: false
})
 
Vue.use(VueSocketIOExt, socket)

Vue.config.productionTip = false

Vue.prototype.$http = Axios.create({
    baseURL: process.env.VUE_APP_URL,
    withCredentials: process.env.VUE_AXIOS_WITHCREDENTIALS? true: false
})

Vue.use(Vuelidate)
Vue.component("font-awesome-icon", FontAwesomeIcon)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app")
