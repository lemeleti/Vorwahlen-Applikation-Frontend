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
          <b>Ausgewählt</b>: {{ syncedCheckedRows.length }}
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
            :disabled="syncedCheckedRows.length == 0"
          />
        </div>

        <div class="level-item">
          <b-button
            @click="deleteSelected"
            icon-left="trash"
            type="is-danger"
            label="Löschen"
            :disabled="syncedCheckedRows.length == 0"
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
import _Vue from "vue";
import { Component, Mixins, Prop, PropSync } from "vue-property-decorator";
import ModuleListUpload from "@/mixins/ExcelSheetUpload";
import { BModalConfig } from "buefy/types/components";

@Component
export default class ModuleAdministration<T> extends Mixins(ModuleListUpload) {
  @PropSync("rows") syncedRows!: Array<T>;
  @PropSync("columns") syncedColumns!: Array<T>;
  @PropSync("checkedRows") syncedCheckedRows!: Array<T>;
  @PropSync("isDataLoading") syncedIsDataLoading!: boolean;
  @Prop() modal!: typeof _Vue;
  @Prop() id!: string;

  created(): void {
    if (this.syncedColumns) {
      this.syncedColumns = this.syncedColumns.map((obj) => ({
        ...obj,
        searchable: true,
      }));
    }
  }

  modalOption: BModalConfig = {
    parent: this,
    trapFocus: true,
    hasModalCard: true,
    canCancel: ["x", "escape"],
    component: this.modal,
    events: {
      addToRow: this.addObjectToRows,
      editInRow: this.updateObjectInRows,
    },
  };

  add(): void {
    this.modalOption.props = {
      partialObject: {},
      createObject: true,
    };
    this.$buefy.modal.open(this.modalOption);
  }

  edit(): void {
    this.modalOption.props = {
      partialObject: this.syncedCheckedRows[0],
      createObject: false,
    };
    this.$buefy.modal.open(this.modalOption);
  }

  addObjectToRows(obj: T): void {
    this.syncedRows.push(obj);
  }

  updateObjectInRows(obj: T): void {
    const key = this.id as keyof typeof obj;
    const oldObj = this.syncedRows.find(
      (rowObj: T) => rowObj[key] === obj[key]);

    if (oldObj) {
      const oldObjIndex = this.syncedRows.indexOf(oldObj);
      this.syncedRows[oldObjIndex] = obj;
    }
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
