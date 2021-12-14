<template>
  <CreateEditModal
    :createObject="createObject"
    :partialObject="partialObject"
    :addCalback="$pageTextApi.create"
    :editCalback="$pageTextApi.update"
    :id="partialObject.id"
    @addToRow="(pageText) => $emit('addToRow', pageText)"
    @editInRow="(pageText) => $emit('editInRow', pageText)"
    @close="$emit('close')"
  >
    <template #title>{{ title }}</template>
    <template #body>
      <b-field label="Seite">
        <b-input v-model="partialObject.page" disabled></b-input>
      </b-field>

      <b-field label="Usertyp">
        <b-select v-model="partialObject.userType">
          <option value="ANONYMOUS">Anonym</option>
          <option value="FULL_TIME">Vollzeit</option>
          <option value="PART_TIME_FIRST_ELECTION">
            Teilzeit erste Vorwahl
          </option>
          <option value="PART_TIME_SECOND_ELECTION">
            Teilzeit zweite Vorwahl
          </option>
        </b-select>
      </b-field>

      <b-field label="IP Text?">
        <b-checkbox v-model="partialObject.isIpText"></b-checkbox>
      </b-field>

      <b-field label="Wo soll der Text angezeigt werden?">
        <b-select v-model="partialObject.textNumber">
          <option value="0">Header</option>
          <option value="1">Footer</option>
        </b-select>
      </b-field>

      <b-field label="Code" v-if="createObject">
        <b-input type="textarea" v-model="partialObject.text"></b-input>
      </b-field>
    </template>
  </CreateEditModal>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import CreateEditModal from "@/components/admin/createAddModals/CreateEditModal.vue";
import PageText from "@/models/pageText";

@Component({
  components: {
    CreateEditModal,
  },
})
export default class CreateEditPageText extends CreateEditModal<PageText> {
  get title(): string {
    return this.createObject
      ? "Seitentext erstellen"
      : "Seitentext aktualisieren";
  }
}
</script>
