<template>
  <div class="column is-narrow side-menu is-hidden-touch">
    <section class="section">
      <div class="tile box is-radiusless">
        <aside class="menu" id="navMenu"></aside>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class LeftMenu extends Vue {}
</script>
