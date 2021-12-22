<template>
  <div class="column has-text-centered is-3-desktop is-6-tablet">
    <div
      class="is-child notification is-radiusless"
      :class="color"
      style="color: black; min-height: 100px"
    >
      <slot name="title">Modultitel</slot>
      <b-field class="selectModule">
        <b-checkbox
          :value="true"
          type="is-info"
          v-model="moduleSelected"
        ></b-checkbox>
      </b-field>
      <b-icon
        icon="info"
        type="is-info"
        class="is-clickable moduleInfo"
        @click.native="$emit('moreInfo')"
      ></b-icon>
      <span class="executionSemester is-size-7">
        Semester: {{ executionSemester }}
      </span>
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
  @Prop() semester!: number;
  moduleStore: ModuleStore = getModule(ModuleStore);

  get executionSemester(): string {
    let executionSemester = "HS";
    if (this.semester % 6 === 0) {
      executionSemester = "FS";
    }
    return executionSemester;
  }

  get moduleSelected(): boolean {
    return this.moduleStore.isModuleSelected(this.moduleNo);
  }

  set moduleSelected(selected: boolean) {
    this.moduleStore.updateElection(this.moduleNo);
  }
}
</script>

<style>
.executionSemester {
  position: absolute;
  bottom: 0;
  right: 0;
}

.selectModule {
  top: 0;
  right: -19px;
  position: absolute;
}

.moduleInfo {
  top: 0;
  left: 0px;
  position: absolute;
}
</style>
