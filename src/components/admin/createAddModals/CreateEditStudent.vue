<template>
  <CreateEditModal
    :addCalback="studentApi.create"
    :editCalback="studentApi.update"
    :id="partialObject.email"
    :createObject="createObject"
    :partialObject="partialObject"
    @addToRow="(student) => $emit('addToRow', student)"
    @editInRow="(student) => $emit('editInRow', student)"
    @close="$emit('close')"
  >
    <template #title>{{ title }}</template>
    <template #body>
      <b-field label="E-Mail">
        <b-input
          type="email"
          v-model="partialObject.email"
          v-if="createObject"
          required
        ></b-input>
        <b-input
          type="email"
          :placeholder="partialObject.email"
          :disabled="createObject"
          v-else
        ></b-input>
      </b-field>

      <b-field label="Vor- und Nachname">
        <b-input v-model="partialObject.name" required></b-input>
      </b-field>

      <b-field label="Credits PA-Dispensation">
        <b-numberinput
          v-model="partialObject.paDispensation"
          min="0"
          max="6"
          step="6"
          type="is-info"
        ></b-numberinput>
      </b-field>

      <b-field label="Credits WPM-Dispensation">
        <b-numberinput
          v-model="partialObject.wpmDispensation"
          min="0"
          max="8"
          step="4"
          type="is-info"
        ></b-numberinput>
      </b-field>

      <b-field label="Klasse">
        <b-input v-model="partialObject.class" required></b-input>
      </b-field>

      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <b-field label="Zweite Modulwahl">
              <b-checkbox v-model="partialObject.secondElection"></b-checkbox>
            </b-field>
          </div>

          <div class="level-item">
            <b-field label="Teilzeitstudent">
              <b-checkbox v-model="partialObject.tz"></b-checkbox>
            </b-field>
          </div>

          <div class="level-item">
            <b-field label="Internationales Profil">
              <b-checkbox v-model="partialObject.ip"></b-checkbox>
            </b-field>
          </div>
        </div>
      </div>
    </template>
  </CreateEditModal>
</template>

<script lang="ts">
import StudentApi from "@/mixins/StudentApi";
import Student from "@/models/student";
import { Component } from "vue-property-decorator";
import CreateEditModal from "./CreateEditModal.vue";

@Component({
  components: {
    CreateEditModal,
  },
})
export default class CreateUser extends CreateEditModal<Student> {
  studentApi = new StudentApi();
  get title(): string {
    return this.createObject ? "Benutzer erstellen" : "Benutzer aktualisieren";
  }
}
</script>
