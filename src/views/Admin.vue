<template>
  <div id="content">
    <StudentAdministration />
    <hr />
    <ModuleAdministration />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import StudentAdministration from "@/components/admin/StudentAdministration.vue";
import ModuleAdministration from "@/components/admin/ModuleAdministration.vue";

@Component({
  components: {
    StudentAdministration,
    ModuleAdministration,
  },
})
export default class Admin extends Vue {}
</script>
