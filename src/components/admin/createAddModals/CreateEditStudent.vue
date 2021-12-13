<template>
  <CreateEditModal
    :createMode="createStudent"
    :addCalback="$studentApi.create"
    :editCalback="$studentApi.update"
    :createEditObject="student"
    :id="student.email"
    @addToRow="(student) => $emit('addToRow', student)"
    @editInRow="(student) => $emit('editInRow', student)"
    @close="$emit('close')"
  >
    <template #title>{{ title }}</template>
    <template #body>
      <b-field label="E-Mail">
        <b-input
          type="email"
          v-model="student.email"
          v-if="createStudent"
          required
        ></b-input>
        <b-input
          type="email"
          :placeholder="student.email"
          :disabled="createStudent"
          v-else
        ></b-input>
      </b-field>

      <b-field label="Vor- und Nachname">
        <b-input v-model="student.name" required></b-input>
      </b-field>

      <b-field label="Credits PA-Dispensation">
        <b-numberinput
          v-model="student.paDispensation"
          min="0"
          max="6"
          step="6"
          type="is-info"
        ></b-numberinput>
      </b-field>

      <b-field label="Credits WPM-Dispensation">
        <b-numberinput
          v-model="student.wpmDispensation"
          min="0"
          max="8"
          step="4"
          type="is-info"
        ></b-numberinput>
      </b-field>

      <b-field label="Klasse">
        <b-input v-model="student.class" required></b-input>
      </b-field>

      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <b-field label="Zweite Modulwahl">
              <b-checkbox v-model="student.secondElection"></b-checkbox>
            </b-field>
          </div>

          <div class="level-item">
            <b-field label="Teilzeitstudent">
              <b-checkbox v-model="student.tz"></b-checkbox>
            </b-field>
          </div>

          <div class="level-item">
            <b-field label="Internationales Profil">
              <b-checkbox v-model="student.ip"></b-checkbox>
            </b-field>
          </div>
        </div>
      </div>
    </template>
  </CreateEditModal>
</template>

<script lang="ts">
import Student from "@/models/student";
import { Component, Prop } from "vue-property-decorator";
import CreateEditModal from "./CreateEditModal.vue";

@Component({
  components: {
    CreateEditModal,
  },
})
export default class CreateUser extends CreateEditModal<Student> {
  @Prop() student!: Partial<Student>;
  @Prop() createStudent!: boolean;

  get title(): string {
    return this.createStudent ? "Benutzer erstellen" : "Benutzer aktualisieren";
  }
}
</script>
