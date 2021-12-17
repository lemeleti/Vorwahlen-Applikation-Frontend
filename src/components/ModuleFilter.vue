<template>
  <div>
    <h2 class="subtitle">Modulfilter</h2>
    <div class="level" v-for="filter of numberOfFilters" :key="filter">
      <div class="level-left">
        <div class="level-item">
          <div class="level-item">
            <b-select v-model="filters[filter - 1].field">
              <option
                v-for="filterOption in filterOptions"
                :key="filterOption.field"
                :value="filterOption.field"
              >
                {{ filterOption.name }}
              </option>
            </b-select>
          </div>

          <div class="level-item">
            <b-select v-model="filters[filter - 1].matcher">
              <option value="eq">Ist gleich</option>
              <option value="neq">Ist nicht gleich</option>
            </b-select>
          </div>

          <div class="level-item">
            <b-select v-model="filters[filter - 1].option">
              <option
                v-for="option in options(filter - 1)"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </b-select>
          </div>

          <div class="level-item">
            <b-select
              v-model="filters[filter - 1].chaining"
              v-if="filter !== numberOfFilters"
            >
              <option value="or">Oder</option>
              <option value="and">Und</option>
            </b-select>
          </div>

          <div class="level-item">
            <b-button
              label="Hinzufügen"
              icon-left="plus"
              type="is-success"
              v-if="filter == numberOfFilters"
              @click="addFilter"
            />
          </div>

          <div class="level-item">
            <b-button
              label="Entfernen"
              type="is-danger"
              @click="removeFilter(filter - 1)"
              v-if="filter - 1 > 0"
            />
          </div>
        </div>
      </div>
    </div>
    <b-button type="is-info" label="Anwenden" @click="applyFilter" />
  </div>
</template>

<script lang="ts">
import ModuleStore from "@/store/modules/ModuleStore";
import { Component, Vue, Watch } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import _ from "lodash";
import Module from "@/models/module";

interface Filter {
  field: string;
  matcher: string;
  option: string;
  chaining: string;
}

@Component
export default class ModuleFilter extends Vue {
  moduleStore: ModuleStore = getModule(ModuleStore);
  filters: Array<Partial<Filter>> = [{}];
  selectedOperator = [];
  numberOfFilters = 1;
  filterOptions = [
    {
      name: "Sprache",
      field: "language",
      options: ["Englisch", "Deutsch"],
    },
    {
      name: "Semester",
      field: "semester",
      options: ["HS", "FS"],
    },
    {
      name: "Institut",
      field: "institute",
      options: [],
    },
    {
      name: "Modulgruppe",
      field: "moduleGroup",
      options: ["IT5", "IT6"],
    },
  ];

  @Watch("moduleStore.moduleArr")
  updateOptionsOnModuleChange(): void {
    const instituteFilterOption = this.filterOptions.find(
      (filterOption) => filterOption.field === "institute"
    );
    if (instituteFilterOption) {
      const indexOf = this.filterOptions.indexOf(instituteFilterOption);
      instituteFilterOption.options = this.moduleStore.moduleArr.map(
        (module) => module.institute
      );
      this.filterOptions[indexOf] = instituteFilterOption;
    }
  }

  options(filterIndex: number): Set<string> {
    let options: Array<string> = [];
    const field = _.get(this.filters[filterIndex], "field");

    if (field) {
      const filterOption = this.filterOptions.find(
        (filterOption) => filterOption.field === field
      );
      options = _.get(filterOption, "options", []) as Array<string>;
    }

    return new Set(options);
  }

  applyFilter(): void {
    this.moduleStore.emptyFilteredModules();
    const modules = this.moduleStore.moduleArr;
    for (const filter of this.filters as Array<Filter>) {
      const filteredModules = this.moduleStore.filteredModules;
      if (filter.field && filter.matcher && filter.option && filter.chaining) {
        if (filter.chaining === "and") {
          this.andChaining(filter, filteredModules, modules);
        } else {
          this.orChaining(filter, filteredModules, modules);
        }
      } else if (filter.field && filter.matcher && filter.option) {
        this.orChaining(filter, filteredModules, modules);
      }
    }
    console.log(this.moduleStore.filteredModules);
  }

  orChaining(
    filter: Filter,
    filteredModules: Array<Module>,
    modules: Array<Module>
  ): void {
    let filterAppliedModules = this.applyOption(filter, modules);
    this.moduleStore.setFilteredModules(
      _.uniq(_.concat(filteredModules, filterAppliedModules))
    );
  }

  andChaining(
    filter: Filter,
    filteredModules: Array<Module>,
    modules: Array<Module>
  ): void {
    if (filteredModules.length > 0) {
      let updatedFilteredModules = this.applyOption(filter, filteredModules);
      this.moduleStore.setFilteredModules(updatedFilteredModules);
    } else {
      let filterAppliedModules = this.applyOption(filter, modules);
      this.moduleStore.setFilteredModules(filterAppliedModules);
    }
  }

  applyOption(filter: Filter, modules: Array<Module>): Array<Module> {
    const key = filter.field as keyof Module;
    let optionAppliedModules: Array<Module> = modules.filter(
      (module) => module[key] === filter.option
    );
    if (filter.matcher === "neq") {
      optionAppliedModules = modules.filter(
        (module) => module[key] !== filter.option
      );
    }
    return optionAppliedModules;
  }

  addFilter(): void {
    this.numberOfFilters++;
    this.filters.push({});
  }

  removeFilter(index: number): void {
    this.filters.splice(index, 1);
    this.numberOfFilters--;
  }
}
</script>
