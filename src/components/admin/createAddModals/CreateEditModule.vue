<template>
  <CreateEditModal
    :createObject="createObject"
    :partialObject="partialObject"
    :addCalback="moduleApi.create"
    :editCalback="moduleApi.update"
    :id="partialObject.moduleNo"
    @addToRow="(module) => $emit('addToRow', module)"
    @editInRow="(module) => $emit('editInRow', module)"
    @close="$emit('close')"
  >
    <template #title>{{ title }}</template>
    <template #body>
      <b-field label="Modulkürzel">
        <b-input
          v-model="partialObject.moduleNo"
          :disabled="!createObject"
          required
        ></b-input>
      </b-field>

      <b-field label="Stammkürzel">
        <b-input v-model="partialObject.shortModuleNo" required></b-input>
      </b-field>

      <b-field label="Modulbezeichnung">
        <b-input v-model="partialObject.moduleTitle" required></b-input>
      </b-field>

      <b-field label="Modul-ID">
        <b-input v-model="partialObject.moduleId" required></b-input>
      </b-field>

      <b-field label="Modulgruppe (kommasepariert)">
        <b-input v-model="partialObject.moduleGroup" required></b-input>
      </b-field>

      <b-field label="Institut">
        <b-input v-model="partialObject.institute" required></b-input>
      </b-field>

      <b-field label="Konsekutive Modulkürzel (Optional)">
        <b-tooltip
          multilined
          label="Wenn es sich um ein konsekutives Modul handelt, geben Sie den entsprechenden Gegenpart ein."
          position="is-right"
        >
          <b-input v-model="partialObject.consecutiveModuleNo"></b-input>
        </b-tooltip>
      </b-field>

      <b-field label="Credits">
        <b-numberinput
          v-model="partialObject.credits"
          min="1"
          required
        ></b-numberinput>
      </b-field>

      <b-field label="Semester">
        <b-numberinput
          v-model="partialObject.semester"
          min="5"
          max="6"
          required
        ></b-numberinput>
      </b-field>

      <b-field label="Sprache">
        <b-select v-model="partialObject.language">
          <option value="Deutsch">Deutsch</option>
          <option value="Englisch">Englisch</option>
        </b-select>
      </b-field>
    </template>
  </CreateEditModal>
</template>

<script lang="ts">
import Module from "@/models/module";
import { Component } from "vue-property-decorator";
import CreateEditModal from "@/components/admin/createAddModals/CreateEditModal.vue";
import ModuleApi from "@/mixins/ModuleApi";

@Component({
  components: {
    CreateEditModal,
  },
})
export default class CreateEditModule extends CreateEditModal<Module> {
  moduleApi = new ModuleApi();
  get title(): string {
    return this.createObject ? "Modul erstellen" : "Modul aktualisieren";
  }
}
</script>
