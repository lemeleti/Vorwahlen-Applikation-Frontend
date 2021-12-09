<template>
  <div class="tile is-parent has-text-centered is-3">
    <div
      class="tile is-child notification is-radiusless"
      :class="color"
      style="color: black; min-height: 100px"
    >
      <slot name="title">Modultitel</slot>
      <b-field id="selectModule">
        <b-checkbox
          :value="true"
          type="is-info"
          v-model="moduleSelected"
        ></b-checkbox>
      </b-field>
      <b-icon
        icon="info"
        type="is-info"
        id="moduleInfo"
        class="is-clickable"
        @click.native="$emit('moreInfo')"
      ></b-icon>
    </div>
  </div>
</template>

<script lang="ts">
import ModuleStore from "@/store/modules/ModuleStore";
import { Component, Vue, Prop } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

@Component
export default class Module extends Vue {
  @Prop() moduleNo!: string;
  @Prop() color!: string;
  moduleStore: ModuleStore = getModule(ModuleStore);

  get moduleSelected(): boolean {
    return this.moduleStore.isModuleSelected(this.moduleNo);
  }

  set moduleSelected(selected: boolean) {
    this.moduleStore.updateElection(this.moduleNo);
  }
}
</script>

<style>
#selectModule {
  top: 0;
  right: -19px;
  position: absolute;
}

#moduleInfo {
  top: 0;
  left: 0px;
  position: absolute;
}
</style>
