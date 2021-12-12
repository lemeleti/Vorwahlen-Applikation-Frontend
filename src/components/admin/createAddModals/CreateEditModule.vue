<template>
  <CreateEditModal
    :createMode="createModule"
    @add="addModule"
    @update="updateModule"
    @close="$emit('close')"
  >
    <template #title>{{ title }}</template>
    <template #body></template>
  </CreateEditModal>
</template>

<script lang="ts">
import Module from "@/models/module";
import { Component, Prop } from "vue-property-decorator";
import CreateEditModal from "@/components/admin/createAddModals/CreateEditModal.vue";

@Component({
  components: {
    CreateEditModal,
  },
})
export default class CreateEditModule extends CreateEditModal {
  @Prop() module!: Partial<Module>;
  @Prop() createModule!: boolean;

  get title(): string {
    return this.createModule ? "Modul erstellen" : "Modul aktualisieren";
  }

  addModule(): void {
    this.$moduleApi.create(this.module as Module);
    this.sendNotification("Das Modul wurde erfolgreich erstellt");
  }

  updateModule(): void {
    if (this.module.moduleNo) {
      this.$moduleApi.update(this.module as Module, this.module.moduleNo);
      this.sendNotification("Das Modul wurde erfolgreich aktualisiert");
    }
  }
}
</script>
