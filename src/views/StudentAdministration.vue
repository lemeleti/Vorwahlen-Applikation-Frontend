<template>
  <Administration
    @add="addStudent"
    @edit="editStudent"
    @deleteSelected="deleteStudent"
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

      <div class="level-item">
        <b-button
          @click="notifySelectedUsers"
          icon-left="paper-plane"
          label="Benachrichtigen"
          type="is-info"
        />
      </div>
    </template>
  </Administration>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Student from "@/models/student";
import CreateEditStudent from "@/components/admin/CreateEditStudent.vue";
import Administration from "@/components/admin/Administration.vue";
import StudentNotify from "@/components/admin/StudentNotify.vue";

@Component({
  components: {
    CreateEditStudent,
    Administration,
    StudentNotify,
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

  async created(): Promise<void> {
    this.isStudentDataLoading = false;
    this.modalOption.component = CreateEditStudent;
    this.studentRows = (await Vue.axios.get<Array<Student>>("students")).data;
  }

  async deleteStudent(student: Student): Promise<void> {
    try {
      await Vue.axios.delete(`/students/${student.email}`);
    } catch (e) {
      console.log(e);
    }
  }

  async addStudent(): Promise<void> {
    this.modalOption.component = CreateEditStudent;
    this.modalOption.props = {
      student: { paDispensation: 0, wpmDispensation: 0 },
      createStudent: true,
    };
    this.$buefy.modal.open(this.modalOption);
  }

  async importClassList(): Promise<void> {
    this.listTitle = "Klassenliste";
    this.importPath = "students";
    await this.importList();
  }

  async editStudent(): Promise<void> {
    this.modalOption.props = {
      student: this.checkedStudentRows[0],
      createStudent: false,
    };
    this.$buefy.modal.open(this.modalOption);
  }

  async importDispensations(): Promise<void> {
    this.listTitle = "Dispensationsliste";
    this.importPath = "students/dispensations";
    await this.importList();
  }

  notifySelectedUsers(): void {
    const studentMailAddresses = this.checkedStudentRows.map(
      (student: Student) => student.email
    );
    this.modalOption.component = StudentNotify;
    this.modalOption.props = { studentNotification: { studentMailAddresses } };
    this.$buefy.modal.open(this.modalOption);
  }
}
</script>
