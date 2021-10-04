<template>
  <header class="hero is-info is-small">
    <div class="hero-head">
      <b-navbar centered type="is-info">
        <template #brand>
          <b-navbar-item tag="div">
            <img src="@/assets/logo.png" alt="ZHAW" />
          </b-navbar-item>
        </template>
        <template #start>
          <b-navbar-item
            v-for="(info, index) of routerInfo"
            tag="router-link"
            :key="index"
            :to="info.link"
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
          <b-navbar-item>
            <b-icon icon="logout"></b-icon>
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

@Component
export default class Header extends Vue {
  routerInfo = [
    { link: "/", icon: "home", text: "Startseite" },
    { link: "/my-subjects", icon: "edit", text: "Meine Wahl" },
    { link: "/statistics", icon: "chart-pie", text: "Statistiken" },
    { link: "/admin", icon: "user", text: "Admin" },
    { link: "/settings", icon: "cogs", text: "Einstellungen" },
  ];
}
</script>

<style lang="scss">
#logo {
  max-height: 120px;
  position: absolute;
  top: 1rem;
}
</style>
