import { Component, Vue } from "vue-property-decorator";
import ErrorHandler from "@/decorators/ErrorHandler";
@Component
export default class Api<T> extends Vue {
  path!: string;

  get basePath(): string {
    return this.path;
  }

  set basePath(path: string) {
    this.path = path;
  }

  get $api(): Api<T> {
    return this;
  }

  @ErrorHandler()
  async getAll(): Promise<Array<T>> {
    return (await Vue.axios.get<Array<T>>(this.basePath)).data;
  }

  @ErrorHandler()
  async deleteById(id: string, message?: string): Promise<void> {
    await Vue.axios.delete(`${this.basePath}/${id}`);
    if (message) this.sendNotification(message);
  }

  @ErrorHandler()
  async getById(id: string): Promise<T> {
    return (await Vue.axios.get<T>(`${this.basePath}/${id}`)).data;
  }

  @ErrorHandler()
  async create(obj: T, message?: string): Promise<void> {
    await this.axios.post(this.basePath, obj);
    if (message) this.sendNotification(message);
  }

  @ErrorHandler()
  async update(obj: T, id: string, message?: string): Promise<void> {
    await this.axios.put(`${this.basePath}/${id}`, obj);
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
