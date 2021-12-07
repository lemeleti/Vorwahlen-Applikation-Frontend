<template>
  <section>
    <h1 class="title">
      <slot name="title">Titel</slot>
    </h1>
    <div class="block">
      <b-table
        :data="syncedRows"
        :columns="syncedColumns"
        :loading="syncedIsDataLoading"
        :debounce-search="1000"
        checkable
        :checked-rows.sync="syncedCheckedRows"
        paginated
        per-page="15"
      >
        <template #bottom-left>
          <b>Ausgewählt</b>: {{ syncedCheckedRows.lenght }}
        </template>
      </b-table>
    </div>
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <b-button
            @click="add"
            icon-left="plus"
            label="Erstellen"
            type="is-success"
          />
        </div>

        <div class="level-item">
          <b-button
            @click="edit"
            icon-left="edit"
            type="is-info"
            label="Editieren"
          />
        </div>

        <div class="level-item">
          <b-button
            @click="deleteSelected"
            icon-left="trash"
            type="is-danger"
            label="Löschen"
          />
        </div>

        <slot name="buttons-left"></slot>
      </div>

      <div class="level-right">
        <slot name="buttons-right"></slot>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Mixins, PropSync } from "vue-property-decorator";
import ModuleListUpload from "@/mixins/ExcelSheetUpload";
import { BModalConfig } from "buefy/types/components";

@Component
export default class ModuleAdministration<T> extends Mixins(ModuleListUpload) {
  @PropSync("rows") syncedRows!: Array<T>;
  @PropSync("columns") syncedColumns!: Array<T>;
  @PropSync("checkedRows") syncedCheckedRows!: Array<T>;
  @PropSync("isDataLoading") syncedIsDataLoading!: boolean;

  modalOption: BModalConfig = {
    parent: this,
    trapFocus: true,
    hasModalCard: true,
    canCancel: ["x", "escape"],
  };

  add(): void {
    this.$emit("add");
  }

  edit(): void {
    this.$emit("edit");
  }

  async deleteSelected(): Promise<void> {
    const userConfirmation = await this.$swal({
      title: "Wollen Sie die ausgewählten Einträge löschen?",
      text: "Diese Aktion ist irreversibel",
      showCancelButton: true,
      cancelButtonText: "Abbrechen",
      confirmButtonText: "Löschen",
    });

    if (userConfirmation.isConfirmed) {
      for (const obj of this.syncedCheckedRows) {
        this.$emit("deleteSelected", obj);
      }
      this.$buefy.notification.open({
        message: "Einträge wurden erfolgreich gelöscht",
        type: "is-success",
        duration: 5000,
        icon: "check",
        hasIcon: true,
      });
    }
  }
}
</script>
