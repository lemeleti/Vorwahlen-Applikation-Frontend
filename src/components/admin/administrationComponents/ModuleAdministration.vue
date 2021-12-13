<template>
  <Administration
    @deleteSelected="deleteModule"
    :modal="modalComponent"
    id="moduleNo"
    :columns.sync="moduleColumns"
    :rows.sync="moduleRows"
    :checkedRows.sync="checkedModuleRows"
    :isDataLoading.sync="isModuleDataLoading"
  >
    <template #title>Modulverwaltung</template>
    <template #buttons-right>
      <div class="level-item">
        <b-button
          label="Modulliste"
          type="is-success"
          icon-left="file-upload"
          @click="importModules"
        />
      </div>

      <div class="level-item">
        <b-button
          label="Scrape"
          type="is-info"
          icon-left="file-upload"
          @click="$moduleApi.scrapeModuleData"
        />
      </div>
    </template>
  </Administration>
</template>

<script lang="ts">
import _Vue from "vue";
import { Component } from "vue-property-decorator";
import CreateEditModule from "@/components/admin/createAddModals/CreateEditModule.vue";
import Administration from "@/components/admin/administrationComponents/Administration.vue";
import Module from "@/models/module";

@Component({
  components: {
    CreateEditModule,
    Administration,
  },
})
export default class ModuleAdministration extends Administration<Module> {
  isModuleDataLoading = true;
  moduleRows: Array<Module> = [];
  checkedModuleRows: Array<Module> = [];

  moduleColumns = [
    {
      field: "moduleNo",
      label: "Modulkürzel",
    },
    {
      field: "shortModuleNo",
      label: "Stammkürzel",
    },
    {
      field: "moduleTitle",
      label: "Modulbezeichnung",
    },
    {
      field: "moduleGroup",
      label: "Modulgruppe",
    },
    {
      field: "institute",
      label: "Institut",
    },
    {
      field: "credits",
      label: "Credits",
    },
    {
      field: "language",
      label: "Sprache",
    },
    {
      field: "consecutiveModuleNo",
      label: "Verbundenes konsekutives Modul",
    },
  ];

  get modalComponent(): typeof _Vue {
    return CreateEditModule;
  }

  async created(): Promise<void> {
    this.modalOption.component = CreateEditModule;
    this.moduleRows = await this.$moduleApi.getAll();
    this.isModuleDataLoading = false;
  }

  async deleteModule(module: Module): Promise<void> {
    await this.$moduleApi.deleteById(module.moduleNo);
  }

  async importModules(): Promise<void> {
    this.listTitle = "Modulliste";
    this.importPath = this.$moduleApi.basePath;
    await this.importList();
  }
}
</script>
