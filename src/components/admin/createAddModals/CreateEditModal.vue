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
        :label="createMode ? 'Erstellen' : 'Aktualisieren'"
        @click.native="
          createMode ? add() : edit();
          $emit('close');
        "
      />
      <b-button label="Abbrechen" @click="$emit('close')" />
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class CreateEditModal<T> extends Vue {
  @Prop() createMode!: boolean;
  @Prop() createEditObject!: Partial<T>;
  @Prop() addCalback!: (obj: T, message?: string) => Promise<void>;
  @Prop() editCalback!: (obj: T, id: string, message?: string) => Promise<void>;
  @Prop() id!: string;

  add(): void {
    const obj: T = this.createEditObject as T;
    this.addCalback(obj, "Der Eintrag wurde erfolgreich erstellt");
    this.$emit("addToRow", obj);
  }

  edit(): void {
    const obj: T = this.createEditObject as T;
    this.editCalback(
      obj,
      this.id,
      "Der Eintrag wurde erfolgreich aktualisiert"
    );
    this.$emit("editInRow", obj);
  }
}
</script>
