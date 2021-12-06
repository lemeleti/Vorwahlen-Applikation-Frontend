<template>
  <section>
    <h1 class="title">Modulverwaltung</h1>
    <div class="block">
      <b-table
        :data="modules"
        :columns="columns"
        :loading="dataIsLoading"
        :debounce-search="1000"
        checkable
        :checked-rows.sync="checkedRows"
        paginated
        per-page="15"
      >
        <template #bottom-left>
          <b>Ausgewählt</b>: {{ checkedRows.lenght }}
        </template>
      </b-table>
    </div>
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <b-button
            @click="addModule"
            icon-left="plus"
            label="Erstellen"
            type="is-success"
          />
        </div>

        <div class="level-item">
          <b-button
            label="Modulliste"
            type="is-success"
            icon-left="file-upload"
            @click="this.importModules"
          />
        </div>

        <div class="level-item">
          <b-button
            @click="editSelectedModule"
            icon-left="edit"
            type="is-info"
            label="Editieren"
          />
        </div>

        <div class="level-item">
          <b-button
            @click="deleteSelectedModules"
            icon-left="trash"
            type="is-danger"
            label="Löschen"
          />
        </div>
      </div>

      <div class="level-right">
        <div class="level-item">
          <b-button
            label="Vorwahlen exportieren"
            type="is-success"
            icon-left="file-download"
            @click="this.exportModuleElection"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from "vue-property-decorator";
import CreateEditModule from "@/components/admin/CreateEditModule.vue";
import ModuleListUpload from "@/mixins/ExcelSheetUpload";
import Module from "@/models/module";
import { BModalConfig } from "buefy/types/components";

@Component({
  components: {
    CreateEditModule,
  },
})
export default class ModuleAdministration extends Mixins(ModuleListUpload) {
  dataIsLoading = true;
  modules: Array<Module> = [];
  checkedRows: Array<Module> = [];

  columns = [
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

  modalOption: BModalConfig = {
    parent: this,
    component: CreateEditModule,
    trapFocus: true,
    hasModalCard: true,
    canCancel: ["x", "escape"],
  };

  async created(): Promise<void> {
    this.modules = (await Vue.axios.get("module")).data;
    this.dataIsLoading = false;
  }

  async addModule(): Promise<void> {
    this.modalOption.props = { module: {}, createModule: true };
    this.$buefy.modal.open(this.modalOption);
  }

  async deleteSelectedModules(): Promise<void> {
    const userConfirmation = await Vue.swal({
      title: "Wollen Sie die asugewählten Module löschen?",
      text: "Diese Aktion ist irreversibel",
      showCancelButton: true,
      cancelButtonText: "Abbrechen",
      confirmButtonText: "Löschen",
    });

    if (userConfirmation.isConfirmed) {
      for (const module of this.checkedRows) {
        try {
          (await Vue.axios.delete(`/module/${module.moduleNo}`)).data;
        } catch (e) {
          // todo display received error message
          console.log(e);
          return;
        }
        const moduleIndex = this.modules.indexOf(module);
        this.modules.splice(moduleIndex, 1);
      }
      Vue.swal({
        title: "Module wurden gelöscht",
        icon: "success",
      });
    }
  }

  async editSelectedModule(): Promise<void> {
    this.modalOption.props = {
      module: this.checkedRows[0],
      createModule: false,
    };
    this.$buefy.modal.open(this.modalOption);
  }

  async importModules(): Promise<void> {
    this.listTitle = "Modulliste";
    this.importPath = "module";
    await this.importList();
  }

  async exportModuleElection(): Promise<void> {
    const data: Blob = (
      await Vue.axios.get<Blob>("/election/export", { responseType: "blob" })
    ).data;
    const url: string = window.URL.createObjectURL(data);
    window.open(url);
  }
}
</script>
