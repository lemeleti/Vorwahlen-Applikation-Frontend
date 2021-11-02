<script lang="tsx">
import { Component, Prop, Vue } from "vue-property-decorator";
import "vue-class-component/hooks";
import { VNode } from "vue";
import Module from "@/models/module";

@Component
export default class ModuleElection extends Vue {
  @Prop() modules!: Array<Module>;

  tiles5Semester = [] as VNode[];
  tiles6Semester = [] as VNode[];

  defaultModules = [
    {
      name: "Wahlpflichtmodul",
      color: "is-contextModule",
      fithSemester: 2,
      sixthSemester: 1,
    },
    {
      name: "Projektarbeit in Informatik",
      color: "is-projectModule",
      fithSemester: 1,
      sixthSemester: 0,
    },
    {
      name: "Wahlpflichtmodul",
      color: "is-electiveModule",
      fithSemester: 5,
      sixthSemester: 4,
    },
  ];

  tilesPerRow = 3;

  created(): void {
    this.createDefaultLayout();
  }

  private createDefaultLayout(): void {
    const tilesFithSemester = new Array<VNode>();
    const tilesSixthSemester = new Array<VNode>();

    for (let module of this.defaultModules) {
      for (let i = 0; i < module.fithSemester; i++) {
        tilesFithSemester.push(this.createTile(module.name, module.color));
      }

      for (let i = 0; i < module.sixthSemester; i++) {
        tilesSixthSemester.push(this.createTile(module.name, module.color));
      }
    }
    this.tiles5Semester.push(...this.createRows(tilesFithSemester));
    this.tiles6Semester.push(...this.createRows(tilesSixthSemester));
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
