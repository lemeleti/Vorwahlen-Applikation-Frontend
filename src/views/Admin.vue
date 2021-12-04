<template>
  <div id="content">
    <StudentAdministration />
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
import StudentAdministration from "@/components/StudentAdministration.vue";

@Component({
  components: {
    StudentAdministration,
  },
})
export default class Admin extends Mixins(ModuleListUpload) {
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
