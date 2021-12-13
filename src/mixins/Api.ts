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
  async deleteById(id: string): Promise<void> {
    await Vue.axios.delete(`${this.basePath}/${id}`);
  }

  @ErrorHandler()
  async getById(id: string): Promise<T> {
    return (await Vue.axios.get<T>(`${this.basePath}/${id}`)).data;
  }

  @ErrorHandler()
  async create(obj: T): Promise<void> {
    await this.axios.post(this.basePath, obj);
  }

  @ErrorHandler()
  async update(obj: T, id: string): Promise<void> {
    await this.axios.put(`${this.basePath}/${id}`, obj);
  }
}
