<template>
  <div>
    <h1 class="title">Einstellungen</h1>
    <div class="section" v-if="validationSetting">
      <div
        class="block"
        v-for="(description, fieldName, index) in descriptionForStudent"
        :key="index"
      >
        <div class="columns">
          <div class="column is-one-third">
            <span>{{ description[0] }}</span>
            <b-tooltip :label="description[1]" type="is-info" multilined>
              <b-icon icon="question-circle" type="is-info" />
            </b-tooltip>
          </div>

          <div class="column is-two-thirds">
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
        <div class="columns" v-if="userStore.student">
          <div class="column is-one-third">
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
</template>

<script lang="ts">
import Student from "@/models/student";
import StudentSetup from "@/models/studentSetup";
import ValidationSetting from "@/models/validationSetting";
import UserStore from "@/store/modules/UserStore";
import { Vue, Component } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

interface SettingsDescription {
  [index: string]: Array<string>;
}

@Component
export default class Settings extends Vue {
  userStore: UserStore = getModule(UserStore);
  validationSetting: ValidationSetting | null = null;
  message = "Die Einstellungen wurden übernommen";

  async created(): Promise<void> {
    if (this.userStore.student) {
      try {
        this.validationSetting = await this.$studentApi.getValidationSetting(
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
      if (student.tz && student.secondElection) {
        description = this.settingDescription;
      } else {
        description = { isRepetent: this.settingDescription.isRepetent };
      }
    }
    return description;
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
    if (student && this.validationSetting) {
      try {
        await this.$studentApi.updateValidationSetting(
          student.email,
          this.validationSetting,
          this.message
        );
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
      await this.$studentApi.updateStudentSetup(
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
