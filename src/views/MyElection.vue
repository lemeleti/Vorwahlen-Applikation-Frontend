<template>
  <div>
    <h1 class="title">Ihre Modulvorwahlen</h1>
    <div class="section">
      <ModuleElection />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ModuleElection from "@/components/ModuleElection.vue";

@Component({
  components: {
    ModuleElection,
  },
})
export default class MyElection extends Vue {}
</script>
