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
        sort-icon="chevron-up"
        paginated
        :per-page="entriesPerPage"
      >
        <template #bottom-left>
          <div class="level">
            <div class="level-item">
              <b-button
                label="Alle abwählen"
                @click="syncedCheckedRows = []"
                type="is-info"
              />
            </div>

            <div class="level-item">
              <b>Ausgewählt</b>: {{ syncedCheckedRows.length }}
            </div>
          </div>
        </template>

        <template #empty>
          <div class="has-text-centered">Keine Einträge vorhanden</div>
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
        <div class="level-item">
          <b-select v-model="entriesPerPage">
            <option value="5">5 pro Seite</option>
            <option value="15">15 pro Seite</option>
            <option value="30">30 pro Seite</option>
            <option value="50">50 pro Seite</option>
            <option value="100">100 pro Seite</option>
          </b-select>
        </div>
        <slot name="buttons-right"></slot>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Mixins, Prop, PropSync } from "vue-property-decorator";
import ModuleListUpload from "@/mixins/ExcelSheetUpload";
import { BModalConfig } from "buefy/types/components";
import Api from "@/mixins/Api";
import _ from "lodash";

@Component
export default class ModuleAdministration<T> extends Mixins(ModuleListUpload) {
  @PropSync("rows") syncedRows!: Array<T>;
  @PropSync("columns") syncedColumns!: Array<T>;
  @PropSync("checkedRows") syncedCheckedRows!: Array<T>;
  @PropSync("isDataLoading") syncedIsDataLoading!: boolean;
  @Prop() modal!: typeof Api;
  @Prop() id!: string;
  @Prop() partialObject!: Partial<T>;
  entriesPerPage = 15;

  created(): void {
    if (this.syncedColumns) {
      this.syncedColumns = this.syncedColumns.map((obj) => ({
        ...obj,
        searchable: true,
        sortable: true,
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
    props: {
      partialObject: null,
    },
  };

  add(): void {
    this.modalOption.props.createObject = true;
    this.modalOption.props.partialObject = this.partialObject;
    this.$buefy.modal.open(this.modalOption);
  }

  edit(): void {
    this.modalOption.props.createObject = false;
    this.modalOption.props.partialObject = _.clone(this.syncedCheckedRows[0]);
    this.$buefy.modal.open(this.modalOption);
  }

  addObjectToRows(obj: T): void {
    this.syncedRows.push(obj);
  }

  updateObjectInRows(obj: T): void {
    const key = this.id as keyof typeof obj;
    const oldObj = this.syncedRows.find(
      (rowObj: T) => rowObj[key] === obj[key]
    );

    if (oldObj) {
      const oldObjIndex = this.syncedRows.indexOf(oldObj);
      this.$set(this.syncedRows, oldObjIndex, obj);
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
      this.removeSubsetFromTable(this.syncedCheckedRows);
    }
  }

  removeSubsetFromTable(rows: T[]): void {
    for (const row of rows) {
      const indexOf = this.syncedRows.indexOf(row);
      this.syncedRows.splice(indexOf, 1);
    }
  }
}
</script>
