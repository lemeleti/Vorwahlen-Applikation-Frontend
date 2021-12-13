<template>
  <Administration
    @deleteSelected="deleteStudent"
    :modal.sync="modalComponent"
    id="email"
    :columns.sync="studentColumns"
    :rows.sync="studentRows"
    :checkedRows.sync="checkedStudentRows"
    :isDataLoading.sync="isStudentDataLoading"
  >
    <template #title>Studentenverwaltung</template>
    <template #buttons-right>
      <div class="level-item">
        <b-button
          @click="importClassList"
          label="Klassenliste"
          icon-left="file-upload"
          type="is-success"
        />
      </div>

      <div class="level-item">
        <b-button
          @click="importDispensations"
          label="Dispensationen"
          icon-left="file-upload"
          type="is-success"
        />
      </div>
    </template>
  </Administration>
</template>

<script lang="ts">
import _Vue from "vue";
import { Component } from "vue-property-decorator";
import Student from "@/models/student";
import CreateEditStudent from "@/components/admin/createAddModals/CreateEditStudent.vue";
import Administration from "@/components/admin/administrationComponents/Administration.vue";

@Component({
  components: {
    CreateEditStudent,
    Administration,
  },
})
export default class StudentAdministration extends Administration<Student> {
  isStudentDataLoading = true;
  studentRows: Array<Student> = [];
  checkedStudentRows: Array<Student> = [];
  studentColumns = [
    {
      field: "email",
      label: "E-Mail",
    },
    {
      field: "name",
      label: "Name",
    },
    {
      field: "class",
      label: "Klasse",
    },
    {
      field: "paDispensation",
      label: "Credits PA-Dispensation",
    },
    {
      field: "wpmDispensation",
      label: "Credits WPM-Dispensation",
    },
    {
      field: "ip",
      label: "Internationales Profil",
    },
    {
      field: "tz",
      label: "Teilzeitstudent",
    },
    {
      field: "secondElection",
      label: "Zweite Modulvorwahl",
    },
  ];

  get modalComponent(): typeof _Vue {
    return CreateEditStudent;
  }

  async created(): Promise<void> {
    this.isStudentDataLoading = false;
    this.modalOption.component = CreateEditStudent;
    this.studentRows = await this.$studentApi.getAll();
  }

  async deleteStudent(student: Student): Promise<void> {
    await this.$studentApi.deleteById(student.email);
    const studentIndex = this.studentRows.indexOf(student);
    this.studentRows.splice(studentIndex, 1);
  }

  async importClassList(): Promise<void> {
    this.listTitle = "Klassenliste";
    this.importPath = `${this.$studentApi.basePath}`;
    await this.importList();
  }

  async importDispensations(): Promise<void> {
    this.listTitle = "Dispensationsliste";
    this.importPath = `${this.$studentApi.basePath}/dispensations`;
    await this.importList();
  }
}
</script>
