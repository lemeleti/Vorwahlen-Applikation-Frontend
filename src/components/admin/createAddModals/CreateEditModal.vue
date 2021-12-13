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
          createMode ? $emit('add') : $emit('update');
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
export default class CreateEditModal extends Vue {
  @Prop() createMode!: boolean;
}
</script>
