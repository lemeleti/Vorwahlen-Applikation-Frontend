<template>
  <div>
    <h1 class="title">Administration</h1>
    <b-tabs type="is-boxed" v-model="activeTab">
      <b-tab-item label="Seitentexte" icon="file-alt"> </b-tab-item>
      <b-tab-item label="Studentenverwaltung" icon="user">
        <StudentAdministration />
      </b-tab-item>
      <b-tab-item label="Modulverwaltung" icon="square">
        <ModuleAdministration />
      </b-tab-item>
      <b-tab-item label="Wahlverwaltung" icon="vote-yea">
        <ModuleElectionAdministration />
      </b-tab-item>
      <b-tab-item label="Mail-Template-Verwaltung" icon="inbox">
        <MailTemplateAdministration />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import StudentAdministration from "@/components/admin/administrationComponents/StudentAdministration.vue";
import ModuleAdministration from "@/components/admin/administrationComponents/ModuleAdministration.vue";
import MailTemplateAdministration from "@/components/admin/administrationComponents/MailTemplateAdministration.vue";
import ModuleElectionAdministration from "@/components/admin/administrationComponents/ModuleElectionAdministration.vue";

@Component({
  components: {
    StudentAdministration,
    ModuleAdministration,
    MailTemplateAdministration,
    ModuleElectionAdministration,
  },
})
export default class Admin extends Vue {
  activeTab = 0;
}
</script>
