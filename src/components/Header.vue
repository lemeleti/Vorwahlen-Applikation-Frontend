<template>
  <header class="hero is-info is-small">
    <div class="hero-head">
      <b-navbar centered type="is-info">
        <template #brand>
          <img src="@/assets/logo.png" alt="ZHAW" id="logo" />
        </template>
        <template #start>
          <b-navbar-item
            v-for="(info, index) of getRouterLinks"
            tag="router-link"
            :key="index"
            :to="{ name: info.name }"
          >
            <b-icon :icon="info.icon"></b-icon>
            <span>{{ info.text }}</span>
          </b-navbar-item>
        </template>

        <template #end>
          <b-navbar-item>
            <b-icon icon="bell"></b-icon>
          </b-navbar-item>
          <b-navbar-item>
            <b-icon icon="search"></b-icon>
          </b-navbar-item>
          <b-navbar-item
            v-if="!userStore.isUserAuthenticated"
            tag="router-link"
            :to="{ name: 'Login' }"
          >
            <b-icon icon="sign-in-alt"></b-icon>
            <span>Login</span>
          </b-navbar-item>
          <b-navbar-item
            v-if="userStore.isUserAuthenticated"
            tag="a"
            @click="logout"
          >
            <b-icon icon="sign-in-alt"></b-icon>
            <span>Logout</span>
          </b-navbar-item>
        </template>
      </b-navbar>
    </div>

    <div class="hero-body">
      <div class="container has-text-centered">
        <p class="title">Modulvorwahlen</p>
        <p class="subtitle">
          Herzlich willkommen auf der Modulwahlseite der ZHAW.
        </p>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import UserStore from "@/store/modules/UserStore";

interface NavbarItemInfo {
  name: string;
  icon: string;
  text: string;
  authNeeded: boolean;
}

@Component
export default class Header extends Vue {
  userStore = getModule(UserStore);
  routerInfo: Array<NavbarItemInfo> = [
    { name: "Home", icon: "home", text: "Startseite", authNeeded: false },
    { name: "Subjects", icon: "edit", text: "Meine Wahl", authNeeded: true },
    {
      name: "Statistiken",
      icon: "chart-pie",
      text: "Statistiken",
      authNeeded: false,
    },
    { name: "Admin", icon: "user", text: "Admin", authNeeded: true },
    {
      name: "Settings",
      icon: "cogs",
      text: "Einstellungen",
      authNeeded: false,
    },
  ];

  get getRouterLinks(): Array<NavbarItemInfo> {
    if (this.userStore.isUserAuthenticated) {
      return this.routerInfo;
    }
    const allowedRoutes = new Array<NavbarItemInfo>();
    this.routerInfo.forEach((link) => {
      if (!link.authNeeded) {
        allowedRoutes.push(link);
      }
    });
    return allowedRoutes;
  }

  logout(): void {
    this.userStore.removeUserData();
    Vue.axios.get("../Shibboleth.sso/Logout");
    Vue.axios.get("/session/destroy");
    this.$router.push({ name: "Home" });
  }
}
</script>

<style lang="scss">
#logo {
  max-height: 60px;
  position: relative;
  top: 1rem;
  left: 0.75rem;
}
</style>
