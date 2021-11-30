<template>
  <div>
    <div class="tile is-ancestor is-vertical is-flex-wrap-wrap">
      <div
        class="tile notification is-vertical is-radiusless"
        v-for="semester in 2"
        :key="semester"
      >
        <div class="tile is-flex-wrap-wrap is-justify-content-start">
          <div
            class="tile is-parent has-text-centered is-3"
            v-for="(tile, tileIndex) of getTilesForSemester(semester)"
            :key="tileIndex"
          >
            <div
              class="tile is-child notification is-radiusless"
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
    if (this.moduleStore.getElectedModules) {
      for (const element of this.moduleStore.getElectedModules) {
        if (element.semester === semester) {
          tiles.push({
            semester: element.semester,
            moduleName: element.name,
            moduleColor: this.getColorForCategory(element.category),
          });
        }
      }
    }

    return tiles;
  }

  public getElectionStatus(): string {
      moduleColor: this.moduleStore.getColorForCategory(element.category),
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
