<template>
  <div class="column is-narrow side-menu is-hidden-touch">
    <div class="tile is-vertical" id="rightMenu">
      <RightMenuBox
        :content="belegung"
        title="Aktuelle Belegung"
        id="belegung"
      />
      <RightMenuBox
        :content="kommilitonen"
        title="Wahl anderer Studenten"
        id="kommilitonen"
      />
      <RightMenuBox :content="my_subjects" title="Ihre Auswahl" id="auswahl" />
      <RightMenuBox :content="legende" title="Legende" id="legende" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import RightMenuBox from "@/components/RightMenuBox.vue";

@Component({
  components: {
    RightMenuBox,
  },
})
export default class RightMenu extends Vue {
  belegung = `
  <table class="table is-fullwidth is-narrow has-text-right">
    <thead>
      <tr>
        <th>Kürzel</th>
        <th># Teilnehmer</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>ASE1</td>
        <td>40</td>
      </tr>
      <tr>
        <td>ASE2</td>
        <td>40</td>
      </tr>
      <tr>
        <td>PSPP</td>
        <td>20</td>
      </tr>
      <tr>
        <td>CCP1-EN</td>
        <td>15</td>
      </tr>
      <tr>
        <td>CCP2-EN</td>
        <td>15</td>
      </tr>
      <tr>
        <td>CNS1-EN</td>
        <td>15</td>
      </tr>
      <tr>
        <td>CNS2-EN</td>
        <td>15</td>
      </tr>
    </tbody>
  </table>`;
  kommilitonen = `
  <input
    class="input"
    placeholder="Studentenkürzel"
    value="Tag1,Tag2,Tag3"
  />`;
  my_subjects = `
  <p><b>Konsekutive Wahlpflichtmodule:</b></p>
  <ul id="konsekutivChosen"></ul>
  <hr />
  <p><b>Wahlpflichtmodule:</b></p>
  <p>Herbstsemester</p>
  <ul id="herbstsemesterChosen"></ul>
  <p>Frühlingssemester</p>
  <ul id="fruelingssemesterChosen"></ul>
  <hr />
  <p><b>Wahlmodule:</b></p>
  <hr />
  <p><b>Aus dem Bereich Wirtschaft und Recht:</b></p>`;

  legende = `
  <p>(E) Durchführung in Englisch</p>
  <p>FS Durchführung im Frühlingssemester</p>
  <p>HS Durchführung im Herbstsemester</p>`;
}
</script>

<style lang="scss">
#rightMenu .box {
  max-width: 20rem;
}
</style>
