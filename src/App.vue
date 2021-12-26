<template>
  <div id="app">
    <Header />
    <!-- Content -->
    <div class="columns section">
      <div class="column main-content">
        <main class="container is-fullhd">
          <div class="tile box is-radiusless">
            <div id="includeContent" class="tile is-child">
              <router-view />
            </div>
          </div>
        </main>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import Header from "@/components/site/Header.vue";
import Footer from "@/components/site/Footer.vue";
import UserStore from "@/store/modules/UserStore";
import "vue-class-component/hooks";
import ModuleStore from "./store/modules/ModuleStore";
import SettingsModal from "@/components/SettingsModal.vue";
import Student from "./models/student";

@Component({
  components: {
    Header,
    Footer,
  },
})
export default class App extends Vue {
  userStore = getModule(UserStore);
  moduleStore = getModule(ModuleStore);

  async mounted(): Promise<void> {
    await this.userStore.initUserStore();
    this.moduleStore.initModuleSelection();
    this.moduleStore.updateModules();
    const student = this.userStore.student;
    if (this.userStore.isAuthenticated && student && student.firstTimeSetup) {
      this.setUpStudent(student);
    }
  }

  destroyed(): void {
    this.moduleStore.closeStompConnection();
  }

  setUpStudent(student: Student): void {
    this.$buefy.modal.open({
      component: SettingsModal,
      parent: this,
      hasModalCard: true,
      canCancel: false,
      props: { student },
    });
  }
}
</script>

<style lang="scss">
body {
  background-color: #f1f1f1;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.section {
  flex: 1;
}

.box-header,
.box-content {
  margin: 20px 20px 20px 20px;
}

main.section {
  padding-left: 0px;
  padding-right: 0px;
}
</style>
