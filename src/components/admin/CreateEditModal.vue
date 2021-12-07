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
        @click.native="createMode ? add() : update()"
      />
      <b-button label="Abbrechen" @click="$emit('close')" />
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from "vue-property-decorator";

@Component
export default class CreateEditModal<T> extends Vue {
  @Prop() createMode!: boolean;
  @Prop() basePath!: string;
  @PropSync("id") syncedId!: string;
  @PropSync("obj") syncedObj!: Partial<T>;

  async add(): Promise<void> {
    try {
      await Vue.axios.post(this.basePath, this.syncedObj);
    } catch (e) {
      console.log(e);
    }
    this.$emit("close");
    this.$emit("add");
  }

  async update(): Promise<void> {
    try {
      await Vue.axios.put(`${this.basePath}/${this.syncedId}`, this.syncedObj);
    } catch (e) {
      console.log(e);
    }
    this.$emit("close");
    this.$emit("update");
  }

  sendNotification(message: string): void {
    this.$buefy.notification.open({
      type: "is-success",
      hasIcon: true,
      icon: "check",
      message: message,
      duration: 5000,
    });
  }
}
</script>
