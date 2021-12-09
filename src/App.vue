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

      <div class="right-sidemenu" v-if="this.$route.name === 'Home'">
        <RightMenu />
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
import RightMenu from "@/components/RightMenu.vue";
import UserStore from "@/store/modules/UserStore";
import "vue-class-component/hooks";
import ModuleStore from "./store/modules/ModuleStore";

@Component({
  components: {
    Header,
    Footer,
    RightMenu,
  },
})
export default class App extends Vue {
  userStore = getModule(UserStore);
  moduleStore = getModule(ModuleStore);

  async mounted(): Promise<void> {
    await this.userStore.fetchUserData();
    if (this.userStore.isUserAuthenticated && this.userStore.isFirstTimeSetup) {
      await this.setUpStudent();
    }
  }

  created(): void {
    this.moduleStore.initModuleSelection();
    this.moduleStore.updateModules();
  }

  setUpStudent(): void {
    Vue.swal({
      title: "Benutzereinrichtung",
      showCancelButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: "Einrichtung abschliessen",
      allowEnterKey: false,
      icon: "question",
      input: "select",
      inputOptions: {
        isIp: "Ich belege das internationale Profil",
        isNotIp: "Ich belege das internationale Profil nicht",
      },
      inputLabel:
        "Bitte wählen Sie aus, ob Sie das internationale Profil haben",
      inputValidator: (value: string) => this.handleSetUpSelection(value),
    });
  }

  async handleSetUpSelection(value: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const id = this.userStore.email;
        const patchData = { firstTimeSetup: false, ip: false };
        if (value === "isIp") {
          this.userStore.setIp(true);
          patchData.ip = true;
          Vue.axios.patch(`/students/${id}`, patchData);
        }
        Vue.axios.patch(`/students/${id}`, patchData);
        resolve("");
      } catch (e) {
        reject(e);
      }
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
