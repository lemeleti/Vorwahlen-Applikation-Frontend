<template>
  <CreateEditModal
    :createMode="createMailTemplate"
    :id="mailTemplate.id"
    :basePath="mailTemplateBasePath"
    :obj.sync="mailTemplate"
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
import CreateEditModal from "@/components/admin/CreateEditModal.vue";

@Component({
  components: {
    CreateEditModal,
  },
})
export default class CreateEditMailTemplate extends CreateEditModal<MailTemplate> {
  @Prop() mailTemplate!: Partial<MailTemplate>;
  @Prop() createMailTemplate!: boolean;
  mailTemplateBasePath = "/mailtemplates";

  get title(): string {
    return this.createMailTemplate
      ? "Mail-Template erstellen"
      : "Mail-Template aktualisieren";
  }

  addMailTemplate(): void {
    this.sendNotification("Das Mail-Template wurde erfolgreich erstellt");
  }

  updateMailTemplate(): void {
    this.sendNotification("Das Mail-Template wurde erfolgreich aktualisiert");
  }
}
</script>
