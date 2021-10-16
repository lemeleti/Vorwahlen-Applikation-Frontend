<template>
  <div class="tile box is-radiusless p-0" :id="id">
    <article class="tile is-child has-text-centered">
      <div class="box-header">
        <span class="is-size-4">{{ title }}</span>
        <b-icon
          icon="chevron-down"
          custom-class="is-clickable"
          @click.native="isActive = !isActive"
        ></b-icon>
      </div>
      <hr class="m-0" />
      <div
        class="content box-content is-small has-text-left"
        v-bind:class="{ active: isActive }"
        v-html="content"
      ></div>
    </article>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class RightMenuBox extends Vue {
  @Prop() title!: string;
  @Prop() content!: string;
  @Prop() id!: string;
  isActive = true;
}
</script>
