<template>
  <div id="content">
    <StudentAdministration />
    <hr />
    <ModuleAdministration />
    <hr />
    <MailTemplateAdministration />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import StudentAdministration from "@/views/StudentAdministration.vue";
import ModuleAdministration from "@/views/ModuleAdministration.vue";
import MailTemplateAdministration from "@/views/MailTemplateAdministration.vue";

@Component({
  components: {
    StudentAdministration,
    ModuleAdministration,
    MailTemplateAdministration,
  },
})
export default class Admin extends Vue {}
</script>
