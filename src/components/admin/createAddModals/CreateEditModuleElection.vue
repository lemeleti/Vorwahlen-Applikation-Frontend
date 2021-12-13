<template>
  <CreateEditModal
    :createMode="createModuleElection"
    @add="addModuleElection"
    @update="updateModuleElection"
    @close="$emit('close')"
  >
    <template #title>{{ title }}</template>
    <template #body>
      <b-field label="Studenten Mail-Adresse">
        <b-input v-model="moduleElection.studentEmail" required></b-input>
      </b-field>

      <b-field label="Gewählte Module">
        <b-taginput
          v-model="electedModules"
          placeholder="Modulvorwahl hinzufügen"
          autocomplete
          :data="filteredModules"
          field="moduleTitle"
          @typing="getFilteredModules"
          open-on-focus
        >
        </b-taginput>
      </b-field>

      <b-field label="Ist die Modulvorwahl gültig?">
        <b-checkbox
          v-model="moduleElection.electionValid"
          required
        ></b-checkbox>
      </b-field>
    </template>
  </CreateEditModal>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import CreateEditModal from "@/components/admin/createAddModals/CreateEditModal.vue";
import ModuleElection from "@/models/moduleElection";
import { getModule } from "vuex-module-decorators";
import ModuleStore from "@/store/modules/ModuleStore";
import Module from "@/models/module";

@Component({
  components: {
    CreateEditModal,
  },
})
export default class CreateEditModuleElection extends CreateEditModal {
  @Prop() moduleElection!: Partial<ModuleElection>;
  @Prop() createModuleElection!: boolean;
  moduleStore: ModuleStore = getModule(ModuleStore);
  filteredModules: Array<Module> = [];

  get title(): string {
    return this.createModuleElection
      ? "Modulvorwahl erstellen"
      : "Modulvorwahl aktualisieren";
  }

  get electedModules(): Array<Module> {
    const electedModules: Array<Module> = [];
    if (this.moduleElection.electedModules) {
      this.moduleElection.electedModules.forEach((moduleNo: string) => {
        const module = this.moduleStore.getModules.find(
          (m) => m.moduleNo === moduleNo
        );
        if (module) {
          electedModules.push(module);
        }
      });
    }
    return electedModules;
  }

  set electedModules(modules: Array<Module>) {
    if (this.moduleElection.electedModules) {
      this.moduleElection.electedModules = modules.map(
        (module: Module) => module.moduleNo
      );
    }
  }

  getFilteredModules(text: string): void {
    this.filteredModules = this.moduleStore.getModules.filter(
      (module: Module) => {
        return (
          module.moduleTitle.toLowerCase().indexOf(text.toLowerCase()) >= 0
        );
      }
    );
  }

  async addModuleElection(): Promise<void> {
    this.moduleElection.electedModules = this.electedModules.map(
      (module: Module) => module.moduleNo
    );
    try {
      await this.$moduleElectionApi.create(
        this.moduleElection as ModuleElection,
        "Die Modulvorwahl wurde erfolgreich erstellt"
      );
    } catch (e) {
      /* */
    }
  }

  updateModuleElection(): void {
    this.moduleElection.electedModules = this.electedModules.map(
      (module: Module) => module.moduleNo
    );
    if (this.moduleElection.id) {
      this.$moduleElectionApi.update(
        this.moduleElection as ModuleElection,
        this.moduleElection.id.toString(),
        "Die Modulvorwahl wurde erfolgreich aktualisiert"
      );
    }
  }
}
</script>
