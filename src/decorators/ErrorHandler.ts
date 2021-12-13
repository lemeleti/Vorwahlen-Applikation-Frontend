import ErrorResponse from "@/models/errorResponse";
import { AxiosError } from "axios";
import { NotificationProgrammatic as Notification } from "buefy";

export default function ErrorHandler() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let returnVal = null;
      try {
        returnVal = await original.apply(this, args);
      } catch (e) {
        const err = e as AxiosError;
        if (err && err.response) {
          let message = "Beim Abfragen einer Ressource ist ein Fehler aufgetreten.";
          const errorResponse: ErrorResponse = err.response.data;
          if (errorResponse && errorResponse.message != null) {
            message = errorResponse.message;
            const causes = errorResponse.causes;
            if (causes.length != 0) {
              message = `${message}<br />${causes.join("<br />")}`;
            }
          }
          Notification.open({
            message,
            type: "is-danger",
            hasIcon: true,
            indefinite: true,
          });
        }
      }
      return returnVal;
    };
  };
}
