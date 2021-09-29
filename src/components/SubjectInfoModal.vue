<template>
  <b-modal v-model="syncedIsModalActive">
    <div class="box is-radiusless">
      <div class="block">
        <p class="title">{{ title }}</p>
      </div>
      <p class="subtitle">Detailierte Übersicht</p>
      <div class="content">
        <div class="table-container">
          <table class="table">
            <tbody>
              <tr>
                <td id="fach"><b>Fach</b></td>
              </tr>
              <tr>
                <td id="modulverantwortung"><b>Modulverantwortung</b></td>
              </tr>
              <tr>
                <td id="kompetenzen"><b>Kompetenzen</b></td>
              </tr>
              <tr>
                <td id="modulinhalte"><b>Modul- / Lerninhalte</b></td>
              </tr>
              <tr>
                <td id="unterrichtssprache"><b>Unterrichtssprache</b></td>
              </tr>
              <tr>
                <td id="modulstruktur"><b>Modulstruktur</b></td>
              </tr>
              <tr>
                <td id="leistungsnachweise"><b>Leistungsnachweise</b></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from "vue-property-decorator";

@Component
export default class SubjectInfoModal extends Vue {
  @Prop() title!: string;
  @PropSync("isModalActive", { type: Boolean }) syncedIsModalActive!: boolean;
}
</script>
