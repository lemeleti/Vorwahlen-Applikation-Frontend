<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Studenten benachrichtigen</p>
    </header>

    <section class="modal-card-body">
      <b-field label="Sender E-Mail">
        <b-input
          type="email"
          placeholder="fame@zhaw.ch"
          ref="senderMail"
          v-model="studentNotification.email"
          required
        >
        </b-input>
      </b-field>

      <b-field label="Empfänger Adressen">
        <b-taginput
          placeholder="Mail-Adresse hinzufügen"
          v-model="studentNotification.studentMailAddresses"
          attached
        ></b-taginput>
      </b-field>

      <b-field label="Passwort">
        <b-input
          type="password"
          ref="password"
          v-model="studentNotification.password"
          password-reveal
          required
        >
        </b-input>
      </b-field>

      <b-field label="Betreff">
        <b-input
          v-model="studentNotification.subject"
          ref="subject"
          required
        ></b-input>
      </b-field>

      <b-field label="Nachricht">
        <b-input
          type="textarea"
          v-model="studentNotification.message"
          ref="message"
          required
        ></b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <b-button
        label="Senden"
        icon-left="paper-plane"
        type="is-info"
        @click="sendNotification"
      />

      <b-button label="Abbrechen" @click="$emit('close')" />
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import StudentNotification from "@/models/studentNotification";
import { AxiosResponse } from "axios";

@Component
export default class StudentNotify extends Vue {
  @Prop() studentNotification!: Partial<StudentNotification>;

  async sendNotification(): Promise<void> {
    const response: AxiosResponse<void> = (
      await Vue.axios.post("/students/notify", this.studentNotification)
    ).data;
    if (response.status) {
      this.$buefy.notification.open({
        message: "Nachricht wurde erfolgreich versendet",
        type: "is-success",
        icon: "check",
        hasIcon: true,
        duration: 5000,
      });
    }
    this.$emit("close");
  }
}
</script>
