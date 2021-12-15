<template>
  <div>
    <h1 class="title">Einstellungen</h1>
    <div class="section" v-if="validationSetting">
      <div class="columns is-multiline">
        <div class="column">
          <div
            v-for="(description, fieldName, index) in descriptionForStudent"
            :key="index"
          >
            <div class="columns">
              <div class="column is-half">
                <span>{{ description[0] }}</span>
                <b-tooltip :label="description[1]" type="is-info" multilined>
                  <b-icon icon="question-circle" type="is-info" />
                </b-tooltip>
              </div>

              <div class="column">
                <b-field>
                  <b-checkbox
                    v-model="validationSetting[fieldName]"
                    @change.native="updateSettingSelection()"
                    type="is-info"
                  >
                  </b-checkbox>
                </b-field>
              </div>
            </div>
            <hr />
          </div>
          <div v-if="validationSetting && userStore.isPartTimeSecondElection">
            <div class="columns">
              <div class="column is-half">
                <span>
                  Anzahl gewählter Kontext-Wahlpflichtmodule bei den ersten Vorwahlen
                </span>
              </div>

              <div class="column">
                <b-select v-model="electedContextModulesInFirstElection">
                  <option v-for="n in 4" :key="n" :value="n - 1">
                    {{ n - 1 }}
                  </option>
                </b-select>
              </div>
            </div>
            <hr />
          </div>
          <div class="columns" v-if="userStore.student">
            <div class="column is-half">
              <span>IP</span>
              <b-tooltip
                label="Belegen Sie das internationale Profil"
                type="is-info"
                multilined
              >
                <b-icon icon="question-circle" type="is-info" />
              </b-tooltip>
            </div>

            <div class="column is-two-thirds">
              <b-field>
                <b-checkbox v-model="ip" type="is-info"></b-checkbox>
              </b-field>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ModuleElectionApi from "@/mixins/ModuleElectionApi";
import StudentApi from "@/mixins/StudentApi";
import Student from "@/models/student";
import StudentSetup from "@/models/studentSetup";
import ValidationSetting from "@/models/validationSetting";
import ModuleStore from "@/store/modules/ModuleStore";
import UserStore from "@/store/modules/UserStore";
import { Vue, Component } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import _ from "lodash";

interface SettingsDescription {
  [index: string]: Array<string>;
}

@Component
export default class Settings extends Vue {
  userStore: UserStore = getModule(UserStore);
  validationSetting: ValidationSetting | null = null;
  message = "Die Einstellungen wurden übernommen";
  studentApi = new StudentApi();
  moduleElectionApi = new ModuleElectionApi();

  async created(): Promise<void> {
    if (this.userStore.student) {
      try {
        this.validationSetting = await this.studentApi.getValidationSetting(
          this.userStore.student.email
        );
      } catch (e) {
        // hadled by error handler
      }
    }
  }

  get ip(): boolean {
    const student = this.userStore.student;
    if (student) {
      return student.ip;
    }
    return false;
  }

  set ip(isIp: boolean) {
    const student = this.userStore.student;
    if (student) {
      const studentData: StudentSetup = { ip: isIp };
      this.updateStudentData(student, studentData);
    }
  }

  get descriptionForStudent(): SettingsDescription {
    const student = this.userStore.student;
    let description: SettingsDescription = {};
    if (student && this.validationSetting) {
      description = _.clone(this.settingDescription);
      if (!this.userStore.isPartTimeSecondElection) {
        delete description["hadAlreadyElectedTwoConsecutiveModules"];
      }
    }
    return description;
  }

  get electedContextModulesInFirstElection(): number {
    let ecmife = 0;
    if (
      this.validationSetting &&
      this.validationSetting.electedContextModulesInFirstElection
    ) {
      ecmife = this.validationSetting.electedContextModulesInFirstElection;
    }
    return ecmife;
  }

  set electedContextModulesInFirstElection(ecmife: number) {
    if (this.validationSetting) {
      this.validationSetting.electedContextModulesInFirstElection = ecmife;
      this.updateSettingSelection();
    }
  }

  settingDescription: SettingsDescription = {
    isRepetent: [
      "Repetent",
      "Wenn Sie repetieren wählen Sie diese Checkbox aus.",
    ],
    hadAlreadyElectedTwoConsecutiveModules: [
      "Konsekutive Wahlpflichtmodule bereits gewählt",
      `Wenn Sie als Teilzeitstudent bereits die verlangten 
      konsekutiven Wahlpflichtmodule gewählt haben`,
    ],
    isSkipConsecutiveModuleCheck: [
      "Konsekutive Wahlpflichmodulüberprüfung überspringen",
      `Falls mit der Studiengangsleitung abgesprochen, 
      dürfen Sie die Überprüfung der konsekutiven Wahlpflichtmodule überspringen`,
    ],
  };

  async updateSettingSelection(): Promise<void> {
    const student = this.userStore.student;
    const moduleStore = getModule(ModuleStore);
    if (student && this.validationSetting) {
      try {
        await this.studentApi.updateValidationSetting(
          student.email,
          this.validationSetting,
          this.message
        );
        this.moduleElectionApi.triggerValidationUpdate(student.email);
        const data = await this.moduleElectionApi.getElectionStructure(
          student.email
        );
        moduleStore.setElectionData(data);
      } catch (e) {
        // hadled by error handler
      }
    }
  }

  async updateStudentData(
    student: Student,
    studentData: StudentSetup
  ): Promise<void> {
    try {
      await this.studentApi.updateStudentSetup(
        student.email,
        studentData,
        this.message
      );
      this.userStore.setIp(studentData.ip);
    } catch (e) {
      // handled by error handler
    }
  }
}
</script>
