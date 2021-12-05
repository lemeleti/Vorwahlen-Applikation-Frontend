<template>
  <div class="modal-card" style="with: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ title }}</p>
    </header>
    <section class="modal-card-body">
      <b-field label="E-Mail">
        <b-input
          type="email"
          v-model="student.email"
          v-if="createStudent"
        ></b-input>
        <b-input
          type="email"
          :placeholder="student.email"
          :disabled="createStudent"
          v-else
        ></b-input>
      </b-field>

      <b-field label="Vor- und Nachname">
        <b-input v-model="student.name"></b-input>
      </b-field>

      <b-field label="Credits PA-Dispensation">
        <b-input v-model="student.paDispensation" type="number"></b-input>
      </b-field>

      <b-field label="Credits WPM-Dispensation">
        <b-input v-model="student.wpmDispensation" type="number"></b-input>
      </b-field>

      <b-field label="Klasse">
        <b-input v-model="student.class"></b-input>
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
    </section>
    <footer class="modal-card-foot">
      <b-button
        type="is-success"
        :label="createStudent ? 'Erstellen' : 'Aktualisieren'"
        @click.native="createStudent ? addStudent() : updateStudent()"
      />
      <b-button label="Abbrechen" @click="$emit('close')" />
    </footer>
  </div>
</template>

<script lang="ts">
import Student from "@/models/student";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class CreateUser extends Vue {
  @Prop() student!: Partial<Student>;
  @Prop() createStudent!: boolean;

  get title(): string {
    return this.createStudent ? "Benutzer erstellen" : "Benutzer aktualisieren";
  }

  async addStudent(): Promise<void> {
    try {
      (await Vue.axios.post("/students", this.student)).data;
    } catch (e) {
      console.error(e);
      return;
    }
    this.sendNotification("Der Benutzer wurde erfolgreich erstellt");
    this.$emit("close");
  }

  async updateStudent(): Promise<void> {
    try {
      (await Vue.axios.put(`/students/${this.student.email}`, this.student))
        .data;
    } catch (e) {
      console.error(e);
      return;
    }
    this.sendNotification("Der Benutzer wurde erfolgreich aktualisiert");
    this.$emit("close");
  }

  sendNotification(message: string): void {
    this.$buefy.notification.open({
      type: "is-success",
      hasIcon: true,
      icon: "check",
      message: message,
      duration: 5000,
    });
  }
}
</script>
