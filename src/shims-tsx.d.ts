import Vue, { VNode } from "vue";
import MailTemplateApi from "./mixins/MailTemplateApi";
import ModuleApi from "./mixins/ModuleApi";
import ModuleElectionApi from "./mixins/ModuleElectionApi";
import Notification from "./mixins/Notification";
import PageTextApi from "./mixins/PageTextApi";
import StudentApi from "./mixins/StudentApi";

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $pageTextApi: PageTextApi;
    $moduleApi: ModuleApi;
    $moduleElectionApi: ModuleElectionApi;
    $mailTemplateApi: MailTemplateApi;
    $studentApi: StudentApi;
  }
}
