import Student from "@/models/student";
import { Component } from "vue-property-decorator";
import Api from "./Api";

@Component
export default class StudentApi extends Api<Student> {
  get $studentApi(): StudentApi {
    this.basePath = "/students";
    return this;
  }
}
