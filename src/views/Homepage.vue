<template>
  <div id="content">
    <ModuleElection v-if="userStore.isAuthenticated" />
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

interface Election {
  electionSaved: boolean;
  electionValid: boolean;
}

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
      stomp.subscribe("/user/queue/electionSaveStatus", this.saveStatus);
    });
    this.moduleStore.setStompClient(stomp);
  }

  showAdditionalSubjectInfo(title: string): void {
    this.modalTitle = title;
    this.isModalActive = !this.isModalActive;
  }

  saveStatus(message: Stomp.Message): void {
    const election: Election = JSON.parse(message.body);
    this.moduleStore.updateElectionStatus(election.electionValid);
    this.$buefy.toast.open({
      message: "Ihre Auswahl wurde gespeichert",
      duration: 2000,
      type: "is-info",
    });
  }
}
</script>
