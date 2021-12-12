<template>
  <div id="content">
    <div v-if="userStore.isUserAuthenticated && userStore.isStudent">
      <b-message
        title="Hinweis für alle Studierende mit dem Internationalen Profil"
        type="is-info"
        has-icon
        icon="info"
        aria-close-label="Close message"
        v-if="userStore.isUserIP"
      >
        Bitte führen Sie die Modulvorwahl für das fünfte Semester ebenfalls
        durch, auch wenn Sie in diesem Semester als Outgoing eingetragen sind.
        Ausserdem müssen alle IP-Studierende das Modul
        <b>"Intercultural Communication and Management"</b> belegen.
      </b-message>
      <ModuleElection v-if="userStore.isAuthenticated" />
      <hr />
      <TileBox
        v-for="(description, category, index) in getElectionCategoryMap()"
        :key="index"
      >
        <template #title>{{ description }}</template>
        <template #content>
          <Module
            v-for="(module, moduleIndex) of getModulesByCategory(category)"
            :key="moduleIndex"
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
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import UserStore from "@/store/modules/UserStore";
import ElectionTansfer from "@/models/electionTransfer";
import Module from "@/components/Module.vue";
import IModule from "@/models/module";
import ModuleCategory from "@/models/moduleCategory";

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

  mounted(): void {
    if (!this.moduleStore.isClientConnected) {
      this.createConnection();
    }
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

  createConnection(): void {
    const socket: WebSocket = new SockJS("/api/stomp-ws-endpoint");
    const stomp: Stomp.Client = Stomp.over(socket);
    stomp.connect({}, () => {
      stomp.subscribe(
        "/user/queue/electionSaveStatus",
        this.updateElectionInformation
      );
    });
    this.moduleStore.setStompClient(stomp);
  }

  showAdditionalSubjectInfo(module: Module): void {
    this.selectedModule = module;
    this.isModalActive = !this.isModalActive;
  }

  updateElectionInformation(message: Stomp.Message): void {
    const electionData: ElectionTansfer = JSON.parse(message.body);
    this.moduleStore.setElectionData(electionData);
    this.$buefy.notification.open({
      hasIcon: true,
      type: "is-success",
      ariaCloseLabel: "Benachrichtigung schliessen",
      message: "Ihre Modulvorwahl wurde erfolgreich gespeichert",
      icon: "check",
      iconPack: "fa",
    });
  }
}
</script>
