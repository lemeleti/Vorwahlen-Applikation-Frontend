<template>
  <div id="content">
    <b-message
      title="Hinweis für alle Studierende mit dem Internationalen Profil"
      type="is-info"
      has-icon icon="info"
      aria-close-label="Close message"
      v-if="userStore.isUserIP"
    >
      Bitte führen Sie die Modulvorwahl für das fünfte Semester ebenfalls durch,
      auch wenn Sie in diesem Semester als Outgoing eingetragen sind. Ausserdem
      müssen alle Studierende das Modul
      <strong>"Intercultural Communication and Management"</strong> belegen.
    </b-message>

    <ModuleElection v-if="userStore.isAuthenticated" />
    <div id="konsekutiv-wrapper" class="content">
      <div class="columns is-multiline" id="konsekutiv">
        <SubjectCard
          @showAdditionalSubjectInfo="showAdditionalSubjectInfo"
          v-for="(module, index) in this.moduleStore.getModules"
          :key="index"
          :title="`${module.moduleTitle} (${module.language})`"
          :moduleId="module.moduleNo"
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
import ModuleElection from "@/components/ModuleElection.vue";
import ModuleStore from "@/store/modules/ModuleStore";
import "vue-class-component/hooks";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import UserStore from "@/store/modules/UserStore";
import ElectionTansfer from "@/models/electionTransfer";

@Component({
  components: {
    SubjectCard,
    SubjectInfoModal,
    ModuleElection,
  },
})
export default class Homepage extends Vue {
  modalTitle = "";
  isModalActive = false;
  moduleStore: ModuleStore = getModule(ModuleStore);
  userStore: UserStore = getModule(UserStore);

  mounted(): void {
    if (!this.moduleStore.isClientConnected) {
      this.createConnection();
    }
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

  showAdditionalSubjectInfo(title: string): void {
    this.modalTitle = title;
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
