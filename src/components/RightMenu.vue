<template>
  <div class="column is-narrow side-menu is-hidden-touch">
    <section class="section">
      <div class="tile is-vertical" id="rightMenu">
        <div class="tile box is-radiusless p-0" id="belegung">
          <article class="tile is-child has-text-centered">
            <div class="box-header">
              <span class="icon-text">
                <span class="is-size-4">Aktuelle Belegung</span>
                <span class="icon">
                  <i class="fas fa-chevron-down is-clickable"></i>
                </span>
              </span>
            </div>
            <hr class="m-0" />
            <div class="box-content">
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
              </table>
            </div>
          </article>
        </div>
        <div class="tile box is-radiusless p-0" id="kommilitonen">
          <article class="tile is-child has-text-centered">
            <span class="icon-text box-header">
              <span class="is-size-4">Kommilitionen</span>
              <span class="icon">
                <i class="fas fa-chevron-down is-clickable"></i>
              </span>
            </span>
            <hr class="m-0" />
            <div class="content box-content">
              <input
                class="input"
                placeholder="Studentenkürzel"
                value="Tag1,Tag2,Tag3"
              />
            </div>
          </article>
        </div>
        <div class="tile box is-radiusless p-0" id="auswahl">
          <article class="tile is-child has-text-centered">
            <span class="icon-text box-header">
              <span class="is-size-4">Ihre Auswahl</span>
              <span class="icon">
                <i class="fas fa-chevron-down is-clickable"></i>
              </span>
            </span>
            <hr class="m-0" />
            <div class="content box-content is-small has-text-left">
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
              <p><b>Aus dem Bereich Wirtschaft und Recht:</b></p>
            </div>
          </article>
        </div>
        <div class="tile box is-radiusless p-0" id="legende">
          <article class="tile is-child has-text-centered">
            <span class="icon-text box-header">
              <span class="is-size-4">Legende</span>
              <span class="icon">
                <i class="fas fa-chevron-down is-clickable"></i>
              </span>
            </span>
            <hr class="m-0" />
            <div class="content box-content has-text-left">
              <p>(E) Durchführung in Englisch</p>
              <p>FS Durchführung im Frühlingssemester</p>
              <p>HS Durchführung im Herbstsemester</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class RightMenu extends Vue {}
</script>

<style lang="scss">
#rightMenu .box {
  max-width: 20rem;
}
</style>
