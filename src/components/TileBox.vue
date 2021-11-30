<template>
  <div class="block">
    <div class="tile is-ancestor is-vertical">
      <div class="tile notification is-vertical is-radiusless">
        <div class="subtitle">
          <strong><slot name="title"></slot></strong>
        </div>
        <div
          class="
            tile
            is-flex
            is-flex-wrap-wrap
            is-justify-content-start
            is-align-content-center
          "
        >
          <slot name="content"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TileBox extends Vue {}
</script>
