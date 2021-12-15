import ErrorHandler from "@/decorators/ErrorHandler";
import Student from "@/models/student";
import StudentSetup from "@/models/studentSetup";
import ValidationSetting from "@/models/validationSetting";
import { Component } from "vue-property-decorator";
import Api from "./Api";

@Component
export default class StudentApi extends Api<Student> {
  get $studentApi(): StudentApi {
    this.basePath = "/students";
    return this;
  }

  @ErrorHandler()
  async updateStudentSetup(
    id: string,
    setup: StudentSetup,
    message?: string
  ): Promise<void> {
    await this.axios.patch(`${this.basePath}/${id}`, setup);
    if (message) this.sendNotification(message);
  }

  @ErrorHandler()
  async getValidationSetting(id: string): Promise<ValidationSetting> {
    return (
      await this.axios.get<ValidationSetting>(`${this.basePath}/${id}/settings`)
    ).data;
  }

  @ErrorHandler()
  async updateValidationSetting(
    id: string,
    setting: ValidationSetting,
    message?: string
  ): Promise<void> {
    await this.axios.put(`${this.basePath}/${id}/settings`, setting);
    if (message) this.sendNotification(message);
  }
}
