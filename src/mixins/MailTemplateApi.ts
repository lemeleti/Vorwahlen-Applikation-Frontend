import MailTemplate from "@/models/mailTemplate";
import { Component } from "vue-property-decorator";
import Api from "./Api";

@Component
export default class MailTemplateApi extends Api<MailTemplate> {
  get $mailTemplateApi(): MailTemplateApi {
    this.basePath = "/mailtemplates";
    return this;
  }
}
