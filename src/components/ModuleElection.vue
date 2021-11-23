<template>
  <div>
    <div class="tile is-ancestor is-vertical">
      <div
        class="tile notification is-vertical is-radiusless"
        v-for="semester in 2"
        :key="semester"
      >
        <div class="tile">
          <div
            class="tile is-parent has-text-centered"
            v-for="(tile, tileIndex) of getTilesForSemester(semester)"
            :key="tileIndex"
          >
            <div
              class="is-child notification is-radiusless"
              :class="tile.moduleColor"
              style="color: black"
            >
              {{ tile.moduleName }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="box notification election-status"
      :class="getElectionStatusColor()"
      v-if="userStore.isUserAuthenticated"
    >
      {{ getElectionStatus() }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import "vue-class-component/hooks";
import ModuleCategory from "@/models/moduleCategory";
import { getModule } from "vuex-module-decorators";
import UserStore from "@/store/modules/UserStore";
import ModuleStore from "@/store/modules/ModuleStore";

interface ModuleTile {
  moduleName: string;
  moduleColor: string;
  semester: number;
}

@Component
export default class ModuleElection extends Vue {
  moduleStore: ModuleStore = getModule(ModuleStore);
  userStore: UserStore = getModule(UserStore);

  public getTilesForSemester(semester: number): Array<ModuleTile> {
    semester += 4;

    const tiles: Array<ModuleTile> = [];
    if (this.moduleStore.getModuleList) {
      let index = this.moduleStore.getModuleList.getHead();

      while (index) {
        if (index.semester === semester) {
          tiles.push({
            semester: index.semester,
            moduleName: index.moduleName,
            moduleColor: this.getColorForCategory(index.moduleCategory),
          });
        }
        index = index.next;
      }
    }

    return tiles;
  }

  public getElectionStatus(): string {
    let text = "Ihre Auswahl ist im Moment nicht gültig.";
    if (this.moduleStore.isElectionValid) {
      text = "Ihre Auswahl ist gültig.";
    }
    return text;
  }

  public getElectionStatusColor(): string {
    let color = "is-warning";
    if (this.moduleStore.isElectionValid) {
      color = "is-success";
    }
    return color;
  }

  private getColorForCategory(cat: ModuleCategory): string {
    let color = "";
    switch (cat) {
      case ModuleCategory.INTERDISCIPLINARY_MODULE:
      case ModuleCategory.SUBJECT_MODULE:
        color = "is-electiveModule";
        break;
      case ModuleCategory.CONTEXT_MODULE:
        color = "is-contextModule";
        break;
      case ModuleCategory.PROJECT_MODULE:
      case ModuleCategory.BACHELOR_MODULE:
        color = "is-projectModule";
        break;
      case ModuleCategory.DISPENSED_PA_MODULE:
      case ModuleCategory.DISPENSED_WPM_MODULE:
        color = "is-info";
        break;
    }

    return color;
  }
}
</script>

<style>
.election-status {
  position: fixed !important;
  right: 5px;
  bottom: 5px;
  z-index: 1;
}
</style>
