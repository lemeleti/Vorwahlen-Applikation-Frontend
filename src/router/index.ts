/* eslint-disable prettier/prettier */
import Vue from "vue";
import VueRouter, { NavigationGuardNext, RouteConfig } from "vue-router";
import { getModule } from "vuex-module-decorators";
import Home from "../views/Homepage.vue";
import UserStore from "@/store/modules/UserStore";
import SessionApi from "@/mixins/SessionApi";

const userStore = getModule(UserStore);
const sessionApi = new SessionApi();
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
    meta: { requiresAuthentication: true, requiresAdmin: true },
  },
  {
    path: "/my-election",
    name: "Subjects",
    component: () => import("../views/MyElection.vue"),
    meta: { requiresAuthentication: true, requiresStudent: true },
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
    meta: { requiresAuthentication: true, requiresStudent: true },
  },
  {
    path: "/statistics",
    name: "Statistiken",
    component: () => import("../views/Statistics.vue"),
    meta: { requiresAuthentication: true, requiresAdmin: true }, // hide until ready
  },
  {
    path: "/Shibboleth.sso/Login?target=https%3A%2F%2Fvorwahlen.cloudlab.zhaw.ch",
    name: "Login",
    beforeEnter(to) {
      window.location.replace(to.path)
    },
  },
  {
    path: "/api/logout",
    name: "Logout",
    beforeEnter(to) {
      window.location.replace(to.path);
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, _from, next) => {
  if (to.matched.some((record) => 
  record.meta.requiresAdmin && record.meta.requiresAuthentication)) {
    await routeIfUserIsAdmin(next);
  } else if (to.matched.some((record) => record.meta.requiresAuthentication && record.meta.requiresStudent)) {
    await routeIfUserisStudent(next);
  } else if (to.matched.some((record) => record.meta.requiresAuthentication)) {
    await routeIfUserIsLoggedIn(next);
  } else {
    next();
  }
});

async function routeIfUserIsAdmin(next: NavigationGuardNext<Vue>) {
  const isAuthenticated = await isUserAuthenticated();
  const isAdmin = await sessionApi.isAdmin();
  if (isAuthenticated && isAdmin) {
    next();
  } else {
    next({ name: "Home" });
  }
}

async function routeIfUserisStudent(next: NavigationGuardNext<Vue>) {
  const isAuthenticated = await isUserAuthenticated();
  if (isAuthenticated && userStore.isStudent) {
    next();
  } else {
    next({ name: "Home" });
  }
}

async function routeIfUserIsLoggedIn(next: NavigationGuardNext<Vue>) {
  if (await isUserAuthenticated()) {
    next();
  } else {
    next({ name: "Login" });
  }
}

async function isUserAuthenticated(): Promise<boolean> {
  return (userStore.isStoreInitialized || await sessionApi.isAuthenticated());
}

export default router;
