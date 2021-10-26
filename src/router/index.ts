import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Homepage.vue";
import UserStore from "@/store/modules/UserStore";
import { getModule } from "vuex-module-decorators";

const moduleStore = getModule(UserStore);
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("../views/Admin.vue"),
    meta: { requiresAuthentication: true },
  },
  {
    path: "/my-subjects",
    name: "Subjects",
    component: () => import("../views/MySubjects.vue"),
    meta: { requiresAuthentication: true },
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
  },
  {
    path: "/statistics",
    name: "Statistiken",
    component: () => import("../views/Statistics.vue"),
  },
  {
    path: "/Shibboleth.sso/Login?target=https%3A%2F%2Fvorwahlen.cloudlab.zhaw.ch",
    name: "Login",
    beforeEnter(to) {
      window.location.href = to.path;
    },
  },
  {
    path: "/Shibboleth.sso/Logout",
    name: "Logout",
    beforeEnter(to) {
      window.location.href = to.path;
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, _from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuthentication)) {
    if (moduleStore.isUserAuthenticated) {
      next();
    } else {
      next({
        name: "Login",
        query: { redirect: to.fullPath },
      });
    }
  } else {
    next();
  }
});

export default router;
