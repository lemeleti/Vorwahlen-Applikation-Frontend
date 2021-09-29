<template>
  <div id="content">
    <div id="modul-filter">
      <button>Übernehmen</button>
    </div>
    <hr />
    <div id="konsekutiv-wrapper" class="content">
      <h1>Konsekutive Wahlpflichtmodule</h1>
      <p>
        Sie dürfen auch konsekutive Wahlpflichtmodul als einzelne Module
        besuchen. Sie müssen bis Studienende mindestens zweimal zwei konsekutive
        Module belegen. Anders ausgedrückt: Total vier solche Module, wobei je
        zwei konsekutiv sein müssen.
      </p>
      <p>
        Beachten Sie, dass die Module mit "1" im Herbstsemester und die Module
        mit "2" im Frühlingssemester stattfinden.
      </p>
      <p>
        <b>IT18 Teilzeit:</b> Wenn Sie im aktuellen Studienjahr schon zwei
        konsekutive Module belegt haben, wählen Sie mindestens einmal zwei
        konsekutive Module, ansonsten mindestens zweimal zwei konsekutive
        Module.
      </p>
      <p>
        <b>IT19 Teilzeit:</b> Wählen Sie bis zu zwei konsekutive Module
        (empfohlen: zwei Module). Achten Sie speziell auf die nötigen
        Vorkenntnisse der Module.
      </p>
      <p>
        <b>IT19 Vollzeit:</b> Wählen Sie mindestens zweimal zwei konsekutive
        Module
      </p>
      <div class="columns is-multiline" id="konsekutiv">
        <SubjectCard
          @showAdditionalSubjectInfo="showAdditionalSubjectInfo"
          v-for="(module, index) in konsekutivModules"
          :key="index"
          :title="module.title"
        />
      </div>
    </div>
    <hr />
    <div id="wahlpflicht" class="content">
      <h1 class="title">Wahlpflichtmodule</h1>
      <p>
        <b>IT18 Teilzeit: </b>Zusammen mit den oben gewählten konsekutiven
        Modulen, wählen Sie total sieben Module (mit genehmigter Dispensation
        aus der beruflichen Anrechnung fünf Module)
      </p>
      <p>
        <b>IT19 Teilzeit: </b>Zusammen mit den oben gewählten konsekutiven
        Modulen wählen Sie total zwei Module. In der Regel wählen Sie hier also
        kein Modul.
      </p>
      <p>
        <b>IT 19 Vollzeit:</b>Zusammen mit den oben gewählten konsekutiven
        Modulen wählen Sie total acht Module.
      </p>
      <h2 class="subtitle">Herbstsemester</h2>
      <div class="columns is-multiline" id="herbstsemester">
        <SubjectCard
          @showAdditionalSubjectInfo="showAdditionalSubjectInfo"
          v-for="(module, index) in wahlpflichtModulesHerbst"
          :key="index"
          :title="module.title"
        />
      </div>
      <p></p>
      <h2 class="subtitle">Frühlingssemester</h2>
      <div class="columns is-multiline" id="fruelingssemester">
        <SubjectCard
          @showAdditionalSubjectInfo="showAdditionalSubjectInfo"
          v-for="(module, index) in wahlpflichtModulesFrueh"
          :key="index"
          :title="module.title"
        />
      </div>
      <p></p>
    </div>
    <hr />
    <div id="wahlmodule" class="content">
      <h1 class="title">Wahlmodule</h1>
      <p>
        IT18 Teilzeit: Sie können bis zu einem der oben gewählten
        Wahlpflichtmodule durch ein Wahlmodule ersetzen.
      </p>
      <p>
        IT19 Teilzeit: In der Regel wählen Sie jetzt noch keines dieser
        Wahlmodule, da es mit grosser Wahrscheinlichkeit mit Ihrem
        obligatorischen Stundenplan nicht kompatibel ist.
      </p>
      <p>
        IT19 Vollzeit: Sie müssen eines dieser Wahlmodule wählen (Sie können
        auch mehrere wählen, angerechnet werden kann aber nur ein Wahlmodul).
      </p>
      <p>Die Zeitslots für diese Module sind von uns nicht beeinflussbar.</p>
      <p>
        Da einige Modulbeschreibungen erst noch erstellt werden, müssen Sie
        basierend auf dem Titel eine Präferenz angeben (vor allem für die
        ZH-Klassen von Vorteil), oder die Wahl des Wahlmoduls noch offen lassen
        und erst am Marktplatz wählen.
      </p>
      <div class="columns is-multiline" id="fruelingssemester">
        <SubjectCard
          @showAdditionalSubjectInfo="showAdditionalSubjectInfo"
          v-for="(module, index) in wahlpflichtModulesFrueh"
          :key="index"
          :title="module.title"
        />
      </div>
    </div>
    <hr />
    <div class="content">
      <h1 class="title">Aus dem Bereich Wirtschaft und Recht</h1>
    </div>
    <SubjectInfoModal :title="modalTitle" :isModalActive.sync="isModalActive" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import SubjectCard from "@/components/SubjectCard.vue";
import SubjectInfoModal from "@/components/SubjectInfoModal.vue";

@Component({
  components: {
    SubjectCard,
    SubjectInfoModal,
  },
})
export default class Homepage extends Vue {
  modalTitle = "";
  isModalActive = false;
  konsekutivModules = [
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
  wahlpflichtModulesHerbst = [
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
  wahlpflichtModulesFrueh = [
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

  showAdditionalSubjectInfo(title: string): void {
    this.modalTitle = title;
    this.isModalActive = !this.isModalActive;
  }
}
</script>
