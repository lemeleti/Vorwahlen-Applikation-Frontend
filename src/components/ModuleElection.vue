<template>
  <div>
    <TileBox v-for="semester in semesters" :key="semester">
      <template #title>{{ semester + getSemesterOffset() }}. Semester</template>
      <template #content>
        <div
          class="tile is-parent has-text-centered is-3"
          v-for="(tile, tileIndex) of getTilesForSemester(semester)"
          :key="tileIndex"
        >
          <div
            class="tile is-child notification is-radiusless"
            :class="tile.moduleColor"
            style="color: black; min-height: 100px"
          >
            {{ tile.moduleName }}
          </div>
        </div>
      </template>
    </TileBox>
    <TileBox v-show="getTileForOverflowedModules().length > 0">
      <template #title>Zu viel gewählte Module</template>
      <template #content>
        <div
          class="tile is-parent has-text-centered is-3"
          v-for="(tile, tileIndex) of getTileForOverflowedModules()"
          :key="tileIndex"
        >
          <div
            class="tile is-child notification is-radiusless"
            :class="tile.moduleColor"
            style="color: black; min-height: 100px"
          >
            {{ tile.moduleName }}
          </div>
        </div>
      </template>
    </TileBox>
    <div
      class="box notification election-status is-radiusless"
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
import { getModule } from "vuex-module-decorators";
import UserStore from "@/store/modules/UserStore";
import ModuleStore from "@/store/modules/ModuleStore";
import TileBox from "@/components/TileBox.vue";
import ElectionStructureElement from "@/models/electionStructureElement";

interface ModuleTile {
  moduleName: string;
  moduleColor: string;
  semester: number;
}

@Component({
  components: {
    TileBox,
  },
})
export default class ModuleElection extends Vue {
  moduleStore: ModuleStore = getModule(ModuleStore);
  userStore: UserStore = getModule(UserStore);

  semesters: Array<number> = [2, 1];

  private getTilesForSemester(semester: number): Array<ModuleTile> {
    const tiles: Array<ModuleTile> = [];
    semester += this.getSemesterOffset();

    if (this.moduleStore.getElectedModules) {
      this.moduleStore.getElectedModules
        .filter((element) => element.semester === semester)
        .map((element) => this.electionStructureElementToTile(element))
        .forEach((tile) => tiles.push(tile));
    }

    return tiles;
  }

  private getTileForOverflowedModules(): Array<ModuleTile> {
    const tiles: Array<ModuleTile> = [];
    if (this.moduleStore.getOverflowedModules) {
      this.moduleStore.getOverflowedModules
        .map((element) => this.electionStructureElementToTile(element))
        .forEach((tile) => tiles.push(tile));
    }
    return tiles;
  }

  private getSemesterOffset(): number {
    return this.userStore.isUserTZ && this.userStore.isSecondElection ? 6 : 4;
  }

  private electionStructureElementToTile(
    element: ElectionStructureElement
  ): ModuleTile {
    return {
      semester: element.semester,
      moduleName: element.name,
      moduleColor: this.moduleStore.getColorForCategory(element.category),
    };
  }

  private getElectionStatus(): string {
    let text = "Ihre Auswahl ist im Moment nicht gültig.";
    if (this.moduleStore.isElectionValid) {
      text = "Ihre Auswahl ist gültig.";
    }
    return text;
  }

  private getElectionStatusColor(): string {
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
