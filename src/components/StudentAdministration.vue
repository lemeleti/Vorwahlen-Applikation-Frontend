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
      ></b-table>
    </div>
    <div class="buttons">
      <b-button @click="addUser" type="is-success">Erstellen</b-button>
      <b-button @click="importClassList" type="is-success"
        >Importieren</b-button
      >
      <b-button @click="editSelectedUsers" type="is-info">Editieren</b-button>
      <b-button
        label="Dispensationen importieren"
        type="is-info"
        icon-left="file-upload"
        @click="this.importDispensations"
      >
      </b-button>
      <b-button @click="deleteSelectedStudents" type="is-danger"
        >Löschen</b-button
      >
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";
import Student from "@/models/student";
import ModuleListUpload from "@/mixins/ExcelSheetUpload";
import CreateUser from "@/components/admin/CreateUser.vue";

@Component({
  components: {
    CreateUser,
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
  ];

  async created(): Promise<void> {
    this.students = (await Vue.axios.get("students")).data;
    this.dataIsLoading = false;
  }

  async deleteSelectedStudents(): Promise<void> {
    const userConfirmation = await Vue.swal({
      title: "Wollen Sie die asugewählten Benutzer löschen?",
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
    this.$buefy.modal.open({
      parent: this,
      component: CreateUser,
      trapFocus: true,
      canCancel: ["x", "escape"],
    });
  }

  async importClassList(): Promise<void> {
    this.listTitle = "Klassenliste";
    this.importPath = "students";
    await this.importList();
  }

  async editSelectedUsers(): Promise<void> {
    //
  }

  async importDispensations(): Promise<void> {
    this.listTitle = "Dispensationsliste";
    this.importPath = "students/dispensations";
    await this.importList();
  }
}
</script>
