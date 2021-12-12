<template>
  <b-modal
    v-model="syncedIsModalActive"
    v-if="module != null && eventoData != null"
  >
    <div class="box is-radiusless">
      <div class="block">
        <p class="title">{{ module.moduleTitle }}</p>
      </div>
      <p class="subtitle">Detailierte Übersicht</p>
      <div class="content">
        <div v-for="(value, key, index) of eventoData" :key="index">
          <div class="columns">
            <div class="column">
              <b>{{ fieldTitles[key] }}</b>
            </div>
            <div class="column">
              <span v-html="eventoData[key]"></span>
            </div>
          </div>
          <hr />
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from "vue-property-decorator";
import Module from "@/models/module";
import EventoData from "@/models/eventoData";

@Component
export default class SubjectInfoModal extends Vue {
  @Prop() module!: Module;
  @PropSync("isModalActive") syncedIsModalActive!: boolean;
  eventoData: EventoData | null = null;
  fieldTitles = {
    shortDescription: "Kurzbeschreibung",
    coordinator: "Modulverantwortlicher",
    learningObjectives: "Lernziele",
    moduleContents: "Modulinhalte",
    literature: "Lehrmittel",
    suppLiterature: "Ergänzende Literatur",
    prerequisites: "Zulassungsvoraussetzungen",
    moduleStructure: "Modulausprägung",
    exams: "Leistungsnachweise",
    remarks: "Bemerkungen",
  };

  async updated(): Promise<void> {
    try {
      if (this.module) {
        this.eventoData = await this.$moduleApi.getEventoDataById(
          this.module.moduleNo
        );
      }
    } catch (e) {
      console.log(e);
    }
  }
}
</script>
