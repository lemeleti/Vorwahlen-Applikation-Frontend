<template>
  <div id="content">
    <div class="block">
      <span v-html="headerText"></span>
      <hr />
    </div>
    <div
      v-if="userStore.isAuthenticated && student && student.canElect"
      class="block"
    >
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
            :semester="module.semester"
            @moreInfo="showAdditionalSubjectInfo(module)"
          >
            <template #title>{{
              module.language === "Englisch"
                ? module.moduleTitle.concat(" (E)")
                : module.moduleTitle
            }}</template>
          </Module>
        </template>
      </TileBox>
      <SubjectInfoModal
        :module="selectedModule"
        :isModalActive.sync="isModalActive"
      />
    </div>
    <div class="block">
      <hr />
      <span v-html="footerText"></span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
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
import PageText from "@/models/pageText";
import PageTextApi from "@/mixins/PageTextApi";

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
  headerText = "";
  footerText = "";

  beforeMount(): void {
    this.setSiteTexts();
  }

  get student(): Student | null {
    return this.userStore.student;
  }

  @Watch("userStore.isStoreInitialized")
  async onUserStoreInitialization(): Promise<void> {
    if (this.userStore.isStoreInitialized) {
      await this.setSiteTexts();
    }
  }

  @Watch("userStore.isStudent")
  onStudentLogin(): void {
    if (
      this.userStore.student &&
      this.userStore.student.canElect &&
      !this.moduleStore.isClientConnected
    ) {
      this.moduleStore.createConnection();
    }
  }

  toggleCategory(index: number): void {
    this.$set(this.openCategories, index, !this.openCategories[index]);
  }

  async setSiteTexts(): Promise<void> {
    let texts: Array<PageText> = [];
    const api = new PageTextApi();
    try {
      if (this.userStore.isAuthenticated && this.userStore.student) {
        const student = this.userStore.student;
        if (student.tz && student.secondElection) {
          texts = await api.getPartTimeSecondElectionText();
        } else if (student.tz) {
          texts = await api.getPartTimeFirstElection();
        } else {
          texts = await api.getFullTimePageText();
        }
      } else if (
        (this.userStore.isAuthenticated && !this.userStore.isStudent) ||
        !this.userStore.isAuthenticated
      ) {
        texts = await api.getAnonymousPageText();
      }
    } catch (e) {
      const error = {
        text: "<h1 class='title'>Es konnten keine Daten aus dem Backend empfangen werden</h1>",
        textNumber: 0,
      };
      texts.push(error as PageText);
      // already treated by error handler
    }
    const header = texts.find((text) => text.textNumber === 0);
    const footer = texts.find((text) => text.textNumber === 1);
    if (header) this.headerText = header.text;
    if (footer) this.footerText = footer.text;
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
