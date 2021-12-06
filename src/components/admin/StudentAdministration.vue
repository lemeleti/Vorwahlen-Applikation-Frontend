<template>
  <section>
    <h1 class="title">Studenten</h1>
    <div class="block">
      <b-table
        :data="students"
        :columns="columns"
        :loading="dataIsLoading"
        :debounce-search="1000"
        checkable
        :checked-rows.sync="checkedRows"
        paginated
        per-page="15"
      >
        <template #bottom-left>
          <b>Ausgewählt</b>: {{ checkedRows.lenght }}
        </template>
      </b-table>
    </div>
    <div class="buttons">
      <b-button
        @click="addUser"
        label="Erstellen"
        icon-left="plus"
        type="is-success"
      />
      <b-button
        @click="importClassList"
        icon-left="file-upload"
        type="is-success"
        label="Klassenliste"
      />
      <b-button
        @click="editSelectedUsers"
        label="Editieren"
        type="is-info"
        icon-left="edit"
      />
      <b-button
        label="Dispensationsliste"
        type="is-info"
        icon-left="file-upload"
        @click="this.importDispensations"
      >
      </b-button>
      <b-button
        @click="deleteSelectedStudents"
        label="Löschen"
        type="is-danger"
        icon-left="trash"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";
import Student from "@/models/student";
import ModuleListUpload from "@/mixins/ExcelSheetUpload";
import CreateEditStudent from "@/components/admin/CreateEditStudent.vue";
import { BModalConfig } from "buefy/types/components";

@Component({
  components: {
    CreateEditStudent,
  },
})
export default class StudentAdministration extends Mixins(ModuleListUpload) {
  dataIsLoading = true;
  students: Array<Student> = [];
  checkedRows: Array<Student> = [];
  columns = [
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

  modalOption: BModalConfig = {
    parent: this,
    component: CreateEditStudent,
    trapFocus: true,
    hasModalCard: true,
    canCancel: ["x", "escape"],
  };

  async created(): Promise<void> {
    this.students = (await Vue.axios.get("students")).data;
    this.dataIsLoading = false;
  }

  async deleteSelectedStudents(): Promise<void> {
    const userConfirmation = await Vue.swal({
      title: "Wollen Sie die ausgewählten Benutzer löschen?",
      text: "Diese Aktion ist irreversibel",
      showCancelButton: true,
      cancelButtonText: "Abbrechen",
      confirmButtonText: "Löschen",
    });

    if (userConfirmation.isConfirmed) {
      for (const student of this.checkedRows) {
        try {
          (await Vue.axios.delete(`/students/${student.email}`)).data;
        } catch (e) {
          // todo display received error message
          console.log(e);
          return;
        }
        const studentIndex = this.students.indexOf(student);
        this.students.splice(studentIndex, 1);
      }
      Vue.swal({
        title: "Benutzer wurden gelöscht",
        icon: "success",
      });
    }
  }

  async addUser(): Promise<void> {
    this.modalOption.props = { student: {}, createStudent: true };
    this.$buefy.modal.open(this.modalOption);
  }

  async importClassList(): Promise<void> {
    this.listTitle = "Klassenliste";
    this.importPath = "students";
    await this.importList();
  }

  async editSelectedUsers(): Promise<void> {
    this.modalOption.props = {
      student: this.checkedRows[0],
      createStudent: false,
    };
    this.$buefy.modal.open(this.modalOption);
  }

  async importDispensations(): Promise<void> {
    this.listTitle = "Dispensationsliste";
    this.importPath = "students/dispensations";
    await this.importList();
  }
}
</script>
