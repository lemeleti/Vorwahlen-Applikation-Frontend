<template>
  <div>
    <div class="notification is-success" v-if="moduleStore.isElectionValid">
      Ihre Wahl ist gültig.
    </div>
    <div class="notification is-danger" v-if="!moduleStore.isElectionValid">
      Ihre Wahl ist derzeit ungültig.
    </div>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import "vue-class-component/hooks";
import { ModuleCategories } from "@/models/moduleList";
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
    let index = this.moduleStore.getModuleList.getHead();

    while (index) {
      if (index.semester === semester) {
        tiles.push({
          semester: index.semester,
          moduleName: index.moduleName,
          moduleColor: this.getColorForCategory(index.moduleCategorie),
        });
      }
      index = index.next;
    }

    return tiles;
  }

  private getColorForCategory(cat: ModuleCategories): string {
    let color = "";
    switch (cat) {
      case ModuleCategories.INTERDISCIPLINARY_MODULE:
      case ModuleCategories.SUBJECT_MODULE:
        color = "is-electiveModule";
        break;
      case ModuleCategories.CONTEXT_MODULE:
        color = "is-contextModule";
        break;
      case ModuleCategories.PROJEKT:
        color = "is-projectModule";
    }

    return color;
  }
}
</script>
