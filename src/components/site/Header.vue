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
            v-if="!userStore.isAuthenticated"
            tag="router-link"
            :to="{ name: 'Login' }"
          >
            <b-icon icon="sign-in-alt"></b-icon>
            <span>Login</span>
          </b-navbar-item>
          <b-navbar-item
            v-if="userStore.isAuthenticated"
            tag="a"
            href="#"
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
  adminNeeded: boolean;
  studentNeeded?: boolean;
}

@Component
export default class Header extends Vue {
  userStore = getModule(UserStore);
  routerInfo: Array<NavbarItemInfo> = [
    {
      name: "Home",
      icon: "home",
      text: "Startseite",
      authNeeded: false,
      adminNeeded: false,
    },
    {
      name: "Subjects",
      icon: "edit",
      text: "Meine Wahl",
      authNeeded: true,
      adminNeeded: false,
      studentNeeded: true,
    },
    {
      name: "Admin",
      icon: "user",
      text: "Admin",
      authNeeded: true,
      adminNeeded: true,
    },
    {
      name: "Statistiken",
      icon: "chart-pie",
      text: "Statistiken",
      authNeeded: true, // until implemented
      adminNeeded: true,
    },
    {
      name: "Settings",
      icon: "cogs",
      text: "Einstellungen",
      authNeeded: true,
      adminNeeded: false,
      studentNeeded: true,
    },
  ];

  get getRouterLinks(): Array<NavbarItemInfo> {
    const allowedRoutes = new Array<NavbarItemInfo>();
    if (this.userStore.isAuthenticated) {
      this.setRoutesIfAuthenticated(allowedRoutes);
    } else {
      this.routerInfo.forEach((link) => {
        if (!link.authNeeded) {
          allowedRoutes.push(link);
        }
      });
    }

    return allowedRoutes;
  }

  setRoutesIfAuthenticated(allowedRoutes: Array<NavbarItemInfo>): void {
    this.routerInfo.forEach((link) => {
      if (link.adminNeeded && this.userStore.isUserAdmin) {
        allowedRoutes.push(link);
      } else if (link.studentNeeded && this.userStore.isStudent) {
        allowedRoutes.push(link);
      } else if (!link.adminNeeded && !link.studentNeeded) {
        allowedRoutes.push(link);
      }
    });
  }

  logout(): void {
    this.userStore.removeUserData();
    this.$router.push({ name: "Logout" });
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
