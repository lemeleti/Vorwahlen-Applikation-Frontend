import MailTemplate from "@/models/mailTemplate";
import { Component } from "vue-property-decorator";
import Api from "./Api";

@Component
export default class MailTemplateApi extends Api<MailTemplate> {
  path = "/mailtemplates";
}
