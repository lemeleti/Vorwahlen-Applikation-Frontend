<template>
  <div class="tile is-parent has-text-centered is-3">
    <div
      class="tile is-child notification is-radiusless"
      :class="color"
      style="color: black; min-height: 100px"
    >
      <slot name="title">Modultitel</slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Module extends Vue {
  @Prop() moduleNo!: string;
  @Prop() isSelected!: boolean;
  @Prop() color!: string;
}
</script>
