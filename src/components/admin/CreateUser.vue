<template>
  <div class="modal-card" style="with: auto">
    <header class="modal-card-header">
      <p class="modal-card-title">Benutzer erstellen</p>
    </header>
    <section class="modal-card-body">
      <b-field :label="form.name" v-for="(form, index) of formData" :key="index">
      <b-input v-model="user[form.param]" :type="form.type"></b-input>
      </b-field>
      <b-button type="is-success" @click.native="createUser">Erstellen</b-button>
    </section>
  </div>
</template>

<script lang="ts">
import Student from "@/models/student";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class CreateUser extends Vue {
  user: Partial<Student> = {};
  formData = [
    {
      name: "E-Mail",
      param: "email",
      type: "email",
    },
    {
      name: "Vor- und Nachname",
      param: "name",
      type: "text",
    },
    {
      name: "Credits PA-Dispensation",
      param: "paDispensation",
      type: "number",
    },
    {
      name: "Credits WPM-Dispensation",
      param: "wpmDispensation",
      type: "number",
    },
    {
      name: "Zweite Modulvorwahl",
      param: "secondElection",
      type: "text",
    },
    {
      name: "Teilzeitstudent",
      param: "tz",
      type: "text",
    },
    {
      name: "Internationales Profil",
      param: "ip",
      type: "text",
    },
    {
      name: "Klasse",
      param: "class",
      type: "text",
    },
  ];

  async createUser(): Promise<void> {
    try {
      (await Vue.axios.post("/students", this.user)).data;
    } catch (e) {
      console.error(e);
      return;
    }
    this.$buefy.notification.open({
      type: "is-success",
      hasIcon: true,
      icon: "check",
      message: "Der Benutzer wurde erfolgreich erstellt",
      duration: 5000,
    });
  }
}
</script>