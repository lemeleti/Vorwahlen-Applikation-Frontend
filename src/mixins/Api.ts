import Module from "@/models/module";
import { Component, Vue } from "vue-property-decorator";

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

  async getAll(): Promise<Array<T>> {
    return (await Vue.axios.get<Array<T>>(this.basePath)).data;
  }

  async deleteById(id: string): Promise<void> {
    await Vue.axios.delete(`${this.basePath}/${id}`);
  }

  async getById(id: string): Promise<Module> {
    return (await Vue.axios.get<Module>(`${this.basePath}/${id}`)).data;
  }

  async create(obj: T): Promise<void> {
    await this.axios.post(this.basePath, obj);
  }

  async update(obj: T, id: string): Promise<void> {
    await this.axios.put(`${this.basePath}/${id}`, obj);
  }
}
