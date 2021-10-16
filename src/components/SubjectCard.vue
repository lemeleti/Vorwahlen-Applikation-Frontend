<template>
  <div class="column is-one-third">
    <div class="block">
      <div class="card" id="subjectId">
        <header class="card-header">
          <p class="card-header-title fach">{{ title }}</p>
        </header>
        <div class="card-content">
          <div class="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            nec iaculis mauris.
            <a href="#">@bulmaio</a>. <a href="#">#css</a>
            <a href="#">#responsive</a>
            <br />
            <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
          </div>
        </div>
        <footer class="card-footer">
          <span
            class="card-footer-item is-clickable subjectInformation"
            @click="showAdditionalSubjectInfo"
          >
            Mehr Info
            <b-icon icon="plus"></b-icon>
          </span>
          <span class="card-footer-item is-clickable chooseSubject">
            <span class="item-text">Auswählen</span>
            <b-icon icon="square"></b-icon>
            <span class="icon has-text-success is-hidden">
              <i class="fas fa-check" aria-hidden="true"></i>
            </span>
          </span>
        </footer>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class SubjectCard extends Vue {
  @Prop() title!: string;

  showAdditionalSubjectInfo(): void {
    this.$emit("showAdditionalSubjectInfo", this.title);
  }
}
</script>
