<template>
  <header class="hero is-info is-small">
    <div class="hero-head">
      <nav class="navbar container">
        <img src="@/assets/logo.png" alt="ZHAW Logo" id="logo" />
        <div class="navbar-brand">
          <span class="navbar-burger" data-target="navbarMenuHeroA">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
        <div id="navbarMenuHeroA" class="navbar-menu navbar-end">
          <router-link to="/" id="frontpage" class="navbar-item">
            <b-icon icon="home"></b-icon>
            <span>Startseite</span>
          </router-link>
          <router-link to="/my-subjects" id="wahl" class="navbar-item">
            <b-icon icon="edit"></b-icon>
            <span>Meine Wahl</span>
          </router-link>
          <router-link to="/admin" id="admin" class="navbar-item">
            <b-icon icon="user"></b-icon>
            <span>Admin</span>
          </router-link>
          <a id="settings" class="navbar-item">
            <b-icon icon="cogs"></b-icon>
            <span>Einstellungen</span>
          </a>
          <a class="navbar-item">
            <b-icon icon="sign-out-alt"></b-icon>
            <span>Logout</span>
          </a>
          <a class="navbar-item">
            <span class="icon">
              <i class="fas fa-bell"></i>
            </span>
          </a>
          <a class="navbar-item">
            <span class="icon">
              <i class="fas fa-search"></i>
            </span>
          </a>
        </div>
      </nav>
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
export default class Header extends Vue {}
</script>

<style lang="scss">
#logo {
  max-height: 120px;
  position: absolute;
  top: 1rem;
}
</style>
