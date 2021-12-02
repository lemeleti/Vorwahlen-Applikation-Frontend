<template>
  <div>
    <h1 class="title">Einstellungen</h1>
    <div class="section">
      <div
        class="block"
        v-for="(description, fieldName, index) in settingDescription"
        :key="index"
      >
        <div class="level">
          <div class="level-left">
            <div class="level-item">{{ description }}</div>
          </div>

          <div class="level-right">
            <b-field>
              <b-checkbox
                v-model="validationSetting[fieldName]"
                @change.native="updateSettingSelection()"
              >
                {{ validationSetting[fieldName] }}
              </b-checkbox>
            </b-field>
          </div>
        </div>
        <hr />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import UserStore from "@/store/modules/UserStore";
import { Vue, Component } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

interface ValidationSetting {
  isRepetent: boolean;
  hadAlreadyElectedTwoConsecutiveModules: boolean;
  isSkipConsecutiveModuleCheck: boolean;
}

@Component
export default class Settings extends Vue {
  userStore: UserStore = getModule(UserStore);
  validationSetting: ValidationSetting = {
    isRepetent: false,
    hadAlreadyElectedTwoConsecutiveModules: false,
    isSkipConsecutiveModuleCheck: false,
  };

  settingDescription = {
    isRepetent: "Sind Sie Repetent?",
    hadAlreadyElectedTwoConsecutiveModules:
      "Haben Sie bereits in der letzten Wahl zwei konsekutive Wahlpflichtmodule gewählt?",
    isSkipConsecutiveModuleCheck:
      "Haben Sie die Erlaubnis der Studiengangsleitung die Prüfung von konsekutiven Wahlpflichtmodulen zu überspringen?",
  };

  async updateSettingSelection(): Promise<void> {
    await Vue.axios.patch(
      `class/${this.userStore.email}`,
      this.validationSetting
    );
  }
}
</script>
