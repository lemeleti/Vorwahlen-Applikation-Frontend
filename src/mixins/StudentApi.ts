import ErrorHandler from "@/decorators/ErrorHandler";
import Student from "@/models/student";
import StudentNotification from "@/models/studentNotification";
import StudentSetup from "@/models/studentSetup";
import ValidationSetting from "@/models/validationSetting";
import { Component, Mixins } from "vue-property-decorator";
import Api from "./Api";

@Component
export default class StudentApi extends Mixins<Api<Student>>(Api) {
  path = "/students";

  @ErrorHandler()
  async updateStudentSetup(
    id: string,
    setup: StudentSetup,
    message?: string
  ): Promise<void> {
    await this.axios.patch(`${this.path}/${id}`, setup);
    if (message) this.sendNotification(message);
  }

  @ErrorHandler()
  async getValidationSetting(id: string): Promise<ValidationSetting> {
    return (
      await this.axios.get<ValidationSetting>(`${this.path}/${id}/settings`)
    ).data;
  }

  @ErrorHandler()
  async updateValidationSetting(
    id: string,
    setting: ValidationSetting,
    message?: string
  ): Promise<void> {
    await this.axios.put(`${this.path}/${id}/settings`, setting);
    if (message) this.sendNotification(message);
  }

  @ErrorHandler()
  async notfiyStudents(notification: StudentNotification): Promise<void> {
    await this.axios.post(`${this.path}/notify`, notification);
  }
}
