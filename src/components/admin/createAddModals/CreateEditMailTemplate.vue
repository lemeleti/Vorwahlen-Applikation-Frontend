<template>
  <CreateEditModal
    :createMode="createMailTemplate"
    @add="addMailTemplate"
    @update="updateMailTemplate"
    @close="$emit('close')"
  >
    <template #title>{{ title }}</template>
    <template #body>
      <b-field label="Beschreibung">
        <b-input v-model="mailTemplate.description" required></b-input>
      </b-field>

      <b-field label="Betreff">
        <b-input v-model="mailTemplate.subject" required></b-input>
      </b-field>

      <b-field label="Nachricht">
        <b-input
          type="textarea"
          v-model="mailTemplate.message"
          required
        ></b-input>
      </b-field>
    </template>
  </CreateEditModal>
</template>

<script lang="ts">
import MailTemplate from "@/models/mailTemplate";
import { Component, Prop } from "vue-property-decorator";
import CreateEditModal from "@/components/admin/createAddModals/CreateEditModal.vue";

@Component({
  components: {
    CreateEditModal,
  },
})
export default class CreateEditMailTemplate extends CreateEditModal {
  @Prop() mailTemplate!: Partial<MailTemplate>;
  @Prop() createMailTemplate!: boolean;

  get title(): string {
    return this.createMailTemplate
      ? "Mail-Template erstellen"
      : "Mail-Template aktualisieren";
  }

  async addMailTemplate(): Promise<void> {
    this.$mailTemplateApi.create(
      this.mailTemplate as MailTemplate,
      "Das Mail-Template wurde erfolgreich erstellt"
    );
  }

  async updateMailTemplate(): Promise<void> {
    if (this.mailTemplate.id) {
      this.$mailTemplateApi.update(
        this.mailTemplate as MailTemplate,
        this.mailTemplate.id.toString(),
        "Das Mail-Template wurde erfolgreich aktualisiert"
      );
    }
  }
}
</script>
