<template>
  <CreateEditModal
    :createMode="createModule"
    :id="module.moduleNo"
    :basePath="moduleBasePath"
    :obj.sync="module"
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
export default class CreateEditModule extends CreateEditModal<Module> {
  @Prop() module!: Partial<Module>;
  @Prop() createModule!: boolean;
  moduleBasePath = "/module";

  get title(): string {
    return this.createModule ? "Modul erstellen" : "Modul aktualisieren";
  }

  addModule(): void {
    this.sendNotification("Das Modul wurde erfolgreich erstellt");
  }

  updateModule(): void {
    this.sendNotification("Das Modul wurde erfolgreich aktualisiert");
  }
}
</script>
