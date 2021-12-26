<template>
  <CreateEditModal
    :createObject="createObject"
    :partialObject="partialObject"
    :addCalback="mailTemplateApi.create"
    :editCalback="mailTemplateApi.update"
    :id="partialObject.id"
    @addToRow="(mailTemplate) => $emit('addToRow', mailTemplate)"
    @editInRow="(mailTemplate) => $emit('editInRow', mailTemplate)"
    @close="$emit('close')"
  >
    <template #title>{{ title }}</template>
    <template #body>
      <b-field label="Beschreibung">
        <b-input v-model="partialObject.description" required></b-input>
      </b-field>

      <b-field label="Betreff">
        <b-input v-model="partialObject.subject" required></b-input>
      </b-field>

      <b-field label="Nachricht">
        <b-input
          type="textarea"
          v-model="partialObject.message"
          required
        ></b-input>
      </b-field>
    </template>
  </CreateEditModal>
</template>

<script lang="ts">
import MailTemplate from "@/models/mailTemplate";
import { Component } from "vue-property-decorator";
import CreateEditModal from "@/components/admin/createAddModals/CreateEditModal.vue";
import MailTemplateApi from "@/mixins/MailTemplateApi";

@Component({
  components: {
    CreateEditModal,
  },
})
export default class CreateEditMailTemplate extends CreateEditModal<MailTemplate> {
  mailTemplateApi = new MailTemplateApi();
  get title(): string {
    return this.createObject
      ? "Mail-Template erstellen"
      : "Mail-Template aktualisieren";
  }
}
</script>
