import Vue from "vue"
import App from "./components/App.vue"
import router from "./router"
import store from "./store/store"
import Vuelidate from "vuelidate"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.component("font-awesome-icon", FontAwesomeIcon)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app")
