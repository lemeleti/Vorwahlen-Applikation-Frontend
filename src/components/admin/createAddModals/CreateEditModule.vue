<template>
  <CreateEditModal
    :createObject="createObject"
    :partialObject="partialObject"
    :addCalback="$moduleApi.create"
    :editCalback="$moduleApi.update"
    :id="partialObject.moduleNo"
    @addToRow="(module) => $emit('addToRow', module)"
    @editInRow="(module) => $emit('editInRow', module)"
    @close="$emit('close')"
  >
    <template #title>{{ title }}</template>
    <template #body></template>
  </CreateEditModal>
</template>

<script lang="ts">
import Module from "@/models/module";
import { Component } from "vue-property-decorator";
import CreateEditModal from "@/components/admin/createAddModals/CreateEditModal.vue";

@Component({
  components: {
    CreateEditModal,
  },
})
export default class CreateEditModule extends CreateEditModal<Module> {
  get title(): string {
    return this.createObject ? "Modul erstellen" : "Modul aktualisieren";
  }
}
</script>
