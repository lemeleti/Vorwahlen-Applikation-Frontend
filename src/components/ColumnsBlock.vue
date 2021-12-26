<template>
  <div class="block">
    <div class="subtitle">
      <strong><slot name="title"></slot></strong>
    </div>
    <div class="columns is-multiline">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ColumnsBlock extends Vue {}
</script>
