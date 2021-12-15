<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Einrichtung</p>
    </header>

    <section class="modal-card-body">
      <p class="subtitle">
        Die Option kann nachträglich in den Einstellungen verändert werden
      </p>
      <b-field label="Belegen Sie das internationale Profil">
        <b-checkbox v-model="studentSetup.ip"></b-checkbox>
      </b-field>
    </section>

    <footer class="modal-card-foot">
      <b-button
        type="is-success"
        label="Bestätigen"
        @click.native="confirmSetup"
      />
    </footer>
  </div>
</template>

<script lang="ts">
import StudentApi from "@/mixins/StudentApi";
import Student from "@/models/student";
import StudentSetup from "@/models/studentSetup";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class SettingsModal extends Vue {
  @Prop() student!: Student;
  studentApi = new StudentApi();
  studentSetup: StudentSetup = {
    ip: false,
    firstTimeSetup: false,
  };

  async confirmSetup(): Promise<void> {
    try {
      await this.studentApi.updateStudentSetup(
        this.student.email,
        this.studentSetup,
        "Die Einrichtung wurde erfolgreich übernommen"
      );
    } catch (e) {
      // handled by error handler
    }
    this.$emit("close");
  }
}
</script>
