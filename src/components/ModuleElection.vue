<template>
  <div>
    <TileBox v-for="semester in semesters" :key="semester">
      <template #title>{{ semester }}. Semester</template>
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
    <TileBox v-show="overflowedElectionTiles.length > 0">
      <template #title>Zu viel gewählte Module</template>
      <template #content>
        <div
          class="tile is-parent has-text-centered is-3"
          v-for="(tile, tileIndex) of overflowedElectionTiles"
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
      :class="electionStatusColor"
      v-if="
        userStore.isStudent &&
        moduleStore.isClientConnected &&
        userStore.student.canElect
      "
    >
      <p v-for="(reason, index) of electionStatus" :key="index">
        {{ reason }}
      </p>
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
import ElectionStatus from "@/models/electionStatus";
import ElectionStatusElement from "@/models/electionStatusElement";
import _ from "lodash";
import ModuleCategory from "@/models/moduleCategory";

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

  getTilesForSemester(semester: number): Array<ModuleTile> {
    const tiles: Array<ModuleTile> = [];

    if (this.moduleStore.getElectedModules) {
      const sortOrder = [
        ModuleCategory.CONTEXT_MODULE,
        ModuleCategory.PROJECT_MODULE,
        ModuleCategory.BACHELOR_MODULE,
        ModuleCategory.CONTEXT_MODULE,
        ModuleCategory.SUBJECT_MODULE,
        ModuleCategory.INTERDISCIPLINARY_MODULE,
      ];
      this.moduleStore.getElectedModules
        .filter((element) => element.semester % semester === 0)
        .sort(
          (el1, el2) =>
            sortOrder.indexOf(el1.category) - sortOrder.indexOf(el2.category)
        )
        .map((element) => this.electionStructureElementToTile(element))
        .forEach((tile) => tiles.push(tile));
    }

    return tiles;
  }

  get overflowedElectionTiles(): Array<ModuleTile> {
    const tiles: Array<ModuleTile> = [];
    if (this.moduleStore.getOverflowedModules) {
      this.moduleStore.getOverflowedModules
        .map((element) => this.electionStructureElementToTile(element))
        .forEach((tile) => tiles.push(tile));
    }
    return tiles;
  }

  get semesters(): Array<number> {
    const student = this.userStore.student;
    let semesters = [6, 5];
    if (student && student.tz && student.secondElection) {
      semesters = [8, 7];
    }
    return semesters;
  }

  electionStructureElementToTile(
    element: ElectionStructureElement
  ): ModuleTile {
    return {
      semester: element.semester,
      moduleName: element.name,
      moduleColor: this.moduleStore.getColorForCategory(element.category),
    };
  }

  get electionStatus(): Array<string> {
    const electionStatus: ElectionStatus = this.moduleStore.electionStatus;
    const reasons: Array<string> = [];
    if (electionStatus) {
      for (const value of Object.values(electionStatus)) {
        const validation = value as ElectionStatusElement;
        if (validation.reasons) {
          reasons.push(...validation.reasons);
        }
      }
    }

    if (reasons.length === 0 && this.moduleStore.isElectionValid) {
      reasons.push("Ihre Wahl ist im Moment gültig");
    }
    return reasons;
  }

  get electionStatusColor(): string {
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
