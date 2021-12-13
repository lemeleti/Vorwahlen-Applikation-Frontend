<template>
  <div id="content">
    <div>
      <span v-html="getHeaderSiteText()"></span>
    </div>
    <div v-if="userStore.isAuthenticated && student">
      <b-message
        title="Hinweis für alle Studierende mit dem Internationalen Profil"
        type="is-info"
        has-icon
        icon="info"
        aria-close-label="Close message"
        v-if="student.ip"
      >
        Bitte führen Sie die Modulvorwahl für das fünfte Semester ebenfalls
        durch, auch wenn Sie in diesem Semester als Outgoing eingetragen sind.
        Ausserdem müssen alle IP-Studierende das Modul
        <b>"Intercultural Communication and Management"</b> belegen.
      </b-message>
      <ModuleElection />
      <hr />
      <TileBox
        v-for="(description, category, index) in getElectionCategoryMap()"
        :key="category"
      >
        <template #title>
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                {{ description }}
              </div>
            </div>

            <div class="level-right">
              <div class="level-item">
                <b-button
                  :label="openCategories[index] ? 'Ausblenden' : 'Einblenden'"
                  :icon-left="
                    openCategories[index] ? 'chevron-down' : 'chevron-right'
                  "
                  type="is-ghost"
                  @click.native="toggleCategory(index)"
                />
              </div>
            </div>
          </div>
        </template>

        <template #content v-if="openCategories[index]">
          <Module
            v-for="module of getModulesByCategory(category)"
            :key="module.moduleNo"
            :color="moduleStore.getColorForCategory(module.category)"
            :moduleNo="module.moduleNo"
            @moreInfo="showAdditionalSubjectInfo(module)"
          >
            <template #title>{{ module.moduleTitle }}</template>
          </Module>
        </template>
      </TileBox>
      <SubjectInfoModal
        :module="selectedModule"
        :isModalActive.sync="isModalActive"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import SubjectInfoModal from "@/components/SubjectInfoModal.vue";
import ModuleElection from "@/components/ModuleElection.vue";
import TileBox from "@/components/TileBox.vue";
import ModuleStore from "@/store/modules/ModuleStore";
import "vue-class-component/hooks";
import UserStore from "@/store/modules/UserStore";
import Module from "@/components/Module.vue";
import IModule from "@/models/module";
import ModuleCategory from "@/models/moduleCategory";
import Student from "@/models/student";

interface ElectionCategoryMap {
  [index: string]: string;
}

@Component({
  components: {
    SubjectInfoModal,
    ModuleElection,
    TileBox,
    Module,
  },
})
export default class Homepage extends Vue {
  selectedModule: Module | null = null;
  isModalActive = false;
  moduleStore: ModuleStore = getModule(ModuleStore);
  userStore: UserStore = getModule(UserStore);
  openCategories = [true, true, true, true];

  mounted(): void {
    if (!this.moduleStore.isClientConnected) {
      this.moduleStore.createConnection();
    }
  }

  get student(): Student | null {
    return this.userStore.student;
  }

  toggleCategory(index: number): void {
    this.$set(this.openCategories, index, !this.openCategories[index]);
  }

  getHeaderSiteText(): string {
    let text = "";
    const student = this.userStore.student;
    if (student) {
      if (student.tz && student.secondElection) {
        text = "";
      } else if (student.tz) {
        text = "";
      } else {
        text = "";
      }
    }
    return text;
  }

  getElectionCategoryMap(): ElectionCategoryMap {
    const electionCategoryMap: ElectionCategoryMap = {};
    electionCategoryMap[ModuleCategory.CONSECUTIVE_MODULE] =
      "Konsekutive Wahlpflichtmodule";
    electionCategoryMap[ModuleCategory.SUBJECT_MODULE] =
      "Fachliche Wahlpflichtmodule";
    electionCategoryMap[ModuleCategory.INTERDISCIPLINARY_MODULE] =
      "Überfachliche Wahlpflichtmodule";
    electionCategoryMap[ModuleCategory.CONTEXT_MODULE] =
      "Kontext Wahlpflichtmodule";

    return electionCategoryMap;
  }

  getModulesByCategory(category: ModuleCategory): Array<IModule> {
    let modules: Array<IModule> = [];
    const filteredModules = this.moduleStore.getModules.filter(
      (module: IModule) =>
        module.category === category && module.consecutiveModuleNo === ""
    );
    if (filteredModules.length > 0) {
      modules = filteredModules;
    } else {
      modules = this.moduleStore.getModules.filter(
        (module: IModule) => module.consecutiveModuleNo !== ""
      );
    }
    return modules;
  }

  showAdditionalSubjectInfo(module: Module): void {
    this.selectedModule = module;
    this.isModalActive = !this.isModalActive;
  }
}
</script>
