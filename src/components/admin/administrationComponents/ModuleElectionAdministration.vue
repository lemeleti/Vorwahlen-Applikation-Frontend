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
    <template #buttons-right>
      <div class="level-item">
        <b-button
          label="Exportieren"
          type="is-info"
          icon-left="file-download"
          @click="exportModuleElection"
        />
      </div>

      <div class="level-item">
        <b-dropdown
          :triggers="['hover']"
          aria-role="list"
          position="is-bottom-left"
        >
          <template #trigger>
            <b-button
              label="Template laden"
              type="is-info"
              icon-right="chevron-down"
              icon-left="paper-plane"
              @click="notifySelectedStudents"
            />
          </template>

          <b-dropdown-item
            aria-role="listitem"
            v-for="(mailTemplate, index) of mailTemplates"
            :key="index"
            @click="loadMailTemplate(mailTemplate.id)"
          >
            {{ mailTemplate.description }}
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </template>
  </Administration>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CreateEditModuleElection from "@/components/admin/createAddModals/CreateEditModuleElection.vue";
import Administration from "@/components/admin/administrationComponents/Administration.vue";
import ModuleElection from "@/models/moduleElection";
import StudentNotify from "@/components/admin/StudentNotify.vue";
import MailTemplate from "@/models/mailTemplate";
import StudentNotification from "@/models/studentNotification";

@Component({
  components: {
    CreateEditModuleElection,
    Administration,
    StudentNotify,
  },
})
export default class ModuleElectionAdministration extends Administration<ModuleElection> {
  isModuleElectionDataLoading = true;
  moduleElectionRows: Array<ModuleElection> = [];
  checkedModuleElectionRows: Array<ModuleElection> = [];
  mailTemplates: Array<MailTemplate> = [];
  studentNotification: Partial<StudentNotification> = {};
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
    this.mailTemplates = (
      await Vue.axios.get<Array<MailTemplate>>("mailtemplates")
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

  async exportModuleElection(): Promise<void> {
    const data: Blob = (
      await Vue.axios.get<Blob>("/election/export", { responseType: "blob" })
    ).data;
    const url: string = window.URL.createObjectURL(data);
    window.open(url);
  }

  notifySelectedUsers(): void {
    const studentMailAddresses = this.checkedModuleElectionRows.map(
      (moduleElection: ModuleElection) => moduleElection.studentEmail
    );
    this.modalOption.component = StudentNotify;
    this.modalOption.props = { studentNotification: { studentMailAddresses } };
    this.$buefy.modal.open(this.modalOption);
  }

  loadMailTemplate(id: number): void {
    const mailTemplate = this.mailTemplates.find(
      (mailTemplate: MailTemplate) => mailTemplate.id === id
    );
    if (mailTemplate && this.studentNotification) {
      this.studentNotification.subject = mailTemplate.subject;
      this.studentNotification.message = mailTemplate.message;
    }
    this.notifySelectedStudents();
  }

  notifySelectedStudents(): void {
    const studentMailAddresses = this.checkedModuleElectionRows.map(
      (moduleElection: ModuleElection) => moduleElection.studentEmail
    );
    if (this.studentNotification) {
      this.studentNotification.studentMailAddresses = studentMailAddresses;
    }

    this.modalOption.component = StudentNotify;
    this.modalOption.props = { studentNotification: this.studentNotification };
    this.$buefy.modal.open(this.modalOption);
  }
}
</script>
