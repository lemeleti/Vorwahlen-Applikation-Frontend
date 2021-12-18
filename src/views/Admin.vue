<template>
  <div>
    <h1 class="title">Administration</h1>
    <b-tabs type="is-boxed" v-model="activeTab">
      <b-tab-item label="Seitentexte" icon="file-alt">
        <keep-alive>
          <PageText v-if="activeTab === 0" />
        </keep-alive>
      </b-tab-item>
      <b-tab-item label="Studentenverwaltung" icon="user">
        <keep-alive>
          <StudentAdministration v-if="activeTab === 1" />
        </keep-alive>
      </b-tab-item>
      <b-tab-item label="Modulverwaltung" icon="square">
        <keep-alive>
          <ModuleAdministration v-if="activeTab === 2" />
        </keep-alive>
      </b-tab-item>
      <b-tab-item label="Wahlverwaltung" icon="vote-yea">
        <keep-alive>
          <ModuleElectionAdministration v-if="activeTab === 3" />
        </keep-alive>
      </b-tab-item>
      <b-tab-item label="Mail-Template-Verwaltung" icon="inbox">
        <keep-alive>
          <MailTemplateAdministration v-if="activeTab === 4" />
        </keep-alive>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    StudentAdministration: () =>
      import(
        "@/components/admin/administrationComponents/StudentAdministration.vue"
      ),
    ModuleAdministration: () =>
      import(
        "@/components/admin/administrationComponents/ModuleAdministration.vue"
      ),
    MailTemplateAdministration: () =>
      import(
        "@/components/admin/administrationComponents/MailTemplateAdministration.vue"
      ),
    ModuleElectionAdministration: () =>
      import(
        "@/components/admin/administrationComponents/ModuleElectionAdministration.vue"
      ),
    PageText: () => import("@/components/admin/PageText.vue"),
  },
})
export default class Admin extends Vue {
  activeTab = 0;

  created(): void {
    document.title = "Admin Dashboard";
  }
}
</script>
