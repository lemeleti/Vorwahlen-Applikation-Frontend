<script lang="tsx">
import { Component, Prop, Vue } from "vue-property-decorator";
import "vue-class-component/hooks";
import { VNode } from "vue";
import Module from "@/models/module";
import { generateFillerList } from "@/tools/listGenerator";
import { ModuleCategories, ModuleList } from "@/models/moduleList";

@Component
export default class ModuleElection extends Vue {
  moduleList: ModuleList | null = null;
  tiles5Semester = [] as VNode[];
  tiles6Semester = [] as VNode[];

  tilesPerRow = 3;

  beforeMount(): void {
    this.moduleList = generateFillerList();
    this.createDefaultLayout();
  }

  private createDefaultLayout(): void {
    const tilesFithSemester = new Array<VNode>();
    const tilesSixthSemester = new Array<VNode>();

    if (this.moduleList) {
      let index = this.moduleList.getHead();
      while (index) {
        if (index.semester === 5) {
          tilesFithSemester.push(
            this.createTile(
              index.moduleName,
              this.getColorFromCategorie(index.moduleCategorie)
            )
          );
        } else if (index.semester === 6) {
          tilesSixthSemester.push(
            this.createTile(
              index.moduleName,
              this.getColorFromCategorie(index.moduleCategorie)
            )
          );
        }
        index = index.next;
      }
      this.tiles5Semester.push(...this.createRows(tilesFithSemester));
      this.tiles6Semester.push(...this.createRows(tilesSixthSemester));
    }
  }

  private createRows(tiles: Array<VNode>): Array<VNode> {
    const rows = new Array<VNode>();
    let buffer = new Array<VNode>();
    for (let i = 0; i < tiles.length; i++) {
      if (i % this.tilesPerRow == 0 && i > 0) {
        buffer.push(tiles[i]);
        rows.push(<div class="tile">{buffer}</div>);
        buffer = new Array<VNode>();
      } else {
        buffer.push(tiles[i]);
      }
    }
    if (buffer.length > 0) {
      rows.push(<div class="tile">{buffer}</div>);
    }
    return rows;
  }

  private createTile(name: string, color: string): VNode {
    const attrs = `tile is-child is-radiusless notification ${color}`;
    return (
      <div class="tile is-parent">
        <div class={attrs}>{name}</div>
      </div>
    );
  }

  private getColorFromCategorie(cat: ModuleCategories): string {
    let color = "";
    switch (cat) {
      case ModuleCategories.UEBERFACHLICH:
      case ModuleCategories.FACHLICH:
        color = "is-electiveModule";
        break;

      case ModuleCategories.KONTEXT:
        color = "is-contextModule";
        break;

      case ModuleCategories.PROJEKT:
        color = "is-projectModule";
        break;
    }

    return color;
  }

  render(): VNode {
    return (
      <div class="tile is-ancestor is-vertical">
        <div class="tile is-vertical notification is-radiusless">
          {this.tiles5Semester}
        </div>
        <div class="tile is-vertical notification is-radiusless">
          {this.tiles6Semester}
        </div>
      </div>
    );
  }
}
</script>
