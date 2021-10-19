<template>
  <div id="content">
    <div id="konsekutiv-wrapper" class="content">
      <h1>Konsekutive Wahlpflichtmodule</h1>
      <p>
        Sie dürfen auch konsekutive Wahlpflichtmodul als einzelne Module
        besuchen. Sie müssen bis Studienende mindestens zweimal zwei konsekutive
        Module belegen. Anders ausgedrückt: Total vier solche Module, wobei je
        zwei konsekutiv sein müssen.
      </p>
      <p>
        Beachten Sie, dass die Module mit "1" im Herbstsemester und die Module
        mit "2" im Frühlingssemester stattfinden.
      </p>
      <p>
        <b>IT18 Teilzeit:</b> Wenn Sie im aktuellen Studienjahr schon zwei
        konsekutive Module belegt haben, wählen Sie mindestens einmal zwei
        konsekutive Module, ansonsten mindestens zweimal zwei konsekutive
        Module.
      </p>
      <p>
        <b>IT19 Teilzeit:</b> Wählen Sie bis zu zwei konsekutive Module
        (empfohlen: zwei Module). Achten Sie speziell auf die nötigen
        Vorkenntnisse der Module.
      </p>
      <p>
        <b>IT19 Vollzeit:</b> Wählen Sie mindestens zweimal zwei konsekutive
        Module
      </p>
      <div class="columns is-multiline" id="konsekutiv">
        <SubjectCard
          @showAdditionalSubjectInfo="showAdditionalSubjectInfo"
          v-for="(module, index) in this.moduleStore.getModules"
          :key="index"
          :title="`${module.module_title} (${module.language})`"
        />
      </div>
    </div>
    <hr />
    <SubjectInfoModal :title="modalTitle" :isModalActive.sync="isModalActive" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import SubjectCard from "@/components/SubjectCard.vue";
import SubjectInfoModal from "@/components/SubjectInfoModal.vue";
import ModuleList from "@/components/ModuleList.vue";
import ModuleStore from "@/store/modules/ModuleStore";
import "vue-class-component/hooks";

@Component({
  components: {
    SubjectCard,
    SubjectInfoModal,
    ModuleList,
  },
})
export default class Homepage extends Vue {
  modalTitle = "";
  isModalActive = false;
  moduleStore = getModule(ModuleStore);

  beforeMount(): void {
    this.moduleStore.initStore();
  }

  showAdditionalSubjectInfo(title: string): void {
    this.modalTitle = title;
    this.isModalActive = !this.isModalActive;
  }
}
</script>
