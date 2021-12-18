<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Einrichtung</p>
    </header>

    <section class="modal-card-body">
      <p class="subtitle">
        Die Option kann nachträglich in den Einstellungen verändert werden
      </p>
      <b-field label="Belegen Sie das internationale Profil">
        <b-checkbox v-model="studentSetup.ip"></b-checkbox>
      </b-field>

      <div v-if="this.userStore.isPartTimeSecondElection">
        <b-field
          label="Wenn Sie als Teilzeitstudent im 5. und 6. Semester konsekutive Wahlpflichtmodule besuchen, 
          wählen Sie diese Feld an. Das Tool erlaubt Ihnen dann weniger konsekutive Wahlpflichtmodule zu wählen."
        >
          <b-select
            v-model="validationSetting.electedContextModulesInFirstElection"
          >
            <option v-for="n in 4" :key="n" :value="n - 1">{{ n - 1 }}</option>
          </b-select>
        </b-field>
      </div>
    </section>

    <footer class="modal-card-foot">
      <b-button
        type="is-success"
        label="Bestätigen"
        @click.native="confirmSetup"
      />
    </footer>
  </div>
</template>

<script lang="ts">
import StudentApi from "@/mixins/StudentApi";
import Student from "@/models/student";
import StudentSetup from "@/models/studentSetup";
import ValidationSetting from "@/models/validationSetting";
import UserStore from "@/store/modules/UserStore";
import { Component, Prop, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

@Component
export default class SettingsModal extends Vue {
  @Prop() student!: Student;
  userStore = getModule(UserStore);
  studentApi = new StudentApi();
  studentSetup: StudentSetup = {
    ip: false,
    firstTimeSetup: false,
  };
  validationSetting: ValidationSetting = {
    isRepetent: false,
    hadAlreadyElectedTwoConsecutiveModules: false,
    isSkipConsecutiveModuleCheck: false,
    electedContextModulesInFirstElection: 0,
  };

  async confirmSetup(): Promise<void> {
    try {
      await this.studentApi.updateStudentSetup(
        this.student.email,
        this.studentSetup,
        "Die Einrichtung wurde erfolgreich übernommen"
      );
      await this.studentApi.updateValidationSetting(
        this.student.email,
        this.validationSetting
      );
    } catch (e) {
      // handled by error handler
    }
    this.$emit("close");
  }
}
</script>
