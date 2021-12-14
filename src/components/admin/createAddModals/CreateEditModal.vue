<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">
        <slot name="title"></slot>
      </p>
    </header>

    <section class="modal-card-body">
      <slot name="body"></slot>
    </section>

    <footer class="modal-card-foot">
      <b-button
        type="is-success"
        :label="createObject ? 'Erstellen' : 'Aktualisieren'"
        @click.native="createObject ? add() : edit()"
      />
      <b-button label="Abbrechen" @click="$emit('close')" />
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class CreateEditModal<T> extends Vue {
  @Prop(Boolean) createObject!: boolean;
  @Prop() partialObject!: Partial<T>;
  @Prop() addCalback!: (obj: T, message?: string) => Promise<T>;
  @Prop() editCalback!: (obj: T, id: string, message?: string) => Promise<void>;
  @Prop() id!: string;

  add(): void {
    const obj: T = this.partialObject as T;
    this.addCalback(obj, "Der Eintrag wurde erfolgreich erstellt")
      .then((createdObj) => {
        this.$emit("addToRow", createdObj);
        this.$emit("close");
      })
      .catch(() => null);
  }

  edit(): void {
    const obj: T = this.partialObject as T;
    this.editCalback(obj, this.id, "Der Eintrag wurde erfolgreich aktualisiert")
      .then(() => {
        this.$emit("editInRow", obj);
        this.$emit("close");
      })
      .catch(() => null);
  }
}
</script>
