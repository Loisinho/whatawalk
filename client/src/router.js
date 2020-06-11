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
                requiresAuth: true
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
                    path: "groups",
                    name: "groups",
                    props: {
                        pick: "groups",
                        op: "member"
                    },
                    component: () => import(/* webpackChunkName: "explore" */ "./views/Explore.vue")
                },
                {
                    path: "notices",
                    name: "notices",
                    props: {
                        pick: "notices",
                        op: "own"
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
            path: "/group/:id",
            name: "group",
            meta: {
                requiresAuth: true
            },
            component: () => import(/* webpackChunkName: "group" */ "./views/Group.vue")
        },
        {
            path: "/travels",
            name: "travels",
            meta: {
                requiresAuth: true
            },
            component: () => import(/* webpackChunkName: "travels" */ "./views/Travel.vue")
        },
        {
            path: "*",
            component: Home
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.state.session.first) {
            store.commit("session/firstConnection");
            await store.dispatch("session/checkSession");
        }
        store.state.session.isLoggedIn? next(): next({ name: "login" });
    } else {
        if (store.state.session.first) {
            store.commit("session/firstConnection");
            await store.dispatch("session/checkSession");
        }
        if (to.matched.some(record => record.meta.guest)) {
            !store.state.session.isLoggedIn? next(): next({ name: "home" });
        } else {
            next();
        }
    }
});

export default router;
