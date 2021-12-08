<template>
  <Administration
    @add="addModule"
    @edit="editModule"
    @deleteSelected="deleteModule"
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
    </template>
  </Administration>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CreateEditModule from "@/components/admin/CreateEditModule.vue";
import Administration from "@/components/admin/Administration.vue";
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

  async created(): Promise<void> {
    this.modalOption.component = CreateEditModule;
    this.moduleRows = (await Vue.axios.get("module")).data;
    this.isModuleDataLoading = false;
  }

  async addModule(): Promise<void> {
    this.modalOption.props = { module: {}, createModule: true };
    this.$buefy.modal.open(this.modalOption);
  }

  async deleteModule(module: Module): Promise<void> {
    try {
      (await Vue.axios.delete(`/module/${module.moduleNo}`)).data;
    } catch (e) {
      // todo display received error message
      console.log(e);
    }
  }

  async editModule(): Promise<void> {
    this.modalOption.props = {
      module: this.checkedModuleRows[0],
      createModule: false,
    };
    this.$buefy.modal.open(this.modalOption);
  }

  async importModules(): Promise<void> {
    this.listTitle = "Modulliste";
    this.importPath = "module";
    await this.importList();
  }
}
</script>
