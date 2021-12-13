import ErrorHandler from "@/decorators/ErrorHandler";
import Student from "@/models/student";
import StudentSetup from "@/models/studentSetup";
import { Component } from "vue-property-decorator";
import Api from "./Api";

@Component
export default class StudentApi extends Api<Student> {
  get $studentApi(): StudentApi {
    this.basePath = "/students";
    return this;
  }

  @ErrorHandler()
  async updateStudentSetup(setup: StudentSetup): Promise<void> {
    await this.axios.patch(this.basePath, setup);
  }
}
