<template>
  <Administration
    @add="addModuleElection"
    @edit="editModuleElections"
    @deleteSelected="deleteModuleElection"
    :columns.sync="moduleElectionColumns"
    :rows.sync="moduleElectionRows"
    :checkedRows.sync="checkedModuleElectionRows"
    :isDataLoading.sync="isModuleElectionDataLoading"
  >
    <template #title>Modulvorwahlen-Verwaltung</template>
  </Administration>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CreateEditModuleElection from "@/components/admin/CreateEditModuleElection.vue";
import Administration from "@/components/admin/Administration.vue";
import ModuleElection from "@/models/moduleElection";

@Component({
  components: {
    CreateEditModuleElection,
    Administration,
  },
})
export default class ModuleElectionAdministration extends Administration<ModuleElection> {
  isModuleElectionDataLoading = true;
  moduleElectionRows: Array<ModuleElection> = [];
  checkedModuleElectionRows: Array<ModuleElection> = [];
  moduleElectionColumns = [
    {
      field: "id",
      label: "ID",
    },
    {
      field: "studentEmail",
      label: "Student",
    },
    {
      field: "electedModules",
      label: "Gewählte Module",
    },
    {
      field: "electionValid",
      label: "Wahlgültigkeit",
    },
  ];

  async created(): Promise<void> {
    this.isModuleElectionDataLoading = false;
    this.modalOption.component = CreateEditModuleElection;
    this.moduleElectionRows = (
      await Vue.axios.get<Array<ModuleElection>>("election")
    ).data;
  }

  async deleteModuleElection(moduleElection: ModuleElection): Promise<void> {
    try {
      await Vue.axios.delete(`/election/${moduleElection.id}`);
    } catch (e) {
      console.log(e);
    }
  }

  async addModuleElection(): Promise<void> {
    this.modalOption.component = CreateEditModuleElection;
    this.modalOption.props = {
      moduleElection: {},
      createModuleElection: true,
    };
    this.$buefy.modal.open(this.modalOption);
  }

  async editModuleElections(): Promise<void> {
    this.modalOption.props = {
      moduleElection: this.checkedModuleElectionRows[0],
      createModuleElection: false,
    };
    this.$buefy.modal.open(this.modalOption);
  }
}
</script>
