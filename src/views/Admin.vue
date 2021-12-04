<template>
  <div id="content">
    <div class="buttons">
      <b-button
        label="Vorwahlen exportieren"
        type="is-success"
        icon-left="download"
      ></b-button>
      <b-button
        label="Module importieren"
        type="is-info"
        icon-left="file-upload"
        @click="this.importModules"
      >
      </b-button>
      <b-button
        label="Klassenliste importieren"
        type="is-info"
        icon-left="file-upload"
        @click="this.importClassList"
      >
      </b-button>
      <b-button
        label="Dispensationen importieren"
        type="is-info"
        icon-left="file-upload"
        @click="this.importDispensations"
      >
      </b-button>
      <b-button
        label="Aktuelle Vorwahl exportieren"
        type="is-success"
        icon-left="file-download"
        @click="this.exportModuleElection"
      >
      </b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import ModuleListUpload from "@/mixins/ExcelSheetUpload";

@Component
export default class Admin extends Mixins(ModuleListUpload) {
  async importModules(): Promise<void> {
    this.listTitle = "Modulliste";
    this.importPath = "module";
    await this.importList();
  }

  async importClassList(): Promise<void> {
    this.listTitle = "Klassenliste";
    this.importPath = "students";
    await this.importList();
  }

  async importDispensations(): Promise<void> {
    this.listTitle = "Dispensationsliste";
    this.importPath = "students/dispensations";
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
