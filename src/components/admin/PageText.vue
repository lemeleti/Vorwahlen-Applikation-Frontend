<template>
  <div class="columns">
    <div class="column">
      <div class="block">
        <b-field label="Seitentext anpassen für:"></b-field>
        <b-select placeholder="Seitentext auswählen" v-model="selection">
          <optgroup label="Header">
            <option v-for="text of headerTexts" :key="text.id" :value="text.id">
              {{ labels[text.userType] }}
            </option>
          </optgroup>

          <optgroup label="Footer">
            <option v-for="text of footerTexts" :key="text.id" :value="text.id">
              {{ labels[text.userType] }}
            </option>
          </optgroup>
        </b-select>
      </div>
      <div v-if="selection > 0" class="block">
        <b-field label="Editor">
          <b-input v-model="content" type="textarea"></b-input>
        </b-field>
        <b-button
          label="Speichern"
          type="is-info"
          @click.native="updateText"
          outlined
        />
      </div>

      <div class="buttons">
        <b-button
          label="Erstellen"
          @click.native="createPageText"
          type="is-success"
          outlined
        />

        <b-button
          label="Update"
          @click.native="updatePageText"
          :disabled="selection < 0"
          type="is-info"
          outlined
        />

        <b-button
          label="Delete"
          @click.native="deleteSelectedSite"
          :disabled="selection < 0"
          type="is-danger"
          outlined
        />
      </div>
    </div>

    <div class="column">
      <p class="subtitle">Editor Preview</p>
      <span v-html="content"></span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PageText from "@/models/pageText";
import CreateEditPageText from "@/components/admin/createAddModals/CreateEditPageText.vue";
import { BModalConfig } from "buefy/types/components";
import _ from "lodash";
import PageTextApi from "@/mixins/PageTextApi";

@Component({
  components: {
    CreateEditPageText,
  },
})
export default class SiteText extends Vue {
  selectedSite: string | null = null;
  pageTextApi = new PageTextApi();
  sites: Array<PageText> = [];
  selection = -1;
  labels = {
    FULL_TIME: "Vollzeitstudierende",
    PART_TIME_FIRST_ELECTION: "Teilzeitstudierende erste Vorwahl",
    PART_TIME_SECOND_ELECTION: "Teilzeitstudierende zweite Vorwahl",
    ANONYMOUS: "Anonyme und nicht zugelassene Besucher",
  };
  modalOption: BModalConfig = {
    parent: this,
    trapFocus: true,
    hasModalCard: true,
    canCancel: ["x", "escape"],
    component: CreateEditPageText,
    events: {
      addToRow: this.addPageTextToSelection,
      editInRow: this.updatePageTextInSelection,
    },
    props: {
      createObject: false,
      partialObject: null,
    },
  };

  async created(): Promise<void> {
    this.sites = await this.pageTextApi.getAll();
  }

  get headerTexts(): Array<PageText> {
    const texts = this.sites.filter((text) => text.textNumber === 0);
    return texts ? texts : [];
  }

  get footerTexts(): Array<PageText> {
    const texts = this.sites.filter((text) => text.textNumber === 1);
    return texts ? texts : [];
  }

  get textBySelection(): PageText | undefined {
    return this.sites.find((page) => page.id === this.selection);
  }

  get content(): string {
    const text = this.textBySelection;
    return text ? text.text : "";
  }

  set content(textContent: string) {
    const text = this.textBySelection;
    if (text) {
      text.text = textContent;
    }
  }

  async updateText(): Promise<void> {
    const text = this.textBySelection;
    if (text) {
      try {
        await this.pageTextApi.update(
          text,
          text.id.toString(),
          "Der Text wurde erfolgreich aktualisiert"
        );
      } catch (e) {
        // treaded by error handler
      }
    }
  }

  createPageText(): void {
    this.modalOption.props.createObject = true;
    this.modalOption.props.partialObject = {
      id: 0,
      userType: 0,
      isIpText: 0,
      page: "frontpage",
    };
    this.$buefy.modal.open(this.modalOption);
  }

  updatePageText(): void {
    this.modalOption.props.createObject = false;
    this.modalOption.props.partialObject = _.clone(this.textBySelection);
    this.$buefy.modal.open(this.modalOption);
  }

  async deleteSelectedSite(): Promise<void> {
    const pageToDelete = this.textBySelection;
    try {
      if (pageToDelete) {
        await this.pageTextApi.deleteById(
          this.selection.toString(),
          "Der Text wurde erfolgreich gelöscht."
        );
        const indexOf = this.sites.indexOf(pageToDelete);
        this.sites.splice(indexOf, 1);
      }
    } catch (e) {
      // handled by error handler
    }
  }

  addPageTextToSelection(pageText: PageText): void {
    this.sites.push(pageText);
  }

  updatePageTextInSelection(newPageText: PageText): void {
    const oldPageText = this.sites.find(
      (pageText) => pageText.id === newPageText.id
    );
    if (oldPageText) {
      const indexOf = this.sites.indexOf(oldPageText);
      this.$set(this.sites, indexOf, newPageText);
    }
  }
}
</script>
