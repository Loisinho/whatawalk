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
            path: "/user/:id",
            name: "profile",
            meta: {
                requiresAuth: true,
                userExists: true
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
        if (!store.state.session.isLoggedIn) {
            next({ name: "login" })
        } else {
            if (to.matched.some(record => record.meta.userExists)) {
                let user = await store.dispatch("session/checkUser", to.params.id);
                !user.data? next() : next({ name: "home" });
            }
            next();
        }
    } else if (to.matched.some(record => record.meta.guest)) {
        !store.state.session.isLoggedIn? next(): next({ name: "home" });
    }
    next();
});

export default router;
