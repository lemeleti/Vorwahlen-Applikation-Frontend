<template>
  <header class="hero is-info is-small">
    <div class="hero-head">
      <b-navbar centered type="is-info">
        <template #brand>
          <img src="@/assets/logo.png" alt="ZHAW" id="logo" />
        </template>
        <template #start>
          <b-navbar-item
            v-for="(info, index) of routerInfo"
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
    { name: "Home", icon: "home", text: "Startseite" },
    { name: "Subjects", icon: "edit", text: "Meine Wahl" },
    { name: "Statistiken", icon: "chart-pie", text: "Statistiken" },
    { name: "Admin", icon: "user", text: "Admin" },
    { name: "Settings", icon: "cogs", text: "Einstellungen" },
  ];
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
