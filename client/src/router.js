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
            path: "/about",
            name: "about",
            component: () => import(/* webpackChunkName: "about" */ "./views/About.vue")
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
            path: "/explore/:id",
            name: "explore",
            props: route => ({
                pick: route.query.pick,
                op: route.query.op
            }),
            meta: {
                requiresAuth: true
            },
            component: () => import(/* webpackChunkName: "explore" */ "./views/Explore.vue")
        },
        {
            path: "/user/:id",
            meta: {
                requiresAuth: true,
                userExists: true
            },
            component: () => import(/* webpackChunkName: "user" */ "./views/Blank.vue"),
            children: [
                {
                    path: "profile",
                    name: "profile",
                    component: () => import(/* webpackChunkName: "user" */ "./views/Profile.vue")
                },
                {
                    path: "following",
                    name: "following",
                    props: {
                        pick: "users",
                        op: "following"
                    },
                    component: () => import(/* webpackChunkName: "explore" */ "./views/Explore.vue")
                },
                {
                    path: "followers",
                    name: "followers",
                    props: {
                        pick: "users",
                        op: "followers"
                    },
                    component: () => import(/* webpackChunkName: "explore" */ "./views/Explore.vue")
                },
                {
                    path: "",
                    component: Home
                }
            ]
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
