import Vue from "vue";
import Router from "vue-router";

import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            name: "home",
            component: Home
        },
        {
            path: "/signup",
            name: "signup",
            component: () =>
                import(/* webpackChunkName: "signup" */ "./views/Signup.vue")
        },
        {
            path: "/login",
            name: "login",
            component: () =>
                import(/* webpackChunkName: "login" */ "./views/Login.vue")
        },
        {
            path: "/about",
            name: "about",
            // Lazy Loading Route
            component: () =>
                import(/* webpackChunkName: "about" */ "./views/About.vue")
        },
        {
            path: "/test",
            name: "test",
            component: () =>
                import(/* webpackChunkName: "test" */ "./views/Test.vue")
        }
    ]
});
