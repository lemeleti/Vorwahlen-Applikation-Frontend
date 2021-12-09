<template>
  <Administration
    @add="addMailTemplate"
    @edit="editMailTemplate"
    @deleteSelected="deleteMailTemplate"
    :columns.sync="mailTemplateColumns"
    :rows.sync="mailTemplateRows"
    :checkedRows.sync="checkedMailTemplateRows"
    :isDataLoading.sync="isMailTemplateDataLoading"
  >
    <template #title>Mail-Template-Verwaltung</template>
  </Administration>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MailTemplate from "@/models/mailTemplate";
import CreateEditMailTemplate from "@/components/admin/CreateEditMailTemplate.vue";
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

  async created(): Promise<void> {
    this.isMailTemplateDataLoading = false;
    this.modalOption.component = CreateEditMailTemplate;
    this.mailTemplateRows = (
      await Vue.axios.get<Array<MailTemplate>>("mailtemplates")
    ).data;
  }

  async deleteMailTemplate(mailTemplate: MailTemplate): Promise<void> {
    try {
      await Vue.axios.delete(`/mailtemplates/${mailTemplate.id}`);
    } catch (e) {
      console.log(e);
    }
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
