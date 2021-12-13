<template>
  <Administration
    @deleteSelected="deleteMailTemplate"
    :modal="modalComponent"
    id="id"
    :columns.sync="mailTemplateColumns"
    :rows.sync="mailTemplateRows"
    :checkedRows.sync="checkedMailTemplateRows"
    :isDataLoading.sync="isMailTemplateDataLoading"
  >
    <template #title>Mail-Template-Verwaltung</template>
  </Administration>
</template>

<script lang="ts">
import _Vue from "vue";
import { Component } from "vue-property-decorator";
import MailTemplate from "@/models/mailTemplate";
import CreateEditMailTemplate from "@/components/admin/createAddModals/CreateEditMailTemplate.vue";
import Administration from "@/components/admin/administrationComponents/Administration.vue";

@Component({
  components: {
    CreateEditMailTemplate,
    Administration,
  },
})
export default class MailTemplateAdministration extends Administration<MailTemplate> {
  isMailTemplateDataLoading = true;
  mailTemplateRows: Array<MailTemplate> = [];
  checkedMailTemplateRows: Array<MailTemplate> = [];
  mailTemplateColumns = [
    {
      field: "id",
      label: "ID",
    },
    {
      field: "description",
      label: "Beschreibung",
    },
    {
      field: "subject",
      label: "Betreff",
    },
  ];

  get modalComponent(): typeof _Vue {
    return CreateEditMailTemplate;
  }

  async created(): Promise<void> {
    this.isMailTemplateDataLoading = false;
    this.modalOption.component = CreateEditMailTemplate;
    this.mailTemplateRows = await this.$mailTemplateApi.getAll();
  }

  async deleteMailTemplate(mailTemplate: MailTemplate): Promise<void> {
    await this.$mailTemplateApi.deleteById(mailTemplate.id.toString());
  }

  async addMailTemplate(): Promise<void> {
    this.modalOption.component = CreateEditMailTemplate;
    this.modalOption.props = {
      mailTemplate: {},
      createMailTemplate: true,
    };
    this.$buefy.modal.open(this.modalOption);
  }

  async editMailTemplate(): Promise<void> {
    this.modalOption.props = {
      mailTemplate: this.checkedMailTemplateRows[0],
      createMailTemplate: false,
    };
    this.$buefy.modal.open(this.modalOption);
  }
}
</script>
