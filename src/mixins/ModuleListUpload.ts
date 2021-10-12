import { Vue, Component } from "vue-property-decorator";
import "vue-class-component/hooks";
import ExcelJs, { Buffer, Workbook, Worksheet } from "exceljs";

@Component
export default class ModuleListUpload extends Vue {
  async beforeMount(): Promise<void> {
    const workbook = new ExcelJs.Workbook();
    const file = await this.getFile();

    if (file) {
      try {
        const worksheetIndex = await this.selectWorkSheet(workbook, file);
        await this.sendModuleListToServer(
          workbook.worksheets[worksheetIndex],
          file
        );
        Vue.swal({
          title: "Import erfolgreich",
          text: "Die Modulliste wurde erfolgreich importiert.",
          icon: "success",
        });
      } catch (err) {
        Vue.swal({
          title: "Fehler beim Erstellen der Module.",
          text: `Beim Hochladen / Erstellen der Datei ist etwas schiefgelaufen. ${err}`,
          icon: "error",
        });
      }
    }
  }

  async getFile(): Promise<File> {
    const { value: file } = await Vue.swal({
      title: "Modulliste",
      input: "file",
      confirmButtonText: "Hochladen",
      cancelButtonText: "Abbrechen",
      showCancelButton: true,
      inputAttributes: {
        accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      inputValidator: (value) =>
        new Promise((resolve) => {
          if (value === null) {
            resolve("Sie müssen eine Datei auswählen");
          } else {
            resolve(null);
          }
        }),
    });
    return file;
  }

  async selectWorkSheet(workbook: Workbook, file: File): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async function () {
        try {
          const buffer = reader.result;
          await workbook.xlsx.load(<Buffer>buffer);
          const worksheets = workbook.worksheets;
          const { value: worksheetIndex } = await Vue.swal({
            title: "Excel Sheet Auswahl",
            text: "Bitte wählen Sie aus, welches Excel Sheet gelesen werden soll.",
            input: "select",
            inputOptions: worksheets.map((ws) => ws.name),
          });
          resolve(worksheetIndex);
        } catch (err) {
          reject(err);
        }
      };
    });
  }

  sendModuleListToServer(worksheet: Worksheet, file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file, "modulelist.xlsx");
    formData.append("worksheet", worksheet.name);
    return Vue.axios.post("module", formData);
  }
}
