import Vue from "vue";
import Router from "vue-router";
import store from "./store"
import Home from "./views/Home.vue";

Vue.use(Router);

const router = new Router({
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
            meta: {
                guest: true
            },
            component: () => import(/* webpackChunkName: "signup" */ "./views/Signup.vue")
        },
        {
            path: "/login",
            name: "login",
            meta: {
                guest: true
            },
            component: () => import(/* webpackChunkName: "login" */ "./views/Login.vue")
        },
        {
            path: "/about",
            name: "about",
            component: () => import(/* webpackChunkName: "about" */ "./views/About.vue")
        },
        {
            path: "/profile",
            name: "profile",
            meta: {
                requiresAuth: true
            },
            component: () => import(/* webpackChunkName: "profile" */ "./views/Profile.vue")
        },
        {
            path: "/test",
            name: "test",
            meta: {
                requiresAuth: true
            },
            component: () => import(/* webpackChunkName: "test" */ "./views/Test.vue")
        },
        {
            path: "*",
            component: Home
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    await store.dispatch("session/checkSession");
    if (to.matched.some(record => record.meta.requiresAuth)) {
        !store.state.session.isLoggedIn? next({ name: "login" }) : next();
    } else if (to.matched.some(record => record.meta.guest)) {
        if (!store.state.session.isLoggedIn) next();
    } else {
        next();
    }
});

export default router;
