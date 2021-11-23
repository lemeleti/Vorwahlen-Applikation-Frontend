<template>
  <div id="content">
    <div class="block">
      <p class="title" id="uebersicht">Übersicht aktuelle Belegung</p>
    </div>
    <div class="content">
      <div class="block">
        <p class="subtitle">Konsekutive Wahlmodule</p>
        <b-table :data="konsekutiv" :columns="columns"></b-table>
      </div>
      <hr />
      <div class="block">
        <p class="subtitle">Wahlpflichtmodule</p>
        <b-table :data="wahlpflichtmodule" :columns="columns"></b-table>
      </div>
      <hr />
      <div class="block">
        <p class="subtitle">Wahlmodule</p>
        <b-table :data="wahlmodule" :columns="columns"></b-table>
      </div>
      <hr />
      <div class="block">
        <p class="subtitle">Aus dem Bereich Wirtschaft und Recht</p>
        <b-table :data="wirtschaft" :columns="columns"></b-table>
      </div>
      <div class="buttons">
        <b-button
          label="Vorwahlen exportieren"
          type="is-success"
          icon-left="download"
        ></b-button>
        <b-button
          label="Module importieren"
          type="is-info"
          icon-left="file-upload"
          @click="this.importModules"
        >
        </b-button>
        <b-button
          label="Klassenliste importieren"
          type="is-info"
          icon-left="file-upload"
          @click="this.importClassList"
        >
        </b-button>
        <b-button
          label="Dispensationen importieren"
          type="is-info"
          icon-left="file-upload"
          @click="this.importDispensations"
        >
        </b-button>
        <b-button
          label="Aktuelle Vorwahl exportieren"
          type="is-success"
          icon-left="file-download"
          @click="this.exportModuleElection"
        >
        </b-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import ModuleListUpload from "@/mixins/ExcelSheetUpload";

@Component
export default class Admin extends Mixins(ModuleListUpload) {
  async importModules(): Promise<void> {
    this.listTitle = "Modulliste";
    this.importPath = "module";
    await this.importList();
  }

  async importClassList(): Promise<void> {
    this.listTitle = "Klassenliste";
    this.importPath = "class";
    await this.importList();
  }

  async importDispensations(): Promise<void> {
    this.listTitle = "Dispensationsliste";
    this.importPath = "dispensation";
    await this.importList();
  }

  async exportModuleElection(): Promise<void> {
    const data: Blob = (
      await Vue.axios.get<Blob>("/election/export", { responseType: "blob" })
    ).data;
    const url: string = window.URL.createObjectURL(data);
    window.open(url);
  }

  columns = [
    {
      field: "title",
      label: "Modultitel",
    },
    {
      field: "id",
      label: "Modulkürzel",
    },
    {
      field: "participants",
      label: "Teilnehmer",
    },
    {
      field: "type",
      label: "Modultyp",
    },
  ];

  konsekutiv = [
    {
      title:
        "Advanced Software Engineering 1 & Advanced Software Engineering 2",
      type: "konsekutiv",
      id: "ASE1_2",
    },
    {
      title: "Cloud Computing 1 (E) & Cloud Computing 2 (E)",
      type: "konsekutiv",
      id: "CCP1_2-EN",
    },
    {
      title:
        "Communication Networks and Services 1 (E) & Communication Networks and Services 2 (E)",
      type: "konsekutiv",
      id: "CNS1_2-EN",
    },
    {
      title: "DotNet Technologie und Frameworks 1",
      type: "konsekutiv",
      id: "DNET1",
    },
    {
      title: "DotNet Technologie und Frameworks 2",
      type: "konsekutiv",
      id: "DNET2",
    },
    { title: "Information Engineering 1", type: "konsekutiv", id: "IE1" },
    { title: "Information Engineering 2", type: "konsekutiv", id: "IE2" },
    {
      title: "Internet of Things 1 (E) & Internet of Things 2 (E)",
      type: "konsekutiv",
      id: "IOT1_2-EN",
    },
    {
      title: "Microcomputer Systems 1 & Microcomputer Systems 2",
      type: "konsekutiv",
      id: "MC1_2",
    },
    { title: "Mobile Applications 1", type: "konsekutiv", id: "MOBA1" },
    { title: "Mobile Applications 2", type: "konsekutiv", id: "MOBA2" },
    {
      title:
        "Software and System Security 1 (E) & Software and System Security 2 (E)",
      type: "konsekutiv",
      id: "SWS1_2-EN",
    },
    {
      title: "Visual Computing 1 & Visual Computing 2",
      type: "konsekutiv",
      id: "VC1_2",
    },
  ];

  wahlpflichtmodule = [
    {
      title: "Digital Image Processing 1",
      type: "herbstsemester",
      id: "DIP-EN",
    },
    {
      title: "Embedded Software Engineering",
      type: "herbstsemester",
      id: "ESE",
    },
    { title: "Kryptologie", type: "herbstsemester", id: "KRY" },
    { title: "Künstliche Intelligenz 1", type: "herbstsemester", id: "KI1" },
    { title: "Natural User Interfaces", type: "herbstsemester", id: "NUI" },
    { title: "Operations Research", type: "herbstsemester", id: "OR" },
    {
      title: "Programmiersprachen und -Paradigmen",
      type: "herbstsemester",
      id: "PSPP",
    },
    {
      title: "Serverless and Cloud Application Development (E)",
      type: "herbstsemester",
      id: "SCAD-EN",
    },
    { title: "Scientific Computing (E)", type: "herbstsemester", id: "SCC-EN" },
    {
      title: "System on Chip Design (E)",
      type: "herbstsemester",
      id: "SCD-EN",
    },
  ];

  wahlmodule = [
    {
      title: "Digitale Signalverarbeitung 1",
      type: "fruelingssemester",
      id: "DSV1",
    },
    {
      title: "Funktionale Programmierung",
      type: "fruelingssemester",
      id: "FUP",
    },
    { title: "Game Development", type: "fruelingssemester", id: "GADE" },
    {
      title: "Multicore und Parallel Computing (E)",
      type: "fruelingssemester",
      id: "MPC-EN",
    },
    {
      title: "Optimierungsmethoden in der Informatik",
      type: "fruelingssemester",
      id: "OMCS",
    },
    {
      title: "Robotic Application Programming (E)",
      type: "fruelingssemester",
      id: "RAP-EN",
    },
  ];

  wirtschaft = [];
}
</script>
