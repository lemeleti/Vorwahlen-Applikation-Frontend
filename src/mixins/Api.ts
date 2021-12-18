import { Component, Vue } from "vue-property-decorator";
import ErrorHandler from "@/decorators/ErrorHandler";
@Component
export default class Api<T> extends Vue {
  path!: string;

  @ErrorHandler()
  async getAll(): Promise<Array<T>> {
    return (await this.axios.get<Array<T>>(this.path)).data;
  }

  @ErrorHandler()
  async deleteById(id: string, message?: string): Promise<void> {
    await this.axios.delete(`${this.path}/${id}`);
    if (message) this.sendNotification(message);
  }

  @ErrorHandler()
  async getById(id: string): Promise<T> {
    return (await this.axios.get<T>(`${this.path}/${id}`)).data;
  }

  @ErrorHandler()
  async create(obj: T, message?: string): Promise<T> {
    const data = (await this.axios.post<T>(this.path, obj)).data;
    if (message) this.sendNotification(message);
    return data;
  }

  @ErrorHandler()
  async update(obj: T, id: string, message?: string): Promise<void> {
    await this.axios.put(`${this.path}/${id}`, obj);
    if (message) this.sendNotification(message);
  }

  sendNotification(message: string): void {
    this.$buefy.notification.open({
      type: "is-success",
      hasIcon: true,
      icon: "check",
      message: message,
      duration: 5000,
    });
  }
}
